import { useState, useCallback } from 'react';
import { UploadCloud, FileImage, X } from 'lucide-react';

export default function UploadBox({ onFileSelect }) {
  const [dragActive, setDragActive] = useState(false);
  const [preview, setPreview] = useState(null);

  const handleDrag = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const processFile = (file) => {
    if (file && file.type.startsWith('image/')) {
      const url = URL.createObjectURL(file);
      setPreview(url);
      onFileSelect(file);
    }
  };

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  }, [onFileSelect]);

  const handleChange = (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const clearFile = () => {
    setPreview(null);
    onFileSelect(null);
  };

  return (
    <div className="w-full">
      {!preview ? (
        <div 
          className={`border-3 border-dashed rounded-2xl p-12 text-center transition-all ${
            dragActive 
            ? 'border-blue-500 bg-blue-50/50 scale-[1.02]' 
            : 'border-gray-200 hover:border-blue-400 hover:bg-gray-50/50'
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <input 
            type="file" 
            id="file-upload" 
            className="hidden" 
            accept="image/*"
            onChange={handleChange}
          />
          <label htmlFor="file-upload" className="cursor-pointer flex flex-col items-center justify-center space-y-4">
            <div className={`p-4 rounded-full transition-colors ${dragActive ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-500'}`}>
              <UploadCloud className="w-10 h-10" />
            </div>
            <div>
              <p className="text-xl font-semibold text-gray-800">
                Click to upload or drag & drop
              </p>
              <p className="text-sm text-gray-500 mt-2">
                SVG, PNG, JPG or GIF (max. 10MB)
              </p>
            </div>
          </label>
        </div>
      ) : (
        <div className="relative rounded-2xl overflow-hidden border border-gray-100 shadow-sm group">
          <img src={preview} alt="Preview" className="w-full max-h-96 object-contain bg-gray-50" />
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
            <button 
              onClick={clearFile}
              className="bg-white/20 hover:bg-white/30 text-white p-3 rounded-full backdrop-blur-md transition translate-y-4 group-hover:translate-y-0"
              title="Remove image"
            >
              <X className="w-8 h-8" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
