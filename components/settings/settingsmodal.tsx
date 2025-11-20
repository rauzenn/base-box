'use client';

import { useState, useEffect } from 'react';
import { Settings, X, Sun, Moon, Globe, Info, MessageSquare } from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
  const [language, setLanguage] = useState<'en' | 'tr'>('en');

  // Load saved settings on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('basebox_theme') as 'light' | 'dark' | null;
    const savedLanguage = localStorage.getItem('basebox_language') as 'en' | 'tr' | null;
    
    if (savedTheme) setTheme(savedTheme);
    if (savedLanguage) setLanguage(savedLanguage);
  }, []);

  // Handle theme change
  const handleThemeChange = (newTheme: 'light' | 'dark') => {
    setTheme(newTheme);
    localStorage.setItem('basebox_theme', newTheme);
    
    // Apply theme to body
    if (newTheme === 'light') {
      document.body.classList.add('light-theme');
      document.body.classList.remove('dark-theme');
    } else {
      document.body.classList.add('dark-theme');
      document.body.classList.remove('light-theme');
    }
    
    console.log(`🎨 Theme changed to: ${newTheme}`);
  };

  // Handle language change
  const handleLanguageChange = (newLanguage: 'en' | 'tr') => {
    setLanguage(newLanguage);
    localStorage.setItem('basebox_language', newLanguage);
    console.log(`🌐 Language changed to: ${newLanguage}`);
    // TODO: Implement i18n translation system
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
          <h2 className="text-2xl font-black text-white">Settings</h2>
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

          {/* Language Section */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Globe className="w-5 h-5 text-blue-400" />
              <h3 className="text-white font-bold">Language</h3>
            </div>
            <div className="space-y-2">
              <button
                onClick={() => handleLanguageChange('en')}
                className={`w-full flex items-center justify-between p-4 rounded-xl transition-all ${
                  language === 'en'
                    ? 'bg-[#0052FF] border-2 border-[#0052FF]'
                    : 'bg-[#1A1F2E] border-2 border-[#0052FF]/20 hover:border-[#0052FF]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">🇺🇸</span>
                  <span className={`font-bold ${language === 'en' ? 'text-white' : 'text-gray-300'}`}>
                    English
                  </span>
                </div>
                {language === 'en' && (
                  <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center">
                    <div className="w-2 h-2 bg-[#0052FF] rounded-full" />
                  </div>
                )}
              </button>

              <button
                onClick={() => handleLanguageChange('tr')}
                className={`w-full flex items-center justify-between p-4 rounded-xl transition-all ${
                  language === 'tr'
                    ? 'bg-[#0052FF] border-2 border-[#0052FF]'
                    : 'bg-[#1A1F2E] border-2 border-[#0052FF]/20 hover:border-[#0052FF]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">🇹🇷</span>
                  <span className={`font-bold ${language === 'tr' ? 'text-white' : 'text-gray-300'}`}>
                    Türkçe
                  </span>
                </div>
                {language === 'tr' && (
                  <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center">
                    <div className="w-2 h-2 bg-[#0052FF] rounded-full" />
                  </div>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}