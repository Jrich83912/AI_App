import React from 'react';
import { X, Book } from 'lucide-react';
import { GLOSSARY_TERMS } from '../constants';

interface GlossaryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const GlossaryModal: React.FC<GlossaryModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[80vh] flex flex-col overflow-hidden animate-scale-up">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-100 bg-slate-50">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-100 text-indigo-600 rounded-lg">
              <Book className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-800">E-Com Glossary</h2>
              <p className="text-sm text-slate-500">Key terms for the Rabin Strategy</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-200 rounded-full transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto p-6 space-y-6">
          {GLOSSARY_TERMS.map((item, index) => (
            <div key={index} className="group">
              <h3 className="font-bold text-indigo-700 text-lg mb-1 flex items-center gap-2">
                {item.term}
              </h3>
              <p className="text-slate-600 leading-relaxed pl-4 border-l-2 border-slate-200 group-hover:border-indigo-300 transition-colors">
                {item.definition}
              </p>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 text-center text-xs text-slate-400">
          Defined for the Austin Rabin 2025 Strategy
        </div>
      </div>
    </div>
  );
};

export default GlossaryModal;