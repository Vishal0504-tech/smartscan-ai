import { Link } from 'react-router-dom';
import { UploadCloud, Languages, FileText, FileSpreadsheet, ArrowRight } from 'lucide-react';

export default function Home() {
  const features = [
    { name: 'OCR Scan', description: 'Extract high-quality text from images and documents instantly.', icon: FileText, color: 'text-blue-600', bg: 'bg-blue-100' },
    { name: 'Seamless Translate', description: 'Translate text from Tamil to English or vice versa natively.', icon: Languages, color: 'text-indigo-600', bg: 'bg-indigo-100' },
    { name: 'Notes & Ticket Mode', description: 'Different processing modes optimized for context retention.', icon: FileSpreadsheet, color: 'text-violet-600', bg: 'bg-violet-100' },
  ];

  return (
    <div className="flex-1 flex flex-col items-center justify-center py-12 animate-in fade-in duration-700">
      <div className="text-center max-w-3xl mb-12">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-blue-700 text-sm font-semibold mb-6">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-blue-500"></span>
          </span>
          Next-gen AI Scanner
        </div>
        <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 tracking-tight mb-6">
          Transform your documents <br className="hidden md:block"/> into <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">actionable data</span>
        </h1>
        <p className="text-xl text-gray-600 mb-10 leading-relaxed max-w-2xl mx-auto">
          Upload any image and let our advanced OCR and Translation engine extract, interpret, and digitize your physical notes instantly.
        </p>

        <Link to="/upload" className="group inline-flex items-center gap-3 bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-full text-lg font-semibold shadow-lg shadow-blue-600/20 hover:shadow-xl hover:shadow-blue-600/30 transition-all active:scale-95">
          <UploadCloud className="w-6 h-6" />
          Start Scanning
          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>

      <div className="grid md:grid-cols-3 gap-6 w-full max-w-5xl mt-12">
        {features.map((feature, i) => (
          <div key={i} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-5 ${feature.bg} ${feature.color}`}>
              <feature.icon className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">{feature.name}</h3>
            <p className="text-gray-600">{feature.description}</p>
          </div>
        ))}
        
      </div>
    </div>
  );
}
