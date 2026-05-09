'use client';

import { useState, useEffect } from 'react';
import { CloudinaryStatus, CertificateConfig } from '@/types';
import { uploadToCloudinary } from '../../lib/cloudinary';
import { slugify } from '@/lib/utils';

interface CloudinarySectionProps {
  cloudName: string;
  uploadPreset: string;
  // 🔁 Changed: now returns templateName instead of URL
  onTemplateReady: (templateName: string, config: CertificateConfig) => void;
  onStatusChange: (status: CloudinaryStatus, message: string) => void;
  templateFile: File | null;
}

const DEFAULT_CONFIG: CertificateConfig = {
  x: 975,
  y: 662,
  fontSize: 56,
  color: '#a04b4b',
  fontFamily: 'PTSerif',
};

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
  const [config, setConfig] = useState<CertificateConfig>(DEFAULT_CONFIG);

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

    // If upload succeeded (url is returned), pass ONLY the template name upward
    if (url) {
      setConfirmedTemplateName(cleanName);
      onTemplateReady(cleanName, config);
    }
  };

  const handleConfigChange = (key: keyof CertificateConfig, value: string | number) => {
    const newConfig = { ...config, [key]: value };
    setConfig(newConfig);
    
    // Propagate config changes to parent only if template is already confirmed
    if (confirmedTemplateName) {
      onTemplateReady(confirmedTemplateName, newConfig);
    }
  };

  const isReady = cldStatus === 'done' && confirmedTemplateName;

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

      {/* Text Position & Style Config */}
      <div className="config-section visible">
        <span className="tns-label">Text Placement & Style</span>
        <div className="config-grid">
          <div className="config-field">
            <label className="config-label">X Position</label>
            <input className="config-input" type="number" value={config.x} min={0} onChange={(e) => handleConfigChange('x', parseInt(e.target.value) || 0)} />
          </div>
          <div className="config-field">
            <label className="config-label">Y Position</label>
            <input className="config-input" type="number" value={config.y} min={0} onChange={(e) => handleConfigChange('y', parseInt(e.target.value) || 0)} />
          </div>
          <div className="config-field">
            <label className="config-label">Font Size</label>
            <input className="config-input" type="number" value={config.fontSize} min={8} max={200} onChange={(e) => handleConfigChange('fontSize', parseInt(e.target.value) || 8)} />
          </div>
          <div className="config-field">
            <label className="config-label">Color</label>
            <input className="config-input" type="color" value={config.color} onChange={(e) => handleConfigChange('color', e.target.value)} />
          </div>
          <div className="config-field full">
            <label className="config-label">Font Family</label>
            <input className="config-input" type="text" value={config.fontFamily} placeholder="e.g., PTSerif, Arial, Times New Roman" onChange={(e) => handleConfigChange('fontFamily', e.target.value)} />
          </div>
        </div>
      </div>

      {isReady && <input type="hidden" value={confirmedTemplateName} data-ready="true" />}
    </div>
  );
}