import axios from 'axios';

const CLOUD_NAME = 'denqj4zdy';
const UPLOAD_PRESET = 'EasyEats';

/**
 * Uploads a file straight to Cloudinary and resolves with its secure URL.
 *
 * Deliberately free of UI concerns (toasts, spinners) so callers own their own
 * progress feedback.
 */
export async function uploadImage(file) {
  const data = new FormData();
  data.append('file', file);
  data.append('upload_preset', UPLOAD_PRESET);
  data.append('cloud_name', CLOUD_NAME);

  try {
    const response = await axios.post(
      `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
      data,
      { headers: { 'Content-Type': 'multipart/form-data' } }
    );
    return response.data.secure_url;
  } catch (error) {
    console.error('Error uploading file to Cloudinary:', error.response?.data || error);
    throw new Error('Failed to upload image');
  }
}
