import { Pet, UserAccount } from './types';

export const INITIAL_ACCOUNTS: UserAccount[] = [
  {
    email: 'admin@auchou.com',
    password: 'Admin123!',
    name: 'Administrador Master',
    phone: '(15) 99999-9999',
    city: 'Itapetininga',
    role: 'ADMIN',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
    isLoggedIn: false
  },
  {
    email: 'carlos@email.com',
    password: 'Tutor123!',
    name: 'Carlos Silva',
    phone: '(15) 99811-2233',
    city: 'Itapetininga',
    role: 'TUTOR',
    avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=200&q=80',
    isLoggedIn: false
  }
];

export const INITIAL_PETS: Pet[] = [
  {
    id: 'PRT-90412',
    category: 'PERDI',
    name: 'Thor',
    species: 'Cão',
    breed: 'Golden Retriever',
    color: 'Dourado',
    date: '2026-03-10',
    address: 'Rua das Flores, Bairro Central',
    lat: -23.5905,
    lng: -48.0512,
    photo: 'https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=600&q=80',
    contact: '(15) 99811-2233',
    reward: 'R$ 300,00',
    description: 'Cão dócil, atende pelo nome de Thor. Usando coleira azul. Perdeu-se próximo à praça central.',
    status: 'Em Busca',
    reporterName: 'Carlos Silva',
    reporterEmail: 'carlos@email.com',
    messages: [
      { id: 'm1', sender: 'Maria Santos', senderEmail: 'maria@email.com', recipientEmail: 'carlos@email.com', text: 'Olá Carlos! Vi um cão muito parecido perto do supermercado ontem às 18h.', time: '10/03/2026 19:30' },
      { id: 'm2', sender: 'Carlos Silva', senderEmail: 'carlos@email.com', recipientEmail: 'maria@email.com', text: 'Oi Maria! Muito obrigado pela ajuda! Teria fotos dele?', time: '10/03/2026 19:42' }
    ]
  },
  {
    id: 'PRT-88123',
    category: 'ACHEI',
    name: 'Gato Siamês',
    species: 'Gato',
    breed: 'Siamês',
    color: 'Creme e Marrom Escuro',
    date: '2026-03-11',
    address: 'Av. Brasil, Vila Jardim',
    lat: -23.5950,
    lng: -48.0460,
    photo: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=600&q=80',
    contact: '(15) 99744-5566',
    reward: 'Não há',
    description: 'Gato muito dócil encontrado assustado no jardim de uma residência. Sem coleira.',
    status: 'Aguardando Tutor',
    reporterName: 'Fernanda Lima',
    reporterEmail: 'admin@auchou.com',
    messages: [
      { id: 'm3', sender: 'João Pedro', senderEmail: 'joao@email.com', recipientEmail: 'admin@auchou.com', text: 'Boa tarde! Ele possui uma mancha preta no queixo?', time: '11/03/2026 14:10' }
    ]
  },
  {
    id: 'PRT-77210',
    category: 'PERDI',
    name: 'Pipoca',
    species: 'Ave',
    breed: 'Calopsita Amarela',
    color: 'Amarela e Cinza',
    date: '2026-03-08',
    address: 'Rua Cel. Fernando, Centro',
    lat: -23.5870,
    lng: -48.0560,
    photo: 'https://images.unsplash.com/photo-1522858547137-f1dcec554f55?auto=format&fit=crop&w=600&q=80',
    contact: '(15) 99633-1122',
    reward: 'R$ 150,00',
    description: 'Calopsita amarela e cinza, responde por Pipoca e assobia a música do Pica-Pau.',
    status: 'Reencontrado',
    reporterName: 'Beatriz Rocha',
    reporterEmail: 'beatriz@email.com',
    messages: []
  },
  {
    id: 'PRT-65421',
    category: 'PERDI',
    name: 'Luna',
    species: 'Cão',
    breed: 'Poodle Toy',
    color: 'Branca',
    date: '2026-03-12',
    address: 'Próximo ao Parque Ecológico, Vila Rio Branco',
    lat: -23.5985,
    lng: -48.0610,
    photo: 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?auto=format&fit=crop&w=600&q=80',
    contact: '(15) 99122-3344',
    reward: 'R$ 200,00',
    description: 'Poodle dócil com lacinho rosa na orelha esquerda. Idosa, precisa de medicação contínua.',
    status: 'Em Busca',
    reporterName: 'Juliana Costa',
    reporterEmail: 'juliana@email.com',
    messages: []
  },
  {
    id: 'PRT-52199',
    category: 'ACHEI',
    name: 'Filhote Caramelo',
    species: 'Cão',
    breed: 'SRD / Vira-lata',
    color: 'Caramelo e Peito Branco',
    date: '2026-03-13',
    address: 'Rua Quintino Bocaiúva, Vila Nova',
    lat: -23.5825,
    lng: -48.0485,
    photo: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=600&q=80',
    contact: '(15) 99888-7711',
    reward: 'Não há',
    description: 'Filhotinho de aproximadamente 3 meses encontrado abrigado da chuva em frente a uma padaria. Muito brincalhão.',
    status: 'Aguardando Tutor',
    reporterName: 'Lucas Ferreira',
    reporterEmail: 'lucas@email.com',
    messages: []
  }
];
