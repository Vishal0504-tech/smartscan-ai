import { Loader2 } from 'lucide-react';

export default function Loader({ message = "Processing your image..." }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 animate-in fade-in duration-500">
      <div className="relative">
        <div className="absolute inset-0 rounded-full blur-xl bg-blue-500/20 animate-pulse"></div>
        <Loader2 className="w-16 h-16 text-blue-600 animate-spin relative z-10" />
      </div>
      <h3 className="mt-8 text-xl font-semibold text-gray-800 tracking-tight">
        {message}
      </h3>
      <div className="w-64 h-1.5 bg-gray-100 rounded-full mt-6 overflow-hidden">
        <div className="h-full bg-blue-600 rounded-full animate-[progress_2s_ease-in-out_infinite]" style={{ width: '50%', transformOrigin: 'left' }}></div>
      </div>
      <p className="text-sm text-gray-500 mt-3 animate-pulse">This might take a few seconds</p>
      
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes progress {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(200%); }
        }
      `}} />
    </div>
  );
}
