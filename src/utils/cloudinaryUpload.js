const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

/**
 * Validate a file before upload.
 * @param {File} file
 * @returns {{ valid: boolean, error?: string }}
 */
export function validateImageFile(file) {
  if (!file) return { valid: false, error: 'No file selected.' };
  if (!ALLOWED_TYPES.includes(file.type)) {
    return { valid: false, error: 'Unsupported file type. Please select a JPG, JPEG, PNG, or WEBP image.' };
  }
  if (file.size > MAX_FILE_SIZE) {
    return { valid: false, error: `File size exceeds 10MB limit. Your file is ${(file.size / (1024 * 1024)).toFixed(1)}MB.` };
  }
  return { valid: true };
}

/**
 * Upload a file to Cloudinary using unsigned upload preset.
 * @param {File} file - The image file to upload
 * @param {function} [onProgress] - Optional progress callback (0-100)
 * @returns {Promise<{ secure_url: string, public_id: string, width: number, height: number, format: string, bytes: number }>}
 */
export async function uploadToCloudinary(file, onProgress) {
  const validation = validateImageFile(file);
  if (!validation.valid) {
    throw new Error(validation.error);
  }

  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', UPLOAD_PRESET);
  formData.append('folder', 'vasthra-products');

  const url = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`;

  const xhr = new XMLHttpRequest();

  return new Promise((resolve, reject) => {
    xhr.open('POST', url);

    if (onProgress) {
      xhr.upload.onprogress = (e) => {
        if (e.lengthComputable) {
          onProgress(Math.round((e.loaded / e.total) * 100));
        }
      };
    }

    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        const data = JSON.parse(xhr.responseText);
        resolve({
          secure_url: data.secure_url,
          public_id: data.public_id,
          width: data.width,
          height: data.height,
          format: data.format,
          bytes: data.bytes,
        });
      } else {
        let msg = 'Image upload failed.';
        try {
          const err = JSON.parse(xhr.responseText);
          msg = err.error?.message || msg;
        } catch (_) {}
        reject(new Error(msg));
      }
    };

    xhr.onerror = () => reject(new Error('Network error during image upload. Please check your connection.'));
    xhr.ontimeout = () => reject(new Error('Upload timed out. Please try again.'));

    xhr.send(formData);
  });
}

/**
 * Generate a Cloudinary thumbnail URL from a secure_url.
 * @param {string} secureUrl
 * @param {number} width
 * @param {number} height
 * @returns {string}
 */
export function getCloudinaryThumbnail(secureUrl, width = 300, height = 400) {
  if (!secureUrl || !secureUrl.includes('cloudinary.com')) return secureUrl;
  return secureUrl.replace('/upload/', `/upload/c_fill,w_${width},h_${height},q_auto,f_auto/`);
}
