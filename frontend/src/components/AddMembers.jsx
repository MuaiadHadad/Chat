import React, { useState, useEffect } from 'react';
import api from '../services/api';
import './AddMembers.css';

const AddMembers = ({ group, onClose, onMembersAdded }) => {
  const [users, setUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const response = await api.get('/users');
      // Filtrar usuários que já estão no grupo
      const existingUserIds = group.users.map(u => u.id);
      const availableUsers = response.data.filter(u => !existingUserIds.includes(u.id));
      setUsers(availableUsers);
    } catch (error) {
      console.error('Erro ao carregar usuários:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleUser = (userId) => {
    setSelectedUsers(prev => {
      if (prev.includes(userId)) {
        return prev.filter(id => id !== userId);
      } else {
        return [...prev, userId];
      }
    });
  };

  const handleAddMembers = async () => {
    if (selectedUsers.length === 0) return;

    setAdding(true);
    try {
      // Adicionar cada usuário ao grupo
      for (const userId of selectedUsers) {
        await api.post(`/groups/${group.id}/users`, { user_id: userId });
      }

      onMembersAdded();
      onClose();
    } catch (error) {
      console.error('Erro ao adicionar membros:', error);
      alert('Erro ao adicionar membros. Tente novamente.');
    } finally {
      setAdding(false);
    }
  };

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="add-members-modal">
      <div className="modal-overlay" onClick={onClose}></div>
      <div className="modal-content">
        <div className="modal-header">
          <h3>Adicionar Membros ao Grupo</h3>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        <div className="modal-body">
          <div className="search-box">
            <input
              type="text"
              placeholder="Buscar usuários..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {loading ? (
            <div className="loading">Carregando usuários...</div>
          ) : filteredUsers.length === 0 ? (
            <div className="no-users">
              {searchQuery ? 'Nenhum usuário encontrado' : 'Todos os usuários já estão neste grupo'}
            </div>
          ) : (
            <div className="users-list">
              {filteredUsers.map(user => (
                <div
                  key={user.id}
                  className={`user-item ${selectedUsers.includes(user.id) ? 'selected' : ''}`}
                  onClick={() => toggleUser(user.id)}
                >
                  <div className="user-avatar">{user.name.charAt(0).toUpperCase()}</div>
                  <div className="user-info">
                    <div className="user-name">{user.name}</div>
                    <div className="user-email">{user.email}</div>
                  </div>
                  <div className="checkbox">
                    {selectedUsers.includes(user.id) && '✓'}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="modal-footer">
          <button className="btn-secondary" onClick={onClose}>
            Cancelar
          </button>
          <button
            className="btn-primary"
            onClick={handleAddMembers}
            disabled={selectedUsers.length === 0 || adding}
          >
            {adding ? 'Adicionando...' : `Adicionar (${selectedUsers.length})`}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddMembers;

