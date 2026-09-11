import { useCallback, useState } from 'react';
import { toast } from 'react-toastify';
import { uploadImage } from './uploadImage';

const TOAST_OPTIONS = {
  position: 'top-right',
  autoClose: 3000,
  theme: 'colored',
};

/**
 * Owns the in-flight state for a Cloudinary image upload.
 *
 * `uploading` is meant to drive both the field's own busy state and any submit
 * button on the form, so a half-finished upload can't be saved. `upload`
 * resolves with the image URL, or null when the upload failed.
 */
export function useImageUpload({ successMessage = 'Image uploaded successfully!' } = {}) {
  const [uploading, setUploading] = useState(false);

  const upload = useCallback(
    async (file) => {
      if (!file) return null;

      setUploading(true);
      try {
        const url = await uploadImage(file);
        toast.success(successMessage, TOAST_OPTIONS);
        return url;
      } catch (error) {
        console.error('Image upload failed:', error);
        toast.error('Image upload failed. Please try again.', TOAST_OPTIONS);
        return null;
      } finally {
        setUploading(false);
      }
    },
    [successMessage]
  );

  return { uploading, upload };
}
