## 🐛 Debug Guide - Como Testar o WebSocket

### ✅ Status dos Servidores (TODOS RODANDO):
- Backend Laravel: ✅ porta 8000
- Reverb WebSocket: ✅ porta 8090  
- Frontend Vite: ✅ porta 5173

### 📝 Passos para Testar:

1. **Abra o navegador em:** http://localhost:5173
   
2. **Abra o Console do Navegador** (F12 ou Cmd+Option+I)

3. **Faça login** e entre em um grupo de chat

4. **Procure pelos seguintes logs no console:**
   ```
   Echo instance created with token
   🔌 Joining private channel: group.1
   ✅ WebSocket connected successfully
   ✅ Successfully subscribed to group.1
   ```

5. **Envie uma mensagem** e observe os logs:
   ```
   📨 MessageSent event received: {id: ..., content: "...", user: {...}}
   ➕ Adding message via WebSocket: {...}
   ✅ Message added successfully
   ```

### 🔍 Se NÃO aparecer "WebSocket connected successfully":

Execute no terminal do backend:
```bash
cd /Users/medrobotsmac/Documents/Chat/backend
tail -f logs/laravel.log
```

Depois envie uma mensagem e veja se aparece algum erro.

### 🔍 Se aparecer "Message already exists":

Isso é NORMAL para sua própria mensagem (porque adicionamos localmente).
O importante é que outros usuários recebam via WebSocket.

### 🧪 Teste com 2 usuários:

1. Abra uma janela normal do navegador
2. Abra uma janela anônima/privada
3. Faça login com usuários diferentes em cada janela
4. Entre no mesmo grupo em ambas
5. Envie uma mensagem de um usuário
6. **A mensagem deve aparecer INSTANTANEAMENTE no outro sem refresh!**

### ⚠️ Se ainda não funcionar:

1. Limpe o cache do navegador (Cmd+Shift+R no Mac)
2. Feche todas as abas e reabra
3. Verifique se o token está correto no localStorage

