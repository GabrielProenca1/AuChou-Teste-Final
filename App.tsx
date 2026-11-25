/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Pet, UserAccount } from './types';
import { INITIAL_ACCOUNTS, INITIAL_PETS } from './mockData';
import { Header } from './components/Header';
import { MuralMapTab } from './components/MuralMapTab';
import { RegisterOccurrenceTab } from './components/RegisterOccurrenceTab';
import { MessagesTab } from './components/MessagesTab';
import { ProfileTab } from './components/ProfileTab';
import { AdminTab } from './components/AdminTab';
import { PetDetailModal } from './components/PetDetailModal';
import { EditPetModal } from './components/EditPetModal';
import { RegisterOccurrenceModal } from './components/RegisterOccurrenceModal';
import { AuthScreen } from './components/AuthScreen';
import { Toast } from './components/Toast';

export default function App() {
  // Accounts State with LocalStorage
  const [accounts, setAccounts] = useState<UserAccount[]>(() => {
    try {
      const stored = localStorage.getItem('auchou_accounts');
      return stored ? JSON.parse(stored) : INITIAL_ACCOUNTS;
    } catch {
      return INITIAL_ACCOUNTS;
    }
  });

  // Current User with LocalStorage
  const [currentUser, setCurrentUser] = useState<UserAccount>(() => {
    try {
      const stored = localStorage.getItem('auchou_current_user');
      if (stored) {
        return JSON.parse(stored);
      }
    } catch {
      // fallback
    }
    return {
      name: 'Visitante',
      email: '',
      phone: '',
      city: '',
      role: 'GUEST',
      isLoggedIn: false,
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
    };
  });

  // Pets State with LocalStorage
  const [pets, setPets] = useState<Pet[]>(() => {
    try {
      const stored = localStorage.getItem('auchou_pets');
      return stored ? JSON.parse(stored) : INITIAL_PETS;
    } catch {
      return INITIAL_PETS;
    }
  });

  // Navigation & Modals
  const [currentTab, setCurrentTab] = useState<string>('list-view');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [selectedDetailPet, setSelectedDetailPet] = useState<Pet | null>(null);
  const [selectedEditPet, setSelectedEditPet] = useState<Pet | null>(null);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [activeChatPetId, setActiveChatPetId] = useState<string | null>(null);

  // Toast
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  // Sync to LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem('auchou_accounts', JSON.stringify(accounts));
    } catch {
      // ignore
    }
  }, [accounts]);

  useEffect(() => {
    try {
      localStorage.setItem('auchou_current_user', JSON.stringify(currentUser));
    } catch {
      // ignore
    }
  }, [currentUser]);

  useEffect(() => {
    try {
      localStorage.setItem('auchou_pets', JSON.stringify(pets));
    } catch {
      // ignore
    }
  }, [pets]);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
  };

  const handlePetRegistered = (newPet: Pet) => {
    setPets((prev) => [newPet, ...prev]);
    showToast(`Ocorrência cadastrada com sucesso! Protocolo: ${newPet.id}`, 'success');
  };

  const handleUpdateProfile = (updated: Partial<UserAccount>) => {
    const updatedUser = {
      ...currentUser,
      ...updated,
    };
    setCurrentUser(updatedUser);

    // Also update in accounts list
    setAccounts((prev) =>
      prev.map((acc) =>
        acc.email.toLowerCase() === currentUser.email.toLowerCase()
          ? { ...acc, ...updated }
          : acc
      )
    );
    showToast('Foto e dados do perfil atualizados com sucesso!', 'success');
  };

  const handleSaveEditedPet = (updatedPet: Pet) => {
    setPets((prev) =>
      prev.map((p) => (p.id === updatedPet.id ? updatedPet : p))
    );
    showToast(`Registro do pet ${updatedPet.name} atualizado!`, 'success');
  };

  const handleDeletePet = (petId: string) => {
    const targetPet = pets.find((p) => p.id === petId);
    setPets((prev) => prev.filter((p) => p.id !== petId));
    if (selectedDetailPet?.id === petId) {
      setSelectedDetailPet(null);
    }
    showToast(
      targetPet
        ? `Ocorrência ${targetPet.id} (${targetPet.name}) excluída com sucesso pelo Administrador.`
        : 'Registro excluído com sucesso.',
      'success'
    );
  };

  const handleSendMessage = (petId: string, text: string) => {
    const now = new Date();
    const timeStr =
      now.toLocaleDateString('pt-BR') +
      ' ' +
      now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });

    const targetPet = pets.find((p) => p.id === petId);
    const isOwner = targetPet?.reporterEmail.toLowerCase() === currentUser.email.toLowerCase();

    const newMsg = {
      id: `msg-${Date.now()}-${Math.random()}`,
      sender: currentUser.name,
      senderEmail: currentUser.email,
      recipientEmail: isOwner ? '' : targetPet?.reporterEmail,
      recipientName: isOwner ? '' : targetPet?.reporterName,
      text,
      time: timeStr,
      isCurrentUser: true,
    };

    setPets((prev) =>
      prev.map((p) => {
        if (p.id === petId) {
          return {
            ...p,
            messages: [...(p.messages || []), newMsg],
          };
        }
        return p;
      })
    );
  };

  const handleOpenChat = (petId: string) => {
    setActiveChatPetId(petId);
    setCurrentTab('messages-view');
  };

  const handleLocateUser = () => {
    if (!navigator.geolocation) {
      showToast('Geolocalização não é suportada pelo seu navegador.', 'error');
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (position) => {
        showToast(
          `Localização obtida: Lat ${position.coords.latitude.toFixed(4)}, Lng ${position.coords.longitude.toFixed(4)}`,
          'success'
        );
      },
      () => {
        showToast('Não foi possível obter sua localização GPS.', 'error');
      }
    );
  };

  const handleLogout = () => {
    setCurrentUser({
      name: 'Visitante',
      email: '',
      phone: '',
      city: '',
      role: 'GUEST',
      isLoggedIn: false,
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
    });
    showToast('Você saiu da sua conta.', 'success');
  };

  // Require login before accessing the system
  if (!currentUser.isLoggedIn) {
    return (
      <div className="min-h-screen flex flex-col bg-[#F7F8F4] text-slate-800 selection:bg-[#176B78] selection:text-white">
        <Toast
          message={toast?.message ?? null}
          type={toast?.type}
          onClose={() => setToast(null)}
        />
        <AuthScreen
          accounts={accounts}
          onLoginSuccess={(user) => {
            setCurrentUser(user);
            showToast(`Bem-vindo(a), ${user.name}!`, 'success');
          }}
          onRegisterAccount={(newAcc) => {
            setAccounts((prev) => [...prev, newAcc]);
          }}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#F7F8F4] text-slate-800 selection:bg-[#176B78] selection:text-white">
      {/* Toast notifications */}
      <Toast
        message={toast?.message ?? null}
        type={toast?.type}
        onClose={() => setToast(null)}
      />

      {/* Main Header / Navbar */}
      <Header
        currentTab={currentTab}
        onSelectTab={(tabId) => {
          if (tabId === 'admin-view' && currentUser.role !== 'ADMIN') {
            showToast('Acesso restrito ao Administrador.', 'error');
            return;
          }
          setCurrentTab(tabId);
        }}
        currentUser={currentUser}
        onOpenRegisterModal={() => setIsRegisterModalOpen(true)}
        onLogout={handleLogout}
        onOpenLoginModal={() => {}}
        mobileMenuOpen={mobileMenuOpen}
        setMobileMenuOpen={setMobileMenuOpen}
      />

      {/* Main Body Tabs */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {(currentTab === 'list-view' || currentTab === 'radar-view') && (
          <MuralMapTab
            pets={pets}
            onOpenDetails={(pet) => setSelectedDetailPet(pet)}
            onOpenChat={handleOpenChat}
            onLocateUser={handleLocateUser}
            forcedLayoutMode={currentTab === 'radar-view' ? 'map-focus' : 'split'}
            currentUser={currentUser}
            onDeletePet={handleDeletePet}
          />
        )}

        {currentTab === 'register-occurrence' && (
          <RegisterOccurrenceTab
            currentUser={currentUser}
            onPetRegistered={handlePetRegistered}
            onNavigateToMural={() => setCurrentTab('list-view')}
            onClose={() => setCurrentTab('list-view')}
          />
        )}

        {currentTab === 'messages-view' && (
          <MessagesTab
            pets={pets}
            activeChatPetId={activeChatPetId}
            onSelectChatPetId={(id) => setActiveChatPetId(id)}
            currentUser={currentUser}
            onSendMessage={handleSendMessage}
            onNavigateToMural={() => setCurrentTab('list-view')}
            onNavigateToRegister={() => setCurrentTab('register-occurrence')}
          />
        )}

        {currentTab === 'profile-view' && (
          <ProfileTab
            currentUser={currentUser}
            pets={pets}
            onUpdateProfile={handleUpdateProfile}
            onEditPet={(pet) => setSelectedEditPet(pet)}
            onDeletePet={handleDeletePet}
            onNavigateToRegister={() => setCurrentTab('register-occurrence')}
          />
        )}

        {currentTab === 'admin-view' && currentUser.role === 'ADMIN' && (
          <AdminTab
            pets={pets}
            onOpenDetails={(pet) => setSelectedDetailPet(pet)}
            onDeletePet={handleDeletePet}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-[#BFE8DD] bg-white py-6 text-center text-xs text-[#5E7180] mt-12">
        <p className="font-semibold text-slate-800">
          AuChou: CadêMeuPet? • Rede Colaborativa de Busca e Reencontro de Animais
        </p>
        <p className="text-[11px] text-[#5E7180] mt-1">
          Suporte completo a mapa interativo, mensagens e upload de fotos do dispositivo para perfil e ocorrências.
        </p>
      </footer>

      {/* Modals */}
      <PetDetailModal
        pet={selectedDetailPet}
        onClose={() => setSelectedDetailPet(null)}
        onOpenChat={handleOpenChat}
        isAdmin={currentUser.role === 'ADMIN'}
        onDeletePet={handleDeletePet}
      />

      <EditPetModal
        pet={selectedEditPet}
        onClose={() => setSelectedEditPet(null)}
        onSave={handleSaveEditedPet}
      />

      <RegisterOccurrenceModal
        isOpen={isRegisterModalOpen}
        onClose={() => setIsRegisterModalOpen(false)}
        currentUser={currentUser}
        onPetRegistered={handlePetRegistered}
      />
    </div>
  );
}
