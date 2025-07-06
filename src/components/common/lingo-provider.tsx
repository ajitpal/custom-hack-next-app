"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import dictionary from '@/lingo/dictionary.js';

type Locale = 'en' | 'es' | 'fr' | 'de';

interface LingoContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: string, values?: Record<string, string>) => string;
}

const LingoContext = createContext<LingoContextType | null>(null);

export function LingoProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>('en');

  // Load locale from cookie on mount
  useEffect(() => {
    const cookies = document.cookie.split(';');
    const localeCookie = cookies.find(cookie => 
      cookie.trim().startsWith('lingo-locale=')
    );
    
    if (localeCookie) {
      const savedLocale = localeCookie.split('=')[1]?.trim() as Locale;
      if (['en', 'es', 'fr', 'de'].includes(savedLocale)) {
        setLocaleState(savedLocale);
      }
    }
  }, []);

  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale);
    // Save to cookie
    document.cookie = `lingo-locale=${newLocale}; path=/; max-age=${365 * 24 * 60 * 60}`;
  };

  const t = (key: string, values?: Record<string, string>): string => {
    try {
      // Navigate through the dictionary structure to find the translation
      const keys = key.split('.');
      let current: any = dictionary.files;
      
      // For now, we'll use a simplified approach and look for the key in the dictionary
      // This is a fallback implementation for WebContainer compatibility
      
      // Search through all files and entries to find a matching hash or content
      for (const [filePath, fileData] of Object.entries(dictionary.files)) {
        for (const [entryKey, entryData] of Object.entries((fileData as any).entries)) {
          if (entryKey.includes(key) || key.includes(entryKey)) {
            const content = (entryData as any).content?.[locale] || (entryData as any).content?.en;
            if (content) {
              // Replace any template variables
              let result = content;
              if (values) {
                Object.entries(values).forEach(([k, v]) => {
                  result = result.replace(new RegExp(`\\{${k}\\}`, 'g'), v);
                });
              }
              // Clean up any remaining element tags for now
              return result.replace(/<element:[^>]+>/g, '').replace(/<\/element:[^>]+>/g, '');
            }
          }
        }
      }
      
      // If no translation found, return the key
      return key;
    } catch (error) {
      console.warn(`Translation error for key "${key}":`, error);
      return key;
    }
  };

  return (
    <LingoContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </LingoContext.Provider>
  );
}

export function useLingo() {
  const context = useContext(LingoContext);
  if (!context) {
    throw new Error('useLingo must be used within a LingoProvider');
  }
  return context;
}

// Export a simple translation function for non-hook usage
export function useTranslation() {
  return useLingo();
}