import { CloudinaryStatus } from '@/types';

interface UploadToCloudinaryOptions {
  file: File;
  publicId: string;
  cloudName: string;
  uploadPreset: string;
  onStatusChange?: (status: CloudinaryStatus, message: string) => void;
}

export async function uploadToCloudinary({
  file,
  publicId,
  cloudName,
  uploadPreset,
  onStatusChange,
}: UploadToCloudinaryOptions): Promise<string | null> {
  try {
    onStatusChange?.('uploading', 'Uploading to Cloudinary…');
    
    const fd = new FormData();
    fd.append('file', file);
    fd.append('upload_preset', uploadPreset);
    fd.append('public_id', publicId);

    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
      { method: 'POST', body: fd }
    );
    
    if (!res.ok) throw new Error(`Cloudinary error ${res.status}`);
    
    const data = await res.json();
    const finalPublicId = data.public_id || publicId;
    
    onStatusChange?.('done', `Uploaded as "${finalPublicId}.png"`);
    
    return `https://res.cloudinary.com/${cloudName}/image/upload/${finalPublicId}.png`;
    
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Upload failed';
    onStatusChange?.('failed', message);
    return null;
  }
}