import React, { useState, useMemo } from 'react';
import { Pet } from '../types';
import { ShieldAlert, CheckCircle, Search, Eye, Trash2, PieChart, Filter } from 'lucide-react';
import { DeletePetModal } from './DeletePetModal';

interface AdminTabProps {
  pets: Pet[];
  onOpenDetails: (pet: Pet) => void;
  onDeletePet: (petId: string) => void;
}

export const AdminTab: React.FC<AdminTabProps> = ({
  pets,
  onOpenDetails,
  onDeletePet,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState<'ALL' | 'PERDI' | 'ACHEI'>('ALL');
  const [petToDelete, setPetToDelete] = useState<Pet | null>(null);

  const totalCases = pets.length;
  const lostCases = pets.filter((p) => p.category === 'PERDI').length;
  const foundCases = pets.filter((p) => p.category === 'ACHEI').length;
  const resolvedCases = pets.filter((p) => p.status === 'Reencontrado').length;

  const speciesCounts = {
    Cão: pets.filter((p) => p.species === 'Cão').length,
    Gato: pets.filter((p) => p.species === 'Gato').length,
    Ave: pets.filter((p) => p.species === 'Ave').length,
    Outros: pets.filter((p) => p.species === 'Outros').length,
  };

  const filteredPets = useMemo(() => {
    return pets.filter((pet) => {
      if (filterCategory !== 'ALL' && pet.category !== filterCategory) return false;
      if (searchTerm.trim()) {
        const q = searchTerm.toLowerCase();
        const matchName = pet.name.toLowerCase().includes(q);
        const matchId = pet.id.toLowerCase().includes(q);
        const matchSpecies = pet.species.toLowerCase().includes(q);
        const matchReporter = pet.reporterName.toLowerCase().includes(q) || pet.reporterEmail.toLowerCase().includes(q);
        const matchAddress = pet.address.toLowerCase().includes(q);
        if (!matchName && !matchId && !matchSpecies && !matchReporter && !matchAddress) {
          return false;
        }
      }
      return true;
    });
  }, [pets, filterCategory, searchTerm]);

  return (
    <div className="space-y-6">
      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-[#BFE8DD] p-5 rounded-3xl shadow-xs">
          <p className="text-xs text-[#5E7180] font-medium">Total de Ocorrências</p>
          <h3 className="text-2xl font-extrabold text-slate-900 mt-1">{totalCases}</h3>
          <p className="text-[11px] text-slate-400 mt-1">Registros na base</p>
        </div>

        <div className="bg-white border border-[#BFE8DD] p-5 rounded-3xl shadow-xs">
          <p className="text-xs text-[#5E7180] font-medium">Pets Perdidos</p>
          <h3 className="text-2xl font-extrabold text-[#FF6B55] mt-1">{lostCases}</h3>
          <p className="text-[11px] text-[#FF6B55]/70 mt-1">Buscas ativas</p>
        </div>

        <div className="bg-white border border-[#BFE8DD] p-5 rounded-3xl shadow-xs">
          <p className="text-xs text-[#5E7180] font-medium">Pets Encontrados</p>
          <h3 className="text-2xl font-extrabold text-[#176B78] mt-1">{foundCases}</h3>
          <p className="text-[11px] text-[#176B78]/70 mt-1">Aguardando tutores</p>
        </div>

        <div className="bg-white border border-[#BFE8DD] p-5 rounded-3xl shadow-xs">
          <p className="text-xs text-[#5E7180] font-medium">Casos Resolvidos</p>
          <h3 className="text-2xl font-extrabold text-[#35A66F] mt-1">{resolvedCases}</h3>
          <p className="text-[11px] text-[#35A66F]/80 mt-1">Reencontrados com sucesso</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Table of cases */}
        <div className="lg:col-span-2 bg-white border border-[#BFE8DD] rounded-3xl p-6 shadow-xs overflow-hidden flex flex-col">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
            <div>
              <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-[#176B78]" /> Gerenciamento Geral de Ocorrências
              </h3>
              <p className="text-xs text-[#5E7180] mt-0.5">
                Exclua ou modere ocorrências registradas por qualquer usuário.
              </p>
            </div>
            <span className="text-xs bg-[#F0FAF7] text-[#176B78] border border-[#BFE8DD] font-bold px-3 py-1 rounded-xl self-start sm:self-auto">
              Modo Moderador Ativo
            </span>
          </div>

          {/* Search & Filter Controls */}
          <div className="flex flex-col sm:flex-row items-center gap-2.5 mb-4">
            <div className="relative flex-1 w-full">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#176B78]" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar por protocolo, nome do pet, tutor ou endereço..."
                className="w-full pl-8.5 pr-3 py-2 bg-[#F0FAF7] border border-[#176B78]/25 rounded-xl text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-[#176B78] focus:bg-white transition"
              />
            </div>
            <div className="flex items-center gap-1.5 w-full sm:w-auto">
              <button
                type="button"
                onClick={() => setFilterCategory('ALL')}
                className={`px-3 py-2 rounded-xl text-xs font-bold transition cursor-pointer flex-1 sm:flex-initial ${
                  filterCategory === 'ALL'
                    ? 'bg-[#176B78] text-white shadow-xs'
                    : 'bg-[#F0FAF7] text-[#5E7180] hover:text-[#176B78] border border-[#BFE8DD]'
                }`}
              >
                Todos ({pets.length})
              </button>
              <button
                type="button"
                onClick={() => setFilterCategory('PERDI')}
                className={`px-3 py-2 rounded-xl text-xs font-bold transition cursor-pointer flex-1 sm:flex-initial ${
                  filterCategory === 'PERDI'
                    ? 'bg-[#FF6B55] text-white shadow-xs'
                    : 'bg-[#F0FAF7] text-[#5E7180] hover:text-[#FF6B55] border border-[#BFE8DD]'
                }`}
              >
                Perdidos
              </button>
              <button
                type="button"
                onClick={() => setFilterCategory('ACHEI')}
                className={`px-3 py-2 rounded-xl text-xs font-bold transition cursor-pointer flex-1 sm:flex-initial ${
                  filterCategory === 'ACHEI'
                    ? 'bg-[#176B78] text-white shadow-xs'
                    : 'bg-[#F0FAF7] text-[#5E7180] hover:text-[#176B78] border border-[#BFE8DD]'
                }`}
              >
                Achados
              </button>
            </div>
          </div>

          <div className="overflow-x-auto flex-1">
            {filteredPets.length === 0 ? (
              <div className="text-center py-10 bg-[#F0FAF7]/50 rounded-2xl border border-dashed border-[#BFE8DD]">
                <p className="text-xs text-[#5E7180] font-medium">Nenhuma ocorrência encontrada com estes filtros.</p>
              </div>
            ) : (
              <table className="w-full text-left text-xs">
                <thead className="bg-[#F0FAF7] text-slate-700 uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="px-4 py-3 rounded-l-xl">Protocolo</th>
                    <th className="px-4 py-3">Pet</th>
                    <th className="px-4 py-3">Tutor / Contato</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3 rounded-r-xl text-right">Ações do Admin</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredPets.map((pet) => (
                    <tr key={pet.id} className="hover:bg-[#F0FAF7]/60 transition">
                      <td className="px-4 py-3 font-mono text-xs text-[#176B78] font-bold">
                        {pet.id}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2.5">
                          <img
                            src={pet.photo}
                            alt={pet.name}
                            className="w-8 h-8 rounded-lg object-cover border border-[#BFE8DD] shrink-0"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src =
                                'https://placehold.co/100x100/BFE8DD/176B78?text=Pet';
                            }}
                          />
                          <div>
                            <div className="font-bold text-slate-800">{pet.name}</div>
                            <div className="text-[11px] text-[#5E7180]">
                              {pet.species} • {pet.breed || 'SRD'}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-slate-600">
                        <div className="font-medium text-slate-800">{pet.reporterName}</div>
                        <div className="text-[10px] text-[#5E7180]">{pet.contact}</div>
                      </td>
                      <td className="px-4 py-3 text-slate-600">
                        <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-medium border ${
                          pet.status === 'Reencontrado'
                            ? 'bg-[#EBF7F1] text-[#35A66F] border-[#35A66F]/30'
                            : pet.category === 'PERDI'
                            ? 'bg-[#FFF0EE] text-[#FF6B55] border-[#FF6B55]/30'
                            : 'bg-[#F0FAF7] text-[#176B78] border-[#BFE8DD]'
                        }`}>
                          {pet.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => onOpenDetails(pet)}
                            className="bg-[#F0FAF7] hover:bg-[#BFE8DD]/40 text-[#176B78] border border-[#BFE8DD] px-2.5 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition flex items-center gap-1"
                            title="Visualizar detalhes da ocorrência"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            Ver
                          </button>
                          <button
                            type="button"
                            onClick={() => setPetToDelete(pet)}
                            className="bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 px-2.5 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition flex items-center gap-1"
                            title="Excluir ocorrência permanentemente"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            Excluir
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* Species Breakdown */}
        <div className="bg-white border border-[#BFE8DD] rounded-3xl p-6 shadow-xs flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-sm text-slate-900 mb-2 flex items-center gap-2">
              <PieChart className="w-4 h-4 text-[#176B78]" /> Distribuição por Espécie
            </h3>
            <p className="text-xs text-[#5E7180] mb-4">
              Contagem de registros por classe de animal
            </p>
          </div>

          <div className="space-y-3 my-auto">
            {Object.entries(speciesCounts).map(([speciesName, count]) => {
              const percent = totalCases > 0 ? Math.round((count / totalCases) * 100) : 0;
              return (
                <div key={speciesName} className="space-y-1">
                  <div className="flex justify-between text-xs font-medium text-slate-700">
                    <span>{speciesName}</span>
                    <span>
                      {count} ({percent}%)
                    </span>
                  </div>
                  <div className="w-full bg-[#F0FAF7] rounded-full h-2.5 overflow-hidden border border-[#BFE8DD]/50">
                    <div
                      className="bg-[#176B78] h-2.5 rounded-full transition-all duration-500"
                      style={{ width: `${percent}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="pt-4 border-t border-slate-100 text-[11px] text-[#5E7180] mt-4">
            Total de ocorrências catalogadas: <strong>{totalCases}</strong>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal for Admin */}
      <DeletePetModal
        pet={petToDelete}
        isOpen={petToDelete !== null}
        onClose={() => setPetToDelete(null)}
        onConfirmDelete={onDeletePet}
        isAdmin={true}
      />
    </div>
  );
};
