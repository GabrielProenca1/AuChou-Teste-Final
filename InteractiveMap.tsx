import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { Pet } from '../types';
import { Locate, Maximize2, Minimize2, Layers, MapPin, ZoomIn, ZoomOut, Compass } from 'lucide-react';

interface InteractiveMapProps {
  pets: Pet[];
  selectedPetId?: string | null;
  onOpenDetails: (pet: Pet) => void;
  onOpenChat: (petId: string) => void;
  className?: string;
  isExpanded?: boolean;
  onToggleExpand?: () => void;
}

export const InteractiveMap: React.FC<InteractiveMapProps> = ({
  pets,
  selectedPetId,
  onOpenDetails,
  onOpenChat,
  className = '',
  isExpanded = false,
  onToggleExpand,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);
  const userMarkerRef = useRef<L.Marker | null>(null);
  const userCircleRef = useRef<L.Circle | null>(null);
  const markerMapRef = useRef<{ [key: string]: L.Marker }>({});

  const [activeTile, setActiveTile] = useState<'osm' | 'voyager' | 'satellite'>('osm');
  const [isLocating, setIsLocating] = useState(false);
  const [userCoords, setUserCoords] = useState<[number, number] | null>(null);
  const tileLayerRef = useRef<L.TileLayer | null>(null);

  // Set up global callbacks so Leaflet popup HTML can call React functions safely
  useEffect(() => {
    (window as any).__auchouMapOpenDetails = (petId: string) => {
      const pet = pets.find((p) => p.id === petId);
      if (pet) onOpenDetails(pet);
    };

    (window as any).__auchouMapOpenChat = (petId: string) => {
      onOpenChat(petId);
    };

    return () => {
      delete (window as any).__auchouMapOpenDetails;
      delete (window as any).__auchouMapOpenChat;
    };
  }, [pets, onOpenDetails, onOpenChat]);

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    // Default center: Itapetininga / SP region
    const initialLat = -23.5905;
    const initialLng = -48.0512;

    const map = L.map(mapContainerRef.current, {
      center: [initialLat, initialLng],
      zoom: 14,
      zoomControl: false, // Custom styled zoom controls
      attributionControl: false,
    });

    // Attribution control compact
    L.control
      .attribution({
        position: 'bottomright',
        prefix: '<a href="https://leafletjs.com" target="_blank" rel="noopener noreferrer">Leaflet</a> | © <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">OpenStreetMap</a>',
      })
      .addTo(map);

    // Initial tile layer
    const tileLayer = L.tileLayer(
      'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      {
        maxZoom: 19,
      }
    ).addTo(map);

    tileLayerRef.current = tileLayer;
    markersLayerRef.current = L.layerGroup().addTo(map);
    mapInstanceRef.current = map;

    // Trigger invalidateSize to prevent grey tiles after DOM layout calculations
    setTimeout(() => {
      map.invalidateSize();
    }, 200);

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Invalidate map size when expanded or resized
  useEffect(() => {
    if (!mapInstanceRef.current) return;
    const timer = setTimeout(() => {
      mapInstanceRef.current?.invalidateSize();
    }, 250);
    return () => clearTimeout(timer);
  }, [isExpanded]);

  // Update Tile Layer
  useEffect(() => {
    if (!mapInstanceRef.current) return;
    if (tileLayerRef.current) {
      tileLayerRef.current.remove();
    }

    let url = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
    let maxZoom = 19;

    if (activeTile === 'voyager') {
      url = 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png';
    } else if (activeTile === 'satellite') {
      url = 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}';
      maxZoom = 18;
    }

    tileLayerRef.current = L.tileLayer(url, { maxZoom }).addTo(mapInstanceRef.current);
  }, [activeTile]);

  // Update Markers when `pets` list updates
  useEffect(() => {
    const map = mapInstanceRef.current;
    const markersLayer = markersLayerRef.current;
    if (!map || !markersLayer) return;

    markersLayer.clearLayers();
    markerMapRef.current = {};

    pets.forEach((pet) => {
      const lat = Number(pet.lat) || -23.5905;
      const lng = Number(pet.lng) || -48.0512;

      const isLost = pet.category === 'PERDI';
      const isReencontrado = pet.status === 'Reencontrado';

      // Determine pin theme colors according to new palette:
      // Coral #FF6B55 for lost, Green #35A66F for reencontrado, Teal #176B78 for found
      const pinBg = isReencontrado
        ? 'border-[#35A66F] bg-white'
        : isLost
        ? 'border-[#FF6B55] bg-white'
        : 'border-[#176B78] bg-white';

      const badgeLabel = isReencontrado
        ? 'REENCONTRADO'
        : isLost
        ? 'PERDIDO'
        : 'ENCONTRADO';

      const badgeBg = isReencontrado
        ? 'bg-[#EBF7F1] text-[#35A66F]'
        : isLost
        ? 'bg-[#FFF0EE] text-[#FF6B55]'
        : 'bg-[#F0FAF7] text-[#176B78]';

      // Custom HTML Marker using L.divIcon with fixed anchor
      const iconHtml = `
        <div style="width: 44px; height: 52px; position: relative; pointer-events: auto;" class="group select-none cursor-pointer">
          <div style="width: 44px; height: 44px; border-radius: 1rem; overflow: hidden; box-shadow: 0 8px 16px -2px rgba(0,0,0,0.18);" class="border-2.5 ${pinBg} flex items-center justify-center relative">
            <img 
              src="${pet.photo}" 
              alt="${pet.name}" 
              class="w-full h-full object-cover" 
              onerror="this.src='https://placehold.co/100x100/BFE8DD/176B78?text=Pet'" 
            />
            <span class="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full ${isReencontrado ? 'bg-[#35A66F]' : isLost ? 'bg-[#FF6B55]' : 'bg-[#176B78]'} border-2 border-white shadow-xs"></span>
          </div>
          <!-- Pin Pointer Arrow pointing down to (22, 52) -->
          <div style="width: 0; height: 0; border-left: 6px solid transparent; border-right: 6px solid transparent; border-top: 8px solid; margin: -1px auto 0 auto;" class="${isReencontrado ? 'border-t-[#35A66F]' : isLost ? 'border-t-[#FF6B55]' : 'border-t-[#176B78]'}"></div>
          <!-- Anchor point dot on ground -->
          <div style="position: absolute; left: 22px; top: 52px; transform: translate(-50%, -50%); width: 4px; height: 4px; border-radius: 9999px; background-color: rgba(0,0,0,0.5); pointer-events: none;"></div>
          <!-- Hover Label -->
          <div style="position: absolute; top: -28px; left: 22px; transform: translateX(-50%); background-color: rgba(15, 23, 42, 0.92); color: #ffffff; font-weight: 700; font-size: 10px; padding: 2px 8px; border-radius: 6px; white-space: nowrap; pointer-events: none; box-shadow: 0 2px 5px rgba(0,0,0,0.25);" class="opacity-0 group-hover:opacity-100 transition">
            ${pet.name} (${pet.category})
          </div>
        </div>
      `;

      const customIcon = L.divIcon({
        className: 'custom-leaflet-pet-marker',
        html: iconHtml,
        iconSize: [44, 52],
        iconAnchor: [22, 52],
        popupAnchor: [0, -50],
      });

      const marker = L.marker([lat, lng], { icon: customIcon });

      // Popup Content
      const popupHtml = `
        <div class="p-1 max-w-[240px] text-slate-800 font-sans">
          <div class="relative h-28 w-full rounded-xl overflow-hidden mb-2 bg-slate-100 border border-slate-200">
            <img src="${pet.photo}" alt="${pet.name}" class="w-full h-full object-cover" onerror="this.src='https://placehold.co/240x120/BFE8DD/176B78?text=Pet'"/>
            <span class="absolute top-2 left-2 text-[10px] font-bold px-2 py-0.5 rounded-full ${badgeBg} shadow-xs">
              ${badgeLabel}
            </span>
            <span class="absolute top-2 right-2 bg-white/95 text-slate-800 font-mono text-[9px] px-1.5 py-0.5 rounded font-bold shadow-xs">
              ${pet.id}
            </span>
          </div>
          <h4 class="font-extrabold text-sm text-slate-900 leading-tight">${pet.name}</h4>
          <p class="text-[11px] text-[#5E7180] mt-0.5">${pet.species} • ${pet.breed || 'SRD'}</p>
          <div class="mt-1 text-[11px] text-[#5E7180] flex items-start gap-1">
            <span class="font-semibold text-slate-700">📍 Local:</span>
            <span class="truncate">${pet.address}</span>
          </div>
          ${pet.reward && pet.reward !== 'Não informada' && pet.reward !== 'Não há' ? `
            <div class="mt-1.5 text-[10px] text-amber-800 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded font-semibold">
              🏆 Recompensa: ${pet.reward}
            </div>
          ` : ''}
          <div class="mt-3 pt-2 border-t border-slate-100 flex gap-2">
            <button 
              type="button"
              onclick="window.__auchouMapOpenDetails('${pet.id}')"
              class="flex-1 bg-[#176B78] hover:bg-[#125560] text-white text-[11px] font-bold py-1.5 px-2 rounded-lg transition text-center shadow-xs cursor-pointer"
            >
              Ver Detalhes
            </button>
            <button 
              type="button"
              onclick="window.__auchouMapOpenChat('${pet.id}')"
              class="bg-[#BFE8DD] hover:bg-[#a9dfd2] text-[#176B78] text-[11px] font-bold py-1.5 px-2.5 rounded-lg transition text-center shadow-xs cursor-pointer"
              title="Abrir Chat"
            >
              Chat
            </button>
          </div>
        </div>
      `;

      marker.bindPopup(popupHtml, {
        maxWidth: 260,
        className: 'custom-auchou-leaflet-popup',
      });

      marker.addTo(markersLayer);
      markerMapRef.current[pet.id] = marker;
    });
  }, [pets]);

  // Center on `selectedPetId` if triggered externally
  useEffect(() => {
    if (!selectedPetId || !mapInstanceRef.current) return;
    const targetMarker = markerMapRef.current[selectedPetId];
    const pet = pets.find((p) => p.id === selectedPetId);

    if (pet && mapInstanceRef.current) {
      mapInstanceRef.current.flyTo([pet.lat, pet.lng], 16, {
        duration: 1.2,
      });

      if (targetMarker) {
        setTimeout(() => {
          targetMarker.openPopup();
        }, 1200);
      }
    }
  }, [selectedPetId, pets]);

  // Fit Bounds to all markers
  const fitAllMarkers = () => {
    const map = mapInstanceRef.current;
    if (!map || pets.length === 0) return;

    const bounds = L.latLngBounds(pets.map((p) => [p.lat, p.lng]));
    if (userCoords) {
      bounds.extend(userCoords);
    }
    map.fitBounds(bounds, { padding: [40, 40], maxZoom: 16 });
  };

  // Locate User GPS
  const handleLocateMe = () => {
    if (!navigator.geolocation) {
      alert('Geolocalização não é suportada pelo seu navegador.');
      return;
    }

    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setIsLocating(false);
        const { latitude, longitude, accuracy } = pos.coords;
        const coords: [number, number] = [latitude, longitude];
        setUserCoords(coords);

        const map = mapInstanceRef.current;
        if (!map) return;

        // Remove previous user marker
        if (userMarkerRef.current) userMarkerRef.current.remove();
        if (userCircleRef.current) userCircleRef.current.remove();

        // Accuracy circle
        const circle = L.circle(coords, {
          radius: accuracy || 100,
          color: '#3b82f6',
          fillColor: '#93c5fd',
          fillOpacity: 0.25,
          weight: 1.5,
        }).addTo(map);

        // Pulsing user pin icon
        const userIcon = L.divIcon({
          className: 'user-gps-marker',
          html: `
            <div class="relative flex items-center justify-center">
              <span class="animate-ping absolute inline-flex h-8 w-8 rounded-full bg-blue-400 opacity-75"></span>
              <span class="relative inline-flex rounded-full h-5 w-5 bg-blue-600 border-2 border-white shadow-md"></span>
            </div>
          `,
          iconSize: [32, 32],
          iconAnchor: [16, 16],
        });

        const marker = L.marker(coords, { icon: userIcon })
          .addTo(map)
          .bindPopup(`
            <div class="p-1 text-xs font-sans">
              <p class="font-bold text-blue-900">📍 Você está aqui</p>
              <p class="text-[11px] text-slate-600 mt-0.5">Precisão: ~${Math.round(accuracy)}m</p>
            </div>
          `);

        userMarkerRef.current = marker;
        userCircleRef.current = circle;

        map.flyTo(coords, 15, { duration: 1.2 });
      },
      (err) => {
        setIsLocating(false);
        alert('Não foi possível obter sua localização GPS. Verifique as permissões de localização no seu navegador.');
      },
      { enableHighAccuracy: true, timeout: 8000 }
    );
  };

  return (
    <div className={`relative rounded-3xl overflow-hidden border border-[#BFE8DD] shadow-sm bg-white flex flex-col ${className}`}>
      {/* Map Header Bar */}
      <div className="p-3.5 sm:p-4 bg-white/95 backdrop-blur-xs border-b border-slate-100 flex items-center justify-between gap-3 z-10">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-[#F0FAF7] border border-[#BFE8DD] flex items-center justify-center text-[#176B78]">
            <MapPin className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-bold text-xs sm:text-sm text-slate-900 flex items-center gap-1.5">
              <span>Radar Interativo Leaflet</span>
              <span className="w-2 h-2 rounded-full bg-[#35A66F] animate-pulse"></span>
            </h3>
            <p className="text-[11px] text-[#5E7180] hidden sm:block">
              {pets.length} {pets.length === 1 ? 'ocorrência no raio' : 'ocorrências no raio geográfico'}
            </p>
          </div>
        </div>

        {/* Top Controls: Layers & Fit */}
        <div className="flex items-center gap-1.5">
          {/* Layer switcher */}
          <div className="flex bg-[#F0FAF7] border border-[#BFE8DD] rounded-xl p-0.5 text-[10px] font-semibold">
            <button
              type="button"
              onClick={() => setActiveTile('osm')}
              className={`px-2 py-1 rounded-lg transition ${
                activeTile === 'osm' ? 'bg-[#176B78] text-white shadow-xs' : 'text-[#5E7180] hover:text-slate-900'
              }`}
              title="Mapa Padrão"
            >
              Padrão
            </button>
            <button
              type="button"
              onClick={() => setActiveTile('voyager')}
              className={`px-2 py-1 rounded-lg transition ${
                activeTile === 'voyager' ? 'bg-[#176B78] text-white shadow-xs' : 'text-[#5E7180] hover:text-slate-900'
              }`}
              title="Visual Claro"
            >
              Claro
            </button>
            <button
              type="button"
              onClick={() => setActiveTile('satellite')}
              className={`px-2 py-1 rounded-lg transition ${
                activeTile === 'satellite' ? 'bg-[#176B78] text-white shadow-xs' : 'text-[#5E7180] hover:text-slate-900'
              }`}
              title="Foto de Satélite"
            >
              Satélite
            </button>
          </div>

          {/* Fit all */}
          <button
            type="button"
            onClick={fitAllMarkers}
            className="bg-[#F0FAF7] hover:bg-[#e2f3ee] text-[#176B78] border border-[#BFE8DD] p-2 rounded-xl transition shadow-xs cursor-pointer"
            title="Ajustar visão para todas as ocorrências"
          >
            <Compass className="w-4 h-4" />
          </button>

          {/* Toggle Expand / Full View */}
          {onToggleExpand && (
            <button
              type="button"
              onClick={onToggleExpand}
              className="bg-[#F0FAF7] hover:bg-[#e2f3ee] text-[#176B78] border border-[#BFE8DD] p-2 rounded-xl transition shadow-xs cursor-pointer"
              title={isExpanded ? 'Visualização Dividida' : 'Expandir Mapa'}
            >
              {isExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>
          )}
        </div>
      </div>

      {/* Map Canvas */}
      <div className="relative flex-1 w-full min-h-[360px] sm:min-h-[440px]">
        <div ref={mapContainerRef} className="w-full h-full z-0" />

        {/* Floating In-Map Buttons */}
        <div className="absolute top-4 right-4 z-[400] flex flex-col gap-2">
          {/* Zoom In */}
          <button
            type="button"
            onClick={() => mapInstanceRef.current?.zoomIn()}
            className="w-9 h-9 bg-white/95 hover:bg-white text-slate-800 rounded-xl shadow-md border border-[#BFE8DD] flex items-center justify-center transition cursor-pointer"
            title="Aproximar Zoom"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          {/* Zoom Out */}
          <button
            type="button"
            onClick={() => mapInstanceRef.current?.zoomOut()}
            className="w-9 h-9 bg-white/95 hover:bg-white text-slate-800 rounded-xl shadow-md border border-[#BFE8DD] flex items-center justify-center transition cursor-pointer"
            title="Afastar Zoom"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          {/* My Location */}
          <button
            type="button"
            onClick={handleLocateMe}
            className={`w-9 h-9 rounded-xl shadow-md border border-[#BFE8DD] flex items-center justify-center transition cursor-pointer ${
              isLocating
                ? 'bg-[#176B78] text-white animate-spin'
                : userCoords
                ? 'bg-[#176B78] text-white hover:bg-[#125560]'
                : 'bg-white/95 hover:bg-white text-[#176B78]'
            }`}
            title="Minha Localização GPS"
          >
            <Locate className="w-4 h-4" />
          </button>
        </div>

        {/* Floating Map Legend (Bottom Left) */}
        <div className="absolute bottom-3 left-3 z-[400] bg-white/95 backdrop-blur-xs p-2.5 rounded-2xl border border-[#BFE8DD] shadow-md text-[10px] space-y-1.5 max-w-[200px]">
          <span className="font-bold text-slate-800 block text-[11px] mb-0.5">Legenda do Radar:</span>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-[#FF6B55] border border-white shrink-0 shadow-xs"></span>
            <span className="text-slate-700 font-medium">Pet Perdido</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-[#176B78] border border-white shrink-0 shadow-xs"></span>
            <span className="text-slate-700 font-medium">Pet Encontrado</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-[#35A66F] border border-white shrink-0 shadow-xs"></span>
            <span className="text-slate-700 font-medium">Reencontrado</span>
          </div>
          {userCoords && (
            <div className="flex items-center gap-2 pt-1 border-t border-slate-100">
              <span className="w-3 h-3 rounded-full bg-blue-600 border border-white shrink-0 shadow-xs"></span>
              <span className="text-blue-700 font-bold">Minha Posição</span>
            </div>
          )}
        </div>
      </div>

      {/* Footer Info */}
      <div className="px-4 py-2.5 bg-[#F0FAF7] border-t border-[#BFE8DD] flex items-center justify-between text-[11px] text-[#5E7180]">
        <span className="flex items-center gap-1.5 truncate">
          <span className="w-2 h-2 rounded-full bg-[#176B78]"></span>
          Clique em qualquer marcador no mapa para ver a foto, status e abrir chat imediato.
        </span>
        <button
          type="button"
          onClick={fitAllMarkers}
          className="text-[#176B78] hover:underline font-bold shrink-0 ml-2 cursor-pointer"
        >
          Enquadrar Todos
        </button>
      </div>
    </div>
  );
};
