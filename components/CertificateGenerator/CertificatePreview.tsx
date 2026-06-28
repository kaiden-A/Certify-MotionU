'use client';

import { useRef, useEffect, useCallback, useState } from 'react';
import { CertificateConfig, FONT_OPTIONS } from '@/types';

interface CertificatePreviewProps {
  templateFile: File | null;
  config: CertificateConfig;
  sampleName: string;
  onConfigChange: (config: CertificateConfig) => void;
  onSampleNameChange: (name: string) => void;
  onSaveConfig: () => void;
  hasSavedConfig: boolean;
}

export default function CertificatePreview({
  templateFile,
  config,
  sampleName,
  onConfigChange,
  onSampleNameChange,
  onSaveConfig,
  hasSavedConfig,
}: CertificatePreviewProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number } | null>(null);
  const scaleRef = useRef(1);

  // Load image from file
  useEffect(() => {
    if (!templateFile) {
      setImageLoaded(false);
      imageRef.current = null;
      return;
    }

    const url = URL.createObjectURL(templateFile);
    const img = new Image();
    img.onload = () => {
      imageRef.current = img;
      setImageLoaded(true);
    };
    img.src = url;

    return () => URL.revokeObjectURL(url);
  }, [templateFile]);

  // Draw canvas
  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    const img = imageRef.current;
    const container = containerRef.current;
    if (!canvas || !img || !container) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Scale to fit container width while maintaining aspect ratio
    const containerWidth = container.clientWidth;
    const scale = containerWidth / img.naturalWidth;
    scaleRef.current = scale;

    const displayWidth = img.naturalWidth * scale;
    const displayHeight = img.naturalHeight * scale;

    canvas.width = displayWidth;
    canvas.height = displayHeight;
    canvas.style.width = displayWidth + 'px';
    canvas.style.height = displayHeight + 'px';

    // Draw image
    ctx.clearRect(0, 0, displayWidth, displayHeight);
    ctx.drawImage(img, 0, 0, displayWidth, displayHeight);

    // Draw text overlay
    if (!sampleName.trim()) return;

    const textX = config.x * scale;
    const textY = config.y * scale;
    const fontSize = config.fontSize * scale;

    ctx.font = fontSize + 'px "' + config.fontFamily + '", serif';
    ctx.fillStyle = config.color;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(sampleName.trim(), textX, textY);
  }, [config, sampleName]);

  useEffect(() => {
    if (!imageLoaded) return;
    draw();
  }, [imageLoaded, draw]);

  // Handle window resize
  useEffect(() => {
    if (!imageLoaded) return;
    const onResize = () => draw();
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [imageLoaded, draw]);

  // Convert canvas click to image coordinates
  const canvasToImage = useCallback(
    (canvasX: number, canvasY: number) => {
      const canvas = canvasRef.current;
      if (!canvas) return { x: 0, y: 0 };
      const rect = canvas.getBoundingClientRect();
      const x = (canvasX - rect.left) / scaleRef.current;
      const y = (canvasY - rect.top) / scaleRef.current;
      return { x: Math.round(x), y: Math.round(y) };
    },
    []
  );

  // Click to position
  const handleCanvasClick = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>) => {
      if (isDragging) return;
      const coords = canvasToImage(e.clientX, e.clientY);
      onConfigChange({ ...config, x: coords.x, y: coords.y });
    },
    [isDragging, canvasToImage, config, onConfigChange]
  );

  // Drag handlers
  const handleMouseDown = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>) => {
      setIsDragging(true);
      setDragStart({ x: e.clientX, y: e.clientY });
    },
    []
  );

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>) => {
      if (!isDragging || !dragStart) return;
      const dx = e.clientX - dragStart.x;
      const dy = e.clientY - dragStart.y;
      const imgDx = Math.round(dx / scaleRef.current);
      const imgDy = Math.round(dy / scaleRef.current);
      if (imgDx === 0 && imgDy === 0) return;
      setDragStart({ x: e.clientX, y: e.clientY });
      onConfigChange({
        ...config,
        x: config.x + imgDx,
        y: config.y + imgDy,
      });
    },
    [isDragging, dragStart, config, onConfigChange]
  );

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
    setDragStart(null);
  }, []);

  if (!templateFile) {
    return (
      <div className="preview-section">
        <span className="tns-label">Certificate Preview</span>
        <div className="preview-empty">
          <svg viewBox="0 0 24 24">
            <rect x="3" y="3" width="18" height="18" rx="2" />
            <circle cx="8.5" cy="8.5" r="1.5" />
            <polyline points="21 15 16 10 5 21" />
          </svg>
          <p>Upload a PNG template to see the preview</p>
        </div>
      </div>
    );
  }

  return (
    <div className="preview-section">
      <span className="tns-label">Certificate Preview</span>

      <div className="preview-canvas-wrap" ref={containerRef}>
        <canvas
          ref={canvasRef}
          className={`preview-canvas ${isDragging ? 'dragging' : ''}`}
          onClick={handleCanvasClick}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        />
      </div>

      <p className="preview-hint">
        Click on the certificate to place the text, then drag to fine-tune
      </p>

      {/* Config inputs */}
      <div className="config-section visible">
        <span className="tns-label">Text &amp; Style</span>
        <div className="config-grid">
          <div className="config-field full">
            <label className="config-label">Sample Name</label>
            <input
              className="config-input"
              type="text"
              value={sampleName}
              onChange={(e) => onSampleNameChange(e.target.value)}
              placeholder="Type a name to preview..."
              spellCheck={false}
            />
          </div>
          <div className="config-field">
            <label className="config-label">Font Family</label>
            <select
              className="config-input config-select"
              value={config.fontFamily}
              onChange={(e) => onConfigChange({ ...config, fontFamily: e.target.value })}
            >
              {FONT_OPTIONS.map((f) => (
                <option key={f.value} value={f.value}>{f.label}</option>
              ))}
            </select>
          </div>
          <div className="config-field">
            <label className="config-label">Font Size</label>
            <input className="config-input" type="number" value={config.fontSize} min={8} max={200} onChange={(e) => onConfigChange({ ...config, fontSize: parseInt(e.target.value) || 8 })} />
          </div>
          <div className="config-field">
            <label className="config-label">Color</label>
            <input className="config-input" type="color" value={config.color} onChange={(e) => onConfigChange({ ...config, color: e.target.value })} />
          </div>
          <div className="config-field">
            <label className="config-label">X Position</label>
            <input className="config-input" type="number" value={config.x} min={0} onChange={(e) => onConfigChange({ ...config, x: parseInt(e.target.value) || 0 })} />
          </div>
          <div className="config-field">
            <label className="config-label">Y Position</label>
            <input className="config-input" type="number" value={config.y} min={0} onChange={(e) => onConfigChange({ ...config, y: parseInt(e.target.value) || 0 })} />
          </div>
        </div>
      </div>

      {/* Save button */}
      <button className="cld-btn save-config-btn" onClick={onSaveConfig} disabled={!sampleName.trim()}>
        <svg viewBox="0 0 24 24">
          <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
          <polyline points="17 21 17 13 7 13 7 21" />
          <polyline points="7 3 7 8 15 8" />
        </svg>
        {hasSavedConfig ? 'Update Configuration' : 'Save Configuration'}
      </button>
    </div>
  );
}