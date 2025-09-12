import { useRef, useState, useEffect } from 'react';
import styles from '../../../styles/ImageUploader.module.css';

const ImageUploader = ({ onUpload, isSecondary, existingImage }) => {
  const fileInputRef = useRef(null);
  const pasteAreaRef = useRef(null);
  const [preview, setPreview] = useState(existingImage || '');
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    setPreview(existingImage || '');
  }, [existingImage]);

  const handleFileChange = (file) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result);
    };
    reader.readAsDataURL(file);
    onUpload(file, isSecondary);
  };

  const handlePaste = (e) => {
    const items = e.clipboardData.items;
    for (const item of items) {
      if (item.type.indexOf('image') !== -1) {
        const blob = item.getAsFile();
        handleFileChange(blob);
        e.preventDefault();
        pasteAreaRef.current.innerHTML = '';
      }
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFileChange(file);
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    setPreview('');
    onUpload(null, isSecondary);
  };

  const openFilePicker = (e) => {
    e.stopPropagation();
    fileInputRef.current.click();
  };

  return (
    <div
      className={`${styles.uploader} ${isDragging ? styles.dragging : ''}`}
      onDragOver={(e) => {
        e.preventDefault();
        setIsDragging(true);
      }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={handleDrop}
    >
      {preview ? (
        <div className={styles.previewContainer}>
          <img
            src={preview}
            alt="Preview"
            className={styles.previewImage}
          />
          <button
            onClick={handleDelete}
            className={styles.deleteButton}
          >
            ×
          </button>
        </div>
      ) : (
        <>
          <div
            ref={pasteAreaRef}
            className={styles.pasteArea}
            contentEditable
            suppressContentEditableWarning
            onPaste={handlePaste}
          >
            <p className={styles.instructions}>Paste, Drag & Drop, or Upload an Image</p>
          </div>
          <button
            onClick={openFilePicker}
            type="button"
            className={styles.uploadButtonSmall}
          >
            Upload Image
          </button>
        </>
      )}

      <input
        type="file"
        ref={fileInputRef}
        style={{ display: 'none' }}
        accept="image/*"
        onChange={(e) => handleFileChange(e.target.files[0])}
      />
    </div>
  );
};

export default ImageUploader;
