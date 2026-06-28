'use client';

import { useState, useCallback, useEffect } from 'react';
import Link from 'next/link';
import { parseCSV } from '@/lib/utils';
import { FileState, CertificateConfig, CloudinaryStatus, GeneratePayload, SavedConfig } from '@/types';
import FileDropZone from './FileDropZone';
import CloudinarySection from './CloudinarySection';
import CertificatePreview from './CertificatePreview';
import ConfigList from './ConfigList';
import ActionBar from './ActionBar';

// ── Environment Config ────────────────────────────────────────
const CLOUDINARY_CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME!;
const CLOUDINARY_UPLOAD_PRESET = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!;
const GENERATE_API_URL = process.env.NEXT_PUBLIC_GENERATE_API_URL!;

const STORAGE_KEY = 'certify-configs';

const DEFAULT_CONFIG: CertificateConfig = {
  x: 975,
  y: 662,
  fontSize: 56,
  color: '#a04b4b',
  fontFamily: 'PTSerif',
};

function loadSavedConfigs(): SavedConfig[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveConfigsToStorage(configs: SavedConfig[]) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(configs));
}

export default function CertificateGenerator() {
  // File states
  const [csvFile, setCsvFile] = useState<FileState>({ file: null, name: '' });
  const [pngFile, setPngFile] = useState<FileState>({ file: null, name: '' });

  // Data states
  const [parsedNames, setParsedNames] = useState<string[]>([]);
  const [templateName, setTemplateName] = useState<string | null>(null);

  // Config state (moved here from CloudinarySection)
  const [certificateConfig, setCertificateConfig] = useState<CertificateConfig>(DEFAULT_CONFIG);
  const [sampleName, setSampleName] = useState('');

  // Saved configs from localStorage
  const [savedConfigs, setSavedConfigs] = useState<SavedConfig[]>([]);

  // UI states
  const [cldStatus, setCldStatus] = useState<CloudinaryStatus>('idle');
  const [status, setStatus] = useState('Upload a PNG template to begin.');
  const [statusType, setStatusType] = useState<'' | 'error' | 'success'>('');
  const [isProcessing, setIsProcessing] = useState(false);

  // Load saved configs on mount
  useEffect(() => {
    setSavedConfigs(loadSavedConfigs());
  }, []);

  // ── CSV Handler ─────────────────────────────────────────────
  const handleCsvSelect = useCallback(async (file: File) => {
    try {
      const text = await file.text();
      const names = parseCSV(text);

      if (names.length === 0) {
        setStatus('CSV must have names in the first column.');
        setStatusType('error');
        return;
      }

      setCsvFile({ file, name: file.name, count: names.length });
      setParsedNames(names);
      setStatusType('');
      updateStatus();
    } catch (err) {
      console.error('CSV parse error:', err);
      setStatus('Failed to parse CSV file.');
      setStatusType('error');
    }
  }, []);

  // ── PNG Handler ─────────────────────────────────────────────
  const handlePngSelect = useCallback((file: File) => {
    setPngFile({ file, name: file.name });
    setCldStatus('idle');
    setTemplateName(null);
    setCertificateConfig(DEFAULT_CONFIG);
    updateStatus();
  }, []);

  // ── Template Ready Handler (receives template name only) ────
  const handleTemplateReady = useCallback((name: string) => {
    setTemplateName(name);
    updateStatus();
  }, []);

  // ── Cloudinary Status Handler ───────────────────────────────
  const handleCldStatusChange = useCallback((status: CloudinaryStatus, message: string) => {
    setCldStatus(status);
    if (status === 'failed') {
      setStatus(message);
      setStatusType('error');
    }
  }, []);

  // ── Config Change Handler ───────────────────────────────────
  const handleConfigChange = useCallback((config: CertificateConfig) => {
    setCertificateConfig(config);
  }, []);

  // ── Save Config Handler ─────────────────────────────────────
  const handleSaveConfig = useCallback(() => {
    if (!templateName || !sampleName.trim()) return;

    const newConfig: SavedConfig = {
      id: crypto.randomUUID(),
      name: sampleName.trim(),
      templateName,
      config: { ...certificateConfig },
      createdAt: new Date().toISOString(),
    };

    // Replace existing config with same name, or add new
    const existing = savedConfigs.findIndex((c) => c.name === newConfig.name && c.templateName === newConfig.templateName);
    let updated: SavedConfig[];
    if (existing >= 0) {
      updated = [...savedConfigs];
      updated[existing] = newConfig;
    } else {
      updated = [...savedConfigs, newConfig];
    }

    setSavedConfigs(updated);
    saveConfigsToStorage(updated);

    setStatus(`Configuration "${newConfig.name}" saved successfully.`);
    setStatusType('success');
    // Clear success after a few seconds
    setTimeout(() => {
      setStatusType('');
      updateStatus();
    }, 3000);
  }, [templateName, sampleName, certificateConfig, savedConfigs]);

  // ── Load Saved Config ───────────────────────────────────────
  const handleLoadConfig = useCallback((cfg: SavedConfig) => {
    setCertificateConfig(cfg.config);
    setSampleName(cfg.name);
    setTemplateName(cfg.templateName);
    setCldStatus('done'); // Assume template is already uploaded
    setStatus(`Loaded configuration "${cfg.name}". Upload CSV to generate.`);
    setStatusType('success');
    setTimeout(() => {
      setStatusType('');
      updateStatus();
    }, 3000);
  }, []);

  // ── Delete Saved Config ─────────────────────────────────────
  const handleDeleteConfig = useCallback((id: string) => {
    const updated = savedConfigs.filter((c) => c.id !== id);
    setSavedConfigs(updated);
    saveConfigsToStorage(updated);
  }, [savedConfigs]);

  // ── Status Updater ──────────────────────────────────────────
  const updateStatus = useCallback(() => {
    const hasCsv = parsedNames.length > 0;
    const hasPng = !!pngFile.file;
    const cloudinaryReady = cldStatus === 'done' && templateName;

    if (!hasPng) {
      setStatus('Upload a PNG template to begin.');
    } else if (!cloudinaryReady) {
      setStatus('Upload the template to Cloudinary to continue.');
    } else if (!hasCsv) {
      setStatus('Configuration ready. Upload your recipients CSV.');
    } else {
      setStatus(`Ready — ${parsedNames.length} names loaded. Click Generate.`);
      setStatusType('');
    }
  }, [parsedNames.length, pngFile.file, cldStatus, templateName]);

  // ── Ready Check ─────────────────────────────────────────────
  const isReady = parsedNames.length > 0 && pngFile.file && cldStatus === 'done' && templateName;

  // ── Generate Handler ────────────────────────────────────────
  const handleGenerate = async () => {
    if (!isReady || !templateName) return;

    setIsProcessing(true);
    setStatus('Generating certificates…');
    setStatusType('');

    const payload: GeneratePayload = {
      names: parsedNames,
      templateName,
      config: certificateConfig,
    };

    try {
      console.log(payload);

      const res = await fetch(GENERATE_API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errText = await res.text().catch(() => '');
        throw new Error(`Server error ${res.status} — ${errText || 'check your backend logs'}`);
      }

      // Download ZIP
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `Certificates_${Date.now()}.zip`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      setStatus('Done! Your ZIP is downloading now.');
      setStatusType('success');
    } catch (err) {
      console.error('Generation error:', err);
      setStatus(err instanceof Error ? err.message : 'Generation failed');
      setStatusType('error');
    } finally {
      setIsProcessing(false);
    }
  };

  const hasSavedConfig = savedConfigs.some(
    (c) => c.name === sampleName.trim() && c.templateName === templateName
  );

  return (
    <div className="wrapper">
      <Link href="/" className="cert-back">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <line x1="19" y1="12" x2="5" y2="12" />
          <polyline points="12 19 5 12 12 5" />
        </svg>
        Home
      </Link>

      <header className="header">
        <div className="eyebrow">
          <span className="eyebrow-line" />
          Bulk Certificate Generator
          <span className="eyebrow-line" />
        </div>
        <span className="logo">Certif<span>y</span></span>
        <p className="tagline">Upload a template, place the text, upload a CSV, download a ZIP.</p>
      </header>

      {/* ── Step 1: Upload Template ── */}
      <div className="cards">
        <div className="card clickable" id="png-card" data-num="01">
          <p className="card-label">Template</p>

          <div
            className="drop-zone"
            onClick={() => document.getElementById('png-input')?.click()}
          >
            <div className="drop-icon">
              <svg viewBox="0 0 24 24">
                <rect x="3" y="3" width="18" height="18" rx="2"/>
                <circle cx="8.5" cy="8.5" r="1.5"/>
                <polyline points="21 15 16 10 5 21"/>
              </svg>
            </div>
            <p className="drop-title">Drop PNG template</p>
            <p className="drop-hint">any resolution works</p>
          </div>

          {pngFile.file && (
            <div className="file-badge visible">
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
              <span className="file-badge-name">{pngFile.name}</span>
            </div>
          )}

          <input
            type="file"
            id="png-input"
            accept="image/png"
            hidden
            onChange={(e) => e.target.files?.[0] && handlePngSelect(e.target.files[0])}
          />
        </div>

        {/* ── Step 2: CSV Upload (can upload anytime) ── */}
        <FileDropZone
          accept=".csv"
          hint="First column should contain names"
          onFileSelect={handleCsvSelect}
          fileState={csvFile}
          badgeIcon={
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
          }
        />
      </div>

      {/* ── Step 3: Preview + Configure ── */}
      <CertificatePreview
        templateFile={pngFile.file}
        config={certificateConfig}
        sampleName={sampleName}
        onConfigChange={handleConfigChange}
        onSampleNameChange={setSampleName}
        onSaveConfig={handleSaveConfig}
        hasSavedConfig={hasSavedConfig}
      />

      {/* ── Step 4: Cloudinary Upload ── */}
      {pngFile.file && (
        <CloudinarySection
          cloudName={CLOUDINARY_CLOUD_NAME}
          uploadPreset={CLOUDINARY_UPLOAD_PRESET}
          onTemplateReady={handleTemplateReady}
          onStatusChange={handleCldStatusChange}
          templateFile={pngFile.file}
        />
      )}

      {/* ── Step 5: Saved Configs ── */}
      <ConfigList
        savedConfigs={savedConfigs}
        onLoad={handleLoadConfig}
        onDelete={handleDeleteConfig}
      />

      <ActionBar
        disabled={!isReady}
        status={status}
        statusType={statusType}
        onGenerate={handleGenerate}
        isProcessing={isProcessing}
      />

      <p className="footnote">
        Develop and Maintain by Kaiden-A
      </p>
    </div>
  );
}
