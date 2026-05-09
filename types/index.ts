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

export type CloudinaryStatus = 'idle' | 'uploading' | 'done' | 'failed';

export interface FileState {
  file: File | null;
  name: string;
  count?: number; // for CSV
}