'use client';

import { useState, useEffect } from 'react';
import { CloudinaryStatus } from '@/types';
import { uploadToCloudinary } from '../../lib/cloudinary';
import { slugify } from '@/lib/utils';

interface CloudinarySectionProps {
  cloudName: string;
  uploadPreset: string;
  onTemplateReady: (templateName: string) => void;
  onStatusChange: (status: CloudinaryStatus, message: string) => void;
  templateFile: File | null;
}

export default function CloudinarySection({
  cloudName,
  uploadPreset,
  onTemplateReady,
  onStatusChange,
  templateFile,
}: CloudinarySectionProps) {
  const [templateName, setTemplateName] = useState('');
  const [cldStatus, setCldStatus] = useState<CloudinaryStatus>('idle');
  const [cldMessage, setCldMessage] = useState('');
  const [confirmedTemplateName, setConfirmedTemplateName] = useState<string | null>(null);

  // Auto-fill template name when file is selected
  useEffect(() => {
    if (templateFile && !templateName) {
      setTemplateName(slugify(templateFile.name));
    }
  }, [templateFile, templateName]);

  const handleUpload = async () => {
    const cleanName = templateName.trim();
    if (!cleanName || !templateFile) return;

    const url = await uploadToCloudinary({
      file: templateFile,
      publicId: cleanName,
      cloudName,
      uploadPreset,
      onStatusChange: (status, message) => {
        setCldStatus(status);
        setCldMessage(message);
        onStatusChange(status, message);
      },
    });

    if (url) {
      setConfirmedTemplateName(cleanName);
      onTemplateReady(cleanName);
    }
  };

  return (
    <div className="tns visible">
      <span className="tns-label">Cloudinary template name</span>
      <div className="tns-row">
        <span className="tns-affix prefix">…/upload/</span>
        <input 
          className="tns-input" 
          value={templateName}
          onChange={(e) => setTemplateName(e.target.value)}
          placeholder="completion-2024" 
          spellCheck={false} 
          autoComplete="off"
        />
        <span className="tns-affix suffix">.png</span>
      </div>

      <button 
        className="cld-btn" 
        onClick={handleUpload}
        disabled={!templateName.trim() || !templateFile || cldStatus === 'uploading'}
      >
        <svg viewBox="0 0 24 24">
          <polyline points="16 16 12 12 8 16"/>
          <line x1="12" y1="12" x2="12" y2="21"/>
          <path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3"/>
        </svg>
        Upload to Cloudinary
      </button>

      {cldStatus !== 'idle' && (
        <div className={`cld-status ${cldStatus}`}>
          <span id="cld-status-icon">
            {cldStatus === 'uploading' && <div className="cld-spinner" />}
            {cldStatus === 'done' && (
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
            )}
            {cldStatus === 'failed' && (
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <circle cx="12" cy="12" r="10"/>
                <line x1="15" y1="9" x2="9" y2="15"/>
                <line x1="9" y1="9" x2="15" y2="15"/>
              </svg>
            )}
          </span>
          <span id="cld-status-text">{cldMessage}</span>
        </div>
      )}

      {confirmedTemplateName && (
        <div className="url-preview visible">
          <strong>Template: {confirmedTemplateName}</strong>
        </div>
      )}
    </div>
  );
}
