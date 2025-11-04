# 🚀 Quick Start Guide

## Opção 1: Usar o script automático (Recomendado)

```bash
./start.sh
```

Este script irá iniciar automaticamente:
- Laravel Backend (porta 8000)
- Reverb WebSocket (porta 8080)
- React Frontend (porta 5173)

Pressione `Ctrl+C` para parar todos os servidores.

---

## Opção 2: Iniciar manualmente (3 terminais)

### Terminal 1 - Laravel Backend
```bash
cd backend
php artisan serve
```

### Terminal 2 - Reverb WebSocket
```bash
cd backend
php artisan reverb:start
```

### Terminal 3 - React Frontend
```bash
cd frontend
npm run dev
```

---

## 🔗 URLs de Acesso

- **Frontend:** http://localhost:5173
- **Backend API:** http://localhost:8000/api
- **WebSocket:** ws://localhost:8080

---

## 👥 Testando o Chat

Para testar a funcionalidade em tempo real:

1. **Abra duas janelas do navegador**
   - Janela 1: http://localhost:5173
   - Janela 2: http://localhost:5173 (modo anônimo)

2. **Registre dois usuários diferentes**
   - Usuário 1: João (joao@example.com)
   - Usuário 2: Maria (maria@example.com)

3. **Crie um grupo com o primeiro usuário**
   - Nome: "Equipe de Desenvolvimento"
   - Descrição: "Chat da equipe"

4. **Envie mensagens e veja a mágica acontecer!** ✨
   - As mensagens aparecem instantaneamente
   - Status "online" é atualizado em tempo real
   - Veja quantos usuários estão online no grupo

---

## ⚠️ Troubleshooting Rápido

### Problema: "Failed to fetch" no frontend
**Solução:** Certifique-se de que o Laravel está rodando na porta 8000

### Problema: Mensagens não aparecem em tempo real
**Solução:** Verifique se o Reverb WebSocket está rodando:
```bash
php artisan reverb:start --debug
```

### Problema: Erro de CORS
**Solução:** Reinicie o servidor Laravel após qualquer mudança no backend

### Problema: "Connection refused" no WebSocket
**Solução:** Verifique se nada está usando a porta 8080:
```bash
lsof -i :8080
```

---

## 📦 Comandos Úteis

### Backend
```bash
# Limpar cache
php artisan cache:clear
php artisan config:clear

# Ver logs em tempo real
tail -f storage/logs/laravel.log

# Criar novo usuário via tinker
php artisan tinker
>>> User::create(['name' => 'Test', 'email' => 'test@test.com', 'password' => bcrypt('password')])
```

### Frontend
```bash
# Limpar cache do npm
rm -rf node_modules package-lock.json
npm install

# Build para produção
npm run build

# Preview do build
npm run preview
```

---

## 🎯 Próximos Passos

Depois de testar o sistema, você pode:

1. ✅ Adicionar funcionalidade de anexar arquivos
2. ✅ Implementar notificações push
3. ✅ Adicionar emojis e reações
4. ✅ Criar salas privadas 1-1
5. ✅ Implementar histórico de mensagens paginado
6. ✅ Adicionar indicador "está digitando..."
7. ✅ Permitir editar/deletar mensagens
8. ✅ Adicionar busca de mensagens

---

## 💡 Dicas de Desenvolvimento

- Use o console do navegador (F12) para ver logs do WebSocket
- Monitore o terminal do Reverb para ver conexões em tempo real
- Use o Laravel Telescope para debugging (opcional)
- Teste com diferentes navegadores para garantir compatibilidade

---

**Divirta-se codificando! 🎉**

