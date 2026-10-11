import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';

export default function FileUpload({ onFile, onFiles, accept, multiple = false, label = 'Drop file here or click to browse' }) {
  const onDrop = useCallback((acceptedFiles) => {
    if (multiple && onFiles) {
      onFiles(acceptedFiles);
    } else if (acceptedFiles.length > 0 && onFile) {
      onFile(acceptedFiles[0]);
    }
  }, [onFile, onFiles, multiple]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept,
    multiple,
  });

  return (
    <div
      {...getRootProps()}
      className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition ${
        isDragActive ? 'border-da-teal bg-da-teal/10' : 'border-da-border hover:border-da-teal/50'
      }`}
    >
      <input {...getInputProps()} />
      <p className="text-da-text-muted">{isDragActive ? 'Drop it here...' : label}</p>
    </div>
  );
}
