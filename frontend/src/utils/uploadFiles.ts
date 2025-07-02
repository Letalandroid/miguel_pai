import { supabase } from "../supabase/client";

export interface UploadResult {
  publicUrl: string;
  error?: string;
}

export const uploadFileFromBrowser = async (
  file: File,
  filename: string,
  bucket: string
): Promise<UploadResult> => {
  const { error: uploadError } = await supabase.storage
    .from(bucket)
    .upload(`${'public'}/${filename}`, file, {
      contentType: file.type,
      upsert: true,
    });

  if (uploadError) {
    throw new Error(`Upload failed: ${uploadError.message}`);
  }

  const { data: publicUrlData } = supabase.storage
    .from(bucket)
    .getPublicUrl(`public/${filename}`);

  if (!publicUrlData?.publicUrl) {
    throw new Error("Failed to get public URL");
  }

  return { publicUrl: publicUrlData.publicUrl };
};
