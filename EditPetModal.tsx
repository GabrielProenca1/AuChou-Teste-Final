import React, { useState, useEffect } from 'react';
import { Pet, PetStatus } from '../types';
import { ImageFileInput } from './ImageFileInput';
import { LocationPickerMap } from './LocationPickerMap';
import { X, Save, Edit } from 'lucide-react';

interface EditPetModalProps {
  pet: Pet | null;
  onClose: () => void;
  onSave: (updatedPet: Pet) => void;
}

export const EditPetModal: React.FC<EditPetModalProps> = ({
  pet,
  onClose,
  onSave,
}) => {
  if (!pet) return null;

  const [name, setName] = useState(pet.name);
  const [breed, setBreed] = useState(pet.breed || '');
  const [color, setColor] = useState(pet.color || '');
  const [status, setStatus] = useState<PetStatus>(pet.status);
  const [address, setAddress] = useState(pet.address || '');
  const [lat, setLat] = useState(pet.lat || -23.5905);
  const [lng, setLng] = useState(pet.lng || -48.0512);
  const [reward, setReward] = useState(pet.reward || '');
  const [description, setDescription] = useState(pet.description || '');
  const [photo, setPhoto] = useState(pet.photo || '');

  useEffect(() => {
    if (pet) {
      setName(pet.name);
      setBreed(pet.breed || '');
      setColor(pet.color || '');
      setStatus(pet.status);
      setAddress(pet.address || '');
      setLat(pet.lat || -23.5905);
      setLng(pet.lng || -48.0512);
      setReward(pet.reward || '');
      setDescription(pet.description || '');
      setPhoto(pet.photo || '');
    }
  }, [pet]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...pet,
      name: name.trim(),
      breed: breed.trim(),
      color: color.trim(),
      status,
      address: address.trim(),
      lat,
      lng,
      reward: reward.trim(),
      description: description.trim(),
      photo: photo || pet.photo,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white border border-[#BFE8DD] rounded-3xl shadow-2xl max-w-lg w-full p-6 sm:p-8 space-y-6 my-8 animate-in fade-in zoom-in-95 duration-150">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="font-bold text-lg text-slate-900 flex items-center gap-2">
              <Edit className="w-5 h-5 text-[#176B78]" /> Editar Registro de Pet
            </h3>
            <p className="text-xs text-[#5E7180]">
              Protocolo: <span className="font-mono text-slate-800 font-bold">{pet.id}</span>
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-800 p-1.5 rounded-xl hover:bg-slate-100 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Nome do Pet *
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-[#F0FAF7] border border-[#176B78]/25 text-slate-800 text-xs rounded-xl px-4 py-2.5 focus:outline-none focus:border-[#176B78] focus:bg-white transition"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Raça
              </label>
              <input
                type="text"
                value={breed}
                onChange={(e) => setBreed(e.target.value)}
                className="w-full bg-[#F0FAF7] border border-[#176B78]/25 text-slate-800 text-xs rounded-xl px-4 py-2.5 focus:outline-none focus:border-[#176B78] focus:bg-white transition"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Cor *
              </label>
              <input
                type="text"
                required
                value={color}
                onChange={(e) => setColor(e.target.value)}
                className="w-full bg-[#F0FAF7] border border-[#176B78]/25 text-slate-800 text-xs rounded-xl px-4 py-2.5 focus:outline-none focus:border-[#176B78] focus:bg-white transition"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Status do Caso
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as PetStatus)}
                className="w-full bg-[#F0FAF7] border border-[#176B78]/25 text-slate-800 text-xs rounded-xl px-3 py-2.5 focus:outline-none focus:border-[#176B78] focus:bg-white transition"
              >
                <option value="Em Busca">Em Busca</option>
                <option value="Aguardando Tutor">Aguardando Tutor</option>
                <option value="Reencontrado">Reencontrado (Resolvido)</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Recompensa
              </label>
              <input
                type="text"
                value={reward}
                onChange={(e) => setReward(e.target.value)}
                placeholder="Ex: R$ 200,00"
                className="w-full bg-[#F0FAF7] border border-[#176B78]/25 text-slate-800 text-xs rounded-xl px-4 py-2.5 focus:outline-none focus:border-[#176B78] focus:bg-white transition"
              />
            </div>
          </div>

          {/* Device photo upload for pet */}
          <div className="bg-[#F0FAF7]/60 border border-[#BFE8DD] p-3.5 rounded-2xl">
            <ImageFileInput
              label="Trocar Foto do Pet (Arquivo do dispositivo):"
              value={photo}
              onChange={setPhoto}
              aspectRatio="wide"
              placeholderText="Escolher foto do dispositivo"
              helperText="Você pode carregar uma nova imagem a partir do seu aparelho."
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Descrição Detalhada
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-[#F0FAF7] border border-[#176B78]/25 text-slate-800 text-xs rounded-xl px-4 py-2.5 focus:outline-none focus:border-[#176B78] focus:bg-white transition"
            ></textarea>
          </div>

          <div className="flex items-center gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-3.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-bold transition cursor-pointer flex items-center justify-center gap-1.5"
            >
              <X className="w-4 h-4" />
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 bg-[#176B78] hover:bg-[#125560] text-white font-bold py-3.5 rounded-xl transition text-xs shadow-sm flex items-center justify-center gap-2 cursor-pointer"
            >
              <Save className="w-4 h-4" />
              Salvar Alterações do Pet
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
