import React, { useState } from 'react';
import { UserAccount } from '../types';
import { PawPrint, LogIn, UserPlus, Shield, Lock, Sparkles, CheckCircle2, AlertCircle, Phone, MapPin, Mail, User } from 'lucide-react';
import { ImageFileInput } from './ImageFileInput';

interface AuthScreenProps {
  accounts: UserAccount[];
  onLoginSuccess: (user: UserAccount) => void;
  onRegisterAccount: (newAccount: UserAccount) => void;
}

export const AuthScreen: React.FC<AuthScreenProps> = ({
  accounts,
  onLoginSuccess,
  onRegisterAccount,
}) => {
  const [mode, setMode] = useState<'LOGIN' | 'REGISTER'>('LOGIN');

  // Login inputs
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Register inputs
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regCity, setRegCity] = useState('');
  const [regAvatar, setRegAvatar] = useState('');

  const [error, setError] = useState<string | null>(null);

  // System error messages automatically disappear in 5 seconds
  React.useEffect(() => {
    if (!error) return;
    const timer = setTimeout(() => {
      setError(null);
    }, 5000);
    return () => clearTimeout(timer);
  }, [error]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const account = accounts.find(
      (acc) =>
        acc.email.toLowerCase() === loginEmail.trim().toLowerCase() &&
        acc.password === loginPassword
    );

    if (!account) {
      setError('E-mail ou senha inválidos. Por favor, verifique seus dados ou use as credenciais de teste.');
      return;
    }

    onLoginSuccess({
      ...account,
      isLoggedIn: true,
    });
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const passwordRegex = /^(?=.*[A-Z])(?=.*\d).{8,}$/;
    if (!passwordRegex.test(regPassword)) {
      setError('A senha deve ter no mínimo 8 dígitos, contendo pelo menos 1 letra maiúscula e 1 número.');
      return;
    }

    if (accounts.some((acc) => acc.email.toLowerCase() === regEmail.trim().toLowerCase())) {
      setError('Este e-mail já está cadastrado no sistema.');
      return;
    }

    const newAccount: UserAccount = {
      name: regName.trim(),
      email: regEmail.trim().toLowerCase(),
      password: regPassword,
      phone: regPhone.trim(),
      city: regCity.trim(),
      role: 'TUTOR',
      avatar:
        regAvatar.trim() ||
        'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
      isLoggedIn: true,
    };

    onRegisterAccount(newAccount);
    onLoginSuccess(newAccount);
  };

  const fillAdmin = () => {
    setMode('LOGIN');
    setLoginEmail('admin@auchou.com');
    setLoginPassword('Admin123!');
    setError(null);
  };

  return (
    <div className="min-h-screen bg-[#F7F8F4] flex items-center justify-center p-4 py-8">
      <div className="max-w-xl w-full bg-white border border-[#BFE8DD] rounded-3xl shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Brand Banner */}
        <div className="bg-[#176B78] p-8 text-white text-center relative overflow-hidden">
          <div className="absolute top-2 right-3 opacity-10">
            <PawPrint className="w-36 h-36" />
          </div>
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white text-[#176B78] text-2xl mb-3 shadow-md">
            <PawPrint className="w-8 h-8" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            AuChou: CadêMeuPet?
          </h1>
          <p className="text-xs sm:text-sm text-[#BFE8DD] max-w-sm mx-auto mt-1 font-medium">
            Rede Colaborativa de Busca e Reencontro de Animais Perdidos
          </p>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/20 text-white text-[11px] font-semibold mt-4 border border-white/20">
            <Lock className="w-3 h-3 text-[#BFE8DD]" />
            <span>Acesso Restrito: Identificação necessária para entrar</span>
          </div>
        </div>

        {/* Toggle Mode: Login vs Register */}
        <div className="flex border-b border-[#BFE8DD] bg-[#F7F8F4]">
          <button
            type="button"
            onClick={() => {
              setMode('LOGIN');
              setError(null);
            }}
            className={`flex-1 py-3.5 text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer ${
              mode === 'LOGIN'
                ? 'text-[#176B78] bg-white border-b-2 border-[#176B78]'
                : 'text-[#5E7180] hover:text-slate-900'
            }`}
          >
            <LogIn className="w-4 h-4" /> Entrar na Minha Conta
          </button>
          <button
            type="button"
            onClick={() => {
              setMode('REGISTER');
              setError(null);
            }}
            className={`flex-1 py-3.5 text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer ${
              mode === 'REGISTER'
                ? 'text-[#176B78] bg-white border-b-2 border-[#176B78]'
                : 'text-[#5E7180] hover:text-slate-900'
            }`}
          >
            <UserPlus className="w-4 h-4" /> Criar Conta de Tutor
          </button>
        </div>

        {/* Form Body */}
        <div className="p-6 sm:p-8 space-y-5">
          {error && (
            <div className="bg-[#FFF0EE] border border-[#FF6B55]/30 text-[#FF6B55] text-xs px-4 py-3 rounded-2xl flex items-center gap-2.5">
              <AlertCircle className="w-4 h-4 shrink-0 text-[#FF6B55]" />
              <span>{error}</span>
            </div>
          )}

          {mode === 'LOGIN' ? (
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-[#176B78]" /> E-mail de Acesso
                </label>
                <input
                  type="email"
                  required
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  placeholder="exemplo@email.com"
                  className="w-full bg-[#F0FAF7] border border-[#176B78]/25 text-slate-800 placeholder-slate-400 rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-[#176B78] focus:bg-white transition"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-[#176B78]" /> Senha
                </label>
                <input
                  type="password"
                  required
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-[#F0FAF7] border border-[#176B78]/25 text-slate-800 placeholder-slate-400 rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-[#176B78] focus:bg-white transition"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-[#176B78] hover:bg-[#125560] text-white font-bold py-3.5 rounded-xl transition shadow-sm text-xs flex items-center justify-center gap-2 cursor-pointer mt-2"
              >
                <LogIn className="w-4 h-4" /> Entrar no Sistema
              </button>

              {/* Fast 1-click test credentials */}
              <div className="pt-3 border-t border-slate-100 text-center space-y-2">
                <span className="text-[11px] text-[#5E7180] font-medium">
                  Acesso rápido com contas pré-cadastradas:
                </span>
                <div className="flex flex-wrap justify-center gap-2 pt-1">
                  <button
                    type="button"
                    onClick={fillAdmin}
                    className="bg-[#F0FAF7] hover:bg-[#e2f3ee] text-[#176B78] border border-[#BFE8DD] text-[11px] font-semibold px-3.5 py-1.5 rounded-xl transition cursor-pointer flex items-center gap-1.5 shadow-xs"
                  >
                    <Shield className="w-3.5 h-3.5 text-[#176B78]" />
                    Admin Master (admin@auchou.com)
                  </button>
                </div>
              </div>
            </form>
          ) : (
            <form onSubmit={handleRegister} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-[#176B78]" /> Nome Completo *
                </label>
                <input
                  type="text"
                  required
                  value={regName}
                  onChange={(e) => setRegName(e.target.value)}
                  placeholder="Seu nome completo"
                  className="w-full bg-[#F0FAF7] border border-[#176B78]/25 text-slate-800 placeholder-slate-400 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-[#176B78] focus:bg-white transition"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-[#176B78]" /> E-mail *
                  </label>
                  <input
                    type="email"
                    required
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    placeholder="seu@email.com"
                    className="w-full bg-[#F0FAF7] border border-[#176B78]/25 text-slate-800 placeholder-slate-400 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-[#176B78] focus:bg-white transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
                    <Lock className="w-3.5 h-3.5 text-[#176B78]" /> Senha *
                  </label>
                  <input
                    type="password"
                    required
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    placeholder="Mín. 8 dígitos (1 Maiúscula, 1 número)"
                    className="w-full bg-[#F0FAF7] border border-[#176B78]/25 text-slate-800 placeholder-slate-400 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-[#176B78] focus:bg-white transition"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-[#176B78]" /> Telefone / WhatsApp *
                  </label>
                  <input
                    type="text"
                    required
                    value={regPhone}
                    onChange={(e) => setRegPhone(e.target.value)}
                    placeholder="(15) 99999-9999"
                    className="w-full bg-[#F0FAF7] border border-[#176B78]/25 text-slate-800 placeholder-slate-400 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-[#176B78] focus:bg-white transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-[#176B78]" /> Cidade *
                  </label>
                  <input
                    type="text"
                    required
                    value={regCity}
                    onChange={(e) => setRegCity(e.target.value)}
                    placeholder="Itapetininga - SP"
                    className="w-full bg-[#F0FAF7] border border-[#176B78]/25 text-slate-800 placeholder-slate-400 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-[#176B78] focus:bg-white transition"
                  />
                </div>
              </div>

              {/* Photo upload from device already on signup */}
              <div className="bg-[#F0FAF7]/70 border border-[#BFE8DD] p-3.5 rounded-2xl">
                <ImageFileInput
                  label="Foto de Perfil (Opcional - Arquivo do dispositivo):"
                  value={regAvatar}
                  onChange={setRegAvatar}
                  aspectRatio="square"
                  placeholderText="Escolher foto do seu dispositivo"
                  allowSamplePhotos={true}
                  samplePhotos={[
                    'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
                    'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=200&q=80',
                    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80',
                    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80'
                  ]}
                  helperText="Você pode carregar uma foto do seu celular ou computador agora ou trocar mais tarde no seu perfil."
                />
              </div>

              <button
                type="submit"
                className="w-full bg-[#176B78] hover:bg-[#125560] text-white font-bold py-3.5 rounded-xl transition text-xs shadow-sm flex items-center justify-center gap-2 cursor-pointer mt-2"
              >
                <UserPlus className="w-4 h-4" /> Criar Minha Conta e Entrar
              </button>
            </form>
          )}
        </div>

        {/* Security / Community Footer Info */}
        <div className="bg-[#F7F8F4] border-t border-[#BFE8DD] p-4 text-center text-[11px] text-[#5E7180] flex items-center justify-center gap-1.5">
          <Shield className="w-3.5 h-3.5 text-[#176B78]" />
          <span>Seus dados são protegidos e usados apenas para contatar você em caso de pistas do seu pet.</span>
        </div>
      </div>
    </div>
  );
};
