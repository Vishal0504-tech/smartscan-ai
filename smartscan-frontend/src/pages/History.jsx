import { FileText, Clock, Trash2, ArrowRight } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';

export default function History() {
  const [historyItems, setHistoryItems] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const saved = localStorage.getItem('smartscan_history');
    if (saved) {
      try {
        setHistoryItems(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to parse history', e);
      }
    }
  }, []);

  const clearHistory = () => {
    if (window.confirm('Are you sure you want to clear all history?')) {
      localStorage.removeItem('smartscan_history');
      setHistoryItems([]);
    }
  };

  const handleOpenResult = (item) => {
    navigate('/result', { state: { result: item.result } });
  };

  return (
    <div className="max-w-4xl mx-auto w-full animate-in fade-in duration-500">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Scan History</h2>
          <p className="text-gray-500">Access your previously processed documents</p>
        </div>
        {historyItems.length > 0 && (
          <button 
            onClick={clearHistory}
            className="text-red-600 hover:text-red-700 font-medium text-sm flex items-center gap-2 hover:bg-red-50 px-4 py-2 rounded-xl transition-colors"
          >
            <Trash2 className="w-4 h-4" /> Clear All
          </button>
        )}
      </div>

      <div className="space-y-4">
        {historyItems.map((item) => {
          // Estimate word count or content size roughly
          let contentSize = 0;
          if (item.result) {
            const dataStr = JSON.stringify(item.result);
            contentSize = Math.max(0, Math.floor(dataStr.length / 6)); // Rough estimate
          }

          return (
            <div key={item.id} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-shadow flex items-center justify-between group cursor-pointer" onClick={() => handleOpenResult(item)}>
              <div className="flex items-center gap-5">
                <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
                  <FileText className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 text-lg mb-1">{item.title}</h3>
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> {item.date}</span>
                    <span className="flex items-center gap-1.5 px-2 py-0.5 bg-gray-100 rounded-md text-xs font-medium text-gray-600 capitalize">
                      {item.mode}
                    </span>
                    <span>~{contentSize} words</span>
                  </div>
                </div>
              </div>
              
              <button className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          );
        })}

        {historyItems.length === 0 && (
          <div className="text-center py-20 bg-white rounded-2xl border border-gray-100 border-dashed">
            <FileText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 font-medium text-lg">No processing history yet.</p>
            <Link to="/upload" className="text-blue-600 hover:underline mt-2 inline-block">Upload a document to get started</Link>
          </div>
        )}
      </div>
    </div>
  );
}
