'use client';

import { useState, useCallback } from 'react';
import { parseCSV } from '@/lib/utils';
import { FileState, CertificateConfig, CloudinaryStatus, GeneratePayload } from '@/types';
import FileDropZone from './FileDropZone';
import CloudinarySection from './CloudinarySection';
import ActionBar from './ActionBar';

// ⚠️ Set these via environment variables in production
const CLOUDINARY_CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME! ;
const CLOUDINARY_UPLOAD_PRESET = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET! ;
const GENERATE_API_URL = process.env.NEXT_PUBLIC_GENERATE_API_URL! ;

export default function CertificateGenerator() {
  const [csvFile, setCsvFile] = useState<FileState>({ file: null, name: '' });
  const [pngFile, setPngFile] = useState<FileState>({ file: null, name: '' });
  const [parsedNames, setParsedNames] = useState<string[]>([]);
  const [templateUrl, setTemplateUrl] = useState<string | null>(null);
  const [templateConfig, setTemplateConfig] = useState<CertificateConfig | null>(null);
  const [cldStatus, setCldStatus] = useState<CloudinaryStatus>('idle');
  const [status, setStatus] = useState('Upload both files to continue.');
  const [statusType, setStatusType] = useState<'' | 'error' | 'success'>('');
  const [isProcessing, setIsProcessing] = useState(false);

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

  const handlePngSelect = useCallback((file: File) => {
    setPngFile({ file, name: file.name });
    setCldStatus('idle');
    setTemplateUrl(null);
    setTemplateConfig(null);
    updateStatus();
  }, []);

  const handleTemplateReady = useCallback((url: string, config: CertificateConfig) => {
    setTemplateUrl(url);
    setTemplateConfig(config);
    updateStatus();
  }, []);

  const handleCldStatusChange = useCallback((status: CloudinaryStatus, message: string) => {
    setCldStatus(status);
    if (status === 'failed') {
      setStatus(message);
      setStatusType('error');
    }
  }, []);

  const updateStatus = useCallback(() => {
    const hasCsv = parsedNames.length > 0;
    const hasPng = !!pngFile.file;
    const cloudinaryReady = cldStatus === 'done' && templateUrl;

    if (!hasCsv && !hasPng) {
      setStatus('Upload both files to continue.');
    } else if (!hasCsv) {
      setStatus('Upload your recipients CSV.');
    } else if (!hasPng) {
      setStatus('Upload your PNG template.');
    } else if (!cloudinaryReady) {
      setStatus('Upload the template to Cloudinary to continue.');
    } else {
      setStatus(`Ready — ${parsedNames.length} names loaded. Click Generate.`);
      setStatusType('');
    }
  }, [parsedNames.length, pngFile.file, cldStatus, templateUrl]);

  const isReady = parsedNames.length > 0 && pngFile.file && cldStatus === 'done' && templateUrl;

  const handleGenerate = async () => {
    if (!isReady || !templateUrl || !templateConfig) return;

    setIsProcessing(true);
    setStatus('Generating certificates…');
    setStatusType('');

    const payload: GeneratePayload = {
      names: parsedNames,
      templateUri: templateUrl,
      config: templateConfig,
    };

    try {
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

  return (
    <div className="wrapper">
      <header className="header">
        <div className="eyebrow">
          <span className="eyebrow-line" />
          Bulk Certificate Generator
          <span className="eyebrow-line" />
        </div>
        <span className="logo">Certif<span>y</span></span>
        <p className="tagline">Upload a CSV and a template. Download a ZIP.</p>
      </header>

      <div className="cards" >
        {/* CSV Drop Zone */}
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

        {/* PNG Drop Zone + Cloudinary */}
        <div className="card" id="png-card" data-num="02">
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

          {pngFile.file && (
            <CloudinarySection
              cloudName={CLOUDINARY_CLOUD_NAME}
              uploadPreset={CLOUDINARY_UPLOAD_PRESET}
              onTemplateReady={handleTemplateReady}
              onStatusChange={handleCldStatusChange}
              templateFile={pngFile.file}
            />
          )}
        </div>
      </div>

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