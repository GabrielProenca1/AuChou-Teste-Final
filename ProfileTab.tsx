import React, { useState, useEffect } from 'react';
import { UserAccount, Pet } from '../types';
import { ImageFileInput } from './ImageFileInput';
import { User, Phone, MapPin, Mail, Save, Edit3, Trash2, Shield, PawPrint, PlusCircle, CheckCircle } from 'lucide-react';
import { DeletePetModal } from './DeletePetModal';

interface ProfileTabProps {
  currentUser: UserAccount;
  pets: Pet[];
  onUpdateProfile: (updated: Partial<UserAccount>) => void;
  onEditPet: (pet: Pet) => void;
  onDeletePet: (petId: string) => void;
  onNavigateToRegister: () => void;
}

export const ProfileTab: React.FC<ProfileTabProps> = ({
  currentUser,
  pets,
  onUpdateProfile,
  onEditPet,
  onDeletePet,
  onNavigateToRegister,
}) => {
  const [name, setName] = useState(currentUser.name || '');
  const [phone, setPhone] = useState(currentUser.phone || '');
  const [city, setCity] = useState(currentUser.city || '');
  const [avatar, setAvatar] = useState(currentUser.avatar || '');
  const [isSaved, setIsSaved] = useState(false);
  const [petToDelete, setPetToDelete] = useState<Pet | null>(null);

  useEffect(() => {
    setName(currentUser.name || '');
    setPhone(currentUser.phone || '');
    setCity(currentUser.city || '');
    setAvatar(currentUser.avatar || '');
  }, [currentUser]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateProfile({
      name: name.trim(),
      phone: phone.trim(),
      city: city.trim(),
      avatar: avatar.trim()
    });
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3500);
  };

  const myPets = pets.filter(
    (p) =>
      p.reporterEmail === currentUser.email ||
      currentUser.role === 'ADMIN'
  );

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="bg-white border border-[#BFE8DD] rounded-3xl p-6 sm:p-8 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#F0FAF7] border border-[#BFE8DD] text-[#176B78] text-xs font-bold mb-2">
            <User className="w-3.5 h-3.5" /> Meu Perfil
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900">
            Gerenciamento de Conta e Ocorrências
          </h1>
          <p className="text-xs sm:text-sm text-[#5E7180] mt-1">
            Altere sua foto de perfil via arquivo do dispositivo e gerencie seus animais anunciados.
          </p>
        </div>
        <button
          onClick={onNavigateToRegister}
          className="bg-[#176B78] hover:bg-[#125560] text-white text-xs font-bold px-4 py-2.5 rounded-xl transition shadow-xs flex items-center gap-2 cursor-pointer"
        >
          <PlusCircle className="w-4 h-4" />
          Nova Ocorrência
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Profile Card & Photo from Device */}
        <div className="bg-white border border-[#BFE8DD] rounded-3xl p-6 sm:p-7 shadow-xs space-y-6">
          <div className="text-center space-y-3">
            <div className="relative w-28 h-28 mx-auto rounded-full overflow-hidden border-3 border-[#176B78] shadow-md bg-[#F0FAF7]">
              {avatar ? (
                <img
                  src={avatar}
                  alt={name || 'Avatar'}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      'https://placehold.co/150x150/BFE8DD/176B78?text=Avatar';
                  }}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-[#176B78]">
                  <User className="w-12 h-12" />
                </div>
              )}
            </div>
            <div>
              <h2 className="font-bold text-base text-slate-900">{name || 'Usuário'}</h2>
              <span className="text-[11px] bg-[#F0FAF7] border border-[#BFE8DD] text-[#176B78] px-2.5 py-0.5 rounded-full font-medium inline-block mt-1">
                {currentUser.role === 'ADMIN' ? 'Administrador do Sistema' : 'Tutor Cadastrado'}
              </span>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* CORE REQUEST: TROCAR FOTO DO PERFIL A PARTIR DE UM ARQUIVO DO DISPOSITIVO */}
            <div className="bg-[#F0FAF7]/60 border border-[#BFE8DD] p-4 rounded-2xl space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-[#176B78]" /> Trocar Foto do Meu Perfil
                </span>
                <span className="text-[10px] bg-white border border-[#BFE8DD] text-[#176B78] px-2 py-0.5 rounded font-semibold">
                  Arquivo do dispositivo
                </span>
              </div>
              <p className="text-[11px] text-[#5E7180]">
                Selecione uma imagem do seu celular ou computador:
              </p>

              <ImageFileInput
                label="Selecione sua foto do dispositivo:"
                value={avatar}
                onChange={setAvatar}
                aspectRatio="square"
                placeholderText="Upload do dispositivo"
                allowSamplePhotos={true}
                samplePhotos={[
                  'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
                  'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=200&q=80',
                  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80',
                  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80'
                ]}
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Nome Completo
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-[#F0FAF7] border border-[#176B78]/25 text-slate-800 text-xs rounded-xl px-4 py-2.5 focus:outline-none focus:border-[#176B78] focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1">
                <Mail className="w-3.5 h-3.5 text-slate-500" /> E-mail (Identificador da conta)
              </label>
              <input
                type="email"
                disabled
                value={currentUser.email || ''}
                className="w-full bg-slate-100 border border-[#BFE8DD] text-slate-500 text-xs rounded-xl px-4 py-2.5 cursor-not-allowed"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1">
                  <Phone className="w-3 h-3 text-[#176B78]" /> Telefone
                </label>
                <input
                  type="text"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-[#F0FAF7] border border-[#176B78]/25 text-slate-800 text-xs rounded-xl px-4 py-2.5 focus:outline-none focus:border-[#176B78] focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-[#176B78]" /> Cidade
                </label>
                <input
                  type="text"
                  required
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full bg-[#F0FAF7] border border-[#176B78]/25 text-slate-800 text-xs rounded-xl px-4 py-2.5 focus:outline-none focus:border-[#176B78] focus:bg-white"
                />
              </div>
            </div>

            {isSaved && (
              <div className="flex items-center gap-2 text-xs text-emerald-800 bg-emerald-50 border border-emerald-300 p-2.5 rounded-xl">
                <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Perfil e foto atualizados com sucesso!</span>
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-[#176B78] hover:bg-[#125560] text-white font-bold py-3 rounded-xl transition text-xs shadow-sm flex items-center justify-center gap-2 cursor-pointer"
            >
              <Save className="w-4 h-4" />
              Salvar Alterações do Perfil
            </button>
          </form>
        </div>

        {/* Right Column: User's Registered Pets */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white border border-[#BFE8DD] rounded-3xl p-6 sm:p-7 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-100 gap-2">
              <div>
                <h3 className="font-bold text-sm sm:text-base text-slate-900 flex items-center gap-2">
                  <PawPrint className="w-4 h-4 text-[#176B78]" /> Meus Animais Registrados
                </h3>
                <p className="text-xs text-[#5E7180]">
                  Gerencie o status, edite dados ou exclua registros cadastrados por você.
                </p>
              </div>
              <span className="text-xs bg-[#F0FAF7] text-[#176B78] px-3 py-1 rounded-full border border-[#BFE8DD] font-bold self-start sm:self-auto">
                {myPets.length} {myPets.length === 1 ? 'registro' : 'registros'}
              </span>
            </div>

            {myPets.length === 0 ? (
              <div className="p-8 text-center bg-[#F0FAF7] rounded-2xl border border-dashed border-[#BFE8DD] space-y-3">
                <PawPrint className="w-10 h-10 text-[#176B78]/50 mx-auto" />
                <p className="text-xs text-slate-700 font-semibold">
                  Você ainda não registrou nenhum animal na plataforma.
                </p>
                <p className="text-[11px] text-[#5E7180] max-w-sm mx-auto">
                  Caso tenha perdido um animal de estimação ou encontrado um pet na rua, cadastre uma ocorrência agora mesmo.
                </p>
                <button
                  onClick={onNavigateToRegister}
                  className="bg-[#176B78] hover:bg-[#125560] text-white text-xs font-bold px-4 py-2 rounded-xl transition shadow-xs inline-flex items-center gap-1.5 cursor-pointer mt-2"
                >
                  <PlusCircle className="w-3.5 h-3.5" />
                  Cadastrar Primeiro Pet
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {myPets.map((pet) => (
                  <div
                    key={pet.id}
                    className="bg-white border border-[#BFE8DD] rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:shadow-xs transition"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <img
                        src={pet.photo}
                        alt={pet.name}
                        className="w-14 h-14 rounded-xl object-cover border border-[#BFE8DD] shrink-0"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src =
                            'https://placehold.co/100x100/BFE8DD/176B78?text=Pet';
                        }}
                      />
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h4 className="font-bold text-sm text-slate-800 truncate">
                            {pet.name}
                          </h4>
                          <span className="text-[10px] bg-[#F0FAF7] text-[#176B78] px-2 py-0.5 rounded-md border border-[#BFE8DD] font-mono">
                            {pet.id}
                          </span>
                          <span
                            className={`text-[10px] px-2 py-0.5 rounded-md font-semibold ${
                              pet.status === 'Reencontrado'
                                ? 'bg-[#EBF7F1] text-[#35A66F] border border-[#35A66F]/30'
                                : pet.category === 'PERDI'
                                ? 'bg-[#FFF0EE] text-[#FF6B55] border border-[#FF6B55]/30'
                                : 'bg-[#F0FAF7] text-[#176B78] border border-[#BFE8DD]'
                            }`}
                          >
                            {pet.status === 'Reencontrado' ? 'Reencontrado' : pet.category === 'PERDI' ? 'Perdido' : 'Encontrado'}
                          </span>
                        </div>
                        <p className="text-xs text-slate-600 mt-0.5 truncate">
                          {pet.species} • {pet.breed || 'SRD'} • Status:{' '}
                          <strong className="text-slate-800">{pet.status}</strong>
                        </p>
                        <p className="text-[11px] text-[#5E7180] mt-1 truncate flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-[#176B78]" /> {pet.address}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
                      <button
                        onClick={() => onEditPet(pet)}
                        className="bg-[#176B78] hover:bg-[#125560] text-white text-xs px-3 py-2 rounded-xl transition flex items-center gap-1.5 font-medium shadow-xs cursor-pointer"
                        title="Editar Ocorrência"
                      >
                        <Edit3 className="w-3.5 h-3.5" /> Editar
                      </button>
                      <button
                        onClick={() => setPetToDelete(pet)}
                        className="bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 text-xs p-2 rounded-xl transition cursor-pointer"
                        title="Excluir Ocorrência"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <DeletePetModal
        pet={petToDelete}
        isOpen={petToDelete !== null}
        onClose={() => setPetToDelete(null)}
        onConfirmDelete={onDeletePet}
        isAdmin={currentUser.role === 'ADMIN'}
      />
    </div>
  );
};
