const CLOUD_NAME = 'dmjsw44ea';
const UPLOAD_PRESET = 'UniIntern';

export const uploadImageToCloudinary = async (
  imageUri: string,
  folder: 'avatars' | 'covers',
): Promise<string> => {
  try {
    console.log('Step 1: Starting upload...');
    console.log('Image URI:', imageUri);

    const formData = new FormData();
    formData.append('file', {
      uri: imageUri,
      type: 'image/jpeg',
      name: `${folder}_${Date.now()}.jpg`,
    } as any);
    formData.append('upload_preset', UPLOAD_PRESET);

    console.log('Step 2: FormData created, sending to Cloudinary...');

    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
      {
        method: 'POST',
        body: formData,
      },
    );

    console.log('Step 3: Response status:', response.status);
    const text = await response.text();
    console.log('Step 4: Response body:', text);

    const data = JSON.parse(text) as any;

    if (!response.ok) {
      throw new Error(data?.error?.message ?? 'Upload failed');
    }

    return data.secure_url;
  } catch (err: any) {
    console.log('CATCH ERROR:', err?.message ?? String(err));
    throw err;
  }
};