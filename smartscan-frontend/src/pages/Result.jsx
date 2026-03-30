import { useLocation, Link, Navigate } from 'react-router-dom';
import { ArrowLeft, RefreshCw } from 'lucide-react';
import ResultCard from '../components/ResultCard';

export default function Result() {
  const location = useLocation();
  const { result, fileUrl } = location.state || {};

  if (!result) {
    return <Navigate to="/upload" replace />;
  }

  let extractedText = '';
  let translatedText = '';

  if (result.formatted) {
    extractedText = result.formatted;
  } else if (result.ticket) {
    extractedText = typeof result.ticket === 'object' ? JSON.stringify(result.ticket, null, 2) : result.ticket;
  } else if (result.original) {
    extractedText = result.original;
    translatedText = result.translated;
  } else if (result.text) {
    extractedText = result.text;
  }

  const modeUsed = result.mode || 'Auto';

  return (
    <div className="max-w-6xl mx-auto w-full animate-in slide-in-from-right-8 duration-500">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Scan Results</h2>
          <div className="flex items-center gap-3">
            <span className="px-3 py-1 bg-green-50 text-green-700 text-xs font-semibold rounded-full border border-green-200">
              Processing Complete
            </span>
            <span className="text-gray-500 text-sm">Mode: {modeUsed}</span>
          </div>
        </div>
        
        <Link 
          to="/upload" 
          className="flex items-center gap-2 px-5 py-2.5 bg-white border border-gray-200 rounded-xl text-gray-700 hover:bg-gray-50 hover:text-blue-600 transition-colors font-medium shadow-sm"
        >
          <RefreshCw className="w-4 h-4" /> Scan Another
        </Link>
      </div>

      <div className="grid lg:grid-cols-12 gap-6">
        {/* Left Col: Original Image */}
        {fileUrl && (
          <div className="lg:col-span-4 bg-white rounded-2xl p-4 shadow-sm border border-gray-100 h-fit sticky top-24">
            <h3 className="font-semibold text-gray-800 mb-3 px-1">Original Document</h3>
            <div className="rounded-xl overflow-hidden border border-gray-100 bg-gray-50 max-h-[600px] flex items-center justify-center">
              <img src={fileUrl} alt="Original" className="w-full object-contain" />
            </div>
          </div>
        )}

        {/* Right Col: Extracted Data */}
        <div className={`${fileUrl ? 'lg:col-span-8' : 'lg:col-span-12'} space-y-6 flex flex-col min-w-0`}>
          {extractedText && (
            <ResultCard 
              title="Extracted Text (OCR)" 
              content={extractedText} 
              bg="bg-blue-50/30"
            />
          )}

          {translatedText && (
            <ResultCard 
              title="Translation / Processed Result" 
              content={translatedText} 
              bg="bg-indigo-50/30"
            />
          )}
          
          {!extractedText && !translatedText && (
            <div className="bg-white rounded-2xl p-10 text-center border border-gray-100 shadow-sm flex-1 flex flex-col items-center justify-center">
              <p className="text-gray-500 mb-4">No text could be extracted from this image.</p>
              <Link to="/upload" className="text-blue-600 font-medium hover:underline flex items-center gap-1">
                <ArrowLeft className="w-4 h-4" /> Try another image
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
