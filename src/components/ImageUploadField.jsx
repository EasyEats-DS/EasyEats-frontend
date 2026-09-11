import React, { useState } from 'react';

/**
 * Drop-zone style image picker with an explicit in-flight state.
 *
 * Presentational only - pair it with the useImageUpload hook, which owns the
 * `uploading` flag so the parent form can disable its submit button too.
 * While uploading the field is greyed out and non-interactive, so a second
 * file can't be picked mid-flight.
 */
const ImageUploadField = ({
  id,
  label = 'Upload Image',
  value,
  uploading,
  onSelectFile,
  className = '',
}) => {
  const [fileName, setFileName] = useState('');

  const handleChange = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    try {
      await onSelectFile(file);
    } finally {
      // Allow re-selecting the same file after a failure.
      event.target.value = '';
    }
  };

  return (
    <div className={`flex flex-col ${className}`}>
      {label && (
        <label className="block text-foodie-charcoal font-medium mb-2 text-normal">
          {label}
        </label>
      )}

      <div className="relative w-full max-w-md">
        <input
          type="file"
          accept="image/*"
          disabled={uploading}
          onChange={handleChange}
          className="hidden"
          id={id}
        />

        <label
          htmlFor={uploading ? undefined : id}
          aria-busy={uploading}
          className={`flex flex-col items-center justify-center w-full h-28 rounded-xl border-2 border-dashed transition-all duration-300 ${
            uploading
              ? 'bg-foodie-gray-light/60 border-foodie-orange/30 cursor-not-allowed opacity-70 pointer-events-none'
              : 'bg-foodie-gray-light border-foodie-orange/50 hover:border-foodie-orange cursor-pointer'
          }`}
        >
          {uploading ? (
            <>
              <svg
                className="w-8 h-8 text-foodie-orange animate-spin mb-2"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                />
              </svg>
              <span className="text-foodie-charcoal/80 font-medium">Uploading image...</span>
              <span className="text-sm text-foodie-charcoal/50">Please wait</span>
            </>
          ) : value ? (
            <>
              <img
                src={value}
                alt="Uploaded preview"
                className="w-12 h-12 object-cover rounded-lg mb-2"
              />
              <span className="text-foodie-charcoal/80 font-medium">Image uploaded</span>
              <span className="text-sm text-foodie-charcoal/50">
                {fileName ? `${fileName} - click to replace` : 'Click to replace'}
              </span>
            </>
          ) : (
            <>
              <svg
                className="w-12 h-12 text-foodie-orange/70 mb-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M3 15a4 4 0 004 4h10a4 4 0 004-4M21 15V9a6 6 0 00-6-6H9a6 6 0 00-6 6v6m6-6l3-3m0 0l3 3m-3-3v12"
                />
              </svg>
              <span className="text-foodie-charcoal/80 font-medium">Click to upload an image</span>
              <span className="text-sm text-foodie-charcoal/50">(PNG, JPG, or GIF)</span>
            </>
          )}
        </label>
      </div>
    </div>
  );
};

export default ImageUploadField;
