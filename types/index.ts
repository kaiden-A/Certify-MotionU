export interface CertificateConfig {
  x: number;
  y: number;
  fontSize: number;
  color: string;
  fontFamily: string;
}

export interface GeneratePayload {
  names: string[];
  templateName: string;
  config?: CertificateConfig;
}

export interface SavedConfig {
  id: string;
  name: string;
  templateName: string;
  config: CertificateConfig;
  createdAt: string;
}

export const FONT_OPTIONS = [
  { value: 'PTSerif', label: 'PT Serif' },
  // Add more fonts here later, e.g.:
  // { value: 'Playfair Display', label: 'Playfair Display' },
  // { value: 'Cormorant Garamond', label: 'Cormorant Garamond' },
] as const;

export type CloudinaryStatus = 'idle' | 'uploading' | 'done' | 'failed';

export interface FileState {
  file: File | null;
  name: string;
  count?: number; // for CSV
}
