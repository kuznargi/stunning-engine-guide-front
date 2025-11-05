import { useState, useEffect } from 'react';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://ai-guide-py50.onrender.com';

export interface TrafficData {
  timestamp: string;
  hour: number;
  time_coefficient: number;
  roads: Array<{
    id: string;
    name: string;
    name_en: string;
    type: string;
    capacity: number;
    speed_limit: number;
    lanes: number;
    length_km: number;
    coordinates: number[][];
    traffic: {
      capacity: number;
      current_vehicles: number;
      load_percent: number;
      status: 'free' | 'moderate' | 'heavy' | 'jam';
      color: string;
      time_coefficient: number;
      speed_factor: number;
    };
  }>;
  bridges: Array<{
    id: string;
    name: string;
    name_en: string;
    type: string;
    capacity: number;
    lanes: number;
    length_km: number;
    status: string;
    year_built: number;
    traffic: {
      current_vehicles: number;
      load_percent: number;
      status: string;
      color: string;
    };
  }>;
  suburbs: Array<{
    id: string;
    name: string;
    name_en: string;
    population: number;
    daily_inflow: number;
    distance_km: number;
    current_flow: number;
    flow_coefficient: number;
    flow_percent: number;
    status: string;
  }>;
  avg_city_load_percent: number;
  total_vehicles_on_roads: number;
  total_capacity: number;
  eco_impact: {
    total_vehicles: number;
    vehicles_in_jams: number;
    jam_percentage: number;
    co2_emissions_kg_per_hour: number;
    co2_emissions_tons_per_day: number;
    fuel_consumption_liters_per_hour: number;
    economic_loss_tenge_per_hour: number;
    economic_loss_tenge_per_day: number;
    estimated_time_loss_hours: number;
  };
}

export interface PredictionData {
  requested_hours: number;
  predictions_count: number;
  predictions: TrafficData[];
}

export const useTrafficData = (autoRefresh = true, refreshInterval = 30000) => {
  const [data, setData] = useState<TrafficData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTraffic = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/traffic/current`);
      if (!response.ok) throw new Error('Failed to fetch traffic data');
      const json = await response.json();
      setData(json);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTraffic();

    if (autoRefresh) {
      const interval = setInterval(fetchTraffic, refreshInterval);
      return () => clearInterval(interval);
    }
  }, [autoRefresh, refreshInterval]);

  return { data, loading, error, refetch: fetchTraffic };
};

export const useTrafficPredictions = (hours = 4) => {
  const [data, setData] = useState<PredictionData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPredictions = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/traffic/predictions?hours=${hours}`);
        if (!response.ok) throw new Error('Failed to fetch predictions');
        const json = await response.json();
        setData(json);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    fetchPredictions();
  }, [hours]);

  return { data, loading, error };
};
