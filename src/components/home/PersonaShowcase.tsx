"use client";

import { usePersona } from "@/contexts/PersonaContext";
import { cn } from "@/lib/utils";
import { User, Eye, Globe, Zap, Shield, Heart } from "lucide-react";

export default function PersonaShowcase() {
  const { currentPersona, switchPersona, availablePersonas } = usePersona();
  
  const theme = currentPersona?.uiSettings.theme || 'light';
  const fontSize = currentPersona?.uiSettings.fontSize || 'medium';

  const getPersonaIcon = (personaId: string) => {
    switch (personaId) {
      case 'tech-enthusiast': return Zap;
      case 'accessibility-focused': return Eye;
      case 'budget-conscious': return Heart;
      default: return User;
    }
  };

  const getPersonaColor = (personaId: string) => {
    switch (personaId) {
      case 'tech-enthusiast': return 'text-blue-600';
      case 'accessibility-focused': return 'text-green-600';
      case 'budget-conscious': return 'text-purple-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <section className={cn(
      "py-16 px-4",
      theme === 'dark' && "bg-gray-900",
      theme === 'high-contrast' && "bg-white"
    )}>
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className={cn(
            "font-bold text-gray-900 mb-4",
            fontSize === 'small' && "text-2xl",
            fontSize === 'medium' && "text-3xl",
            fontSize === 'large' && "text-4xl",
            theme === 'high-contrast' && "text-black",
            theme === 'dark' && "text-white"
          )}>
            Experience Personalized Shopping
          </h2>
          <p className={cn(
            "text-gray-600 max-w-3xl mx-auto",
            fontSize === 'small' && "text-base",
            fontSize === 'medium' && "text-lg",
            fontSize === 'large' && "text-xl",
            theme === 'dark' && "text-gray-300"
          )}>
            See how our AI adapts to different user types. Try switching between personas 
            to experience how the interface, recommendations, and pricing change.
          </p>
        </div>

        {/* Current Persona Display */}
        <div className={cn(
          "bg-white rounded-lg border p-8 mb-8",
          theme === 'high-contrast' && "border-black border-2",
          theme === 'dark' && "bg-gray-800 border-gray-700"
        )}>
          {currentPersona && (
            <div className="text-center">
              <div className={cn(
                "inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4",
                fontSize === 'large' && "w-20 h-20"
              )}>
                {(() => {
                  const Icon = getPersonaIcon(currentPersona.id);
                  return <Icon className={cn(
                    "w-8 h-8 text-primary",
                    fontSize === 'large' && "w-10 h-10"
                  )} />;
                })()}
              </div>
              
              <h3 className={cn(
                "font-bold text-gray-900 mb-2",
                fontSize === 'small' && "text-lg",
                fontSize === 'medium' && "text-xl",
                fontSize === 'large' && "text-2xl",
                theme === 'high-contrast' && "text-black",
                theme === 'dark' && "text-white"
              )}>
                Current Experience: {currentPersona.name}
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
                <div className="text-center">
                  <Globe className={cn(
                    "w-6 h-6 text-primary mx-auto mb-2",
                    fontSize === 'large' && "w-8 h-8"
                  )} />
                  <h4 className={cn(
                    "font-semibold text-gray-900 mb-1",
                    fontSize === 'large' && "text-lg",
                    theme === 'dark' && "text-white"
                  )}>
                    Language
                  </h4>
                  <p className={cn(
                    "text-gray-600 text-sm",
                    fontSize === 'large' && "text-base",
                    theme === 'dark' && "text-gray-300"
                  )}>
                    {currentPersona.preferences.languagePreference.toUpperCase()}
                  </p>
                </div>

                <div className="text-center">
                  <Shield className={cn(
                    "w-6 h-6 text-primary mx-auto mb-2",
                    fontSize === 'large' && "w-8 h-8"
                  )} />
                  <h4 className={cn(
                    "font-semibold text-gray-900 mb-1",
                    fontSize === 'large' && "text-lg",
                    theme === 'dark' && "text-white"
                  )}>
                    Loyalty Tier
                  </h4>
                  <p className={cn(
                    "text-gray-600 text-sm capitalize",
                    fontSize === 'large' && "text-base",
                    theme === 'dark' && "text-gray-300"
                  )}>
                    {currentPersona.shoppingBehavior.loyaltyTier}
                  </p>
                </div>

                <div className="text-center">
                  <Eye className={cn(
                    "w-6 h-6 text-primary mx-auto mb-2",
                    fontSize === 'large' && "w-8 h-8"
                  )} />
                  <h4 className={cn(
                    "font-semibold text-gray-900 mb-1",
                    fontSize === 'large' && "text-lg",
                    theme === 'dark' && "text-white"
                  )}>
                    Accessibility
                  </h4>
                  <p className={cn(
                    "text-gray-600 text-sm",
                    fontSize === 'large' && "text-base",
                    theme === 'dark' && "text-gray-300"
                  )}>
                    {currentPersona.preferences.accessibilityNeeds.length > 0 
                      ? `${currentPersona.preferences.accessibilityNeeds.length} active`
                      : "Standard"}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Persona Switcher */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {availablePersonas.map((persona) => {
            const Icon = getPersonaIcon(persona.id);
            const isActive = currentPersona?.id === persona.id;
            
            return (
              <button
                key={persona.id}
                onClick={() => switchPersona(persona.id)}
                className={cn(
                  "p-6 border rounded-lg transition-all duration-200 text-left",
                  isActive 
                    ? "border-primary bg-primary/5 shadow-lg scale-105" 
                    : "border-gray-300 hover:border-primary/50 hover:bg-gray-50",
                  theme === 'high-contrast' && "border-2",
                  theme === 'high-contrast' && isActive && "border-primary",
                  theme === 'dark' && !isActive && "border-gray-600 hover:border-primary/50 hover:bg-gray-700",
                  theme === 'dark' && isActive && "bg-primary/10 border-primary"
                )}
              >
                <div className={cn(
                  "flex items-center gap-3 mb-3",
                  fontSize === 'large' && "gap-4"
                )}>
                  <Icon className={cn(
                    "w-6 h-6",
                    getPersonaColor(persona.id),
                    fontSize === 'large' && "w-8 h-8"
                  )} />
                  <h3 className={cn(
                    "font-semibold text-gray-900",
                    fontSize === 'large' && "text-lg",
                    theme === 'dark' && "text-white"
                  )}>
                    {persona.name}
                  </h3>
                </div>
                
                <div className="space-y-2">
                  <p className={cn(
                    "text-sm text-gray-600",
                    fontSize === 'large' && "text-base",
                    theme === 'dark' && "text-gray-300"
                  )}>
                    <strong>Interests:</strong> {persona.preferences.categories.slice(0, 2).join(', ')}
                  </p>
                  <p className={cn(
                    "text-sm text-gray-600",
                    fontSize === 'large' && "text-base",
                    theme === 'dark' && "text-gray-300"
                  )}>
                    <strong>Budget:</strong> ${persona.preferences.priceRange.min} - ${persona.preferences.priceRange.max}
                  </p>
                  <p className={cn(
                    "text-sm text-gray-600",
                    fontSize === 'large' && "text-base",
                    theme === 'dark' && "text-gray-300"
                  )}>
                    <strong>Shopping:</strong> {persona.shoppingBehavior.frequency}
                  </p>
                </div>

                {isActive && (
                  <div className="mt-3 px-3 py-1 bg-primary text-white rounded-full text-xs font-medium inline-block">
                    Active
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}