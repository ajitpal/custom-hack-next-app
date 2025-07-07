"use client";

import { useState } from "react";
import { useSession } from "@/lib/auth-client";

interface OnboardingFormProps {
  onComplete: () => void;
}

interface OnboardingData {
  interests: string[];
  accessibilityNeeds: string[];
  languagePreference: string;
  priceRange: { min: number; max: number };
  shoppingFrequency: string;
  preferredCategories: string[];
}

const INTERESTS = [
  "Technology", "Fashion", "Sports", "Books", "Home & Garden", 
  "Health & Beauty", "Automotive", "Travel", "Food & Drink", "Gaming"
];

const ACCESSIBILITY_OPTIONS = [
  "High Contrast", "Large Fonts", "Screen Reader Support", 
  "Keyboard Navigation", "Reduced Motion", "Voice Commands"
];

const CATEGORIES = [
  "Electronics", "Clothing", "Books", "Home Decor", "Sports Equipment",
  "Beauty Products", "Automotive", "Travel Gear", "Kitchen & Dining", "Toys & Games"
];

const LANGUAGES = [
  { code: "en", name: "English" },
  { code: "es", name: "Español" },
  { code: "fr", name: "Français" },
  { code: "de", name: "Deutsch" }
];

export default function OnboardingForm({ onComplete }: OnboardingFormProps) {
  const { data: session } = useSession();
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState<OnboardingData>({
    interests: [],
    accessibilityNeeds: [],
    languagePreference: "en",
    priceRange: { min: 0, max: 1000 },
    shoppingFrequency: "monthly",
    preferredCategories: []
  });

  const handleInterestToggle = (interest: string) => {
    setData(prev => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter(i => i !== interest)
        : [...prev.interests, interest]
    }));
  };

  const handleAccessibilityToggle = (need: string) => {
    setData(prev => ({
      ...prev,
      accessibilityNeeds: prev.accessibilityNeeds.includes(need)
        ? prev.accessibilityNeeds.filter(n => n !== need)
        : [...prev.accessibilityNeeds, need]
    }));
  };

  const handleCategoryToggle = (category: string) => {
    setData(prev => ({
      ...prev,
      preferredCategories: prev.preferredCategories.includes(category)
        ? prev.preferredCategories.filter(c => c !== category)
        : [...prev.preferredCategories, category]
    }));
  };

  const saveOnboardingData = async () => {
    if (!session?.user?.id) return;

    setIsLoading(true);
    try {
      const response = await fetch("/api/user/onboarding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: session.user.id,
          ...data
        })
      });

      if (response.ok) {
        onComplete();
      } else {
        console.error("Failed to save onboarding data");
      }
    } catch (error) {
      console.error("Error saving onboarding data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const nextStep = () => setStep(prev => prev + 1);
  const prevStep = () => setStep(prev => prev - 1);

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <span className="text-sm text-gray-600">Step {step} of 4</span>
          <div className="w-full max-w-xs bg-gray-200 rounded-full h-2 ml-4">
            <div 
              className="bg-primary h-2 rounded-full transition-all duration-300"
              style={{ width: `${(step / 4) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {step === 1 && (
        <div className="space-y-6">
          <h2 className="text-2xl font-bold">What are your interests?</h2>
          <p className="text-gray-600">Select all that apply to help us personalize your experience.</p>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {INTERESTS.map(interest => (
              <button
                key={interest}
                onClick={() => handleInterestToggle(interest)}
                className={`p-3 rounded-lg border text-sm font-medium transition-colors ${
                  data.interests.includes(interest)
                    ? "bg-primary text-white border-primary"
                    : "bg-white text-gray-700 border-gray-300 hover:border-primary"
                }`}
              >
                {interest}
              </button>
            ))}
          </div>

          <div className="flex justify-end">
            <button
              onClick={nextStep}
              disabled={data.interests.length === 0}
              className="px-6 py-2 bg-primary text-white rounded-md hover:bg-primary/80 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-6">
          <h2 className="text-2xl font-bold">Accessibility Preferences</h2>
          <p className="text-gray-600">Help us make your shopping experience more comfortable.</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {ACCESSIBILITY_OPTIONS.map(option => (
              <button
                key={option}
                onClick={() => handleAccessibilityToggle(option)}
                className={`p-3 rounded-lg border text-sm font-medium transition-colors text-left ${
                  data.accessibilityNeeds.includes(option)
                    ? "bg-primary text-white border-primary"
                    : "bg-white text-gray-700 border-gray-300 hover:border-primary"
                }`}
              >
                {option}
              </button>
            ))}
          </div>

          <div className="space-y-4">
            <label className="block">
              <span className="text-sm font-medium text-gray-700">Preferred Language</span>
              <select
                value={data.languagePreference}
                onChange={(e) => setData(prev => ({ ...prev, languagePreference: e.target.value }))}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-primary focus:outline-none"
              >
                {LANGUAGES.map(lang => (
                  <option key={lang.code} value={lang.code}>{lang.name}</option>
                ))}
              </select>
            </label>
          </div>

          <div className="flex justify-between">
            <button
              onClick={prevStep}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
            >
              Back
            </button>
            <button
              onClick={nextStep}
              className="px-6 py-2 bg-primary text-white rounded-md hover:bg-primary/80"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="space-y-6">
          <h2 className="text-2xl font-bold">Shopping Preferences</h2>
          <p className="text-gray-600">Tell us about your shopping habits and preferences.</p>
          
          <div className="space-y-4">
            <label className="block">
              <span className="text-sm font-medium text-gray-700">Typical Budget Range (USD)</span>
              <div className="mt-1 grid grid-cols-2 gap-4">
                <input
                  type="number"
                  placeholder="Min"
                  value={data.priceRange.min}
                  onChange={(e) => setData(prev => ({ 
                    ...prev, 
                    priceRange: { ...prev.priceRange, min: parseInt(e.target.value) || 0 }
                  }))}
                  className="block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-primary focus:outline-none"
                />
                <input
                  type="number"
                  placeholder="Max"
                  value={data.priceRange.max}
                  onChange={(e) => setData(prev => ({ 
                    ...prev, 
                    priceRange: { ...prev.priceRange, max: parseInt(e.target.value) || 1000 }
                  }))}
                  className="block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-primary focus:outline-none"
                />
              </div>
            </label>

            <label className="block">
              <span className="text-sm font-medium text-gray-700">How often do you shop online?</span>
              <select
                value={data.shoppingFrequency}
                onChange={(e) => setData(prev => ({ ...prev, shoppingFrequency: e.target.value }))}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-primary focus:outline-none"
              >
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
                <option value="occasionally">Occasionally</option>
                <option value="rarely">Rarely</option>
              </select>
            </label>
          </div>

          <div className="flex justify-between">
            <button
              onClick={prevStep}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
            >
              Back
            </button>
            <button
              onClick={nextStep}
              className="px-6 py-2 bg-primary text-white rounded-md hover:bg-primary/80"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {step === 4 && (
        <div className="space-y-6">
          <h2 className="text-2xl font-bold">Preferred Categories</h2>
          <p className="text-gray-600">Select the categories you're most interested in shopping for.</p>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {CATEGORIES.map(category => (
              <button
                key={category}
                onClick={() => handleCategoryToggle(category)}
                className={`p-3 rounded-lg border text-sm font-medium transition-colors ${
                  data.preferredCategories.includes(category)
                    ? "bg-primary text-white border-primary"
                    : "bg-white text-gray-700 border-gray-300 hover:border-primary"
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          <div className="flex justify-between">
            <button
              onClick={prevStep}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
            >
              Back
            </button>
            <button
              onClick={saveOnboardingData}
              disabled={isLoading || data.preferredCategories.length === 0}
              className="px-6 py-2 bg-primary text-white rounded-md hover:bg-primary/80 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Saving..." : "Complete Setup"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}