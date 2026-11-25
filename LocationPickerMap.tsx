import React, { useEffect, useRef, useState, useCallback } from 'react';
import L from 'leaflet';
import { MapPin, Search, Locate, Loader2, CheckCircle2, Navigation, AlertCircle, X } from 'lucide-react';

interface LocationPickerMapProps {
  address: string;
  onAddressChange: (newAddress: string) => void;
  lat: number;
  lng: number;
  onCoordsChange: (lat: number, lng: number) => void;
  className?: string;
  category?: 'PERDI' | 'ACHEI';
}

// Helper to create a perfectly anchored sighting pin (point at bottom center: x=20, y=48)
const createSightingPinIcon = (color: string) => {
  return L.divIcon({
    className: 'sighting-location-pin',
    html: `
      <div style="width: 40px; height: 48px; position: relative; pointer-events: auto; cursor: grab;" class="group select-none">
        <!-- Pin Head Circle: 40x40 -->
        <div style="width: 40px; height: 40px; border: 3px solid ${color}; color: ${color}; background-color: #ffffff; border-radius: 9999px; box-shadow: 0 8px 16px -2px rgba(0,0,0,0.18);" class="flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" style="width: 20px; height: 20px;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/>
            <circle cx="12" cy="10" r="3"/>
          </svg>
        </div>
        <!-- Pin Arrow Point: exactly 8px height, ends at (20, 48) -->
        <div style="width: 0; height: 0; border-left: 6px solid transparent; border-right: 6px solid transparent; border-top: 8px solid ${color}; margin: -1px auto 0 auto;"></div>
        <!-- Exact ground target dot -->
        <div style="position: absolute; left: 20px; top: 48px; transform: translate(-50%, -50%); width: 6px; height: 6px; border-radius: 9999px; background-color: ${color}; pointer-events: none; box-shadow: 0 0 0 2px rgba(255,255,255,0.9);"></div>
        <!-- Tooltip Label -->
        <div style="position: absolute; top: -28px; left: 20px; transform: translateX(-50%); background-color: rgba(15, 23, 42, 0.92); color: #ffffff; font-weight: 700; font-size: 10px; padding: 2px 8px; border-radius: 6px; white-space: nowrap; pointer-events: none; box-shadow: 0 2px 5px rgba(0,0,0,0.25);">
          Ponto do Avistamento
        </div>
      </div>
    `,
    iconSize: [40, 48],
    iconAnchor: [20, 48],
  });
};

