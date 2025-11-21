'use client';

import { useState, useEffect } from 'react';
import { Settings, X, Sun, Moon, Info, MessageSquare } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
  const { theme, setTheme } = useTheme();
  const [saved, setSaved] = useState<string | null>(null);

  // Handle theme change
  const handleThemeChange = (newTheme: 'light' | 'dark') => {
    setTheme(newTheme);
    
    // Show saved feedback
    setSaved('Theme');
    setTimeout(() => setSaved(null), 2000);
    
    console.log(`🎨 Theme changed to: ${newTheme}`);
  };

  // Handle language change
  const handleLanguageChange = (newLanguage: 'en' | 'tr') => {
    // Language system removed - English only
    console.log(`🌐 Language: English (${newLanguage} requested)`);
  };

  // Handle feedback
  const handleFeedback = () => {
    window.open('https://github.com/rauzenn/base-box/issues/new', '_blank');
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-md mx-4 bg-[#0A0E14] border-2 border-[#0052FF]/30 rounded-3xl overflow-hidden shadow-2xl shadow-[#0052FF]/20 slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 w-10 h-10 flex items-center justify-center rounded-full bg-[#1A1F2E] hover:bg-[#0052FF]/20 border-2 border-[#0052FF]/20 hover:border-[#0052FF] transition-all z-10"
        >
          <X className="w-5 h-5 text-gray-400" />
        </button>

        {/* Header */}
        <div className="bg-gradient-to-r from-[#0052FF]/10 to-purple-500/10 border-b-2 border-gray-800 p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-black text-white">Settings</h2>
            {saved && (
              <div className="flex items-center gap-2 px-3 py-1.5 bg-green-500/20 border border-green-500/30 rounded-lg animate-fade-in">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                <span className="text-xs font-bold text-green-400">{saved} Saved!</span>
              </div>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Theme Section */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Sun className="w-5 h-5 text-orange-400" />
              <h3 className="text-white font-bold">Theme</h3>
            </div>
            <div className="space-y-2">
              <button
                onClick={() => handleThemeChange('light')}
                className={`w-full flex items-center justify-between p-4 rounded-xl transition-all ${
                  theme === 'light'
                    ? 'bg-[#0052FF] border-2 border-[#0052FF]'
                    : 'bg-[#1A1F2E] border-2 border-[#0052FF]/20 hover:border-[#0052FF]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Sun className={`w-5 h-5 ${theme === 'light' ? 'text-white' : 'text-gray-400'}`} />
                  <span className={`font-bold ${theme === 'light' ? 'text-white' : 'text-gray-300'}`}>
                    Light
                  </span>
                </div>
                {theme === 'light' && (
                  <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center">
                    <div className="w-2 h-2 bg-[#0052FF] rounded-full" />
                  </div>
                )}
              </button>

              <button
                onClick={() => handleThemeChange('dark')}
                className={`w-full flex items-center justify-between p-4 rounded-xl transition-all ${
                  theme === 'dark'
                    ? 'bg-[#0052FF] border-2 border-[#0052FF]'
                    : 'bg-[#1A1F2E] border-2 border-[#0052FF]/20 hover:border-[#0052FF]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Moon className={`w-5 h-5 ${theme === 'dark' ? 'text-white' : 'text-gray-400'}`} />
                  <span className={`font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-300'}`}>
                    Dark
                  </span>
                </div>
                {theme === 'dark' && (
                  <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center">
                    <div className="w-2 h-2 bg-[#0052FF] rounded-full" />
                  </div>
                )}
              </button>
            </div>
          </div>

          {/* About Section */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Info className="w-5 h-5 text-cyan-400" />
              <h3 className="text-white font-bold">About</h3>
            </div>
            <button className="w-full flex items-center justify-between p-4 bg-[#1A1F2E] border-2 border-[#0052FF]/20 hover:border-[#0052FF] rounded-xl transition-all">
              <span className="text-gray-300 font-medium">About</span>
              <span className="text-xs text-gray-500">v1.0.0</span>
            </button>
          </div>

          {/* Feedback Section */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <MessageSquare className="w-5 h-5 text-green-400" />
              <h3 className="text-white font-bold">Feedback</h3>
            </div>
            <button 
              onClick={handleFeedback}
              className="w-full flex items-center justify-between p-4 bg-[#1A1F2E] border-2 border-[#0052FF]/20 hover:border-[#0052FF] rounded-xl transition-all group"
            >
              <span className="text-gray-300 group-hover:text-white font-medium">Send Feedback</span>
              <span className="text-xs text-gray-500">→</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}