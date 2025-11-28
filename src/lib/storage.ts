import { put, del, list, head } from '@vercel/blob';

export interface UploadResult {
  url: string;
  pathname: string;
  size: number;
  uploadedAt: Date;
}

export async function uploadFile(
  file: File | Buffer,
  path: string,
  options?: {
    contentType?: string;
    addRandomSuffix?: boolean;
  }
): Promise<UploadResult> {
  try {
    const buffer = file instanceof File 
      ? Buffer.from(await file.arrayBuffer())
      : file;

    const fileSize = buffer.length;

    const blob = await put(path, buffer, {
      access: 'public',
      contentType: options?.contentType || 'application/octet-stream',
      addRandomSuffix: options?.addRandomSuffix !== false,
    });

    return {
      url: blob.url,
      pathname: blob.pathname,
      size: fileSize,
      uploadedAt: new Date(),
    };
  } catch (error) {
    console.error('Erro ao fazer upload para Vercel Blob:', error);
    throw new Error('Falha ao fazer upload do arquivo');
  }
}

export async function deleteFile(pathname: string): Promise<boolean> {
  try {
    await del(pathname);
    return true;
  } catch (error) {
    console.error('Erro ao deletar arquivo do Vercel Blob:', error);
    return false;
  }
}

export async function fileExists(pathname: string): Promise<boolean> {
  try {
    await head(pathname);
    return true;
  } catch (error) {
    return false;
  }
}

export async function listFiles(prefix: string): Promise<string[]> {
  try {
    const { blobs } = await list({ prefix });
    return blobs.map((blob: { pathname: string }) => blob.pathname);
  } catch (error) {
    console.error('Erro ao listar arquivos do Vercel Blob:', error);
    return [];
  }
}

