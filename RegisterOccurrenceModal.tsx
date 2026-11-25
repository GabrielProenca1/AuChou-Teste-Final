import React, { useState } from 'react';
import { Pet, PetCategory, PetSpecies, UserAccount } from '../types';
import { ImageFileInput } from './ImageFileInput';
import { LocationPickerMap } from './LocationPickerMap';
import { X, Send, PawPrint } from 'lucide-react';

interface RegisterOccurrenceModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserAccount;
  onPetRegistered: (newPet: Pet) => void;
}

export const RegisterOccurrenceModal: React.FC<RegisterOccurrenceModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onPetRegistered,
}) => {
  if (!isOpen) return null;

  const [category, setCategory] = useState<PetCategory>('PERDI');
  const [name, setName] = useState('');
  const [species, setSpecies] = useState<PetSpecies>('Cão');
  const [breed, setBreed] = useState('');
  const [color, setColor] = useState('');
  const [date, setDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [address, setAddress] = useState('');
  const [lat, setLat] = useState(-23.5905);
  const [lng, setLng] = useState(-48.0512);
  const [photo, setPhoto] = useState('');
  const [contact, setContact] = useState(currentUser.phone || '');
  const [reward, setReward] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim() || !address.trim() || !color.trim() || !contact.trim()) {
      return;
    }

    const protocolId = `PRT-${Math.floor(10000 + Math.random() * 90000)}`;
    const newPet: Pet = {
      id: protocolId,
      category,
      name: name.trim(),
      species,
      breed: breed.trim() || 'Sem raça definida',
      color: color.trim(),
      date,
      address: address.trim(),
      lat: lat || -23.5905,
      lng: lng || -48.0512,
      photo:
        photo ||
        'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=600&q=80',
      contact: contact.trim(),
      reward: reward.trim() || 'Não informada',
      description: description.trim() || 'Sem observações adicionais.',
      status: category === 'PERDI' ? 'Em Busca' : 'Aguardando Tutor',
      reporterName: currentUser.isLoggedIn ? currentUser.name : 'Cidadão',
      reporterEmail: currentUser.isLoggedIn ? currentUser.email : 'anonimo@email.com',
      messages: [],
      createdAt: new Date().toISOString(),
    };

    onPetRegistered(newPet);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white border border-[#BFE8DD] rounded-3xl shadow-2xl max-w-xl w-full p-6 sm:p-8 space-y-5 my-8 animate-in fade-in zoom-in-95 duration-150">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="font-bold text-lg text-slate-900 flex items-center gap-2">
              <PawPrint className="w-5 h-5 text-[#176B78]" /> Cadastrar Ocorrência de Pet
            </h3>
            <p className="text-xs text-[#5E7180]">
              Preencha os dados e aponte a localização no mapa.
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-[#FF6B55] hover:bg-[#FFF0EE] p-2 rounded-xl transition cursor-pointer flex items-center gap-1 border border-transparent hover:border-red-200"
            title="Fechar cadastro de ocorrência"
            aria-label="Fechar modal"
          >
            <span className="text-xs font-bold hidden sm:inline">Fechar</span>
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="bg-[#F0FAF7]/70 border border-[#BFE8DD] p-3.5 rounded-2xl space-y-2">
            <label className="block text-xs font-bold text-[#176B78] uppercase tracking-wide">
              O animal que você está registrando é um: *
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setCategory('PERDI')}
                className={`p-3 rounded-2xl border-2 transition text-left flex items-center gap-2.5 cursor-pointer ${
                  category === 'PERDI'
                    ? 'border-[#FF6B55] bg-white shadow-xs ring-1 ring-[#FF6B55]/30'
                    : 'border-slate-200 bg-white/70 hover:border-[#FF6B55]/50'
                }`}
              >
                <span className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 ${
                  category === 'PERDI' ? 'border-[#FF6B55]' : 'border-slate-300'
                }`}>
                  {category === 'PERDI' && (
                    <span className="w-2 h-2 rounded-full bg-[#FF6B55]"></span>
                  )}
                </span>
                <div>
                  <span className="text-xs font-bold text-[#FF6B55] block">Animal Perdido</span>
                  <span className="text-[10px] text-[#5E7180] block">Perdi meu pet</span>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setCategory('ACHEI')}
                className={`p-3 rounded-2xl border-2 transition text-left flex items-center gap-2.5 cursor-pointer ${
                  category === 'ACHEI'
                    ? 'border-[#176B78] bg-white shadow-xs ring-1 ring-[#176B78]/30'
                    : 'border-slate-200 bg-white/70 hover:border-[#176B78]/50'
                }`}
              >
                <span className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 ${
                  category === 'ACHEI' ? 'border-[#176B78]' : 'border-slate-300'
                }`}>
                  {category === 'ACHEI' && (
                    <span className="w-2 h-2 rounded-full bg-[#176B78]"></span>
                  )}
                </span>
                <div>
                  <span className="text-xs font-bold text-[#176B78] block">Animal Encontrado</span>
                  <span className="text-[10px] text-[#5E7180] block">Achei um pet</span>
                </div>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Nome do Pet *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ex: Mel, Bob, Sem identificação"
                className="w-full bg-[#F0FAF7] border border-[#176B78]/25 text-slate-800 text-xs rounded-xl px-4 py-2.5 focus:outline-none focus:border-[#176B78] focus:bg-white transition"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Espécie *
              </label>
              <select
                value={species}
                onChange={(e) => setSpecies(e.target.value as PetSpecies)}
                className="w-full bg-[#F0FAF7] border border-[#176B78]/25 text-slate-800 text-xs rounded-xl px-3 py-2.5 focus:outline-none focus:border-[#176B78] focus:bg-white transition"
              >
                <option value="Cão">Cão</option>
                <option value="Gato">Gato</option>
                <option value="Ave">Ave</option>
                <option value="Outros">Outros</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Raça
              </label>
              <input
                type="text"
                value={breed}
                onChange={(e) => setBreed(e.target.value)}
                placeholder="Ex: SRD, Poodle..."
                className="w-full bg-[#F0FAF7] border border-[#176B78]/25 text-slate-800 text-xs rounded-xl px-3 py-2.5 focus:outline-none focus:border-[#176B78] focus:bg-white transition"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Cor Predominante *
              </label>
              <input
                type="text"
                required
                value={color}
                onChange={(e) => setColor(e.target.value)}
                placeholder="Ex: Preto e Branco"
                className="w-full bg-[#F0FAF7] border border-[#176B78]/25 text-slate-800 text-xs rounded-xl px-3 py-2.5 focus:outline-none focus:border-[#176B78] focus:bg-white transition"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Data *
              </label>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full bg-[#F0FAF7] border border-[#176B78]/25 text-slate-800 text-xs rounded-xl px-3 py-2.5 focus:outline-none focus:border-[#176B78] focus:bg-white transition"
              />
            </div>
          </div>

          {/* Interactive Leaflet Location Picker with Address Synchronization */}
          <div className="bg-[#F0FAF7]/60 border border-[#BFE8DD] p-4 rounded-2xl">
            <LocationPickerMap
              address={address}
              onAddressChange={setAddress}
              lat={lat}
              lng={lng}
              onCoordsChange={(newLat, newLng) => {
                setLat(newLat);
                setLng(newLng);
              }}
              category={category}
            />
          </div>

          {/* Core Device File Photo input */}
          <div className="bg-[#F0FAF7]/70 border border-[#BFE8DD] p-4 rounded-2xl">
            <ImageFileInput
              label="Foto do Pet (Arquivo do dispositivo):"
              value={photo}
              onChange={setPhoto}
              aspectRatio="wide"
              placeholderText="Escolher foto do dispositivo (celular / PC)"
              allowSamplePhotos={true}
              helperText="Clique para carregar do seu dispositivo ou arraste um arquivo."
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Telefone de Contato *
              </label>
              <input
                type="text"
                required
                value={contact}
                onChange={(e) => setContact(e.target.value)}
                placeholder="(15) 99999-9999"
                className="w-full bg-[#F0FAF7] border border-[#176B78]/25 text-slate-800 text-xs rounded-xl px-4 py-2.5 focus:outline-none focus:border-[#176B78] focus:bg-white transition"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Recompensa (Opcional)
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

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Descrição Detalhada
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Coleira azul, dócil, responde por..."
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
              <Send className="w-4 h-4" />
              Publicar Ocorrência no Radar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
