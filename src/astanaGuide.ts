export type RetrievedItem = {
  name: string
  category?: string | null
  subcategory?: string | null
  address?: string | null
  district?: string | null
  city?: string | null
  lat: number
  lon: number
  distance_km: number
  distance_text: string
  working_hours?: string | null
  instagram?: string | null
  website?: string | null
  phone?: string | null
  open_now?: boolean | null
  popularity_score?: number | null
  semantic_similarity?: number | null
  description?: string | null
}
export type RecommendationItem = {
  name: string
  category: string
  distance: string
  why: string
  action_plan: string
  estimated_time: string
  working_hours: string
  confidence: number
}

export type RecommendResponse = {
  query: string
  user_location: { lat: number; lon: number }
  radius_km: number
  retrieved: RetrievedItem[]
  recommendations: RecommendationItem[]
}
export type RecommendRequest = {
  query: string
  lat: number
  lon: number
  radius_km?: number
  provider?: 'openai' | 'anthropic' | 'gemini'
  model?: string
}

const API_BASE = import.meta.env.VITE_API_BASE || 'https://ai-guide-py50.onrender.com'

export type LocationItem = {
  label: string
  lat: number
  lon: number
  city?: string
  region?: string
  category?: string
  district?: string
  address?: string
  popularity_score?: number
}

export type LocationsResponse = {
  locations: LocationItem[]
  total: number
  city?: string | null
  region?: string | null
  source: string
}

export type CityInfo = {
  name: string
  name_en: string
  lat: number
  lon: number
  population: number
}

export type CitiesResponse = {
  cities: CityInfo[]
  regions: string[]
  total_cities: number
  total_regions: number
}

export async function fetchCities(): Promise<CitiesResponse> {
  const res = await fetch(`${API_BASE}/api/cities`)
  if (!res.ok) throw new Error('Failed to load cities')
  return (await res.json()) as CitiesResponse
}

export async function fetchLocations(params?: {
  city?: string
  region?: string
  limit?: number
  min_popularity?: number
  category?: string
}): Promise<LocationsResponse> {
  const queryParams = new URLSearchParams()
  if (params?.city) queryParams.append('city', params.city)
  if (params?.region) queryParams.append('region', params.region)
  if (params?.limit) queryParams.append('limit', params.limit.toString())
  if (params?.min_popularity !== undefined) queryParams.append('min_popularity', params.min_popularity.toString())
  if (params?.category) queryParams.append('category', params.category)

  const url = `${API_BASE}/api/locations${queryParams.toString() ? '?' + queryParams.toString() : ''}`
  const res = await fetch(url)
  if (!res.ok) throw new Error('Failed to load locations')
  return (await res.json()) as LocationsResponse
}

export async function fetchRecommendations(body: RecommendRequest): Promise<RecommendResponse> {
  const res = await fetch(`${API_BASE}/api/recommendations`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
    if (!res.ok) {
    const msg = await res.text()
    throw new Error(msg || 'Recommendation request failed')
  }
  return (await res.json()) as RecommendResponse
}
