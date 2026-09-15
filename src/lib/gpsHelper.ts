/**
 * GPS Helper Utility with Intelligent Fallbacks & Coordinates Parsing
 */

export interface GpsCoordinateResult {
  latitude: number;
  longitude: number;
  accuracy?: number;
}

/**
 * Mendapatkan posisi GPS terkini dengan metode Dual-Stage Fallback:
 * 1. Mencoba High Accuracy (GPS Chip/Satelit) dengan timeout singkat (3.5 detik).
 * 2. Jika gagal/timeout (umum di PC / laptop / indoor), otomatis fallback ke Standard Accuracy (Wi-Fi/Jaringan IP/Cell Tower)
 *    dengan batas waktu 12 detik dan toleransi cache 5 menit.
 */
export const getBrowserCoordinates = (): Promise<GpsCoordinateResult> => {
  return new Promise((resolve, reject) => {
    if (typeof window === "undefined" || !navigator.geolocation) {
      return reject(new Error("Browser Anda tidak mendukung fitur lokasi / Geolocation."));
    }

    const tryLowAccuracyFallback = (previousError?: any) => {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          resolve({
            latitude: pos.coords.latitude,
            longitude: pos.coords.longitude,
            accuracy: pos.coords.accuracy,
          });
        },
        (finalErr) => {
          let errorMsg = "Gagal mengambil lokasi.";
          if (finalErr.code === 1) {
            errorMsg = "Izin lokasi diblokir oleh browser. Klik ikon gembok/pengaturan di kiri bilah URL browser Anda dan ubah 'Location' menjadi 'Allow' / 'Izinkan'.";
          } else if (finalErr.code === 2) {
            errorMsg = "Layanan lokasi tidak tersedia. Pastikan Location Services aktif di pengaturan sistem perangkat Anda.";
          } else if (finalErr.code === 3) {
            errorMsg = "Waktu permintaan lokasi habis (Timeout). Silakan coba lagi atau masukkan koordinat secara manual.";
          } else {
            errorMsg = finalErr.message || errorMsg;
          }
          reject(new Error(errorMsg));
        },
        {
          enableHighAccuracy: false,
          timeout: 12000,
          maximumAge: 300000, // 5 minutes cache
        }
      );
    };

    // Stage 1: Try High Accuracy (mobile GPS)
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        resolve({
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
          accuracy: pos.coords.accuracy,
        });
      },
      (firstErr) => {
        // If permission denied explicitly, don't retry, fail early
        if (firstErr.code === 1) {
          return reject(
            new Error("Izin lokasi diblokir oleh browser. Silakan izinkan akses lokasi pada bilah URL browser Anda.")
          );
        }
        // If timeout or unavailable, fallback to network/wifi geolocation
        tryLowAccuracyFallback(firstErr);
      },
      {
        enableHighAccuracy: true,
        timeout: 3500,
        maximumAge: 60000,
      }
    );
  });
};

/**
 * Mengekstrak latitude dan longitude dari berbagai format teks:
 * - Direct: "-2.3125, 102.6847" atau "-2.3125 102.6847"
 * - Google Maps URL: "https://www.google.com/maps?q=-2.3125,102.6847"
 * - Google Maps Place/Search: "https://www.google.com/maps/place/.../@-2.3125,102.6847,17z/..."
 * - Google Maps search query: "https://www.google.com/maps/search/-2.3125,+102.6847?entry=ttu"
 */
export const parseCoordinatesFromString = (input: string): { latitude: number; longitude: number } | null => {
  if (!input || typeof input !== "string") return null;

  const trimmed = input.trim();

  // 1. Check for @lat,long in Google Maps URL
  const atMatch = trimmed.match(/@(-?\d+\.\d+),\s*(-?\d+\.\d+)/);
  if (atMatch) {
    const lat = parseFloat(atMatch[1]);
    const lon = parseFloat(atMatch[2]);
    if (!isNaN(lat) && !isNaN(lon)) return { latitude: lat, longitude: lon };
  }

  // 2. Check for q=lat,long or query=lat,long in Google Maps URL
  const qMatch = trimmed.match(/[?&](?:q|query|ll)=(-?\d+\.\d+)[,\s]+(-?\d+\.\d+)/);
  if (qMatch) {
    const lat = parseFloat(qMatch[1]);
    const lon = parseFloat(qMatch[2]);
    if (!isNaN(lat) && !isNaN(lon)) return { latitude: lat, longitude: lon };
  }

  // 3. Check for search/lat,+long
  const searchMatch = trimmed.match(/\/search\/(-?\d+\.\d+)[,\+\s]+(-?\d+\.\d+)/);
  if (searchMatch) {
    const lat = parseFloat(searchMatch[1]);
    const lon = parseFloat(searchMatch[2]);
    if (!isNaN(lat) && !isNaN(lon)) return { latitude: lat, longitude: lon };
  }

  // 4. Check for direct coordinate pair "lat, lon" or "lat lon"
  const directMatch = trimmed.match(/^(-?\d+\.\d+)[\s,]+(-?\d+\.\d+)$/);
  if (directMatch) {
    const lat = parseFloat(directMatch[1]);
    const lon = parseFloat(directMatch[2]);
    if (!isNaN(lat) && !isNaN(lon)) return { latitude: lat, longitude: lon };
  }

  return null;
};
