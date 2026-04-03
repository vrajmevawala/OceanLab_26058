'use client';
import React from 'react';
import { Plus, X } from 'lucide-react';

interface Tab {
  id: string;
  name: string;
  language: string;
  modified?: boolean;
}

interface EditorTabsProps {
  tabs: Tab[];
  activeId: string;
  onSelect: (id: string) => void;
  onClose?: (id: string) => void;
  onAdd?: () => void;
  onRename?: (id: string, newName: string) => void;
}

const LANG_COLORS: Record<string, string> = {
  TypeScript: '#79c0ff',
  JavaScript: '#e3b341',
  Python:     '#3fb950',
  Go:         '#79c0ff',
  Rust:       '#f0883e',
};

export function EditorTabs({ tabs, activeId, onSelect, onClose, onAdd, onRename }: EditorTabsProps) {
  const [editingId, setEditingId] = React.useState<string | null>(null);
  const [tempName, setTempName] = React.useState('');

  const startRename = (id: string, name: string) => {
    setEditingId(id);
    setTempName(name);
  };

  const submitRename = (id: string) => {
    if (onRename && tempName.trim()) {
      onRename(id, tempName.trim());
    }
    setEditingId(null);
  };

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      background: 'var(--surface)',
      borderBottom: '1px solid var(--border)',
      overflow: 'auto',
      flexShrink: 0,
      height: 35,
    }}>
      {tabs.map(tab => {
        const isActive = tab.id === activeId;
        const isEditing = editingId === tab.id;
        const langColor = LANG_COLORS[tab.language] || 'var(--text-mid)';
        return (
          <div
            key={tab.id}
            onClick={() => !isEditing && onSelect(tab.id)}
            onDoubleClick={() => startRename(tab.id, tab.name)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              padding: '0 12px',
              height: '100%',
              cursor: isEditing ? 'default' : 'pointer',
              background: isActive ? 'var(--bg)' : 'transparent',
              borderRight: '1px solid var(--border)',
              color: isActive ? 'var(--text)' : 'var(--text-mid)',
              fontSize: 12,
              fontFamily: 'var(--font-mono)',
              whiteSpace: 'nowrap',
              minWidth: 0,
              userSelect: 'none',
              position: 'relative',
            }}
          >
            {isActive && (
              <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 2, background: 'var(--accent)' }} />
            )}
            <span style={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              background: langColor,
              flexShrink: 0,
            }} />
            
            {isEditing ? (
              <input
                autoFocus
                value={tempName}
                onChange={(e) => setTempName(e.target.value)}
                onBlur={() => submitRename(tab.id)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') submitRename(tab.id);
                  if (e.key === 'Escape') setEditingId(null);
                }}
                style={{
                  background: 'rgba(255,255,255,0.1)',
                  border: '1px solid var(--accent)',
                  color: 'var(--text)',
                  fontSize: 11,
                  fontFamily: 'var(--font-mono)',
                  padding: '2px 4px',
                  borderRadius: 2,
                  width: 100,
                  outline: 'none',
                }}
              />
            ) : (
              <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {tab.name}
              </span>
            )}

            {tab.modified && (
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--accent)', flexShrink: 0 }} />
            )}
            {onClose && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onClose(tab.id);
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: 'none',
                  border: 'none',
                  color: 'inherit',
                  padding: 2,
                  borderRadius: 4,
                  cursor: 'pointer',
                  opacity: 0.6,
                }}
                onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.05)')}
                onMouseLeave={e => (e.currentTarget.style.background = 'none')}
              >
                <X size={12} />
              </button>
            )}
          </div>
        );
      })}
      
      {onAdd && (
        <button
          onClick={onAdd}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100%',
            width: 35,
            background: 'none',
            border: 'none',
            color: 'var(--text-dim)',
            cursor: 'pointer',
            borderRight: '1px solid var(--border)',
          }}
          onMouseEnter={e => (e.currentTarget.style.color = 'var(--text)')}
          onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-dim)')}
        >
          <Plus size={16} />
        </button>
      )}
    </div>
  );
}
