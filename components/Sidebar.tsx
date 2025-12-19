import React from 'react';
import { Layers, ShoppingBag, BarChart3, Mail, MonitorSmartphone, PackageCheck, X, BookOpen, CheckCircle2, Circle } from 'lucide-react';
import { MILESTONES } from '../constants';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  completedMilestones: string[];
  onToggleMilestone: (id: string) => void;
  onOpenGlossary: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ 
  isOpen, 
  onClose, 
  completedMilestones, 
  onToggleMilestone,
  onOpenGlossary 
}) => {
  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/40 z-20 md:hidden backdrop-blur-sm"
          onClick={onClose}
        />
      )}

      {/* Sidebar Content */}
      <aside 
        className={`fixed top-0 left-0 bottom-0 w-80 bg-white border-r border-slate-200 z-30 transform transition-transform duration-300 ease-in-out overflow-y-auto
          ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 md:static md:w-72 lg:w-80 shadow-xl md:shadow-none flex flex-col`}
      >
        <div className="p-6 border-b border-slate-100 flex justify-between items-center">
          <div className="flex items-center gap-3">
             <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold text-lg shadow-md">
                M
             </div>
             <div>
                <h1 className="font-bold text-slate-800 text-lg leading-tight">E-Com Mentor</h1>
                <p className="text-xs text-slate-500">Strategy 2025</p>
             </div>
          </div>
          <button onClick={onClose} className="md:hidden text-slate-400 hover:text-slate-600">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 space-y-8 flex-1">
          
          {/* Progress Section */}
          <div>
             <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
              <CheckCircle2 className="w-3 h-3" /> Your Journey
            </h2>
            <div className="space-y-2">
              {MILESTONES.map((milestone) => {
                const isCompleted = completedMilestones.includes(milestone.id);
                return (
                  <button
                    key={milestone.id}
                    onClick={() => onToggleMilestone(milestone.id)}
                    className={`w-full flex items-start gap-3 p-3 rounded-xl transition-all duration-200 border text-left
                      ${isCompleted 
                        ? 'bg-emerald-50 border-emerald-100' 
                        : 'bg-white border-slate-100 hover:border-indigo-200 hover:shadow-sm'}`}
                  >
                    <div className={`mt-0.5 flex-shrink-0 transition-colors ${isCompleted ? 'text-emerald-500' : 'text-slate-300'}`}>
                      {isCompleted ? <CheckCircle2 className="w-5 h-5 fill-emerald-100" /> : <Circle className="w-5 h-5" />}
                    </div>
                    <div>
                      <span className={`text-sm font-medium transition-colors ${isCompleted ? 'text-emerald-800' : 'text-slate-600'}`}>
                        {milestone.label}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
            
            {/* Progress Bar */}
            <div className="mt-4 flex items-center gap-2">
              <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-emerald-400 to-emerald-500 transition-all duration-500"
                  style={{ width: `${(completedMilestones.length / MILESTONES.length) * 100}%` }}
                />
              </div>
              <span className="text-xs font-medium text-slate-400">
                {Math.round((completedMilestones.length / MILESTONES.length) * 100)}%
              </span>
            </div>
          </div>

          {/* Tech Stack */}
          <div>
            <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
              <Layers className="w-3 h-3" /> Tech Stack
            </h2>
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-50 transition-colors">
                <div className="p-2 bg-green-100 text-green-700 rounded-md"><ShoppingBag className="w-4 h-4"/></div>
                <div>
                  <div className="font-semibold text-sm text-slate-700">Shopify</div>
                  <div className="text-xs text-slate-500">Store Platform</div>
                </div>
              </div>
              <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-50 transition-colors">
                <div className="p-2 bg-purple-100 text-purple-700 rounded-md"><PackageCheck className="w-4 h-4"/></div>
                <div>
                  <div className="font-semibold text-sm text-slate-700">Zendrop</div>
                  <div className="text-xs text-slate-500">Fulfillment</div>
                </div>
              </div>
              <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-50 transition-colors">
                <div className="p-2 bg-blue-100 text-blue-700 rounded-md"><Mail className="w-4 h-4"/></div>
                <div>
                  <div className="font-semibold text-sm text-slate-700">Omnisend</div>
                  <div className="text-xs text-slate-500">Email Marketing</div>
                </div>
              </div>
              <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-50 transition-colors">
                <div className="p-2 bg-orange-100 text-orange-700 rounded-md"><MonitorSmartphone className="w-4 h-4"/></div>
                <div>
                  <div className="font-semibold text-sm text-slate-700">PageFly</div>
                  <div className="text-xs text-slate-500">Landing Pages</div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Resources Button */}
          <div>
             <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
              <BookOpen className="w-3 h-3" /> Resources
            </h2>
            <button 
              onClick={onOpenGlossary}
              className="w-full flex items-center justify-between p-3 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 hover:border-indigo-300 transition-all shadow-sm group"
            >
              <span className="text-sm font-semibold text-slate-700 group-hover:text-indigo-700">View Glossary</span>
              <BookOpen className="w-4 h-4 text-slate-400 group-hover:text-indigo-500" />
            </button>
          </div>

        </div>
        
        <div className="mt-auto p-6 bg-slate-50 border-t border-slate-200">
          <div className="bg-indigo-50 p-3 rounded-lg border border-indigo-100">
             <p className="text-xs text-indigo-800 font-medium">
               "Start with short-form organic content to test before spending on ads."
             </p>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;