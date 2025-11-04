#!/bin/bash

# Script para iniciar o sistema de chat

echo "🚀 Iniciando Sistema de Chat em Tempo Real..."
echo ""

# Verificar se estamos no diretório correto
if [ ! -d "backend" ] || [ ! -d "frontend" ]; then
    echo "❌ Erro: Execute este script no diretório raiz do projeto Chat/"
    exit 1
fi

# Função para limpar processos ao sair
cleanup() {
    echo ""
    echo "🛑 Encerrando servidores..."
    kill $LARAVEL_PID $REVERB_PID $VITE_PID 2>/dev/null
    exit
}

trap cleanup SIGINT SIGTERM

# Iniciar Laravel
echo "📦 Iniciando Laravel (Backend)..."
cd backend
php artisan serve > ../logs/laravel.log 2>&1 &
LARAVEL_PID=$!
echo "✅ Laravel rodando em http://localhost:8000 (PID: $LARAVEL_PID)"

# Esperar um pouco para o Laravel iniciar
sleep 2

# Iniciar Reverb WebSocket
echo "🔌 Iniciando Reverb WebSocket..."
php artisan reverb:start > ../logs/reverb.log 2>&1 &
REVERB_PID=$!
echo "✅ Reverb rodando em ws://localhost:8080 (PID: $REVERB_PID)"

cd ..

# Iniciar React Frontend
echo "⚛️  Iniciando React (Frontend)..."
cd frontend
npm run dev  &
VITE_PID=$!
echo "✅ React rodando em http://localhost:5173 (PID: $VITE_PID)"

cd ..

echo ""
echo "✨ Todos os servidores estão rodando!"
echo ""
echo "📱 Acesse o aplicativo em: http://localhost:5173"
echo ""
echo "💡 Pressione Ctrl+C para parar todos os servidores"
echo ""
echo "📋 Logs disponíveis em:"
echo "   - Laravel: logs/laravel.log"
echo "   - Reverb: logs/reverb.log"
echo "   - Vite: logs/vite.log"
echo ""

# Criar diretório de logs se não existir
mkdir -p logs

# Manter o script rodando
wait

