'use client';

import { SavedConfig } from '@/types';

interface ConfigListProps {
  savedConfigs: SavedConfig[];
  onLoad: (config: SavedConfig) => void;
  onDelete: (id: string) => void;
}

export default function ConfigList({ savedConfigs, onLoad, onDelete }: ConfigListProps) {
  if (savedConfigs.length === 0) {
    return (
      <div className="config-list-section">
        <span className="tns-label">Saved Configurations</span>
        <div className="config-list-empty">
          <p>No configurations saved yet.</p>
          <p className="config-list-empty-hint">
            Configure your preview above and click &ldquo;Save Configuration&rdquo;
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="config-list-section">
      <span className="tns-label">
        Saved Configurations ({savedConfigs.length})
      </span>
      <div className="config-list">
        {savedConfigs.map((cfg) => (
          <div key={cfg.id} className="config-list-item">
            <div className="config-list-info">
              <span className="config-list-name">{cfg.name}</span>
              <span className="config-list-meta">
                Template: {cfg.templateName} &middot;{' '}
                {cfg.config.fontFamily} &middot;{' '}
                {cfg.config.fontSize}px &middot;{' '}
                <span
                  className="config-list-swatch"
                  style={{ backgroundColor: cfg.config.color }}
                />{' '}
                ({cfg.config.x}, {cfg.config.y})
              </span>
              <span className="config-list-date">
                {new Date(cfg.createdAt).toLocaleString()}
              </span>
            </div>
            <div className="config-list-actions">
              <button
                className="config-list-btn load"
                onClick={() => onLoad(cfg)}
                title="Load this configuration"
              >
                <svg
                  width="13"
                  height="13"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
                  <polyline points="17 6 23 6 23 12" />
                </svg>
                Load
              </button>
              <button
                className="config-list-btn delete"
                onClick={() => onDelete(cfg.id)}
                title="Delete this configuration"
              >
                <svg
                  width="13"
                  height="13"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="3 6 5 6 21 6" />
                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                  <line x1="10" y1="11" x2="10" y2="17" />
                  <line x1="14" y1="11" x2="14" y2="17" />
                </svg>
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}