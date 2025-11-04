# Sistema de Chat em Tempo Real

Um sistema de chat completo com Laravel (WebSockets/Reverb) no backend e React no frontend, com autenticação, grupos, mensagens em tempo real e status online de usuários.

## 🚀 Funcionalidades

- ✅ Autenticação de usuários (registro/login)
- ✅ Criação e gerenciamento de grupos de chat
- ✅ Mensagens em tempo real via WebSockets (Laravel Reverb)
- ✅ Status online/offline dos usuários
- ✅ Interface responsiva e moderna
- ✅ API RESTful com Laravel Sanctum
- ✅ Presence Channels para rastreamento de usuários online

## 📋 Requisitos

- PHP 8.2+
- Composer
- Node.js 18+
- SQLite (ou MySQL/PostgreSQL)

## 🔧 Instalação

### Backend (Laravel)

1. **Navegue para o diretório do backend:**
```bash
cd backend
```

2. **Instale as dependências:**
```bash
composer install
```

3. **Configure o arquivo .env (já configurado):**
- O banco de dados SQLite já está configurado
- As credenciais do Reverb já estão configuradas

4. **Execute as migrações:**
```bash
php artisan migrate
```

5. **Inicie o servidor Laravel:**
```bash
php artisan serve
```
O backend estará rodando em: http://localhost:8000

6. **Inicie o servidor WebSocket Reverb (em outro terminal):**
```bash
php artisan reverb:start
```
O WebSocket estará rodando em: ws://localhost:8080

### Frontend (React)

1. **Navegue para o diretório do frontend:**
```bash
cd frontend
```

2. **Instale as dependências:**
```bash
npm install
```

3. **Inicie o servidor de desenvolvimento:**
```bash
npm run dev
```
O frontend estará rodando em: http://localhost:5173

## 📖 Como Usar

1. **Acesse o aplicativo:**
   - Abra http://localhost:5173 no navegador

2. **Registre-se:**
   - Crie uma nova conta com nome, email e senha

3. **Crie um Grupo:**
   - Clique em "+ Create Group"
   - Insira o nome e descrição do grupo

4. **Converse em Tempo Real:**
   - Selecione um grupo
   - Digite mensagens no campo de entrada
   - Veja mensagens aparecerem instantaneamente
   - Veja quem está online no grupo

## 🏗️ Estrutura do Projeto

```
Chat/
├── backend/                    # Laravel Backend
│   ├── app/
│   │   ├── Events/            # MessageSent, UserStatusChanged
│   │   ├── Http/Controllers/  # Auth, Group, Message Controllers
│   │   └── Models/            # User, Group, Message, GroupUser
│   ├── database/
│   │   └── migrations/        # Tabelas: users, groups, messages, group_users
│   ├── routes/
│   │   ├── api.php            # Rotas da API REST
│   │   └── channels.php       # Canais de Broadcasting
│   └── config/
│       └── sanctum.php        # Configuração de autenticação
│
└── frontend/                  # React Frontend
    ├── src/
    │   ├── components/        # Login, Register, Chat, ChatRoom, etc.
    │   ├── contexts/          # AuthContext
    │   ├── services/          # api.js, echo.js
    │   └── App.jsx            # Rotas principais
    └── package.json
```

## 🔑 API Endpoints

### Autenticação
- `POST /api/register` - Registrar novo usuário
- `POST /api/login` - Login
- `POST /api/logout` - Logout
- `GET /api/user` - Obter usuário autenticado

### Grupos
- `GET /api/groups` - Listar grupos do usuário
- `POST /api/groups` - Criar novo grupo
- `GET /api/groups/{id}` - Detalhes do grupo
- `PUT /api/groups/{id}` - Atualizar grupo
- `DELETE /api/groups/{id}` - Deletar grupo
- `POST /api/groups/{id}/users` - Adicionar usuário ao grupo
- `DELETE /api/groups/{id}/users` - Remover usuário do grupo
- `POST /api/groups/{id}/status` - Atualizar status online

### Mensagens
- `GET /api/messages?group_id={id}` - Listar mensagens do grupo
- `POST /api/messages` - Enviar mensagem
- `PUT /api/messages/{id}` - Editar mensagem
- `DELETE /api/messages/{id}` - Deletar mensagem

## 🌐 WebSocket Events

### Eventos Broadcast
- `MessageSent` - Quando uma nova mensagem é enviada
- `UserStatusChanged` - Quando usuário fica online/offline

### Presence Channels
- `group.{groupId}` - Canal de presença para cada grupo

## 🛠️ Tecnologias Utilizadas

### Backend
- Laravel 12
- Laravel Reverb (WebSockets)
- Laravel Sanctum (Autenticação API)
- Pusher PHP Server
- SQLite

### Frontend
- React 18
- Vite
- React Router DOM
- Axios
- Laravel Echo
- Pusher JS

## 📝 Testando com Múltiplos Usuários

Para testar o chat em tempo real:

1. Abra duas janelas do navegador (ou use modo anônimo)
2. Registre dois usuários diferentes
3. Crie um grupo com o primeiro usuário
4. Com o segundo usuário, você pode criar outro grupo ou ambos podem se comunicar se estiverem no mesmo grupo
5. Envie mensagens e veja-as aparecer instantaneamente em ambas as janelas
6. Observe o status "online" sendo atualizado

## 🐛 Troubleshooting

### Backend não conecta ao WebSocket
- Certifique-se de que `php artisan reverb:start` está rodando
- Verifique se a porta 8080 está disponível

### CORS Errors
- Verifique se `config/sanctum.php` inclui `localhost:5173`
- Reinicie o servidor Laravel após mudanças

### Mensagens não aparecem em tempo real
- Confirme que o Reverb está rodando
- Verifique o console do navegador para erros de WebSocket
- Certifique-se de que as credenciais do Reverb no frontend (echo.js) correspondem ao .env do backend

## 📄 Licença

Este projeto é de código aberto para fins educacionais.

## 👨‍💻 Desenvolvido com

- Laravel Framework
- React + Vite
- Laravel Reverb WebSockets
- Muito ☕ e 💻
