import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { getEcho } from '../services/echo';
import api from '../services/api';
import AddMembers from './AddMembers';

const ChatRoom = ({ group, onGroupUpdated }) => {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [showAddMembers, setShowAddMembers] = useState(false);
  const [showMembers, setShowMembers] = useState(false);
  const messagesEndRef = useRef(null);
  const channelRef = useRef(null);

  useEffect(() => {
    if (group) {
      loadMessages();
      setupWebSocket();
      updateOnlineStatus(true);
    }

    return () => {
      if (channelRef.current) {
        channelRef.current.unsubscribe();
      }
      if (group) {
        updateOnlineStatus(false);
      }
    };
  }, [group?.id]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const loadMessages = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/messages?group_id=${group.id}`);
      setMessages(response.data.data.reverse());
    } catch (error) {
      console.error('Error loading messages:', error);
    } finally {
      setLoading(false);
    }
  };

  const setupWebSocket = () => {
    const echo = getEcho();
    if (!echo) {
      console.error('❌ Echo instance not available');
      return;
    }

    console.log(`🔌 Joining private channel: group.${group.id}`);

    // Limpar canal anterior se existir
    if (channelRef.current) {
      console.log('🧹 Cleaning up previous channel subscription');
      channelRef.current.unsubscribe();
    }

    const channel = echo.private(`group.${group.id}`)
      .listen('MessageSent', (e) => {
        console.log('📨 MessageSent event received:', e);
        // O evento contém os dados diretamente (não dentro de e.message)
        const newMessage = {
          id: e.id,
          content: e.content,
          user: e.user,
          group_id: e.group_id,
          created_at: e.created_at
        };

        console.log('➕ Adding message via WebSocket:', newMessage);

        // Adicionar mensagem apenas se ainda não existir (evitar duplicatas)
        setMessages(prev => {
          const exists = prev.some(msg => msg.id === newMessage.id);
          if (exists) {
            console.log('⚠️ Message already exists, skipping:', newMessage.id);
            return prev;
          }
          console.log('✅ Message added successfully');
          return [...prev, newMessage];
        });
      })
      .listenForWhisper('typing', (e) => {
        console.log('⌨️ User typing:', e);
      })
      .error((error) => {
        console.error('❌ Channel error:', error);
      });

    // Log de subscrição
    channel.subscribed(() => {
      console.log(`✅ Successfully subscribed to group.${group.id}`);
    });

    channelRef.current = channel;

    // Simular usuários online baseado nos membros do grupo
    if (group.users) {
      setOnlineUsers(group.users.filter(u => u.pivot?.is_online));
    }
  };

  const updateOnlineStatus = async (isOnline) => {
    try {
      await api.post(`/groups/${group.id}/status`, { is_online: isOnline });
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    try {
      const response = await api.post('/messages', {
        group_id: group.id,
        content: newMessage,
      });

      // Adicionar a mensagem imediatamente para feedback instantâneo
      setMessages(prev => {
        // Verificar se já existe para evitar duplicatas
        const exists = prev.some(msg => msg.id === response.data.id);
        if (exists) return prev;
        return [...prev, response.data];
      });

      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const handleMembersAdded = () => {
    // Recarregar informações do grupo
    if (onGroupUpdated) {
      onGroupUpdated();
    }
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="chat-room">
      <div className="chat-header">
        <div>
          <h3>{group.name}</h3>
          {group.description && <p className="group-desc">{group.description}</p>}
        </div>
        <div className="header-actions">
          <button
            className="btn-members"
            onClick={() => setShowMembers(!showMembers)}
          >
            👥 {group.users?.length || 0} membros
          </button>
          <button
            className="btn-add-members"
            onClick={() => setShowAddMembers(true)}
          >
            + Adicionar
          </button>
          <div className="online-users">
            <span className="online-indicator">●</span>
            <span>{onlineUsers.length} online</span>
          </div>
        </div>
      </div>

      {showMembers && (
        <div className="members-panel">
          <h4>Membros do Grupo</h4>
          <div className="members-list">
            {group.users?.map(member => (
              <div key={member.id} className="member-item">
                <div className="member-avatar">
                  {member.name.charAt(0).toUpperCase()}
                </div>
                <div className="member-info">
                  <div className="member-name">{member.name}</div>
                  <div className="member-status">
                    {onlineUsers.find(u => u.id === member.id) ? (
                      <span className="status-online">● Online</span>
                    ) : (
                      <span className="status-offline">○ Offline</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="messages-container">
        {loading ? (
          <div className="loading">Carregando mensagens...</div>
        ) : messages.length === 0 ? (
          <div className="no-messages">Nenhuma mensagem ainda. Inicie a conversa!</div>
        ) : (
          messages.map((message) => (
            <div
              key={message.id}
              className={`message ${message.user.id === user.id ? 'own-message' : ''}`}
            >
              <div className="message-header">
                <span className="message-author">{message.user.name}</span>
                <span className="message-time">{formatTime(message.created_at)}</span>
              </div>
              <div className="message-content">{message.content}</div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSendMessage} className="message-input-form">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Digite uma mensagem..."
          className="message-input"
        />
        <button type="submit" disabled={!newMessage.trim()} className="btn-send">
          Enviar
        </button>
      </form>

      {showAddMembers && (
        <AddMembers
          group={group}
          onClose={() => setShowAddMembers(false)}
          onMembersAdded={handleMembersAdded}
        />
      )}
    </div>
  );
};

export default ChatRoom;
