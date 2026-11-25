export type PetCategory = 'PERDI' | 'ACHEI';
export type PetSpecies = 'Cão' | 'Gato' | 'Ave' | 'Outros';
export type PetStatus = 'Em Busca' | 'Aguardando Tutor' | 'Reencontrado';

export interface ChatMessage {
  id: string;
  sender: string;
  senderEmail?: string;
  recipientEmail?: string;
  recipientName?: string;
  text: string;
  time: string;
  isCurrentUser?: boolean;
}

export interface Pet {
  id: string;
  category: PetCategory;
  name: string;
  species: PetSpecies;
  breed: string;
  color: string;
  date: string;
  address: string;
  lat: number;
  lng: number;
  photo: string;
  contact: string;
  reward?: string;
  description: string;
  status: PetStatus;
  reporterName: string;
  reporterEmail: string;
  messages: ChatMessage[];
  createdAt?: string;
}

export interface UserAccount {
  name: string;
  email: string;
  password?: string;
  phone: string;
  city: string;
  role: 'ADMIN' | 'TUTOR' | 'GUEST';
  avatar?: string;
  isLoggedIn?: boolean;
}
