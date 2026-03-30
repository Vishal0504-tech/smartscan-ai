import { Link } from 'react-router-dom';
import { ScanSearch, Settings, History } from 'lucide-react';

export default function Navbar() {
  return (
    <nav className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2 group">
              <div className="bg-blue-600 text-white p-2 rounded-xl group-hover:scale-105 transition-transform shadow-sm">
                <ScanSearch className="h-5 w-5" />
              </div>
              <span className="font-extrabold text-xl bg-clip-text text-transparent bg-gradient-to-r from-blue-700 to-indigo-600 tracking-tight">
                SmartScan AI
              </span>
            </Link>
          </div>
          <div className="flex items-center space-x-6">
            <Link to="/history" className="text-gray-500 hover:text-blue-600 transition-colors flex items-center gap-1.5 font-medium">
              <History size={18} strokeWidth={2.5} /> <span className="hidden sm:inline">History</span>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
