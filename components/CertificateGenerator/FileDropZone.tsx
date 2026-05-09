'use client';

import { useCallback, useState } from 'react';
import { FileState } from '@/types';

interface FileDropZoneProps {
  accept: string;
  hint: string;
  onFileSelect: (file: File) => void;
  fileState?: FileState;
  badgeIcon?: React.ReactNode;
}

export default function FileDropZone({
  accept,
  hint,
  onFileSelect,
  fileState,
  badgeIcon,
}: FileDropZoneProps) {
  const [isDragOver, setIsDragOver] = useState(false);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) onFileSelect(file);
  }, [onFileSelect]);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) onFileSelect(file);
  }, [onFileSelect]);

  return (
    <div className={`card clickable ${fileState?.file ? 'file-set' : ''} ${isDragOver ? 'drag-over' : ''}`}>
      <p className="card-label">Recipients</p>
      
      <div 
        className="drop-zone"
        onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
        onDragLeave={() => setIsDragOver(false)}
        onDrop={handleDrop}
        onClick={() => document.getElementById('csv-input')?.click()}
      >
        <div className="drop-icon">
          <svg viewBox="0 0 24 24">
            <rect x="3" y="3" width="18" height="18" rx="2"/>
            <line x1="3" y1="9" x2="21" y2="9"/>
            <line x1="3" y1="15" x2="21" y2="15"/>
            <line x1="9" y1="9" x2="9" y2="21"/>
          </svg>
        </div>
        <p className="drop-title">Drop CSV file</p>
        <p className="drop-hint">{hint}</p>
      </div>

      {fileState?.file && (
        <div className="file-badge visible">
          {badgeIcon}
          <span className="file-badge-name">{fileState.name}</span>
          {fileState.count && <span style={{marginLeft: 6, opacity: 0.7}}>({fileState.count} names)</span>}
        </div>
      )}

      <input 
        type="file" 
        id="csv-input" 
        accept={accept} 
        hidden 
        onChange={handleChange}
      />
    </div>
  );
}