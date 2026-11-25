import React, { useState, useMemo, useEffect } from 'react';
import { Pet, PetCategory, PetSpecies, PetStatus, UserAccount } from '../types';
import { Search, MapPin, Calendar, Palette, MessageSquare, Locate, ShieldAlert, Award, Filter, LayoutGrid, Map as MapIcon, Columns, Trash2 } from 'lucide-react';
import { InteractiveMap } from './InteractiveMap';
import { DeletePetModal } from './DeletePetModal';

interface MuralMapTabProps {
  pets: Pet[];
  onOpenDetails: (pet: Pet) => void;
  onOpenChat: (petId: string) => void;
  onLocateUser: () => void;
  forcedLayoutMode?: 'split' | 'map-focus' | 'grid-only';
  currentUser?: UserAccount;
  onDeletePet?: (petId: string) => void;
}

export const MuralMapTab: React.FC<MuralMapTabProps> = ({
  pets,
  onOpenDetails,
  onOpenChat,
  onLocateUser,
  forcedLayoutMode,
  currentUser,
  onDeletePet,
}) => {
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');
  const [speciesFilter, setSpeciesFilter] = useState<string>('ALL');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Selected pet to center map on
  const [focusedPetId, setFocusedPetId] = useState<string | null>(null);

  // Pet selected for admin deletion modal
  const [petToDelete, setPetToDelete] = useState<Pet | null>(null);

  // Layout mode: 'split' | 'map-focus' | 'grid-only'
  const [layoutMode, setLayoutMode] = useState<'split' | 'map-focus' | 'grid-only'>('split');

  useEffect(() => {
    if (forcedLayoutMode) {
      setLayoutMode(forcedLayoutMode);
    }
  }, [forcedLayoutMode]);

  const filteredPets = useMemo(() => {
    return pets.filter((pet) => {
      if (categoryFilter !== 'ALL' && pet.category !== categoryFilter) return false;
      if (speciesFilter !== 'ALL' && pet.species !== speciesFilter) return false;
      if (statusFilter !== 'ALL' && pet.status !== statusFilter) return false;

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchName = pet.name.toLowerCase().includes(q);
        const matchBreed = pet.breed?.toLowerCase().includes(q);
        const matchAddress = pet.address.toLowerCase().includes(q);
        const matchId = pet.id.toLowerCase().includes(q);
        const matchColor = pet.color.toLowerCase().includes(q);
        if (!matchName && !matchBreed && !matchAddress && !matchId && !matchColor) {
          return false;
        }
      }
      return true;
    });
  }, [pets, categoryFilter, speciesFilter, statusFilter, searchQuery]);

  const handleFocusPetOnMap = (petId: string) => {
    setFocusedPetId(petId);
    if (layoutMode === 'grid-only') {
      setLayoutMode('split');
    }
  };

  return (
    <div className="space-y-6">
      {/* Filter Bar & View Layout Switcher */}
      <div className="bg-white border border-[#BFE8DD] p-4 sm:p-5 rounded-3xl shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div>
            <h2 className="text-base sm:text-lg font-extrabold text-slate-900 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-[#176B78]" />
              <span>Mural de Ocorrências e Radar em Tempo Real</span>
            </h2>
            <p className="text-xs text-[#5E7180] mt-0.5 font-medium">
              Acompanhe animais perdidos, encontrados e reencontrados com localização geográfica interativa.
            </p>
          </div>

          {/* Layout Mode Buttons */}
          <div className="flex items-center gap-1 bg-[#F0FAF7] border border-[#BFE8DD] p-1 rounded-2xl self-start sm:self-auto">
            <button
              type="button"
              onClick={() => setLayoutMode('split')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                layoutMode === 'split'
                  ? 'bg-[#176B78] text-white shadow-xs'
                  : 'text-[#5E7180] hover:text-[#176B78]'
              }`}
              title="Exibição Dividida (Mural + Mapa)"
            >
              <Columns className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Dividido</span>
            </button>
            <button
              type="button"
              onClick={() => setLayoutMode('map-focus')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                layoutMode === 'map-focus'
                  ? 'bg-[#176B78] text-white shadow-xs'
                  : 'text-[#5E7180] hover:text-[#176B78]'
              }`}
              title="Foco no Mapa Interativo"
            >
              <MapIcon className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Radar / Mapa</span>
            </button>
            <button
              type="button"
              onClick={() => setLayoutMode('grid-only')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                layoutMode === 'grid-only'
                  ? 'bg-[#176B78] text-white shadow-xs'
                  : 'text-[#5E7180] hover:text-[#176B78]'
              }`}
              title="Apenas Grade de Cards"
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Cards</span>
            </button>
          </div>
        </div>

        {/* Filters Controls - 4 Fields with Teal / Mint Accents */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          <div>
            <label className="block text-[10px] font-bold text-[#5E7180] uppercase tracking-wide mb-1 flex items-center gap-1">
              <Filter className="w-3 h-3 text-[#176B78]" /> Categoria
            </label>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full bg-[#F0FAF7] border border-[#176B78]/25 text-slate-800 text-xs rounded-xl px-3 py-2.5 focus:outline-none focus:border-[#176B78] focus:bg-white transition"
            >
              <option value="ALL">Todas as Categorias</option>
              <option value="PERDI">Perdi um Pet (Alerta)</option>
              <option value="ACHEI">Achei um Pet</option>
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-[#5E7180] uppercase tracking-wide mb-1">
              Espécie
            </label>
            <select
              value={speciesFilter}
              onChange={(e) => setSpeciesFilter(e.target.value)}
              className="w-full bg-[#F0FAF7] border border-[#176B78]/25 text-slate-800 text-xs rounded-xl px-3 py-2.5 focus:outline-none focus:border-[#176B78] focus:bg-white transition"
            >
              <option value="ALL">Todas as Espécies</option>
              <option value="Cão">Cão</option>
              <option value="Gato">Gato</option>
              <option value="Ave">Ave</option>
              <option value="Outros">Outros</option>
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-[#5E7180] uppercase tracking-wide mb-1">
              Status
            </label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full bg-[#F0FAF7] border border-[#176B78]/25 text-slate-800 text-xs rounded-xl px-3 py-2.5 focus:outline-none focus:border-[#176B78] focus:bg-white transition"
            >
              <option value="ALL">Todos os Status</option>
              <option value="Em Busca">Em Busca</option>
              <option value="Aguardando Tutor">Aguardando Tutor</option>
              <option value="Reencontrado">Reencontrado</option>
            </select>
          </div>

          <div className="sm:col-span-2">
            <label className="block text-[10px] font-bold text-[#5E7180] uppercase tracking-wide mb-1 flex items-center gap-1">
              <Search className="w-3 h-3 text-[#176B78]" /> Buscar por Nome, Raça ou Bairro
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar por nome, raça ou bairro..."
                className="w-full bg-[#F0FAF7] border border-[#176B78]/25 text-slate-800 placeholder-slate-400 text-xs rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-[#176B78] focus:bg-white transition"
              />
              <button
                type="button"
                onClick={onLocateUser}
                className="bg-[#BFE8DD] hover:bg-[#a9dfd2] text-[#176B78] px-3.5 py-2.5 rounded-xl text-xs font-bold transition shadow-xs flex items-center gap-1 cursor-pointer shrink-0"
                title="Obter minha localização GPS"
              >
                <Locate className="w-4 h-4 text-[#176B78]" />
                <span className="hidden sm:inline font-bold">GPS</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* VIEW MODE 1: FULL MAP FOCUS */}
      {layoutMode === 'map-focus' && (
        <div className="space-y-4">
          <InteractiveMap
            pets={filteredPets}
            selectedPetId={focusedPetId}
            onOpenDetails={onOpenDetails}
            onOpenChat={onOpenChat}
            className="w-full h-[640px]"
            isExpanded={true}
            onToggleExpand={() => setLayoutMode('split')}
          />

          {/* Quick horizontal cards carousel below the full map */}
          <div className="space-y-2">
            <h3 className="font-bold text-xs text-[#5E7180] uppercase tracking-wider flex items-center gap-1.5">
              <span>Ocorrências filtradas no radar ({filteredPets.length}):</span>
            </h3>
            <div className="flex gap-3 overflow-x-auto pb-2 custom-scrollbar">
              {filteredPets.map((pet) => (
                <div
                  key={pet.id}
                  onClick={() => handleFocusPetOnMap(pet.id)}
                  className={`min-w-[240px] max-w-[240px] bg-white border rounded-2xl p-3 shadow-xs cursor-pointer transition shrink-0 ${
                    focusedPetId === pet.id
                      ? 'border-[#176B78] ring-2 ring-[#176B78]/30 bg-[#F0FAF7]'
                      : 'border-slate-200 hover:border-[#176B78]'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <img
                      src={pet.photo}
                      alt={pet.name}
                      className="w-12 h-12 rounded-xl object-cover border border-[#BFE8DD] shrink-0"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          'https://placehold.co/100x100/BFE8DD/176B78?text=Pet';
                      }}
                    />
                    <div className="min-w-0">
                      <h4 className="font-bold text-xs text-slate-900 truncate">{pet.name}</h4>
                      <p className="text-[10px] text-[#5E7180] truncate">{pet.species} • {pet.breed || 'SRD'}</p>
                      <span className={`inline-block text-[9px] font-bold px-1.5 py-0.5 rounded mt-0.5 ${
                        pet.category === 'PERDI'
                          ? 'bg-[#FFF0EE] text-[#FF6B55]'
                          : 'bg-[#F0FAF7] text-[#176B78]'
                      }`}>
                        {pet.category === 'PERDI' ? 'Perdido' : 'Encontrado'}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* VIEW MODE 2: SPLIT VIEW (CARDS + LEAFLET MAP) */}
      {layoutMode === 'split' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Cards List (7 Cols) */}
          <div className="lg:col-span-7 space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="font-bold text-xs sm:text-sm text-slate-800 uppercase tracking-wider flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#176B78]"></span>
                Ocorrências em Tempo Real ({filteredPets.length})
              </h3>
              <span className="text-xs text-[#5E7180]">Clique em "Ver no Mapa" para focar</span>
            </div>

            {filteredPets.length === 0 ? (
              <div className="bg-white border border-[#BFE8DD] rounded-3xl p-12 text-center space-y-3 shadow-xs">
                <ShieldAlert className="w-12 h-12 text-[#176B78]/60 mx-auto" />
                <h4 className="font-bold text-slate-900 text-base">Nenhum pet encontrado</h4>
                <p className="text-xs text-[#5E7180] max-w-sm mx-auto">
                  Tente ajustar seus filtros de busca ou cadastre uma nova ocorrência para ajudar a comunidade.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {filteredPets.map((pet) => {
                  const isLost = pet.category === 'PERDI';
                  const isFound = pet.status === 'Reencontrado';
                  const isFocused = focusedPetId === pet.id;

                  return (
                    <div
                      key={pet.id}
                      className={`bg-white rounded-3xl shadow-xs border overflow-hidden hover:shadow-md transition-all duration-200 flex flex-col group ${
                        isFocused ? 'border-[#176B78] ring-2 ring-[#176B78]/30' : 'border-slate-200/90 hover:border-[#176B78]/40'
                      }`}
                    >
                      {/* Photo Header */}
                      <div className="relative h-44 bg-slate-100 overflow-hidden">
                        <img
                          src={pet.photo}
                          alt={pet.name}
                          className="w-full h-full object-cover group-hover:scale-102 transition duration-300"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src =
                              'https://placehold.co/400x300/BFE8DD/176B78?text=Sem+Foto';
                          }}
                        />
                        {/* Status badge: Coral #FF6B55 for PERDI, Teal #176B78 for ACHEI, Green #35A66F for REENCONTRADO */}
                        {isFound ? (
                          <span className="absolute top-3 left-3 bg-[#35A66F] text-white font-bold text-[10px] px-2.5 py-1 rounded-full shadow-md tracking-tight flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-white"></span>
                            REENCONTRADO
                          </span>
                        ) : isLost ? (
                          <span className="absolute top-3 left-3 bg-[#FF6B55] text-white font-bold text-[10px] px-2.5 py-1 rounded-full shadow-md tracking-tight flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></span>
                            PERDI UM PET
                          </span>
                        ) : (
                          <span className="absolute top-3 left-3 bg-[#176B78] text-white font-bold text-[10px] px-2.5 py-1 rounded-full shadow-md tracking-tight flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#BFE8DD]"></span>
                            ACHEI UM PET
                          </span>
                        )}

                        <span className="absolute top-3 right-3 bg-white/95 backdrop-blur-md text-slate-800 font-mono text-[10px] px-2 py-0.5 rounded-md border border-slate-200 font-bold shadow-xs">
                          {pet.id}
                        </span>

                        {pet.reward && pet.reward !== 'Não há' && pet.reward !== 'Não informada' && (
                          <span className="absolute bottom-2.5 left-3 bg-amber-500/95 text-white font-bold text-[10px] px-2 py-0.5 rounded-md shadow-xs flex items-center gap-1">
                            <Award className="w-3 h-3" /> Recompensa: {pet.reward}
                          </span>
                        )}
                      </div>

                      {/* Card Content */}
                      <div className="p-4.5 sm:p-5 flex-1 flex flex-col justify-between space-y-3">
                        <div>
                          <div className="flex justify-between items-start gap-2">
                            <h4 className="font-bold text-base text-slate-900 truncate">
                              {pet.name}
                            </h4>
                            <span
                              className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold border shrink-0 ${
                                isFound
                                  ? 'text-[#35A66F] bg-[#EBF7F1] border-[#35A66F]/30'
                                  : isLost
                                  ? 'text-[#FF6B55] bg-[#FFF0EE] border-[#FF6B55]/30'
                                  : 'text-[#176B78] bg-[#F0FAF7] border-[#176B78]/25'
                              }`}
                            >
                              {pet.status}
                            </span>
                          </div>
                          <p className="text-xs text-[#5E7180] mt-0.5 font-medium">
                            {pet.species} • {pet.breed || 'SRD'}
                          </p>

                          <div className="mt-2.5 flex items-center gap-1.5 text-xs text-slate-700 bg-[#F0FAF7] px-2.5 py-1.5 rounded-xl border border-[#BFE8DD]/70">
                            <Palette className="w-3.5 h-3.5 text-[#176B78]" />
                            <span className="truncate">
                              Cor: <strong className="text-slate-900">{pet.color}</strong>
                            </span>
                          </div>

                          <div className="mt-2.5 space-y-1">
                            <p className="text-xs text-[#5E7180] line-clamp-1 flex items-start gap-1">
                              <MapPin className="w-3.5 h-3.5 text-[#176B78] shrink-0 mt-0.5" />
                              <span className="truncate">{pet.address}</span>
                            </p>
                            {pet.date && (
                              <p className="text-[11px] text-[#5E7180] flex items-center gap-1">
                                <Calendar className="w-3 h-3 text-[#176B78] shrink-0" />
                                <span>Visto em: {pet.date}</span>
                              </p>
                            )}
                          </div>
                        </div>

                        {/* Footer Actions: Contact (Mint) & Details (Teal) */}
                        <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs gap-1.5">
                          <button
                            type="button"
                            onClick={() => handleFocusPetOnMap(pet.id)}
                            className="text-[#176B78] hover:text-[#125560] font-bold text-[11px] flex items-center gap-1 cursor-pointer transition hover:underline"
                            title="Localizar no Mapa"
                          >
                            <MapPin className="w-3.5 h-3.5 text-[#176B78]" />
                            Ver no Mapa
                          </button>
                          <div className="flex items-center gap-1.5">
                            {currentUser?.role === 'ADMIN' && onDeletePet && (
                              <button
                                type="button"
                                onClick={() => setPetToDelete(pet)}
                                className="bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 p-1.5 rounded-xl transition shadow-xs flex items-center gap-1 cursor-pointer text-[11px] font-bold"
                                title="Excluir Ocorrência (Admin)"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            )}
                            <button
                              onClick={() => onOpenChat(pet.id)}
                              className="bg-[#BFE8DD] hover:bg-[#a9dfd2] text-[#176B78] font-bold px-3 py-1.5 rounded-xl transition shadow-xs flex items-center gap-1 cursor-pointer text-[11px]"
                              title="Entrar em contato com o Tutor"
                            >
                              <MessageSquare className="w-3 h-3 text-[#176B78]" />
                              <span>Contato</span>
                            </button>
                            <button
                              onClick={() => onOpenDetails(pet)}
                              className="bg-[#176B78] hover:bg-[#125560] text-white font-bold px-3.5 py-1.5 rounded-xl transition shadow-xs cursor-pointer text-[11px]"
                            >
                              Ver Detalhes
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Right Column: Leaflet Interactive Map (5 Cols, Sticky) */}
          <div className="lg:col-span-5 lg:sticky lg:top-24">
            <InteractiveMap
              pets={filteredPets}
              selectedPetId={focusedPetId}
              onOpenDetails={onOpenDetails}
              onOpenChat={onOpenChat}
              className="w-full h-[520px] lg:h-[620px]"
              isExpanded={false}
              onToggleExpand={() => setLayoutMode('map-focus')}
            />
          </div>
        </div>
      )}

      {/* VIEW MODE 3: GRID ONLY */}
      {layoutMode === 'grid-only' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-bold text-xs sm:text-sm text-slate-800 uppercase tracking-wider flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#176B78]"></span>
              Todos os Animais Registrados ({filteredPets.length})
            </h3>
            <button
              onClick={() => setLayoutMode('split')}
              className="text-xs text-[#176B78] hover:underline font-bold flex items-center gap-1 cursor-pointer"
            >
              <MapPin className="w-3.5 h-3.5" /> Abrir Mapa Interativo
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredPets.map((pet) => {
              const isLost = pet.category === 'PERDI';
              const isFound = pet.status === 'Reencontrado';

              return (
                <div
                  key={pet.id}
                  className="bg-white rounded-3xl shadow-xs border border-slate-200/90 hover:border-[#176B78]/40 hover:shadow-md transition-all duration-200 flex flex-col group overflow-hidden"
                >
                  <div className="relative h-48 bg-slate-100 overflow-hidden">
                    <img
                      src={pet.photo}
                      alt={pet.name}
                      className="w-full h-full object-cover group-hover:scale-102 transition duration-300"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          'https://placehold.co/400x300/BFE8DD/176B78?text=Sem+Foto';
                      }}
                    />
                    {/* Status badge: Coral #FF6B55 for PERDI, Teal #176B78 for ACHEI, Green #35A66F for REENCONTRADO */}
                    {isFound ? (
                      <span className="absolute top-3 left-3 bg-[#35A66F] text-white font-bold text-[10px] px-2.5 py-1 rounded-full shadow-md tracking-tight flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-white"></span>
                        REENCONTRADO
                      </span>
                    ) : isLost ? (
                      <span className="absolute top-3 left-3 bg-[#FF6B55] text-white font-bold text-[10px] px-2.5 py-1 rounded-full shadow-md tracking-tight flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></span>
                        PERDI UM PET
                      </span>
                    ) : (
                      <span className="absolute top-3 left-3 bg-[#176B78] text-white font-bold text-[10px] px-2.5 py-1 rounded-full shadow-md tracking-tight flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#BFE8DD]"></span>
                        ACHEI UM PET
                      </span>
                    )}
                    <span className="absolute top-3 right-3 bg-white/95 backdrop-blur-md text-slate-800 font-mono text-[10px] px-2 py-0.5 rounded-md border border-slate-200 font-bold shadow-xs">
                      {pet.id}
                    </span>
                  </div>

                  <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                    <div>
                      <div className="flex justify-between items-start gap-2">
                        <h4 className="font-bold text-base text-slate-900 truncate">
                          {pet.name}
                        </h4>
                        <span
                          className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold border shrink-0 ${
                            isFound
                              ? 'text-[#35A66F] bg-[#EBF7F1] border-[#35A66F]/30'
                              : isLost
                              ? 'text-[#FF6B55] bg-[#FFF0EE] border-[#FF6B55]/30'
                              : 'text-[#176B78] bg-[#F0FAF7] border-[#176B78]/25'
                          }`}
                        >
                          {pet.status}
                        </span>
                      </div>
                      <p className="text-xs text-[#5E7180] mt-0.5 font-medium">
                        {pet.species} • {pet.breed || 'SRD'}
                      </p>
                      <div className="mt-2.5 flex items-center gap-1.5 text-xs text-slate-700 bg-[#F0FAF7] px-2.5 py-1.5 rounded-xl border border-[#BFE8DD]/70">
                        <Palette className="w-3.5 h-3.5 text-[#176B78]" />
                        <span className="truncate">Cor: <strong>{pet.color}</strong></span>
                      </div>
                      <div className="mt-2.5 space-y-1">
                        <p className="text-xs text-[#5E7180] line-clamp-1 flex items-start gap-1">
                          <MapPin className="w-3.5 h-3.5 text-[#176B78] shrink-0 mt-0.5" />
                          <span className="truncate">{pet.address}</span>
                        </p>
                        {pet.date && (
                          <p className="text-[11px] text-[#5E7180] flex items-center gap-1">
                            <Calendar className="w-3 h-3 text-[#176B78] shrink-0" />
                            <span>Visto em: {pet.date}</span>
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs gap-2">
                      <button
                        type="button"
                        onClick={() => handleFocusPetOnMap(pet.id)}
                        className="text-[#176B78] hover:text-[#125560] font-bold text-xs flex items-center gap-1 cursor-pointer transition hover:underline"
                      >
                        <MapPin className="w-3.5 h-3.5 text-[#176B78]" />
                        Ver no Mapa
                      </button>
                      <div className="flex items-center gap-2">
                        {currentUser?.role === 'ADMIN' && onDeletePet && (
                          <button
                            type="button"
                            onClick={() => setPetToDelete(pet)}
                            className="bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 p-2 rounded-xl transition shadow-xs flex items-center gap-1 cursor-pointer text-xs font-bold"
                            title="Excluir Ocorrência (Admin)"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                        <button
                          onClick={() => onOpenChat(pet.id)}
                          className="bg-[#BFE8DD] hover:bg-[#a9dfd2] text-[#176B78] font-bold px-3 py-1.5 rounded-xl transition shadow-xs flex items-center gap-1.5 cursor-pointer text-xs"
                          title="Entrar em contato com o Tutor"
                        >
                          <MessageSquare className="w-3.5 h-3.5 text-[#176B78]" />
                          <span>Contato</span>
                        </button>
                        <button
                          onClick={() => onOpenDetails(pet)}
                          className="bg-[#176B78] hover:bg-[#125560] text-white font-bold px-3.5 py-1.5 rounded-xl transition shadow-xs cursor-pointer text-xs"
                        >
                          Ver Detalhes
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Admin Delete Confirmation Modal */}
      <DeletePetModal
        pet={petToDelete}
        isOpen={petToDelete !== null}
        onClose={() => setPetToDelete(null)}
        onConfirmDelete={onDeletePet || (() => {})}
        isAdmin={true}
      />
    </div>
  );
};
