import React from 'react';

const GroupList = ({ groups, selectedGroup, onSelectGroup }) => {
  return (
    <div className="group-list">
      {groups.length === 0 ? (
        <div className="no-groups">No groups yet. Create one to start chatting!</div>
      ) : (
        groups.map((group) => (
          <div
            key={group.id}
            className={`group-item ${selectedGroup?.id === group.id ? 'active' : ''}`}
            onClick={() => onSelectGroup(group)}
          >
            <div className="group-info">
              <h4>{group.name}</h4>
              {group.description && (
                <p className="group-description">{group.description}</p>
              )}
            </div>
            <div className="group-meta">
              <span className="member-count">
                {group.users?.length || 0} members
              </span>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default GroupList;

