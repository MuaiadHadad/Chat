import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { getEcho } from '../services/echo';
import api from '../services/api';
import GroupList from './GroupList';
import ChatRoom from './ChatRoom';
import CreateGroup from './CreateGroup';
import './Chat.css';

const Chat = () => {
  const { user, logout } = useAuth();
  const [groups, setGroups] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [showCreateGroup, setShowCreateGroup] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadGroups();
  }, []);

  const loadGroups = async () => {
    try {
      const response = await api.get('/groups');
      setGroups(response.data);
    } catch (error) {
      console.error('Error loading groups:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleGroupCreated = (newGroup) => {
    setGroups([...groups, newGroup]);
    setShowCreateGroup(false);
    setSelectedGroup(newGroup);
  };

  const handleSelectGroup = (group) => {
    setSelectedGroup(group);
  };

  const handleGroupUpdated = async () => {
    // Recarregar os grupos e atualizar o grupo selecionado
    try {
      const response = await api.get('/groups');
      setGroups(response.data);

      // Atualizar o grupo selecionado com dados novos
      if (selectedGroup) {
        const updatedGroup = response.data.find(g => g.id === selectedGroup.id);
        if (updatedGroup) {
          setSelectedGroup(updatedGroup);
        }
      }
    } catch (error) {
      console.error('Erro ao atualizar grupos:', error);
    }
  };

  return (
    <div className="chat-container">
      <div className="sidebar">
        <div className="sidebar-header">
          <h2>Grupos de Chat</h2>
          <div className="user-info">
            <span className="user-name">{user?.name}</span>
            <button onClick={logout} className="btn-logout">Sair</button>
          </div>
        </div>

        <button
          onClick={() => setShowCreateGroup(true)}
          className="btn-create-group"
        >
          + Criar Grupo
        </button>

        {loading ? (
          <div className="loading">Carregando grupos...</div>
        ) : (
          <GroupList
            groups={groups}
            selectedGroup={selectedGroup}
            onSelectGroup={handleSelectGroup}
          />
        )}
      </div>

      <div className="main-content">
        {showCreateGroup ? (
          <CreateGroup
            onGroupCreated={handleGroupCreated}
            onCancel={() => setShowCreateGroup(false)}
          />
        ) : selectedGroup ? (
          <ChatRoom
            group={selectedGroup}
            onGroupUpdated={handleGroupUpdated}
          />
        ) : (
          <div className="no-group-selected">
            <h3>Bem-vindo ao Chat!</h3>
            <p>Selecione um grupo ou crie um novo para começar a conversar</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Chat;
