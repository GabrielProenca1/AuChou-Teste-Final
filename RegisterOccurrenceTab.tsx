import React, { useState } from 'react';
import { Pet, PetCategory, PetSpecies, UserAccount } from '../types';
import { ImageFileInput } from './ImageFileInput';
import { LocationPickerMap } from './LocationPickerMap';
import { Send, MapPin, Calendar, Phone, Award, FileText, CheckCircle2, ShieldCheck, Sparkles, X, AlertCircle, HeartHandshake, Search } from 'lucide-react';

interface RegisterOccurrenceTabProps {
  currentUser: UserAccount;
  onPetRegistered: (newPet: Pet) => void;
  onOpenLoginModal?: () => void;
  onNavigateToMural?: () => void;
  onClose?: () => void;
}

export const RegisterOccurrenceTab: React.FC<RegisterOccurrenceTabProps> = ({
  currentUser,
  onPetRegistered,
  onNavigateToMural,
  onClose,
}) => {
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
  const [submittedProtocol, setSubmittedProtocol] = useState<string | null>(null);

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
      breed: breed.trim() || 'Sem raça definida (SRD)',
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
      reporterName: currentUser.isLoggedIn ? currentUser.name : 'Cidadão Solidário',
      reporterEmail: currentUser.isLoggedIn ? currentUser.email : 'anonimo@email.com',
      messages: [],
      createdAt: new Date().toISOString(),
    };

    onPetRegistered(newPet);
    setSubmittedProtocol(protocolId);

    // Reset fields
    setName('');
    setBreed('');
    setColor('');
    setAddress('');
    setLat(-23.5905);
    setLng(-48.0512);
    setPhoto('');
    setReward('');
    setDescription('');
  };

  if (submittedProtocol) {
    return (
      <div className="relative max-w-2xl mx-auto bg-white border border-[#BFE8DD] rounded-3xl p-8 sm:p-10 shadow-sm text-center space-y-6 my-6 animate-in fade-in zoom-in-95 duration-200">
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 text-[#5E7180] hover:text-[#176B78] hover:bg-[#F0FAF7] p-2 rounded-2xl transition cursor-pointer"
            title="Fechar aba e voltar ao Mural"
            aria-label="Fechar aba cadastrar pet"
          >
            <X className="w-5 h-5" />
          </button>
        )}
        <div className="w-16 h-16 bg-[#EBF7F1] border border-[#35A66F]/30 text-[#35A66F] rounded-full flex items-center justify-center mx-auto shadow-inner">
          <CheckCircle2 className="w-9 h-9" />
        </div>
        <div>
          <span className="text-xs bg-[#F0FAF7] border border-[#BFE8DD] text-[#176B78] px-3.5 py-1 rounded-full font-mono font-bold">
            Protocolo: {submittedProtocol}
          </span>
          <h2 className="text-2xl font-bold text-slate-900 mt-3">
            Ocorrência Registrada com Sucesso!
          </h2>
          <p className="text-xs sm:text-sm text-[#5E7180] max-w-md mx-auto mt-2">
            O animal já está visível no Mural e Radar da comunidade. Tutores e voluntários poderão entrar em contato direto pelo chat ou telefone.
          </p>
        </div>

        <div className="p-4 bg-[#F0FAF7] border border-[#BFE8DD] rounded-2xl text-xs text-slate-700 max-w-md mx-auto text-left space-y-1">
          <p className="font-semibold text-slate-900 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-[#176B78]" /> Dica de Segurança:
          </p>
          <p className="text-[#5E7180]">
            Acompanhe as mensagens recebidas na aba <strong>Mensagens</strong> e atualize o status para "Reencontrado" assim que o animal estiver seguro.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <button
            onClick={() => {
              setSubmittedProtocol(null);
              if (onNavigateToMural) onNavigateToMural();
            }}
            className="w-full sm:w-auto bg-[#176B78] hover:bg-[#125560] text-white font-bold px-6 py-3 rounded-xl text-xs transition shadow-sm flex items-center justify-center gap-2 cursor-pointer"
          >
            <MapPin className="w-4 h-4" />
            Ver no Mural e Mapa Interativo
          </button>
          <button
            onClick={() => setSubmittedProtocol(null)}
            className="w-full sm:w-auto bg-[#BFE8DD] hover:bg-[#a9dfd2] text-[#176B78] font-bold px-6 py-3 rounded-xl text-xs transition shadow-xs flex items-center justify-center gap-2 cursor-pointer"
          >
            <Sparkles className="w-4 h-4" />
            Registrar Nova Ocorrência
          </button>
          {onClose && (
            <button
              onClick={onClose}
              className="w-full sm:w-auto text-[#5E7180] hover:text-[#176B78] font-semibold px-4 py-3 rounded-xl text-xs transition hover:bg-slate-100 flex items-center justify-center gap-1 cursor-pointer"
            >
              <X className="w-4 h-4" />
              Fechar
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Banner / Info Header with Close X Button */}
      <div className="relative bg-white border border-[#BFE8DD] rounded-3xl p-6 sm:p-8 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 text-[#5E7180] hover:text-[#176B78] hover:bg-[#F0FAF7] p-2 rounded-2xl transition cursor-pointer flex items-center gap-1.5 border border-transparent hover:border-[#BFE8DD] shadow-xs group z-10"
            title="Fechar aba cadastrar pet e voltar ao Mural"
            aria-label="Fechar aba cadastrar pet"
          >
            <span className="text-[11px] font-bold text-[#5E7180] group-hover:text-[#176B78] hidden sm:inline">Fechar</span>
            <X className="w-5 h-5 text-[#5E7180] group-hover:text-[#176B78]" />
          </button>
        )}
        <div className="pr-8 sm:pr-0">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#F0FAF7] border border-[#BFE8DD] text-[#176B78] text-xs font-bold mb-2">
            <span>Aba Oficial</span> • Registro Rápido
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900">
            Registrar Ocorrência de Pet
          </h1>
          <p className="text-xs sm:text-sm text-[#5E7180] mt-1 font-medium">
            Publique informações do animal perdido ou encontrado para mobilizar a comunidade.
          </p>
        </div>

        <div className="bg-[#F0FAF7] border border-[#BFE8DD] p-3 rounded-2xl text-xs flex items-center gap-3">
          <div className="w-9 h-9 rounded-full overflow-hidden border border-[#BFE8DD] bg-white shrink-0">
            <img
              src={currentUser.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80'}
              alt={currentUser.name}
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <p className="font-semibold text-slate-800">Ocorrência vinculada a: {currentUser.name}</p>
            <p className="text-[#5E7180] text-[11px]">{currentUser.email} • {currentUser.city || 'Tutor'}</p>
          </div>
        </div>
      </div>

      {/* Main Registration Form */}
      <form
        onSubmit={handleSubmit}
        className="bg-white border border-[#BFE8DD] rounded-3xl p-6 sm:p-8 shadow-xs space-y-6"
      >
        {/* Form Title & Top Close X */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div>
            <h2 className="font-bold text-sm text-slate-800 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#176B78]"></span>
              Dados da Ocorrência e Ponto de Avistamento
            </h2>
            <p className="text-[11px] text-[#5E7180] mt-0.5">
              Preencha as informações do animal e confirme a localização no mapa abaixo
            </p>
          </div>
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="text-[#5E7180] hover:text-[#FF6B55] hover:bg-[#FFF0EE] p-2 rounded-xl transition cursor-pointer flex items-center gap-1.5 border border-slate-200 shadow-xs"
              title="Fechar e voltar ao Mural"
              aria-label="Fechar aba cadastrar pet"
            >
              <span className="text-xs font-bold hidden sm:inline">Fechar</span>
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Escolha: Animal Perdido ou Animal Encontrado */}
        <div className="bg-[#F0FAF7]/70 border border-[#BFE8DD] p-5 sm:p-6 rounded-2xl space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <span className="text-xs font-bold text-[#176B78] uppercase tracking-wide flex items-center gap-1.5">
                <AlertCircle className="w-3.5 h-3.5" /> Informar Situação do Animal *
              </span>
              <h3 className="text-sm sm:text-base font-extrabold text-slate-900 mt-0.5">
                O animal que você está registrando é um animal Perdido ou Encontrado?
              </h3>
            </div>
            <span className={`self-start sm:self-auto text-xs px-3 py-1 rounded-full font-bold border ${
              category === 'PERDI'
                ? 'bg-[#FFF0EE] text-[#FF6B55] border-[#FF6B55]/30'
                : 'bg-[#F0FAF7] text-[#176B78] border-[#BFE8DD]'
            }`}>
              {category === 'PERDI' ? '● Registrando Animal Perdido' : '● Registrando Animal Encontrado'}
            </span>
          </div>

          <p className="text-xs text-[#5E7180]">
            Selecione uma das opções abaixo para categorizar o pet e emitir o alerta correto no mural da comunidade:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-1">
            {/* Opção 1: Animal Perdido */}
            <button
              type="button"
              onClick={() => setCategory('PERDI')}
              className={`p-4 sm:p-5 rounded-2xl border-2 transition text-left flex items-start gap-3.5 cursor-pointer relative ${
                category === 'PERDI'
                  ? 'border-[#FF6B55] bg-white shadow-md ring-2 ring-[#FF6B55]/20'
                  : 'border-slate-200 hover:border-[#FF6B55]/50 bg-white/80'
              }`}
            >
              <span className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 mt-0.5 ${
                category === 'PERDI' ? 'border-[#FF6B55]' : 'border-slate-300'
              }`}>
                {category === 'PERDI' && (
                  <span className="w-2.5 h-2.5 rounded-full bg-[#FF6B55]"></span>
                )}
              </span>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-base font-extrabold text-[#FF6B55]">
                    Animal Perdido
                  </span>
                  <span className="text-[10px] bg-[#FFF0EE] text-[#FF6B55] font-bold px-2 py-0.5 rounded-md border border-[#FF6B55]/30">
                    Perdi meu pet
                  </span>
                </div>
                <p className="text-xs text-slate-700 leading-snug font-medium">
                  Meu animal de estimação fugiu ou desapareceu e estou procurando por ele.
                </p>
                <p className="text-[11px] text-[#5E7180]">
                  Gera um <strong>Alerta Vermelho/Coral</strong> no mural e mapa para que voluntários e vizinhos ajudem a procurar.
                </p>
              </div>
            </button>

            {/* Opção 2: Animal Encontrado */}
            <button
              type="button"
              onClick={() => setCategory('ACHEI')}
              className={`p-4 sm:p-5 rounded-2xl border-2 transition text-left flex items-start gap-3.5 cursor-pointer relative ${
                category === 'ACHEI'
                  ? 'border-[#176B78] bg-white shadow-md ring-2 ring-[#176B78]/20'
                  : 'border-slate-200 hover:border-[#176B78]/50 bg-white/80'
              }`}
            >
              <span className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 mt-0.5 ${
                category === 'ACHEI' ? 'border-[#176B78]' : 'border-slate-300'
              }`}>
                {category === 'ACHEI' && (
                  <span className="w-2.5 h-2.5 rounded-full bg-[#176B78]"></span>
                )}
              </span>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-base font-extrabold text-[#176B78]">
                    Animal Encontrado
                  </span>
                  <span className="text-[10px] bg-[#F0FAF7] text-[#176B78] font-bold px-2 py-0.5 rounded-md border border-[#BFE8DD]">
                    Achei um pet
                  </span>
                </div>
                <p className="text-xs text-slate-700 leading-snug font-medium">
                  Encontrei ou resgatei um animal na rua e quero localizar seu tutor ou família.
                </p>
                <p className="text-[11px] text-[#5E7180]">
                  Gera um <strong>Aviso Azul-petróleo</strong> no mural para que o verdadeiro tutor possa identificá-lo e recuperá-lo.
                </p>
              </div>
            </button>
          </div>
        </div>

        {/* Section 1: Basic Pet Data */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Nome do Pet (ou Apelido temporário) *
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex: Thor, Mel, Sem nome..."
              className="w-full bg-[#F0FAF7] border border-[#176B78]/25 text-slate-800 placeholder-slate-400 rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-[#176B78] focus:bg-white transition"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Espécie *
            </label>
            <select
              value={species}
              onChange={(e) => setSpecies(e.target.value as PetSpecies)}
              className="w-full bg-[#F0FAF7] border border-[#176B78]/25 text-slate-800 rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-[#176B78] focus:bg-white transition"
            >
              <option value="Cão">Cão (Cachorro)</option>
              <option value="Gato">Gato (Felino)</option>
              <option value="Ave">Ave (Pássaro)</option>
              <option value="Outros">Outros Animais</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Raça
            </label>
            <input
              type="text"
              value={breed}
              onChange={(e) => setBreed(e.target.value)}
              placeholder="Ex: Golden, Poodle, SRD / Vira-lata..."
              className="w-full bg-[#F0FAF7] border border-[#176B78]/25 text-slate-800 placeholder-slate-400 rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-[#176B78] focus:bg-white transition"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Cor Predominante / Pelagem *
            </label>
            <input
              type="text"
              required
              value={color}
              onChange={(e) => setColor(e.target.value)}
              placeholder="Ex: Caramelo, Preto com patas brancas..."
              className="w-full bg-[#F0FAF7] border border-[#176B78]/25 text-slate-800 placeholder-slate-400 rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-[#176B78] focus:bg-white transition"
            />
          </div>
        </div>

        {/* Section 2: PHOTO FROM DEVICE */}
        <div className="bg-[#F0FAF7]/60 border border-[#BFE8DD] p-5 rounded-2xl space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#176B78]"></span>
              <h3 className="font-bold text-xs sm:text-sm text-slate-900">
                Foto do Pet (A partir de um arquivo do dispositivo)
              </h3>
            </div>
            <span className="text-[10px] bg-white border border-[#BFE8DD] text-[#176B78] px-2.5 py-0.5 rounded-md font-bold">
              Arquivo Local
            </span>
          </div>
          <p className="text-xs text-[#5E7180]">
            Adicione uma foto nítida direto do seu computador, galeria do celular ou câmera para facilitar o reconhecimento.
          </p>

          <ImageFileInput
            label="Escolha ou arraste o arquivo da foto do pet:"
            value={photo}
            onChange={setPhoto}
            aspectRatio="wide"
            placeholderText="Upload do dispositivo (computador / celular)"
            allowSamplePhotos={true}
            helperText="Formatos suportados: JPG, PNG, WEBP. A foto é otimizada automaticamente."
          />
        </div>

        {/* Section 3: Location and Date with Interactive Leaflet Pinpoint */}
        <div className="bg-[#F0FAF7]/60 border border-[#BFE8DD] p-5 rounded-2xl space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#176B78]"></span>
              <h3 className="font-bold text-xs sm:text-sm text-slate-900">
                Localização e Data do Avistamento
              </h3>
            </div>
            <span className="text-[10px] bg-white border border-[#BFE8DD] text-[#176B78] px-2.5 py-0.5 rounded-md font-bold">
              Mapa Interativo Leaflet
            </span>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-[#176B78]" /> Data em que o pet foi visto / perdido *
            </label>
            <input
              type="date"
              required
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full sm:w-1/2 bg-white border border-[#176B78]/25 text-slate-800 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-[#176B78] transition"
            />
          </div>

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

        {/* Section 4: Contact & Reward */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-[#176B78]" /> Telefone / WhatsApp de Contato *
            </label>
            <input
              type="text"
              required
              value={contact}
              onChange={(e) => setContact(e.target.value)}
              placeholder="Ex: (15) 99876-5432"
              className="w-full bg-[#F0FAF7] border border-[#176B78]/25 text-slate-800 placeholder-slate-400 rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-[#176B78] focus:bg-white transition"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
              <Award className="w-3.5 h-3.5 text-[#176B78]" /> Recompensa Oferecida (Opcional)
            </label>
            <input
              type="text"
              value={category === 'PERDI' ? reward : 'Não aplicável para animais encontrados'}
              disabled={category === 'ACHEI'}
              onChange={(e) => setReward(e.target.value)}
              placeholder={category === 'PERDI' ? 'Ex: R$ 200,00 ou Não há' : 'Não aplicável'}
              className={`w-full border text-slate-800 placeholder-slate-400 rounded-xl px-4 py-3 text-xs focus:outline-none transition ${
                category === 'ACHEI'
                  ? 'bg-slate-100 border-slate-200 text-slate-400 cursor-not-allowed'
                  : 'bg-[#F0FAF7] border-[#176B78]/25 focus:border-[#176B78] focus:bg-white'
              }`}
            />
            {category === 'ACHEI' && (
              <p className="text-[10px] text-[#5E7180] mt-1">Recompensas financeiras se aplicam apenas a tutores procurando animais perdidos.</p>
            )}
          </div>
        </div>

        {/* Section 5: Description */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
            <FileText className="w-3.5 h-3.5 text-[#176B78]" /> Descrição Detalhada e Características
          </label>
          <textarea
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder={category === 'PERDI'
              ? 'Ex: Atende pelo nome de Thor, usa coleira azul, dócil, manqueja na pata direita traseira...'
              : 'Ex: Encontrado próximo à praça, aparentemente saudável, assustado, sem coleira, porte médio...'
            }
            className="w-full bg-[#F0FAF7] border border-[#176B78]/25 text-slate-800 placeholder-slate-400 rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-[#176B78] focus:bg-white transition"
          ></textarea>
        </div>

        {/* Submit and Close Actions */}
        <div className="pt-2 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-[11px] text-[#5E7180] text-center sm:text-left">
            Ao publicar, a ocorrência de <strong>{category === 'PERDI' ? 'Animal Perdido' : 'Animal Encontrado'}</strong> será exibida imediatamente no radar e mural.
          </p>
          <div className="flex items-center gap-2.5 w-full sm:w-auto">
            {onClose && (
              <button
                type="button"
                onClick={onClose}
                className="w-full sm:w-auto bg-[#F0FAF7] hover:bg-[#e2f3ee] text-[#176B78] font-bold py-3.5 px-5 rounded-xl transition text-xs border border-[#BFE8DD] flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                title="Fechar aba cadastrar pet e voltar ao Mural"
              >
                <X className="w-4 h-4" />
                Fechar
              </button>
            )}
            <button
              type="submit"
              className={`w-full sm:w-auto text-white font-bold py-3.5 px-8 rounded-xl transition text-xs shadow-md flex items-center justify-center gap-2 cursor-pointer ${
                category === 'PERDI'
                  ? 'bg-[#FF6B55] hover:bg-[#e85b46]'
                  : 'bg-[#176B78] hover:bg-[#125560]'
              }`}
            >
              <Send className="w-4 h-4" />
              {category === 'PERDI'
                ? 'Publicar Alerta de Animal Perdido'
                : 'Publicar Aviso de Animal Encontrado'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};
