/**
 * GeoService — fetches user location with High-Accuracy GPS & Reverse Geocoding.
 *
 * Primary  : Device Browser GPS (highAccuracy: true) + Reverse Geocoding via BigDataCloud
 * Fallback : IP-based geolocation (ipapi.co) if GPS is denied or unavailable.
 */

export interface GeoLocation {
  city: string;
  region: string;
  country: string;
  pincode: string;
  latitude: number;
  longitude: number;
  displayName: string;
}

const GEO_API_URL: string = import.meta.env.VITE_GEO_API_URL ?? 'https://ipapi.co/json/';

/**
 * High-Accuracy GPS Location fetcher with Reverse Geocoding.
 */
export async function fetchGPSLocation(): Promise<GeoLocation> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported by this browser.'));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;

        try {
          // Free reverse geocoding (no API key required)
          const revRes = await fetch(
            `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lng}&localityLanguage=en`,
            { signal: AbortSignal.timeout(4000) }
          );

          if (revRes.ok) {
            const rev = await revRes.json();
            const cityName = rev.city || rev.locality || rev.localityInfo?.administrative?.[2]?.name || 'Your Location';
            const regionName = rev.principalSubdivision || '';
            const countryName = rev.countryName || '';
            const postcode = rev.postcode || '';

            const displayName = [cityName, regionName].filter(Boolean).join(', ');

            resolve({
              city: cityName,
              region: regionName,
              country: countryName,
              pincode: postcode,
              latitude: lat,
              longitude: lng,
              displayName: displayName || `${lat.toFixed(3)}° N, ${lng.toFixed(3)}° E`
            });
            return;
          }
        } catch {
          // Fallback reverse geocoding label
        }

        resolve({
          city: 'Device Location',
          region: '',
          country: '',
          pincode: '',
          latitude: lat,
          longitude: lng,
          displayName: `${lat.toFixed(4)}° N, ${lng.toFixed(4)}° E`
        });
      },
      (err) => reject(err),
      { timeout: 10000, enableHighAccuracy: true, maximumAge: 0 }
    );
  });
}

/**
 * IP-based location fallback.
 */
export async function fetchIPLocation(): Promise<GeoLocation> {
  const res = await fetch(GEO_API_URL, { signal: AbortSignal.timeout(5000) });
  if (!res.ok) throw new Error(`ipapi response ${res.status}`);
  const data = await res.json();

  return {
    city: data.city ?? 'Unknown City',
    region: data.region ?? '',
    country: data.country_name ?? '',
    pincode: data.postal ?? '',
    latitude: parseFloat(data.latitude) || 0,
    longitude: parseFloat(data.longitude) || 0,
    displayName: buildDisplayName(data.city, data.region, data.country_name),
  };
}

/**
 * Tries high-accuracy GPS first, then falls back to IP-based location.
 */
export async function fetchUserLocation(): Promise<GeoLocation> {
  try {
    return await fetchGPSLocation();
  } catch {
    return await fetchIPLocation();
  }
}

function buildDisplayName(city: string, region: string, country: string): string {
  const parts = [city, region, country].filter(Boolean);
  return parts.join(', ') || 'Location detected';
}

