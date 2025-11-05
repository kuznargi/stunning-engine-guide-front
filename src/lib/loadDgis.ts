
let loadingPromise: Promise<any> | null = null;

export function loadDgis(): Promise<any> {
  if (typeof window !== 'undefined' && (window as any).mapgl) {
    return Promise.resolve((window as any).mapgl);
  }
  if (loadingPromise) return loadingPromise;

  const apiKey = (import.meta as any).env.VITE_DGIS_API_KEY as string | undefined;
  if (!apiKey) {
    return Promise.reject(new Error('2GIS API key is missing. Please set VITE_DGIS_API_KEY in your .env'));
  }

  loadingPromise = new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = `https://mapgl.2gis.com/api/js/v1?key=${encodeURIComponent(apiKey)}`;
    script.async = true;
    script.defer = true;
    script.onload = () => {
      const mg = (window as any).mapgl;
      if (mg) resolve(mg);
      else reject(new Error('2GIS MapGL failed to load'));
    };
    script.onerror = () => reject(new Error('Failed to load 2GIS MapGL script'));
    document.head.appendChild(script);
  });

  return loadingPromise;
}
