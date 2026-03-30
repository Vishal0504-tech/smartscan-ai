import { Copy, Download, CheckCircle2 } from 'lucide-react';
import { useState } from 'react';

export default function ResultCard({ title, content, type = 'text', bg = 'bg-white' }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (!content) return;
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    if (!content) return;
    const element = document.createElement("a");
    const file = new Blob([content], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `${title.toLowerCase().replace(/\s+/g, '_')}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  if (!content) return null;

  return (
    <div className={`rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col h-full ${bg}`}>
      <div className="px-5 py-4 border-b border-gray-100 bg-white/50 flex justify-between items-center backdrop-blur-sm">
        <h3 className="font-semibold text-gray-800">{title}</h3>
        <div className="flex gap-2">
          <button 
            onClick={handleCopy}
            className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors flex items-center justify-center relative"
            title="Copy to clipboard"
          >
            {copied ? <CheckCircle2 className="w-5 h-5 text-green-500" /> : <Copy className="w-5 h-5" />}
          </button>
          <button 
            onClick={handleDownload}
            className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            title="Download as TXT"
          >
            <Download className="w-5 h-5" />
          </button>
        </div>
      </div>
      <div className="p-5 flex-1 relative group">
        <textarea
          readOnly
          value={content}
          className="w-full h-full min-h-[200px] resize-none bg-transparent outline-none text-gray-700 leading-relaxed font-mono text-sm"
        />
      </div>
    </div>
  );
}
