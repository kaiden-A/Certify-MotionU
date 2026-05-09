'use client';

import { memo } from 'react';

export interface ActionBarProps {
  disabled: boolean;
  status: string;
  statusType: '' | 'error' | 'success';
  onGenerate: () => Promise<void>;
  isProcessing: boolean;
}

function ActionBarComponent({
  disabled,
  status,
  statusType,
  onGenerate,
  isProcessing,
}: ActionBarProps) {
  return (
    <div className="action-bar">
      <button 
        className="btn" 
        onClick={onGenerate}
        disabled={disabled || isProcessing}
        aria-busy={isProcessing}
      >
        {isProcessing ? (
          <span className="btn-spinner" style={{ display: 'block' }} aria-hidden="true" />
        ) : (
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
            <polyline points="7 10 12 15 17 10"/>
            <line x1="12" y1="15" x2="12" y2="3"/>
          </svg>
        )}
        <span>{isProcessing ? 'Processing…' : 'Generate ZIP'}</span>
      </button>
      <div className="action-divider" aria-hidden="true" />
      <p className={`status ${statusType}`} role="status" aria-live="polite">
        {status}
      </p>
    </div>
  );
}

// Memoize to prevent unnecessary re-renders
export const ActionBar = memo(ActionBarComponent);
export default ActionBar;