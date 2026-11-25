# AuChou: CadêMeuPet? 🐾

Plataforma colaborativa para busca, localização e reencontro de animais de estimação perdidos e encontrados, com mapa interativo em tempo real, mural de ocorrências, chat com tutores e upload de fotos do dispositivo.

---

## 🎨 Identidade Visual
- **Azul-petróleo / Teal (`#176B78`)**: Cor primária da aplicação, cabeçalho e ações principais.
- **Verde-água / Mint (`#BFE8DD`)**: Destaques secundários e fundos suaves.
- **Coral (`#FF6B55`)**: Indicador semântico para animais perdidos e situações de alerta.
- **Verde (`#35A66F`)**: Indicador semântico para animais reencontrados e resoluções positivas.
- **Off-white (`#F7F8F4`)**: Fundo geral leve e acolhedor.

---

## 🚀 Funcionalidades
- **Mural de Ocorrências**: Filtros por Categoria (*Perdido*, *Encontrado*), Espécie, Status e busca por Nome, Raça ou Endereço.
- **Radar Geográfico Interativo (Leaflet / OpenStreetMap)**: Marcadores fixos com fotos e status do animal.
- **Cadastro Completo de Ocorrências**:
  - Seleção explícita entre **Animal Perdido** e **Animal Encontrado** com adaptação dinâmica dos campos.
  - Apontamento preciso no mapa sem desvio durante o zoom.
  - Upload de foto diretamente do dispositivo (computador ou smartphone).
  - Botões rápidos de fechamento (**X**) em todas as telas de registro.
- **Painel Administrativo (`ADMIN`)**:
  - Tabela com filtros e pesquisa em tempo real.
  - Moderação e exclusão de ocorrências com modal de confirmação seguro.
- **Mensagens Diretas**: Chat integrado entre quem avistou o animal e o tutor responsável.
- **Perfil do Tutor**: Gestão de dados pessoais e listagem de ocorrências cadastradas pelo usuário.

---

## 🛠️ Tecnologias Utilizadas
- **React 19** com **TypeScript**
- **Vite**
- **Tailwind CSS v4**
- **Leaflet** & **OpenStreetMap / Nominatim** (Geocodificação e Mapa)
- **Lucide React** (Ícones)

---

## 💻 Como Rodar Localmente

### 1. Clonar o repositório
```bash
git clone https://github.com/SEU_USUARIO/auchou-cade-meu-pet.git
cd auchou-cade-meu-pet
```

### 2. Instalar as dependências
```bash
npm install
```

### 3. Iniciar o servidor de desenvolvimento
```bash
npm run dev
```
Abra no navegador em `http://localhost:3000`.

### 4. Build de Produção
```bash
npm run build
```

---

## 🔑 Credenciais de Teste / Demonstração
- **Administrador**: `admin@auchou.com` / Senha: `Admin123!`
- **Tutor**: `carlos@email.com` / Senha: `Tutor123!`

---

## 📄 Licença
Distribuído sob a licença Apache 2.0.
