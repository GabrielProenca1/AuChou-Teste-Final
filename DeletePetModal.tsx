import React from 'react';
import { Pet } from '../types';
import { Trash2, AlertTriangle, X, ShieldAlert } from 'lucide-react';

interface DeletePetModalProps {
  pet: Pet | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirmDelete: (petId: string) => void;
  isAdmin?: boolean;
}

export const DeletePetModal: React.FC<DeletePetModalProps> = ({
  pet,
  isOpen,
  onClose,
  onConfirmDelete,
  isAdmin = false,
}) => {
  if (!isOpen || !pet) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
      <div className="bg-white border border-red-200 rounded-3xl shadow-2xl max-w-md w-full overflow-hidden animate-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="bg-gradient-to-r from-red-600 to-[#FF6B55] p-5 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center text-white shrink-0">
              <Trash2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base leading-tight">Excluir Ocorrência</h3>
              <p className="text-xs text-white/85">
                {isAdmin ? 'Ação com privilégios de Administrador' : 'Exclusão permanente de registro'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white/80 hover:text-white p-1.5 rounded-xl hover:bg-white/10 transition cursor-pointer"
            aria-label="Fechar modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4">
          {/* Warning banner */}
          <div className="bg-red-50 border border-red-200 rounded-2xl p-3.5 flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
            <div className="text-xs text-red-800 leading-relaxed">
              <strong className="font-bold">Atenção:</strong> Esta ação é irreversível. O registro do animal, pontos no mapa e mensagens associadas serão permanentemente removidos.
            </div>
          </div>

          {/* Pet Summary Card */}
          <div className="flex items-center gap-3.5 p-3.5 bg-[#F0FAF7] border border-[#BFE8DD] rounded-2xl">
            <img
              src={pet.photo}
              alt={pet.name}
              className="w-14 h-14 rounded-xl object-cover border border-[#BFE8DD] shrink-0"
              onError={(e) => {
                (e.target as HTMLImageElement).src =
                  'https://placehold.co/100x100/BFE8DD/176B78?text=Pet';
              }}
            />
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-900 text-sm truncate">{pet.name}</span>
                <span className="text-[10px] bg-white text-[#176B78] border border-[#BFE8DD] font-mono px-2 py-0.5 rounded-md font-semibold">
                  {pet.id}
                </span>
              </div>
              <p className="text-xs text-slate-600 mt-0.5 truncate">
                {pet.species} • {pet.breed || 'SRD'}
              </p>
              <p className="text-[11px] text-[#5E7180] mt-0.5 truncate">
                Tutor: <strong className="text-slate-700">{pet.reporterName}</strong> ({pet.reporterEmail})
              </p>
            </div>
          </div>

          <p className="text-xs text-slate-600 text-center">
            Deseja realmente confirmar a exclusão deste pet da plataforma?
          </p>

          {/* Action buttons */}
          <div className="pt-2 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-bold transition cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={() => {
                onConfirmDelete(pet.id);
                onClose();
              }}
              className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold transition shadow-sm flex items-center gap-2 cursor-pointer"
            >
              <Trash2 className="w-4 h-4" />
              Sim, Excluir Ocorrência
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
