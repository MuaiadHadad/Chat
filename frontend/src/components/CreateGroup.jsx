import React, { useState, useEffect } from 'react';
import api from '../services/api';

const CreateGroup = ({ onGroupCreated, onCancel }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [users, setUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const response = await api.get('/users');
      setUsers(response.data);
    } catch (error) {
      console.error('Erro ao carregar usuários:', error);
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await api.post('/groups', {
        name,
        description,
        user_ids: selectedUsers
      });
      onGroupCreated(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Falha ao criar grupo');
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="create-group">
      <h2>Criar Novo Grupo</h2>
      <form onSubmit={handleSubmit}>
        {error && <div className="error-message">{error}</div>}

        <div className="form-group">
          <label>Nome do Grupo</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            placeholder="Digite o nome do grupo"
          />
        </div>

        <div className="form-group">
          <label>Descrição (opcional)</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Digite a descrição do grupo"
            rows="3"
          />
        </div>

        <div className="form-group">
          <label>Adicionar Membros (opcional)</label>
          <input
            type="text"
            placeholder="Buscar usuários..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
          <div className="users-select-list">
            {filteredUsers.length === 0 ? (
              <div className="no-users-found">Nenhum usuário encontrado</div>
            ) : (
              filteredUsers.map(user => (
                <div
                  key={user.id}
                  className={`user-select-item ${selectedUsers.includes(user.id) ? 'selected' : ''}`}
                  onClick={() => toggleUser(user.id)}
                >
                  <div className="user-avatar-small">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="user-info-small">
                    <div className="user-name-small">{user.name}</div>
                    <div className="user-email-small">{user.email}</div>
                  </div>
                  <div className="checkbox-small">
                    {selectedUsers.includes(user.id) && '✓'}
                  </div>
                </div>
              ))
            )}
          </div>
          {selectedUsers.length > 0 && (
            <div className="selected-count">
              {selectedUsers.length} membro(s) selecionado(s)
            </div>
          )}
        </div>

        <div className="button-group">
          <button type="submit" disabled={loading} className="btn-primary">
            {loading ? 'Criando...' : 'Criar Grupo'}
          </button>
          <button type="button" onClick={onCancel} className="btn-secondary">
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateGroup;
