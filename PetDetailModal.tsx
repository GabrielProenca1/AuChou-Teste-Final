import React, { useState } from 'react';
import { Pet } from '../types';
import { X, MapPin, Calendar, Info, User, Award, MessageSquare, Phone, Trash2, ShieldAlert } from 'lucide-react';
import { DeletePetModal } from './DeletePetModal';

interface PetDetailModalProps {
  pet: Pet | null;
  onClose: () => void;
  onOpenChat: (petId: string) => void;
  isAdmin?: boolean;
  onDeletePet?: (petId: string) => void;
}

export const PetDetailModal: React.FC<PetDetailModalProps> = ({
  pet,
  onClose,
  onOpenChat,
  isAdmin = false,
  onDeletePet,
}) => {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  if (!pet) return null;

  const isLost = pet.category === 'PERDI';
  const isFound = pet.status === 'Reencontrado';

  const headerBg = isFound
    ? 'bg-gradient-to-r from-[#35A66F] to-[#288457]'
    : isLost
    ? 'bg-gradient-to-r from-[#FF6B55] to-[#f25841]'
    : 'bg-gradient-to-r from-[#176B78] to-[#125560]';

  const handleDeleteConfirmed = (petId: string) => {
    if (onDeletePet) {
      onDeletePet(petId);
      setIsDeleteModalOpen(false);
      onClose();
    }
  };

  return (
    <>
      <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
        <div className="bg-white border border-[#BFE8DD] rounded-3xl shadow-2xl max-w-2xl w-full overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-150">
          {/* Header */}
          <div className={`p-6 text-white flex justify-between items-start ${headerBg}`}>
            <div>
              <div className="flex items-center gap-2">
                <span className="bg-white/20 text-white font-bold text-xs px-3 py-1 rounded-full uppercase tracking-wider inline-flex items-center gap-1.5 shadow-xs">
                  <span className="w-1.5 h-1.5 rounded-full bg-white"></span>
                  {isFound ? 'REENCONTRADO' : isLost ? 'PERDI UM PET' : 'ACHEI UM PET'}
                </span>
                {isAdmin && (
                  <span className="bg-black/25 text-amber-200 border border-white/20 font-bold text-[10px] px-2.5 py-0.5 rounded-full uppercase tracking-wider inline-flex items-center gap-1">
                    <ShieldAlert className="w-3 h-3" /> Modo Admin
                  </span>
                )}
              </div>
              <h2 className="text-2xl font-bold mt-2">{pet.name}</h2>
              <p className="text-xs text-white/90">
                {pet.species} • {pet.breed || 'Sem raça definida'}
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:text-white/80 bg-black/20 p-2 rounded-xl transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="rounded-2xl overflow-hidden h-56 bg-[#F0FAF7] border border-[#BFE8DD] shadow-inner">
                <img
                  src={pet.photo}
                  alt={pet.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      'https://placehold.co/400x300/BFE8DD/176B78?text=Sem+Foto';
                  }}
                />
              </div>

              <div className="space-y-3 text-xs">
                <div className="bg-[#F0FAF7] border border-[#BFE8DD] p-3.5 rounded-2xl space-y-2">
                  <p className="text-slate-700 flex items-start gap-1.5">
                    <MapPin className="w-4 h-4 text-[#176B78] shrink-0 mt-0.5" />
                    <span>{pet.address}</span>
                  </p>
                  <p className="text-slate-700 flex items-center gap-1.5">
                    <Calendar className="w-4 h-4 text-[#176B78]" />
                    <span>Data: <strong className="text-slate-900">{pet.date}</strong></span>
                  </p>
                  <p className="text-slate-700 flex items-center gap-1.5">
                    <Info className="w-4 h-4 text-[#176B78]" />
                    <span>Status: <strong className={isFound ? 'text-[#35A66F]' : isLost ? 'text-[#FF6B55]' : 'text-[#176B78]'}>{pet.status}</strong></span>
                  </p>
                  <p className="text-slate-700 flex items-center gap-1.5">
                    <User className="w-4 h-4 text-[#176B78]" />
                    <span>Tutor / Contato: <strong className="text-slate-900">{pet.reporterName}</strong></span>
                  </p>
                </div>

                {pet.reward && pet.reward !== 'Não informada' && pet.reward !== 'Não há' && (
                  <div className="bg-amber-50 border border-amber-200 p-3.5 rounded-2xl">
                    <p className="text-amber-800 flex items-center gap-1 text-xs font-semibold">
                      <Award className="w-4 h-4 text-amber-600" /> Recompensa Oferecida:
                    </p>
                    <p className="text-sm font-bold text-amber-900 mt-0.5">{pet.reward}</p>
                  </div>
                )}

                <a
                  href={`tel:${pet.contact}`}
                  className="w-full bg-[#BFE8DD] hover:bg-[#a9dfd2] text-[#176B78] font-bold py-2.5 px-3 rounded-xl transition text-xs flex items-center justify-center gap-2 shadow-xs"
                >
                  <Phone className="w-3.5 h-3.5" /> Ligar para o contato: {pet.contact}
                </a>
              </div>
            </div>

            <div>
              <h4 className="font-bold text-xs text-[#5E7180] uppercase tracking-wider mb-2">
                Descrição e Observações
              </h4>
              <p className="text-xs text-slate-700 bg-[#F0FAF7] border border-[#BFE8DD] p-4 rounded-2xl leading-relaxed whitespace-pre-wrap">
                {pet.description || 'Nenhuma informação adicional cadastrada.'}
              </p>
            </div>

            <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
              <span className="font-mono text-xs text-[#5E7180]">
                Protocolo: <strong className="text-slate-900">{pet.id}</strong>
              </span>
              <div className="flex items-center gap-2.5 w-full sm:w-auto">
                {isAdmin && onDeletePet && (
                  <button
                    type="button"
                    onClick={() => setIsDeleteModalOpen(true)}
                    className="bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 px-4 py-3 rounded-xl transition text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer"
                    title="Excluir ocorrência como administrador"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>Excluir (Admin)</span>
                  </button>
                )}
                <button
                  onClick={() => {
                    onOpenChat(pet.id);
                    onClose();
                  }}
                  className="w-full sm:w-auto flex-1 sm:flex-initial bg-[#176B78] hover:bg-[#125560] text-white font-bold px-6 py-3 rounded-xl transition text-xs flex items-center justify-center gap-2 shadow-sm cursor-pointer"
                >
                  <MessageSquare className="w-4 h-4" />
                  Enviar Mensagem ao Tutor
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal for Admin in Details */}
      <DeletePetModal
        pet={pet}
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirmDelete={handleDeleteConfirmed}
        isAdmin={isAdmin}
      />
    </>
  );
};
