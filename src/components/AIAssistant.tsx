import { useState, useEffect, useRef } from "react";
import { Bot, Send, X, Minimize2, MapPin, MessageCircle, Loader2, Navigation, Filter, Map as MapIcon } from "lucide-react";
import { useQuery, useMutation } from '@tanstack/react-query';
import { fetchCities, fetchLocations, fetchRecommendations, type RecommendResponse, type RecommendationItem, type RetrievedItem, type LocationItem, type CityInfo } from "@/astanaGuide";
import { loadDgis } from "@/lib/loadDgis";

type Message = {
  role: 'user' | 'assistant';
  text: string;
  recommendations?: RecommendationItem[];
  retrieved?: RetrievedItem[];
};

type ViewMode = 'chat' | 'map';

const AIAssistant = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      text: 'Сәлем! Я ваш гид по Казахстану 🇰🇿 Выберите город и расскажите, что ищете: кафе, парк, достопримечательности, или что-то ещё!'
    }
  ]);
  const [viewMode, setViewMode] = useState<ViewMode>('chat');
  const [selectedCity, setSelectedCity] = useState<CityInfo | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<LocationItem | null>(null);
  const [radiusKm, setRadiusKm] = useState(5);  // Increased default radius
  const [currentRecommendations, setCurrentRecommendations] = useState<RecommendResponse | null>(null);
  const [mapReady, setMapReady] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<any>(null); // google.maps.Map | mapgl.Map
  const mapProviderRef = useRef<null | 'google' | 'dgis'>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const markersRef = useRef<any[]>([]);

  // Load cities
  const { data: citiesData } = useQuery({
    queryKey: ['cities'],
    queryFn: fetchCities,
  });

  // Load locations for selected city (includes city center as first option)
  const { data: locationsData, isLoading: locationsLoading } = useQuery({
    queryKey: ['locations', selectedCity?.name],
    queryFn: () => fetchLocations({
      city: selectedCity?.name,
      limit: 50,
      min_popularity: 0.3  // Lower threshold for more results
    }),
    enabled: !!selectedCity,
  });

  const recMutation = useMutation({
    mutationFn: fetchRecommendations,
    onSuccess: (data) => {
      setCurrentRecommendations(data);

      const responseText = data.recommendations.length > 0
        ? `Нашёл для вас ${data.recommendations.length} ${data.recommendations.length === 1 ? 'место' : 'места'}! 🎯`
        : 'К сожалению, не нашёл подходящих мест в этом радиусе. Попробуйте расширить поиск или изменить запрос.';

      setMessages(prev => [
        ...prev,
        {
          role: 'assistant',
          text: responseText,
          recommendations: data.recommendations,
          retrieved: data.retrieved
        }
      ]);
    },
    onError: (error: Error) => {
      setMessages(prev => [
        ...prev,
        {
          role: 'assistant',
          text: `Упс, произошла ошибка: ${error.message}. Попробуйте ещё раз! 😔`
        }
      ]);
    }
  });

  const quickActions = [
    "Тихое кафе с Wi-Fi",
    "Парк для прогулки",

    "Торговые центры",
    "Спортивные клубы"
  ];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Initialize Map (Google if available, else 2GIS)
  useEffect(() => {
    if (viewMode === 'map' && mapContainerRef.current && !mapRef.current) {
      initializeMap();
    }
  }, [viewMode]);

  // Update map markers when recommendations change
  useEffect(() => {
    if (viewMode === 'map' && mapRef.current && currentRecommendations) {
      updateMapMarkers();
    }
  }, [viewMode, currentRecommendations]);

  const initializeMap = async () => {
    if (!mapContainerRef.current) return;

    setMapReady(false);

    const defaultCenter = selectedCity
      ? { lat: selectedCity.lat, lng: selectedCity.lon }
      : { lat: 48.0, lng: 68.0 }; // Center of Kazakhstan

    try {
      // Prefer Google if available on window
      if ((window as any).google?.maps) {
        mapRef.current = new google.maps.Map(mapContainerRef.current, {
          center: defaultCenter,
          zoom: selectedCity ? 12 : 5,
          styles: [
            { featureType: "poi", elementType: "labels", stylers: [{ visibility: "off" }] }
          ],
          mapTypeControl: false,
          fullscreenControl: false,
          streetViewControl: false,
        });
        mapProviderRef.current = 'google';

        // Add user location marker if selected
        if (selectedLocation) {
          new google.maps.Marker({
            position: { lat: selectedLocation.lat, lng: selectedLocation.lon },
            map: mapRef.current,
            icon: {
              path: google.maps.SymbolPath.CIRCLE,
              scale: 10,
              fillColor: "#3B82F6",
              fillOpacity: 1,
              strokeColor: "#fff",
              strokeWeight: 2,
            },
            title: "Ваше местоположение"
          });
        }

        setMapReady(true);
        return;
      }

      // Fallback to 2GIS MapGL
      const mapgl = await loadDgis();
      const apiKey = (import.meta as any).env.VITE_DGIS_API_KEY as string | undefined;

      // 2GIS expects [lon, lat]
      const centerGL: [number, number] = [defaultCenter.lng, defaultCenter.lat];
      const map = new (mapgl as any).Map(mapContainerRef.current, {
        center: centerGL,
        zoom: selectedCity ? 12 : 5,
        key: apiKey,
      });
      mapRef.current = map;
      mapProviderRef.current = 'dgis';

      // User location marker for 2GIS
      if (selectedLocation) {
        const marker = new (mapgl as any).Marker(map, {
          coordinates: [selectedLocation.lon, selectedLocation.lat],
          // You can style markers via icon or label in MapGL newer versions
        });
        markersRef.current.push(marker);
      }

      setMapReady(true);
    } catch (e) {
      console.error('Map initialization failed:', e);
      setMapReady(false);
    }
  };

  const updateMapMarkers = () => {
    if (!mapRef.current || !currentRecommendations) return;

    const provider = mapProviderRef.current;

    // Clear existing markers
    if (provider === 'google') {
      markersRef.current.forEach((marker: any) => marker.setMap && marker.setMap(null));
    } else if (provider === 'dgis') {
      markersRef.current.forEach((marker: any) => marker.destroy && marker.destroy());
    }
    markersRef.current = [];

    // GOOGLE branch
    if (provider === 'google') {
      const bounds = new google.maps.LatLngBounds();
      if (selectedLocation) bounds.extend({ lat: selectedLocation.lat, lng: selectedLocation.lon });

      currentRecommendations.retrieved.forEach((place) => {
        const isRecommended = currentRecommendations.recommendations.some(
          rec => rec.name === place.name
        );

        const marker = new google.maps.Marker({
          position: { lat: place.lat, lng: place.lon },
          map: mapRef.current,
          title: place.name,
          icon: {
            path: google.maps.SymbolPath.CIRCLE,
            scale: isRecommended ? 12 : 8,
            fillColor: isRecommended ? "#10B981" : "#F59E0B",
            fillOpacity: 1,
            strokeColor: "#fff",
            strokeWeight: 2,
          },
          label: isRecommended ? { text: "★", color: "#fff", fontSize: "12px" } : undefined,
        });

        const infoWindow = new google.maps.InfoWindow({
          content: `
            <div style="padding: 8px; max-width: 250px;">
              <h3 style="margin: 0 0 8px 0; font-size: 16px; font-weight: 600;">${place.name}</h3>
              <p style="margin: 4px 0; font-size: 13px; color: #666;">${place.category || ''}</p>
              <p style="margin: 4px 0; font-size: 13px;">${place.distance_text}</p>
              ${place.working_hours ? `<p style=\"margin: 4px 0; font-size: 12px; color: #888;\">⏰ ${place.working_hours}</p>` : ''}
              ${isRecommended ? '<p style=\"margin: 8px 0 0 0; font-size: 12px; color: #10B981; font-weight: 600;\">✓ Рекомендуем!</p>' : ''}
            </div>
          `
        });

        marker.addListener('click', () => {
          infoWindow.open(mapRef.current, marker);
        });

        markersRef.current.push(marker);
        bounds.extend({ lat: place.lat, lng: place.lon });
      });

      if (!bounds.isEmpty()) {
        mapRef.current.fitBounds(bounds, 50);
      }
      return;
    }

    // 2GIS branch
    if (provider === 'dgis') {
      const mg = (window as any).mapgl;
      if (!mg) return;

      const bounds: [[number, number], [number, number]] = [[180, 90], [-180, -90]]; // [minLon, minLat], [maxLon, maxLat]
      const extendBounds = (lon: number, lat: number) => {
        bounds[0][0] = Math.min(bounds[0][0], lon);
        bounds[0][1] = Math.min(bounds[0][1], lat);
        bounds[1][0] = Math.max(bounds[1][0], lon);
        bounds[1][1] = Math.max(bounds[1][1], lat);
      };

      if (selectedLocation) extendBounds(selectedLocation.lon, selectedLocation.lat);

      currentRecommendations.retrieved.forEach((place) => {
        const isRecommended = currentRecommendations.recommendations.some(rec => rec.name === place.name);
        const marker = new (mg as any).Marker(mapRef.current, {
          coordinates: [place.lon, place.lat],
        });
        markersRef.current.push(marker);
        extendBounds(place.lon, place.lat);
      });

      // Fit map to bounds if we added points
      const hasBounds = bounds[0][0] < bounds[1][0] && bounds[0][1] < bounds[1][1];
      if (hasBounds && mapRef.current && mapRef.current.setBounds) {
        try {
          (mapRef.current as any).setBounds([[bounds[0][0], bounds[0][1]], [bounds[1][0], bounds[1][1]]]);
        } catch {}
      }
    }
  };

  const handleSendMessage = () => {
    if (!message.trim() || !selectedLocation) {
      if (!selectedLocation) {
        alert('Пожалуйста, выберите город и локацию для поиска');
      }
      return;
    }

    const userMessage = message.trim();
    setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
    setMessage("");

    recMutation.mutate({
      query: userMessage,
      lat: selectedLocation.lat,
      lon: selectedLocation.lon,
      radius_km: radiusKm,
      provider: 'gemini',
      model: 'gemini-1.5-flash',
    });
  };

  const handleQuickAction = (action: string) => {
    if (!selectedLocation) {
      alert('Пожалуйста, выберите город и локацию для поиска');
      return;
    }
    setMessage(action);
    setMessages(prev => [...prev, { role: 'user', text: action }]);

    recMutation.mutate({
      query: action,
      lat: selectedLocation.lat,
      lon: selectedLocation.lon,
      radius_km: radiusKm,
      provider: 'gemini',
      model: 'gemini-1.5-flash',
    });
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <>
      {/* Floating Button - Minimized State */}
      {!isExpanded && (
        <button
          onClick={() => setIsExpanded(true)}
          className="fixed bottom-8 right-8 w-16 h-16 rounded-full bg-gradient-to-br from-primary to-secondary shadow-2xl hover:scale-110 transition-transform z-50 group"
        >
          <div className="relative w-full h-full flex items-center justify-center">
            <Bot className="w-8 h-8 text-primary-foreground" />
            <div className="absolute inset-0 rounded-full bg-primary/30 animate-ping"></div>
          </div>
          <div className="absolute -top-2 -right-2 px-2 py-1 bg-success rounded-full text-xs font-medium text-success-foreground">
            KZ AI 🇰🇿
          </div>
        </button>
      )}

      {/* Expanded Panel */}
      {isExpanded && (
        <div className="fixed bottom-8 right-8 w-[450px] h-[700px] glass-elevated rounded-2xl shadow-2xl z-50 flex flex-col overflow-hidden">
          {/* Header */}
          <div className="p-4 border-b border-primary/20 flex items-center justify-between bg-gradient-to-r from-primary/5 to-secondary/5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                <Bot className="w-6 h-6 text-primary-foreground" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">Kazakhstan Guide AI</h3>
                <p className="text-xs text-muted-foreground">Ваш умный гид по Казахстану</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsExpanded(false)}
                className="p-2 hover:bg-primary/10 rounded-lg transition-colors"
                title="Свернуть"
              >
                <Minimize2 className="w-4 h-4 text-foreground" />
              </button>
              <button
                onClick={() => setIsExpanded(false)}
                className="p-2 hover:bg-destructive/10 rounded-lg transition-colors"
                title="Закрыть"
              >
                <X className="w-4 h-4 text-destructive" />
              </button>
            </div>
          </div>

          {/* View Mode Toggle */}
          <div className="px-4 pt-3 pb-2 border-b border-primary/10 bg-background-elevated/50">
            <div className="flex gap-2">
              <button
                onClick={() => setViewMode('chat')}
                className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  viewMode === 'chat'
                    ? 'bg-gradient-to-r from-primary to-secondary text-primary-foreground shadow-lg'
                    : 'bg-secondary/20 text-muted-foreground hover:bg-secondary/30'
                }`}
              >
                <MessageCircle className="w-4 h-4 inline mr-2" />
                Чат
              </button>
              <button
                onClick={() => setViewMode('map')}
                className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  viewMode === 'map'
                    ? 'bg-gradient-to-r from-primary to-secondary text-primary-foreground shadow-lg'
                    : 'bg-secondary/20 text-muted-foreground hover:bg-secondary/30'
                }`}
                disabled={!currentRecommendations}
              >
                <MapIcon className="w-4 h-4 inline mr-2" />
                Карта
              </button>
            </div>
          </div>

          {/* City & Location Selection */}
          <div className="px-4 py-3 border-b border-primary/10 bg-background/50 space-y-2">
            {/* City Selector */}
            <div className="space-y-1">
              <label className="text-xs text-muted-foreground flex items-center gap-1">
                <MapPin className="w-3 h-3" />
                Выберите город:
              </label>
              <select
                value={selectedCity ? selectedCity.name : ''}
                onChange={(e) => {
                  const city = citiesData?.cities.find(c => c.name === e.target.value);
                  setSelectedCity(city || null);
                  setSelectedLocation(null);
                }}
                className="w-full px-3 py-2 bg-background-elevated rounded-lg text-sm text-foreground border border-primary/10 focus:outline-none focus:ring-2 focus:ring-primary/50"
              >
                <option value="">🌍 Выберите город...</option>
                {citiesData?.cities.map((city) => (
                  <option key={city.name} value={city.name}>
                    {city.name} ({city.population.toLocaleString('ru-RU')})
                  </option>
                ))}
              </select>
            </div>

            {/* Location Selector */}
            {selectedCity && (
              <div className="space-y-1">
                <label className="text-xs text-muted-foreground">Точное место:</label>
                <select
                  value={selectedLocation ? JSON.stringify(selectedLocation) : ''}
                  onChange={(e) => {
                    if (e.target.value) {
                      const loc = JSON.parse(e.target.value);
                      setSelectedLocation(loc);
                    }
                  }}
                  className="w-full px-3 py-2 bg-background-elevated rounded-lg text-sm text-foreground border border-primary/10 focus:outline-none focus:ring-2 focus:ring-primary/50"
                  disabled={locationsLoading}
                >
                  <option value="">
                    {locationsLoading ? '⏳ Загрузка...' : '📍 Выберите место...'}
                  </option>
                  {locationsData?.locations?.map((loc, idx) => (
                    <option key={`${loc.label}-${idx}`} value={JSON.stringify(loc)}>
                      {loc.label} {loc.district ? `(${loc.district})` : ''}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {selectedLocation && (
              <div className="text-xs text-muted-foreground bg-background-elevated/50 rounded-lg px-3 py-2">
                <div className="flex items-center gap-2">
                  <MapPin className="w-3 h-3" />
                  <span className="font-medium">{selectedLocation.label}</span>
                </div>
                {selectedLocation.category && (
                  <div className="mt-1 ml-5 text-[10px]">
                    {selectedLocation.category.substring(0, 60)}
                    {selectedLocation.category.length > 60 ? '...' : ''}
                  </div>
                )}
              </div>
            )}

            {/* Radius Selector */}
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Navigation className="w-3 h-3" />
              <span>Радиус поиска:</span>
              <input
                type="range"
                min="0.5"
                max="10"
                step="0.5"
                value={radiusKm}
                onChange={(e) => setRadiusKm(parseFloat(e.target.value))}
                className="flex-1"
              />
              <span className="font-medium text-foreground">{radiusKm} км</span>
            </div>

            {locationsData && (
              <div className="text-[10px] text-muted-foreground flex items-center gap-1">
                <Filter className="w-3 h-3" />
                <span>Доступно {locationsData.total} мест {selectedCity && `в городе ${selectedCity.name}`}</span>
              </div>
            )}
          </div>

          {/* Content Area */}
          <div className="flex-1 overflow-hidden">
            {viewMode === 'chat' ? (
              <>
                {/* Quick Actions */}
                <div className="p-4 border-b border-primary/10">
                  <p className="text-xs text-muted-foreground mb-2">Быстрые запросы</p>
                  <div className="flex flex-wrap gap-2">
                    {quickActions.map((action, index) => (
                      <button
                        key={index}
                        onClick={() => handleQuickAction(action)}
                        disabled={recMutation.isPending || !selectedLocation}
                        className="px-3 py-1.5 rounded-full bg-secondary/20 hover:bg-secondary/30 text-xs font-medium text-foreground border border-secondary/30 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {action}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar h-[320px]">
                  {messages.map((msg, index) => (
                    <div key={index}>
                      <div
                        className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-[85%] p-3 rounded-2xl ${
                            msg.role === 'user'
                              ? 'bg-gradient-to-br from-primary to-secondary text-primary-foreground'
                              : 'bg-background-elevated border border-primary/20 text-foreground'
                          }`}
                        >
                          {msg.role === 'assistant' && (
                            <div className="flex items-center gap-2 mb-2">
                              <Bot className="w-4 h-4 text-primary" />
                              <span className="text-xs font-medium text-primary">KZ AI</span>
                            </div>
                          )}
                          <p className="text-sm whitespace-pre-wrap">{msg.text}</p>
                        </div>
                      </div>

                      {/* Recommendations Cards */}
                      {msg.recommendations && msg.recommendations.length > 0 && (
                        <div className="mt-3 space-y-2">
                          {msg.recommendations.map((rec, recIndex) => (
                            <div
                              key={recIndex}
                              className="bg-background-elevated border border-primary/20 rounded-xl p-3 hover:border-primary/40 transition-all"
                            >
                              <div className="flex items-start justify-between mb-2">
                                <div>
                                  <h4 className="font-semibold text-foreground text-sm">{rec.name}</h4>
                                  <p className="text-xs text-muted-foreground mt-0.5">
                                    {rec.category} • {rec.distance}
                                  </p>
                                </div>
                                <div className="flex items-center gap-1 bg-success/20 px-2 py-1 rounded-full">
                                  <span className="text-xs font-medium text-success">
                                    {Math.round(rec.confidence * 100)}%
                                  </span>
                                </div>
                              </div>

                              <p className="text-xs text-foreground mb-2">
                                <strong>Почему:</strong> {rec.why}
                              </p>

                              <p className="text-xs text-muted-foreground mb-2">
                                <strong>План:</strong> {rec.action_plan}
                              </p>

                              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                                <span>⏱️ {rec.estimated_time}</span>
                                <span>🕒 {rec.working_hours}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}

                  {/* Thinking Indicator */}
                  {recMutation.isPending && (
                    <div className="flex justify-start">
                      <div className="bg-background-elevated border border-primary/20 p-3 rounded-2xl">
                        <div className="flex items-center gap-2">
                          <Bot className="w-4 h-4 text-primary" />
                          <Loader2 className="w-4 h-4 text-primary animate-spin" />
                          <span className="text-sm text-muted-foreground">Ищу лучшие места...</span>
                        </div>
                      </div>
                    </div>
                  )}

                  <div ref={messagesEndRef} />
                </div>
              </>
            ) : (
              /* Map View */
              <div className="h-full w-full relative">
                <div ref={mapContainerRef} className="h-full w-full" />

                {/* Map Loading State */}
                {!mapReady && (
                  <div className="absolute inset-0 flex items-center justify-center bg-background/80">
                    <div className="text-center">
                      <Loader2 className="w-8 h-8 text-primary animate-spin mx-auto mb-2" />
                      <p className="text-sm text-muted-foreground">Загрузка карты...</p>
                    </div>
                  </div>
                )}

                {/* Map Legend */}
                <div className="absolute bottom-4 left-4 bg-background-elevated/95 backdrop-blur-sm border border-primary/20 rounded-lg p-3 shadow-lg">
                  <p className="text-xs font-semibold text-foreground mb-2">Легенда:</p>
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-primary border-2 border-white"></div>
                      <span className="text-xs text-muted-foreground">Вы здесь</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-success border-2 border-white"></div>
                      <span className="text-xs text-muted-foreground">Рекомендации ⭐</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-warning border-2 border-white"></div>
                      <span className="text-xs text-muted-foreground">Другие места</span>
                    </div>
                  </div>
                </div>

                {/* Back to Chat Button */}
                <button
                  onClick={() => setViewMode('chat')}
                  className="absolute top-4 right-4 px-4 py-2 bg-gradient-to-br from-primary to-secondary text-primary-foreground rounded-lg shadow-lg hover:scale-105 transition-transform text-sm font-medium"
                >
                  <MessageCircle className="w-4 h-4 inline mr-2" />
                  Назад к чату
                </button>
              </div>
            )}
          </div>

          {/* Input - Only in Chat Mode */}
          {viewMode === 'chat' && (
            <div className="p-4 border-t border-primary/20 bg-background/50">
              <div className="flex items-end gap-2">
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyDown={handleKeyPress}
                  placeholder="Спросите о кафе, парках, достопримечательностях..."
                  rows={1}
                  className="flex-1 px-4 py-3 bg-background-elevated rounded-xl text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 border border-primary/10 resize-none"
                  disabled={recMutation.isPending}
                />
                <button
                  onClick={handleSendMessage}
                  disabled={recMutation.isPending || !message.trim() || !selectedLocation}
                  className="p-3 rounded-xl bg-gradient-to-br from-primary to-secondary hover:scale-105 transition-transform disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                >
                  {recMutation.isPending ? (
                    <Loader2 className="w-5 h-5 text-primary-foreground animate-spin" />
                  ) : (
                    <Send className="w-5 h-5 text-primary-foreground" />
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default AIAssistant;
