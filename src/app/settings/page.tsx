"use client";

import { useState, useEffect } from "react";
import { useSession } from "@/lib/auth-client";
import { usePersona } from "@/contexts/PersonaContext";
import { cn } from "@/lib/utils";
import { 
  User, 
  Bell, 
  Eye, 
  Globe, 
  Palette, 
  Shield,
  Save,
  ArrowLeft
} from "lucide-react";
import Link from "next/link";

export default function SettingsPage() {
  const { data: session } = useSession();
  const { currentPersona, updatePersona } = usePersona();
  const [isLoading, setIsLoading] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  
  const [settings, setSettings] = useState({
    name: session?.user?.name || "",
    email: session?.user?.email || "",
    languagePreference: currentPersona?.preferences.languagePreference || "en",
    theme: currentPersona?.uiSettings.theme || "light",
    fontSize: currentPersona?.uiSettings.fontSize || "medium",
    accessibilityNeeds: currentPersona?.preferences.accessibilityNeeds || [],
    notifications: {
      email: true,
      push: false,
      sms: false
    }
  });

  const theme = currentPersona?.uiSettings.theme || 'light';
  const fontSize = currentPersona?.uiSettings.fontSize || 'medium';

  const handleSave = async () => {
    setIsLoading(true);
    try {
      // Update persona
      updatePersona({
        preferences: {
          ...currentPersona?.preferences,
          languagePreference: settings.languagePreference,
          accessibilityNeeds: settings.accessibilityNeeds
        },
        uiSettings: {
          ...currentPersona?.uiSettings,
          theme: settings.theme as 'light' | 'dark' | 'high-contrast',
          fontSize: settings.fontSize as 'small' | 'medium' | 'large'
        }
      });

      // Update user profile via API
      const response = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user: {
            name: settings.name,
            languagePreference: settings.languagePreference,
            accessibilityNeeds: settings.accessibilityNeeds
          }
        })
      });

      if (response.ok) {
        setIsSaved(true);
        setTimeout(() => setIsSaved(false), 3000);
      }
    } catch (error) {
      console.error('Error saving settings:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleAccessibilityNeed = (need: string) => {
    setSettings(prev => ({
      ...prev,
      accessibilityNeeds: prev.accessibilityNeeds.includes(need)
        ? prev.accessibilityNeeds.filter(n => n !== need)
        : [...prev.accessibilityNeeds, need]
    }));
  };

  if (!session?.user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Please log in to access settings</h1>
          <Link 
            href="/auth/login" 
            className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90"
          >
            Log In
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className={cn(
      "min-h-screen p-4",
      theme === 'dark' && "bg-gray-900",
      theme === 'high-contrast' && "bg-white"
    )}>
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Link
            href="/dashboard"
            className={cn(
              "p-2 border border-gray-300 rounded-lg hover:bg-gray-50",
              theme === 'dark' && "border-gray-600 hover:bg-gray-700"
            )}
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          
          <div>
            <h1 className={cn(
              "text-3xl font-bold text-gray-900",
              fontSize === 'large' && "text-4xl",
              theme === 'high-contrast' && "text-black",
              theme === 'dark' && "text-white"
            )}>
              Settings
            </h1>
            <p className={cn(
              "text-gray-600 mt-2",
              fontSize === 'large' && "text-lg",
              theme === 'dark' && "text-gray-300"
            )}>
              Customize your shopping experience
            </p>
          </div>
        </div>

        {/* Settings Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Profile Settings */}
          <div className={cn(
            "bg-white rounded-lg border p-6",
            theme === 'high-contrast' && "border-black border-2",
            theme === 'dark' && "bg-gray-800 border-gray-700"
          )}>
            <div className="flex items-center gap-3 mb-6">
              <User className="w-6 h-6 text-primary" />
              <h2 className={cn(
                "text-xl font-bold",
                theme === 'dark' && "text-white"
              )}>
                Profile
              </h2>
            </div>

            <div className="space-y-4">
              <div>
                <label className={cn(
                  "block text-sm font-medium text-gray-700 mb-1",
                  theme === 'dark' && "text-gray-300"
                )}>
                  Name
                </label>
                <input
                  type="text"
                  value={settings.name}
                  onChange={(e) => setSettings(prev => ({ ...prev, name: e.target.value }))}
                  className={cn(
                    "w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary",
                    theme === 'dark' && "bg-gray-700 border-gray-600 text-white"
                  )}
                />
              </div>

              <div>
                <label className={cn(
                  "block text-sm font-medium text-gray-700 mb-1",
                  theme === 'dark' && "text-gray-300"
                )}>
                  Email
                </label>
                <input
                  type="email"
                  value={settings.email}
                  disabled
                  className={cn(
                    "w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-500",
                    theme === 'dark' && "bg-gray-700 border-gray-600 text-gray-400"
                  )}
                />
              </div>
            </div>
          </div>

          {/* Appearance Settings */}
          <div className={cn(
            "bg-white rounded-lg border p-6",
            theme === 'high-contrast' && "border-black border-2",
            theme === 'dark' && "bg-gray-800 border-gray-700"
          )}>
            <div className="flex items-center gap-3 mb-6">
              <Palette className="w-6 h-6 text-primary" />
              <h2 className={cn(
                "text-xl font-bold",
                theme === 'dark' && "text-white"
              )}>
                Appearance
              </h2>
            </div>

            <div className="space-y-4">
              <div>
                <label className={cn(
                  "block text-sm font-medium text-gray-700 mb-1",
                  theme === 'dark' && "text-gray-300"
                )}>
                  Theme
                </label>
                <select
                  value={settings.theme}
                  onChange={(e) => setSettings(prev => ({ ...prev, theme: e.target.value }))}
                  className={cn(
                    "w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary",
                    theme === 'dark' && "bg-gray-700 border-gray-600 text-white"
                  )}
                >
                  <option value="light">Light</option>
                  <option value="dark">Dark</option>
                  <option value="high-contrast">High Contrast</option>
                </select>
              </div>

              <div>
                <label className={cn(
                  "block text-sm font-medium text-gray-700 mb-1",
                  theme === 'dark' && "text-gray-300"
                )}>
                  Font Size
                </label>
                <select
                  value={settings.fontSize}
                  onChange={(e) => setSettings(prev => ({ ...prev, fontSize: e.target.value }))}
                  className={cn(
                    "w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary",
                    theme === 'dark' && "bg-gray-700 border-gray-600 text-white"
                  )}
                >
                  <option value="small">Small</option>
                  <option value="medium">Medium</option>
                  <option value="large">Large</option>
                </select>
              </div>

              <div>
                <label className={cn(
                  "block text-sm font-medium text-gray-700 mb-1",
                  theme === 'dark' && "text-gray-300"
                )}>
                  Language
                </label>
                <select
                  value={settings.languagePreference}
                  onChange={(e) => setSettings(prev => ({ ...prev, languagePreference: e.target.value }))}
                  className={cn(
                    "w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary",
                    theme === 'dark' && "bg-gray-700 border-gray-600 text-white"
                  )}
                >
                  <option value="en">English</option>
                  <option value="es">Español</option>
                  <option value="fr">Français</option>
                  <option value="de">Deutsch</option>
                </select>
              </div>
            </div>
          </div>

          {/* Accessibility Settings */}
          <div className={cn(
            "bg-white rounded-lg border p-6",
            theme === 'high-contrast' && "border-black border-2",
            theme === 'dark' && "bg-gray-800 border-gray-700"
          )}>
            <div className="flex items-center gap-3 mb-6">
              <Eye className="w-6 h-6 text-primary" />
              <h2 className={cn(
                "text-xl font-bold",
                theme === 'dark' && "text-white"
              )}>
                Accessibility
              </h2>
            </div>

            <div className="space-y-3">
              {[
                "High Contrast",
                "Large Fonts", 
                "Screen Reader Support",
                "Keyboard Navigation",
                "Reduced Motion",
                "Voice Commands"
              ].map((need) => (
                <label key={need} className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.accessibilityNeeds.includes(need)}
                    onChange={() => toggleAccessibilityNeed(need)}
                    className="w-4 h-4 text-primary focus:ring-primary border-gray-300 rounded"
                  />
                  <span className={cn(
                    "text-sm",
                    theme === 'dark' && "text-white"
                  )}>
                    {need}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Notification Settings */}
          <div className={cn(
            "bg-white rounded-lg border p-6",
            theme === 'high-contrast' && "border-black border-2",
            theme === 'dark' && "bg-gray-800 border-gray-700"
          )}>
            <div className="flex items-center gap-3 mb-6">
              <Bell className="w-6 h-6 text-primary" />
              <h2 className={cn(
                "text-xl font-bold",
                theme === 'dark' && "text-white"
              )}>
                Notifications
              </h2>
            </div>

            <div className="space-y-3">
              {Object.entries(settings.notifications).map(([type, enabled]) => (
                <label key={type} className="flex items-center justify-between">
                  <span className={cn(
                    "text-sm capitalize",
                    theme === 'dark' && "text-white"
                  )}>
                    {type} notifications
                  </span>
                  <input
                    type="checkbox"
                    checked={enabled}
                    onChange={(e) => setSettings(prev => ({
                      ...prev,
                      notifications: {
                        ...prev.notifications,
                        [type]: e.target.checked
                      }
                    }))}
                    className="w-4 h-4 text-primary focus:ring-primary border-gray-300 rounded"
                  />
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <button
            onClick={handleSave}
            disabled={isLoading}
            className={cn(
              "flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 disabled:opacity-50",
              fontSize === 'large' && "px-8 py-4 text-lg"
            )}
          >
            <Save className="w-5 h-5" />
            {isLoading ? "Saving..." : isSaved ? "Saved!" : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
}