export const LocationPickerMap: React.FC<LocationPickerMapProps> = ({
  address,
  onAddressChange,
  lat,
  lng,
  onCoordsChange,
  className = '',
  category = 'PERDI',
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);
  const searchTimeoutRef = useRef<any>(null);

  const [isGeocoding, setIsGeocoding] = useState(false);
  const [isReverseGeocoding, setIsReverseGeocoding] = useState(false);
  const [isLocatingUser, setIsLocatingUser] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  // Reverse geocoding function: Lat/Lng -> Address string
  const reverseGeocode = useCallback(
    async (latitude: number, longitude: number) => {
      try {
        setIsReverseGeocoding(true);
        setStatusMessage('Identificando endereço do ponto selecionado...');

        const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`;
        const res = await fetch(url, {
          headers: {
            'Accept-Language': 'pt-BR,pt;q=0.9,en;q=0.8',
          },
        });

        if (!res.ok) throw new Error('Falha no serviço de mapas');
        const data = await res.json();

        if (data && data.address) {
          const addr = data.address;
          const road = addr.road || addr.street || addr.pedestrian || addr.footway || '';
          const number = addr.house_number ? `, ${addr.house_number}` : '';
          const neighborhood = addr.suburb || addr.neighbourhood || addr.residential || '';
          const city = addr.city || addr.town || addr.village || addr.municipality || 'Itapetininga';
          const state = addr.state_code || addr.state || 'SP';

          let formatted = '';
          if (road) {
            formatted = `${road}${number}`;
            if (neighborhood) formatted += ` - ${neighborhood}`;
            if (city) formatted += `, ${city}`;
            if (state) formatted += ` - ${state}`;
          } else if (neighborhood) {
            formatted = `${neighborhood}, ${city} - ${state}`;
          } else if (data.display_name) {
            formatted = data.display_name.split(',').slice(0, 3).join(', ');
          }

          if (formatted.trim()) {
            onAddressChange(formatted.trim());
            setStatusMessage(`Local identificado: ${formatted.trim()}`);
          }
        }
      } catch (err) {
        // Fallback gracefully without throwing
        setStatusMessage('Ponto definido no mapa');
      } finally {
        setIsReverseGeocoding(false);
        setTimeout(() => setStatusMessage(null), 5000);
      }
    },
    [onAddressChange]
  );

  // Forward geocoding: Address string -> Lat/Lng
  const geocodeAddress = useCallback(
    async (queryText: string) => {
      if (!queryText || queryText.trim().length < 3) return;

      try {
        setIsGeocoding(true);
        setStatusMessage('Buscando localização no mapa...');

        let searchStr = queryText.trim();
        // If no city mentioned, bias towards Itapetininga SP
        if (!searchStr.toLowerCase().includes('itapetininga') && !searchStr.toLowerCase().includes('sp')) {
          searchStr += ', Itapetininga, SP, Brasil';
        } else {
          searchStr += ', Brasil';
        }

        const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          searchStr
        )}&limit=1&countrycodes=br&addressdetails=1`;

        const res = await fetch(url, {
          headers: {
            'Accept-Language': 'pt-BR,pt;q=0.9,en;q=0.8',
          },
        });

        if (!res.ok) throw new Error('Falha na busca de endereço');
        const results = await res.json();

        if (results && results.length > 0) {
          const first = results[0];
          const newLat = parseFloat(first.lat);
          const newLng = parseFloat(first.lon);

          onCoordsChange(newLat, newLng);

          if (mapInstanceRef.current) {
            mapInstanceRef.current.flyTo([newLat, newLng], 16, { duration: 1.2 });
          }

          if (markerRef.current) {
            markerRef.current.setLatLng([newLat, newLng]);
          }

          setStatusMessage('Marcador posicionado no endereço digitado!');
        } else {
          setStatusMessage('Endereço não encontrado exatamente. Você pode clicar diretamente no mapa.');
        }
      } catch (err) {
        setStatusMessage('Não foi possível localizar o texto. Clique diretamente no mapa.');
      } finally {
        setIsGeocoding(false);
        setTimeout(() => setStatusMessage(null), 5000);
      }
    },
    [onCoordsChange]
  );

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    const initialLat = lat || -23.5905;
    const initialLng = lng || -48.0512;

    const map = L.map(mapContainerRef.current, {
      center: [initialLat, initialLng],
      zoom: 15,
      zoomControl: true,
      attributionControl: false,
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
    }).addTo(map);

    // Custom Draggable Pin Icon - Coral for PERDI, Teal for ACHEI
    const pinColor = category === 'PERDI' ? '#FF6B55' : '#176B78';
    const pinIcon = createSightingPinIcon(pinColor);

    const marker = L.marker([initialLat, initialLng], {
      icon: pinIcon,
      draggable: true,
    }).addTo(map);

    // When marker is dragged
    marker.on('dragend', (e) => {
      const newPos = e.target.getLatLng();
      onCoordsChange(newPos.lat, newPos.lng);
      reverseGeocode(newPos.lat, newPos.lng);
    });

    // When map is clicked anywhere: locks marker immediately onto clicked location
    map.on('click', (e: L.LeafletMouseEvent) => {
      const clickedLat = e.latlng.lat;
      const clickedLng = e.latlng.lng;

      marker.setLatLng([clickedLat, clickedLng]);
      onCoordsChange(clickedLat, clickedLng);
      reverseGeocode(clickedLat, clickedLng);
    });

    markerRef.current = marker;
    mapInstanceRef.current = map;

    // Invalidate size to guarantee tiles render fully after container mount
    setTimeout(() => {
      map.invalidateSize();
    }, 200);
    setTimeout(() => {
      map.invalidateSize();
    }, 600);

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Update marker icon if category changes
  useEffect(() => {
    if (!markerRef.current) return;
    const pinColor = category === 'PERDI' ? '#FF6B55' : '#176B78';
    markerRef.current.setIcon(createSightingPinIcon(pinColor));
  }, [category]);

  // Update marker position if coordinates change externally
  useEffect(() => {
    if (!markerRef.current || !mapInstanceRef.current) return;
    const current = markerRef.current.getLatLng();
    if (Math.abs(current.lat - lat) > 0.0001 || Math.abs(current.lng - lng) > 0.0001) {
      markerRef.current.setLatLng([lat, lng]);
      mapInstanceRef.current.panTo([lat, lng]);
    }
  }, [lat, lng]);

  // Handle User GPS Click
  const handleGPS = () => {
    if (!navigator.geolocation) {
      setStatusMessage('Geolocalização não suportada no seu navegador.');
      return;
    }

    setIsLocatingUser(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setIsLocatingUser(false);
        const { latitude, longitude } = pos.coords;
        onCoordsChange(latitude, longitude);

        if (mapInstanceRef.current) {
          mapInstanceRef.current.flyTo([latitude, longitude], 16, { duration: 1.2 });
        }
        if (markerRef.current) {
          markerRef.current.setLatLng([latitude, longitude]);
        }
        reverseGeocode(latitude, longitude);
      },
      () => {
        setIsLocatingUser(false);
        setStatusMessage('Não foi possível obter sua localização GPS.');
      },
      { enableHighAccuracy: true, timeout: 8000 }
    );
  };

  // Debounce address typing to sync to map
  const handleAddressInputChange = (newVal: string) => {
    onAddressChange(newVal);

    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    if (newVal.trim().length >= 6) {
      searchTimeoutRef.current = setTimeout(() => {
        geocodeAddress(newVal);
      }, 1200);
    }
  };

  return (
    <div className={`space-y-3 ${className}`}>
      {/* Address Input & Geocoding Search Bar */}
      <div>
        <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center justify-between">
          <span className="flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-[#176B78]" /> Endereço do Avistamento *
          </span>
          <span className="text-[11px] text-[#5E7180] font-normal">
            Sincronizado com o marcador no mapa
          </span>
        </label>

        <div className="flex gap-2">
          <div className="relative flex-1">
            <input
              type="text"
              required
              value={address}
              onChange={(e) => handleAddressInputChange(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  geocodeAddress(address);
                }
              }}
              placeholder="Ex: Rua das Flores, 120, Centro, Itapetininga"
              className="w-full bg-[#F0FAF7] border border-[#176B78]/25 text-slate-800 placeholder-slate-400 rounded-xl px-4 py-3 text-xs pr-8 focus:outline-none focus:border-[#176B78] focus:bg-white transition"
            />
            {address && !isGeocoding && !isReverseGeocoding && (
              <button
                type="button"
                onClick={() => onAddressChange('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 p-1 rounded-md transition cursor-pointer"
                title="Limpar endereço"
                aria-label="Limpar endereço"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
            {(isGeocoding || isReverseGeocoding) && (
              <div className="absolute right-3 top-1/2 -translate-y-1/2 text-[#176B78] animate-spin">
                <Loader2 className="w-4 h-4" />
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={() => geocodeAddress(address)}
            disabled={isGeocoding}
            className="bg-[#176B78] hover:bg-[#125560] text-white text-xs font-bold px-4 py-3 rounded-xl transition shadow-xs flex items-center gap-1.5 cursor-pointer shrink-0 disabled:opacity-50"
            title="Localizar endereço digitado no mapa"
          >
            <Search className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Buscar no Mapa</span>
          </button>

          <button
            type="button"
            onClick={handleGPS}
            disabled={isLocatingUser}
            className="bg-[#BFE8DD] hover:bg-[#a9dfd2] text-[#176B78] text-xs font-bold px-3.5 py-3 rounded-xl transition shadow-xs flex items-center gap-1.5 cursor-pointer shrink-0 disabled:opacity-50"
            title="Usar meu GPS atual para posicionar"
          >
            <Locate className={`w-4 h-4 ${isLocatingUser ? 'animate-spin text-[#176B78]' : ''}`} />
            <span className="hidden md:inline font-bold">Meu GPS</span>
          </button>
        </div>
      </div>

      {/* Map Interactive Box */}
      <div className="rounded-2xl overflow-hidden border border-[#BFE8DD] shadow-xs relative bg-[#F7F8F4]">
        {/* Map Header Instructions */}
        <div className="bg-white/95 px-3.5 py-2 border-b border-slate-100 flex items-center justify-between text-xs z-10 relative">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#FF6B55] animate-pulse"></span>
            <span className="font-bold text-slate-800 text-[11px] sm:text-xs">
              Aponte no mapa o local exato onde o animal foi visto:
            </span>
          </div>
          <div className="flex items-center gap-2 text-[10px] text-[#5E7180] font-mono">
            <span>Lat: {lat.toFixed(4)}</span>
            <span>Lng: {lng.toFixed(4)}</span>
          </div>
        </div>

        {/* Map Canvas */}
        <div className="h-64 sm:h-72 w-full relative">
          <div ref={mapContainerRef} className="w-full h-full z-0" />

          {/* Quick Floating Instruction Overlay */}
          <div className="absolute top-3 left-3 z-[400] bg-white/95 backdrop-blur-xs px-3 py-1.5 rounded-xl border border-[#BFE8DD] shadow-md text-[11px] text-slate-700 pointer-events-none flex items-center gap-1.5">
            <Navigation className="w-3.5 h-3.5 text-[#176B78]" />
            <span>Clique no mapa ou arraste o marcador</span>
          </div>
        </div>

        {/* Status / Feedback Bar */}
        <div className="bg-[#F0FAF7] px-3.5 py-2 border-t border-[#BFE8DD] flex items-center justify-between text-[11px] text-[#5E7180]">
          <span className="flex items-center gap-1.5 truncate">
            {isReverseGeocoding || isGeocoding ? (
              <>
                <Loader2 className="w-3.5 h-3.5 text-[#176B78] animate-spin shrink-0" />
                <span className="text-[#176B78] font-medium">{statusMessage || 'Sincronizando...'}</span>
              </>
            ) : statusMessage ? (
              <>
                <CheckCircle2 className="w-3.5 h-3.5 text-[#35A66F] shrink-0" />
                <span className="text-slate-800 font-medium truncate">{statusMessage}</span>
              </>
            ) : (
              <>
                <CheckCircle2 className="w-3.5 h-3.5 text-[#176B78] shrink-0" />
                <span>O endereço e o ponto no mapa estão sincronizados automaticamente.</span>
              </>
            )}
          </span>

          <button
            type="button"
            onClick={handleGPS}
            className="text-[#176B78] hover:underline font-bold shrink-0 ml-2 cursor-pointer text-[10px] sm:text-[11px]"
          >
            Centralizar GPS
          </button>
        </div>
      </div>
    </div>
  );
};
