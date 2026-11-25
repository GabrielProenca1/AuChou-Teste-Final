import React from 'react';
import { PawPrint, MapPin, PlusCircle, MessageSquare, UserCheck, ShieldAlert, LogOut, Menu, X, User, Compass } from 'lucide-react';
import { UserAccount } from '../types';

interface HeaderProps {
  currentTab: string;
  onSelectTab: (tabId: string) => void;
  currentUser: UserAccount;
  onOpenRegisterModal: () => void;
  onLogout: () => void;
  onOpenLoginModal?: () => void;
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  onSelectTab,
  currentUser,
  onOpenRegisterModal,
  onLogout,
  onOpenLoginModal,
  mobileMenuOpen,
  setMobileMenuOpen,
}) => {
  return (
    <header className="bg-[#176B78] text-white border-b border-[#125560] sticky top-0 z-40 shadow-sm transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Brand */}
        <div
          onClick={() => onSelectTab('list-view')}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="w-11 h-11 rounded-2xl bg-white text-[#176B78] flex items-center justify-center shadow-md group-hover:scale-105 transition">
            <PawPrint className="w-6 h-6 text-[#176B78]" />
          </div>
          <div>
            <div className="font-bold text-lg text-white tracking-tight flex items-center gap-2">
              <span>AuChou:</span>
              <span className="text-xs bg-[#BFE8DD] text-[#176B78] px-2.5 py-0.5 rounded-full font-mono font-bold shadow-xs">
                CadêMeuPet?
              </span>
            </div>
            <p className="text-[11px] text-[#BFE8DD]/90 font-medium hidden sm:block">
              Rede Colaborativa de Busca e Reencontro
            </p>
          </div>
        </div>

        {/* Navigation Tabs (Desktop) */}
        <nav className="hidden lg:flex items-center gap-1.5 bg-black/15 border border-white/10 p-1.5 rounded-2xl backdrop-blur-xs">
          {/* Mural de Ocorrências */}
          <button
            type="button"
            onClick={() => onSelectTab('list-view')}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition flex items-center gap-2 cursor-pointer ${
              currentTab === 'list-view'
                ? 'bg-white text-[#176B78] font-bold shadow-md'
                : 'text-white/85 hover:text-white hover:bg-white/10'
            }`}
          >
            <MapPin className="w-4 h-4" />
            Mural de Ocorrências
          </button>

          {/* Radar / Mapa */}
          <button
            type="button"
            onClick={() => onSelectTab('radar-view')}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition flex items-center gap-2 cursor-pointer ${
              currentTab === 'radar-view'
                ? 'bg-white text-[#176B78] font-bold shadow-md'
                : 'text-white/85 hover:text-white hover:bg-white/10'
            }`}
          >
            <Compass className="w-4 h-4" />
            Radar / Mapa
          </button>

          {/* Cadastrar Ocorrência */}
          <div className="relative flex items-center">
            <button
              type="button"
              onClick={() => onSelectTab(currentTab === 'register-occurrence' ? 'list-view' : 'register-occurrence')}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition flex items-center gap-2 cursor-pointer ${
                currentTab === 'register-occurrence'
                  ? 'bg-white text-[#176B78] font-bold shadow-md pr-8'
                  : 'text-white/85 hover:text-white hover:bg-white/10'
              }`}
            >
              <PlusCircle className={`w-4 h-4 ${currentTab === 'register-occurrence' ? 'text-[#176B78]' : 'text-[#BFE8DD]'}`} />
              Cadastrar Ocorrência
            </button>
            {currentTab === 'register-occurrence' && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectTab('list-view');
                }}
                className="absolute right-1.5 top-1/2 -translate-y-1/2 text-[#176B78] hover:text-[#FF6B55] hover:bg-slate-100 p-1 rounded-lg transition cursor-pointer"
                title="Fechar aba cadastrar ocorrência e voltar ao Mural"
                aria-label="Fechar aba cadastrar pet"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Mensagens */}
          <button
            type="button"
            onClick={() => onSelectTab('messages-view')}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition flex items-center gap-2 cursor-pointer ${
              currentTab === 'messages-view'
                ? 'bg-white text-[#176B78] font-bold shadow-md'
                : 'text-white/85 hover:text-white hover:bg-white/10'
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            Mensagens
          </button>

          {/* Meu Perfil */}
          <button
            type="button"
            onClick={() => onSelectTab('profile-view')}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition flex items-center gap-2 cursor-pointer ${
              currentTab === 'profile-view'
                ? 'bg-white text-[#176B78] font-bold shadow-md'
                : 'text-white/85 hover:text-white hover:bg-white/10'
            }`}
          >
            <UserCheck className="w-4 h-4" />
            Meu Perfil
          </button>

          {currentUser.role === 'ADMIN' && (
            <button
              type="button"
              onClick={() => onSelectTab('admin-view')}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition flex items-center gap-2 cursor-pointer ${
                currentTab === 'admin-view'
                  ? 'bg-white text-[#176B78] font-bold shadow-md'
                  : 'text-white/85 hover:text-white hover:bg-white/10'
              }`}
            >
              <ShieldAlert className="w-4 h-4 text-amber-300" />
              Painel Admin
            </button>
          )}
        </nav>

        {/* User Info & Actions */}
        <div className="flex items-center gap-3">
          {currentUser.isLoggedIn ? (
            <div
              onClick={() => onSelectTab('profile-view')}
              className="hidden sm:flex items-center gap-2.5 text-right cursor-pointer p-1.5 px-2.5 rounded-xl hover:bg-white/10 transition border border-transparent hover:border-white/20"
              title="Ir para Meu Perfil"
            >
              <div className="relative w-9 h-9 rounded-full overflow-hidden border-2 border-[#BFE8DD] bg-white shrink-0 shadow-xs">
                {currentUser.avatar ? (
                  <img
                    src={currentUser.avatar}
                    alt={currentUser.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-[#176B78]">
                    <User className="w-5 h-5" />
                  </div>
                )}
              </div>
              <div className="text-left">
                <div className="font-bold text-xs text-white leading-tight">
                  {currentUser.name}
                </div>
                <div className="text-[10px] text-[#BFE8DD] font-medium">
                  {currentUser.role === 'ADMIN' ? 'Administrador' : 'Tutor'}
                </div>
              </div>
            </div>
          ) : (
            <button
              onClick={onOpenLoginModal}
              className="text-xs font-semibold text-white hover:text-white/90 bg-white/15 border border-white/25 px-3 py-2 rounded-xl transition cursor-pointer"
            >
              Entrar
            </button>
          )}

          {/* Quick Add Pet Button in Mint / Teal */}
          <button
            onClick={() => {
              if (currentTab === 'register-occurrence') {
                onSelectTab('list-view');
              } else {
                onOpenRegisterModal();
              }
            }}
            className={`font-bold px-3.5 sm:px-4 py-2.5 rounded-xl text-xs transition shadow-sm flex items-center gap-2 cursor-pointer ${
              currentTab === 'register-occurrence'
                ? 'bg-white text-[#176B78] hover:bg-slate-100'
                : 'bg-[#BFE8DD] hover:bg-[#a9dfd2] text-[#176B78]'
            }`}
            title={currentTab === 'register-occurrence' ? 'Fechar aba cadastrar pet e voltar ao Mural' : 'Cadastrar Ocorrência'}
          >
            {currentTab === 'register-occurrence' ? (
              <>
                <X className="w-4 h-4 text-[#176B78]" />
                <span className="hidden sm:inline">Fechar Cadastro</span>
                <span className="sm:hidden">Fechar</span>
              </>
            ) : (
              <>
                <PlusCircle className="w-4 h-4 text-[#176B78]" />
                <span className="hidden sm:inline">Cadastrar Ocorrência</span>
                <span className="sm:hidden">Pet</span>
              </>
            )}
          </button>

          {currentUser.isLoggedIn && (
            <button
              onClick={onLogout}
              className="bg-white/10 hover:bg-white/20 text-white border border-white/20 px-2.5 sm:px-3 py-2.5 rounded-xl text-xs transition cursor-pointer"
              title="Sair da Conta"
            >
              <LogOut className="w-4 h-4" />
            </button>
          )}

          {/* Mobile Menu Hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden text-white p-2 rounded-xl hover:bg-white/15 transition cursor-pointer"
            aria-label="Abrir menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#176B78] border-b border-[#125560] px-4 py-4 space-y-2 shadow-xl animate-in fade-in slide-in-from-top-2 duration-150">
          <button
            onClick={() => {
              onSelectTab('list-view');
              setMobileMenuOpen(false);
            }}
            className={`w-full text-left px-4 py-3 rounded-xl text-xs font-semibold flex items-center gap-3 transition ${
              currentTab === 'list-view'
                ? 'bg-white text-[#176B78] font-bold shadow-sm'
                : 'text-white hover:bg-white/10'
            }`}
          >
            <MapPin className="w-4 h-4" /> Mural de Ocorrências
          </button>

          <button
            onClick={() => {
              onSelectTab('radar-view');
              setMobileMenuOpen(false);
            }}
            className={`w-full text-left px-4 py-3 rounded-xl text-xs font-semibold flex items-center gap-3 transition ${
              currentTab === 'radar-view'
                ? 'bg-white text-[#176B78] font-bold shadow-sm'
                : 'text-white hover:bg-white/10'
            }`}
          >
            <Compass className="w-4 h-4" /> Radar / Mapa
          </button>

          <div className="relative">
            <button
              onClick={() => {
                onSelectTab('register-occurrence');
                setMobileMenuOpen(false);
              }}
              className={`w-full text-left px-4 py-3 rounded-xl text-xs font-semibold flex items-center justify-between transition ${
                currentTab === 'register-occurrence'
                  ? 'bg-white text-[#176B78] font-bold shadow-sm'
                  : 'text-white hover:bg-white/10'
              }`}
            >
              <span className="flex items-center gap-3">
                <PlusCircle className="w-4 h-4" /> Cadastrar Ocorrência
              </span>
              {currentTab === 'register-occurrence' && (
                <span
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectTab('list-view');
                    setMobileMenuOpen(false);
                  }}
                  className="p-1 hover:bg-[#176B78]/15 rounded-lg cursor-pointer text-[#176B78]"
                  title="Fechar aba e voltar ao Mural"
                >
                  <X className="w-4 h-4" />
                </span>
              )}
            </button>
          </div>

          <button
            onClick={() => {
              onSelectTab('messages-view');
              setMobileMenuOpen(false);
            }}
            className={`w-full text-left px-4 py-3 rounded-xl text-xs font-semibold flex items-center gap-3 transition ${
              currentTab === 'messages-view'
                ? 'bg-white text-[#176B78] font-bold shadow-sm'
                : 'text-white hover:bg-white/10'
            }`}
          >
            <MessageSquare className="w-4 h-4" /> Mensagens
          </button>

          <button
            onClick={() => {
              onSelectTab('profile-view');
              setMobileMenuOpen(false);
            }}
            className={`w-full text-left px-4 py-3 rounded-xl text-xs font-semibold flex items-center gap-3 transition ${
              currentTab === 'profile-view'
                ? 'bg-white text-[#176B78] font-bold shadow-sm'
                : 'text-white hover:bg-white/10'
            }`}
          >
            <UserCheck className="w-4 h-4" /> Meu Perfil
          </button>

          {currentUser.role === 'ADMIN' && (
            <button
              onClick={() => {
                onSelectTab('admin-view');
                setMobileMenuOpen(false);
              }}
              className={`w-full text-left px-4 py-3 rounded-xl text-xs font-semibold flex items-center gap-3 transition ${
                currentTab === 'admin-view'
                  ? 'bg-white text-[#176B78] font-bold shadow-sm'
                  : 'text-white hover:bg-white/10'
              }`}
            >
              <ShieldAlert className="w-4 h-4 text-amber-300" /> Painel Admin
            </button>
          )}
        </div>
      )}
    </header>
  );
};
