import React, { useState, useRef, useEffect } from 'react';
import { Pet, UserAccount } from '../types';
import { MessageSquare, Phone, Send, User, PawPrint, Search, ShieldCheck, MapPin, Sparkles } from 'lucide-react';

interface MessagesTabProps {
  pets: Pet[];
  activeChatPetId: string | null;
  onSelectChatPetId: (petId: string) => void;
  currentUser: UserAccount;
  onSendMessage: (petId: string, text: string) => void;
  onNavigateToMural?: () => void;
  onNavigateToRegister?: () => void;
}

export const MessagesTab: React.FC<MessagesTabProps> = ({
  pets,
  activeChatPetId,
  onSelectChatPetId,
  currentUser,
  onSendMessage,
  onNavigateToMural,
  onNavigateToRegister,
}) => {
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Requirement: ONLY display messages initiated by the current user OR sent regarding a pet registered by the current user
  const visiblePets = pets.filter((pet) => {
    const isMyRegisteredPet =
      pet.reporterEmail?.toLowerCase() === currentUser.email?.toLowerCase();

    const hasMyInitiatedMessages = pet.messages?.some(
      (m) =>
        m.senderEmail?.toLowerCase() === currentUser.email?.toLowerCase() ||
        m.sender?.toLowerCase() === currentUser.name?.toLowerCase() ||
        m.isCurrentUser
    );

    const isActivelyInitiating = activeChatPetId && pet.id === activeChatPetId;

    return isMyRegisteredPet || hasMyInitiatedMessages || isActivelyInitiating;
  });

  const activePet =
    visiblePets.find((p) => p.id === activeChatPetId) || visiblePets[0] || null;

  const isMyPet =
    activePet?.reporterEmail?.toLowerCase() === currentUser.email?.toLowerCase();

  // Filter messages for the active conversation
  const displayedMessages = (activePet?.messages || []).filter((msg) => {
    if (isMyPet) {
      // Pet registered by current user: display all reports and messages regarding this pet
      return true;
    }
    // Pet registered by someone else: display messages initiated by current user or replies to them
    const isFromMe =
      msg.senderEmail?.toLowerCase() === currentUser.email?.toLowerCase() ||
      msg.sender?.toLowerCase() === currentUser.name?.toLowerCase() ||
      msg.isCurrentUser;
    const isAddressedToMe =
      msg.recipientEmail?.toLowerCase() === currentUser.email?.toLowerCase() ||
      msg.recipientName?.toLowerCase() === currentUser.name?.toLowerCase();

    return isFromMe || isAddressedToMe;
  });

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [displayedMessages.length]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !activePet) return;
    onSendMessage(activePet.id, inputText.trim());
    setInputText('');
  };

  return (
    <div className="bg-white border border-[#BFE8DD] rounded-3xl shadow-xs overflow-hidden h-[calc(100vh-160px)] min-h-[540px] flex flex-col md:flex-row">
      {/* Threads Sidebar */}
      <div className="w-full md:w-80 lg:w-96 border-r border-[#BFE8DD] flex flex-col bg-[#F7F8F4] shrink-0">
        <div className="p-4 sm:p-5 border-b border-[#BFE8DD] bg-white">
          <div className="flex items-center justify-between">
            <h2 className="font-bold text-sm sm:text-base text-slate-900 flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-[#176B78]" /> Mensagens
            </h2>
            <span className="text-[10px] bg-[#F0FAF7] border border-[#BFE8DD] text-[#176B78] px-2 py-0.5 rounded-full font-bold">
              {visiblePets.length} {visiblePets.length === 1 ? 'conversa' : 'conversas'}
            </span>
          </div>
          <p className="text-[11px] text-[#5E7180] mt-1">
            Seus pets cadastrados e conversas que você iniciou
          </p>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar p-3 space-y-2">
          {visiblePets.length === 0 ? (
            <div className="p-6 text-center space-y-3 my-auto">
              <div className="w-12 h-12 rounded-full bg-[#F0FAF7] border border-[#BFE8DD] text-[#176B78] flex items-center justify-center mx-auto">
                <MessageSquare className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-xs text-slate-800">Nenhuma conversa ativa</h3>
              <p className="text-[11px] text-[#5E7180] leading-relaxed max-w-[220px] mx-auto">
                Aqui aparecerão apenas mensagens de pets que você cadastrou ou conversas que você iniciou no mural.
              </p>
              {onNavigateToMural && (
                <button
                  type="button"
                  onClick={onNavigateToMural}
                  className="bg-[#176B78] hover:bg-[#125560] text-white text-xs font-semibold px-3 py-1.5 rounded-xl transition shadow-xs inline-flex items-center gap-1.5 cursor-pointer mt-1"
                >
                  <Search className="w-3.5 h-3.5" />
                  Ver Mural e Pets
                </button>
              )}
            </div>
          ) : (
            visiblePets.map((pet) => {
              const isSelected = activePet && pet.id === activePet.id;
              const isOwner = pet.reporterEmail?.toLowerCase() === currentUser.email?.toLowerCase();

              const petMsgs = (pet.messages || []).filter((msg) => {
                if (isOwner) return true;
                return (
                  msg.senderEmail?.toLowerCase() === currentUser.email?.toLowerCase() ||
                  msg.sender?.toLowerCase() === currentUser.name?.toLowerCase() ||
                  msg.isCurrentUser ||
                  msg.recipientEmail?.toLowerCase() === currentUser.email?.toLowerCase()
                );
              });

              const lastMsg =
                petMsgs.length > 0
                  ? petMsgs[petMsgs.length - 1].text
                  : isOwner
                  ? 'Aguardando relatos da comunidade sobre seu pet...'
                  : 'Inicie a conversa com o tutor!';

              return (
                <div
                  key={pet.id}
                  onClick={() => onSelectChatPetId(pet.id)}
                  className={`p-3.5 rounded-2xl border transition flex items-center gap-3 cursor-pointer ${
                    isSelected
                      ? 'bg-[#F0FAF7] border-[#176B78] shadow-xs'
                      : 'bg-white border-slate-200 hover:border-[#BFE8DD] hover:bg-[#F0FAF7]/50'
                  }`}
                >
                  <img
                    src={pet.photo}
                    alt={pet.name}
                    className="w-12 h-12 rounded-xl object-cover border border-[#BFE8DD] shrink-0"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        'https://placehold.co/100x100/BFE8DD/176B78?text=Pet';
                    }}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-center gap-1">
                      <h3 className="font-bold text-xs text-slate-900 truncate">
                        {pet.name}
                      </h3>
                      {isOwner ? (
                        <span className="text-[9px] bg-[#EBF7F1] text-[#35A66F] border border-[#35A66F]/30 px-1.5 py-0.5 rounded font-bold shrink-0">
                          Meu Pet
                        </span>
                      ) : (
                        <span className="text-[9px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded font-mono shrink-0">
                          {pet.id}
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-600 truncate mt-0.5">
                      {isOwner ? 'Ocorrência cadastrada por você' : `Tutor: ${pet.reporterName}`}
                    </p>
                    <p className="text-[11px] text-[#5E7180] truncate mt-1 italic">
                      {lastMsg}
                    </p>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Active Chat Conversation Area */}
      <div className="flex-1 flex flex-col h-full bg-white min-w-0">
        {activePet ? (
          <>
            {/* Chat Header */}
            <div className="p-4 sm:p-5 bg-white border-b border-[#BFE8DD] flex items-center justify-between shadow-xs">
              <div className="flex items-center gap-3 min-w-0">
                <img
                  src={activePet.photo}
                  alt={activePet.name}
                  className="w-11 h-11 rounded-xl object-cover border border-[#BFE8DD] shrink-0"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      'https://placehold.co/100x100/BFE8DD/176B78?text=Pet';
                  }}
                />
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-bold text-sm sm:text-base text-slate-900 truncate">
                      {activePet.name}
                    </h3>
                    <span className="text-[10px] bg-[#F0FAF7] border border-[#BFE8DD] text-[#176B78] px-2 py-0.5 rounded-md font-mono">
                      {activePet.id}
                    </span>
                    {isMyPet ? (
                      <span className="text-[10px] bg-[#EBF7F1] text-[#35A66F] border border-[#35A66F]/30 px-2 py-0.5 rounded-md font-semibold">
                        Ocorrência do seu Pet
                      </span>
                    ) : (
                      <span className="text-[10px] bg-[#F0FAF7] text-[#176B78] border border-[#BFE8DD] px-2 py-0.5 rounded-md font-semibold">
                        Conversa iniciada por você
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-[#5E7180] truncate mt-0.5">
                    {isMyPet
                      ? `Você é o tutor(a) responsável • ${activePet.address}`
                      : `Tutor(a): ${activePet.reporterName} • ${activePet.address}`}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <a
                  href={`tel:${activePet.contact}`}
                  className="bg-[#BFE8DD] hover:bg-[#a9dfd2] text-[#176B78] font-bold text-xs px-3.5 py-2 rounded-xl transition flex items-center gap-1.5 shadow-xs whitespace-nowrap cursor-pointer"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Ligar: {activePet.contact}</span>
                  <span className="sm:hidden">Ligar</span>
                </a>
              </div>
            </div>

            {/* Messages Scrollable List */}
            <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-3 custom-scrollbar flex flex-col bg-[#F7F8F4]">
              {displayedMessages.length === 0 ? (
                <div className="text-center text-[#5E7180] text-xs my-auto py-12 space-y-2 max-w-sm mx-auto">
                  <div className="w-12 h-12 bg-white border border-[#BFE8DD] rounded-full flex items-center justify-center mx-auto text-[#176B78] shadow-xs">
                    <MessageSquare className="w-6 h-6" />
                  </div>
                  <p className="font-bold text-slate-800 text-sm">
                    {isMyPet
                      ? `Nenhum relato recebido ainda para ${activePet.name}`
                      : `Inicie a conversa sobre ${activePet.name}`}
                  </p>
                  <p className="text-[11px] text-[#5E7180] leading-relaxed">
                    {isMyPet
                      ? 'Quando voluntários ou cidadãos encontrarem pistas ou informarem sobre seu animal, as mensagens serão exibidas aqui.'
                      : `Envie sua mensagem abaixo diretamente para o tutor(a) ${activePet.reporterName}.`}
                  </p>
                </div>
              ) : (
                displayedMessages.map((msg) => {
                  const isMe =
                    msg.senderEmail?.toLowerCase() === currentUser.email?.toLowerCase() ||
                    msg.sender?.toLowerCase() === currentUser.name?.toLowerCase() ||
                    msg.isCurrentUser;

                  const bubbleClass = isMe
                    ? 'ml-auto bg-[#176B78] text-white rounded-br-xs'
                    : 'mr-auto bg-white text-slate-800 border border-[#BFE8DD] rounded-bl-xs';

                  return (
                    <div
                      key={msg.id}
                      className={`max-w-[85%] sm:max-w-[75%] rounded-2xl px-4 py-3 text-xs shadow-xs ${bubbleClass}`}
                    >
                      <div className="flex justify-between items-center gap-4 mb-1 text-[10px] opacity-80 font-medium">
                        <span>{isMe ? 'Você' : msg.sender}</span>
                        <span>{msg.time}</span>
                      </div>
                      <p className="leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                    </div>
                  );
                })
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Form */}
            <form
              onSubmit={handleSend}
              className="p-3 sm:p-4 bg-white border-t border-[#BFE8DD] flex gap-2 items-center"
            >
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder={
                  isMyPet
                    ? 'Responder na conversa do seu pet...'
                    : `Escreva uma mensagem para o tutor ${activePet.reporterName}...`
                }
                className="flex-1 bg-[#F0FAF7] border border-[#176B78]/25 text-slate-800 placeholder-slate-400 text-xs rounded-xl px-4 py-3 focus:outline-none focus:border-[#176B78] focus:bg-white"
              />
              <button
                type="submit"
                className="bg-[#176B78] hover:bg-[#125560] text-white font-bold px-5 py-3 rounded-xl transition text-xs flex items-center gap-2 shadow-xs cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Enviar</span>
              </button>
            </form>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-[#5E7180] space-y-3">
            <div className="w-14 h-14 rounded-full bg-[#F0FAF7] border border-[#BFE8DD] text-[#176B78] flex items-center justify-center">
              <PawPrint className="w-7 h-7" />
            </div>
            <h3 className="font-bold text-sm text-slate-800">Nenhuma conversa selecionada</h3>
            <p className="text-xs text-[#5E7180] max-w-sm">
              Selecione uma conversa ao lado ou vá até o Mural para iniciar contato com tutores sobre animais perdidos ou encontrados.
            </p>
            {onNavigateToMural && (
              <button
                type="button"
                onClick={onNavigateToMural}
                className="bg-[#176B78] hover:bg-[#125560] text-white text-xs font-bold px-4 py-2.5 rounded-xl transition shadow-xs inline-flex items-center gap-2 cursor-pointer mt-2"
              >
                <MapPin className="w-4 h-4" />
                Explorar Mural de Animais
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
