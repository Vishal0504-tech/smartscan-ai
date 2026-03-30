import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import UploadBox from '../components/UploadBox';
import Loader from '../components/Loader';
import { processImage } from '../services/api';
import { Settings2, Globe, FileStack, AlertCircle } from 'lucide-react';

export default function Upload() {
  const savedSettings = JSON.parse(localStorage.getItem('smartscan_settings') || '{}');
  const [file, setFile] = useState(null);
  const [language, setLanguage] = useState(savedSettings.language || 'en');
  const [targetLang, setTargetLang] = useState(savedSettings.targetLang || 'ta');
  const [mode, setMode] = useState(savedSettings.mode || 'notes');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleProcess = async () => {
    if (!file) {
      setError('Please select an image first.');
      return;
    }
    setError('');
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append('file', file);
      // Backend expects ocrLang, targetLang, mode
      formData.append('ocrLang', language);
      formData.append('targetLang', targetLang);
      formData.append('mode', mode);

      const response = await processImage(formData);
      
      try {
        const historyItem = {
          id: Date.now(),
          title: file.name,
          date: new Date().toLocaleString(),
          mode,
          result: response.data
        };
        const existingHistory = JSON.parse(localStorage.getItem('smartscan_history') || '[]');
        localStorage.setItem('smartscan_history', JSON.stringify([historyItem, ...existingHistory].slice(0, 30)));
      } catch (e) { console.error('Error saving history', e); }
      
      // Navigate to Result page passing the state
      navigate('/result', { state: { result: response.data, fileUrl: URL.createObjectURL(file) } });
    } catch (err) {
      console.error(err);
      setError('Failed to process image. Please make sure the backend is running.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Loader message="Analyzing your document..." />;
  }

  return (
    <div className="max-w-4xl mx-auto w-full animate-in slide-in-from-bottom-4 duration-500">
      <div className="bg-white rounded-3xl p-6 md:p-10 shadow-sm border border-gray-100">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Upload Document</h2>
          <p className="text-gray-500">Select an image to extract text or translate</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-xl flex items-center gap-3">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <p className="font-medium">{error}</p>
          </div>
        )}

        <div className="grid md:grid-cols-5 gap-8">
          <div className="md:col-span-3">
            <div className="mb-4 flex items-center gap-2">
              <FileStack className="w-5 h-5 text-blue-600" />
              <h3 className="text-lg font-semibold text-gray-800">1. Select Image</h3>
            </div>
            <UploadBox onFileSelect={setFile} />
          </div>

          <div className="md:col-span-2 space-y-8">
            <div>
              <div className="mb-4 flex items-center gap-2">
                <Settings2 className="w-5 h-5 text-indigo-600" />
                <h3 className="text-lg font-semibold text-gray-800">2. Options</h3>
              </div>
              
              <div className="space-y-4 bg-gray-50/50 p-5 rounded-2xl border border-gray-100">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                    <Globe className="w-4 h-4" /> Document Language (OCR)
                  </label>
                  <select 
                    value={language} 
                    onChange={(e) => setLanguage(e.target.value)}
                    className="w-full bg-white border border-gray-200 text-gray-700 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow text-sm"
                  >
                    <option value="en">English (Original image is in English)</option>
                    <option value="ta">Tamil (Original image is in Tamil)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Processing Mode</label>
                  <select 
                    value={mode} 
                    onChange={(e) => setMode(e.target.value)}
                    className="w-full bg-white border border-gray-200 text-gray-700 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow text-sm"
                  >
                    <option value="notes">Notes Mode (Standard)</option>
                    <option value="ticket">Ticket Mode (Receipts/Bills)</option>
                    <option value="translate">Translate Mode</option>
                  </select>
                </div>

                {mode === 'translate' && (
                  <div className="animate-in fade-in slide-in-from-top-2">
                    <label className="block text-sm font-medium text-indigo-700 mb-2 mt-2 flex items-center gap-2">
                      <Globe className="w-4 h-4" /> Translate to:
                    </label>
                    <select 
                      value={targetLang} 
                      onChange={(e) => setTargetLang(e.target.value)}
                      className="w-full bg-indigo-50 border border-indigo-200 text-indigo-800 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-shadow text-sm font-medium"
                    >
                      <option value="en">English</option>
                      <option value="ta">Tamil (தமிழ்)</option>
                      <option value="hi">Hindi (हिन्दी)</option>
                      <option value="te">Telugu (తెలుగు)</option>
                      <option value="ml">Malayalam (മലയാളം)</option>
                      <option value="kn">Kannada (ಕನ್ನಡ)</option>
                      <option value="fr">French (Français)</option>
                      <option value="es">Spanish (Español)</option>
                      <option value="de">German (Deutsch)</option>
                      <option value="ja">Japanese (日本語)</option>
                      <option value="zh-cn">Chinese (Simplified)</option>
                    </select>
                  </div>
                )}
              </div>
            </div>

            <button 
              onClick={handleProcess}
              disabled={!file}
              className={`w-full py-4 rounded-xl text-lg font-semibold flex justify-center items-center gap-2 transition-all shadow-md ${
                file 
                ? 'bg-blue-600 hover:bg-blue-700 text-white hover:shadow-lg hover:-translate-y-0.5' 
                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
              }`}
            >
              Process Document
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
