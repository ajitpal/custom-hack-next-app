"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useSession } from '@/lib/auth-client';

interface UserPersona {
  id: string;
  name: string;
  preferences: {
    categories: string[];
    priceRange: { min: number; max: number };
    brands: string[];
    accessibilityNeeds: string[];
    languagePreference: string;
  };
  uiSettings: {
    theme: 'light' | 'dark' | 'high-contrast';
    fontSize: 'small' | 'medium' | 'large';
    reducedMotion: boolean;
  };
  shoppingBehavior: {
    frequency: string;
    avgOrderValue: number;
    loyaltyTier: string;
  };
}

interface PersonaContextType {
  currentPersona: UserPersona | null;
  isLoading: boolean;
  updatePersona: (persona: Partial<UserPersona>) => void;
  switchPersona: (personaId: string) => void;
  availablePersonas: UserPersona[];
}

const PersonaContext = createContext<PersonaContextType | null>(null);

const defaultPersonas: UserPersona[] = [
  {
    id: 'tech-enthusiast',
    name: 'Tech Enthusiast',
    preferences: {
      categories: ['Electronics', 'Gaming', 'Computers'],
      priceRange: { min: 100, max: 2000 },
      brands: ['Apple', 'Samsung', 'Sony'],
      accessibilityNeeds: [],
      languagePreference: 'en'
    },
    uiSettings: {
      theme: 'dark',
      fontSize: 'medium',
      reducedMotion: false
    },
    shoppingBehavior: {
      frequency: 'weekly',
      avgOrderValue: 500,
      loyaltyTier: 'gold'
    }
  },
  {
    id: 'accessibility-focused',
    name: 'Accessibility Focused',
    preferences: {
      categories: ['Books', 'Health & Beauty', 'Home Decor'],
      priceRange: { min: 20, max: 200 },
      brands: [],
      accessibilityNeeds: ['High Contrast', 'Large Fonts', 'Screen Reader Support'],
      languagePreference: 'en'
    },
    uiSettings: {
      theme: 'high-contrast',
      fontSize: 'large',
      reducedMotion: true
    },
    shoppingBehavior: {
      frequency: 'monthly',
      avgOrderValue: 75,
      loyaltyTier: 'silver'
    }
  },
  {
    id: 'budget-conscious',
    name: 'Budget Conscious',
    preferences: {
      categories: ['Clothing', 'Books', 'Home & Garden'],
      priceRange: { min: 5, max: 100 },
      brands: [],
      accessibilityNeeds: [],
      languagePreference: 'en'
    },
    uiSettings: {
      theme: 'light',
      fontSize: 'medium',
      reducedMotion: false
    },
    shoppingBehavior: {
      frequency: 'occasionally',
      avgOrderValue: 45,
      loyaltyTier: 'bronze'
    }
  }
];

export function PersonaProvider({ children }: { children: ReactNode }) {
  const { data: session } = useSession();
  const [currentPersona, setCurrentPersona] = useState<UserPersona | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [availablePersonas] = useState<UserPersona[]>(defaultPersonas);

  useEffect(() => {
    if (session?.user) {
      fetchUserPersona();
    } else {
      setCurrentPersona(defaultPersonas[0]);
      setIsLoading(false);
    }
  }, [session]);

  const fetchUserPersona = async () => {
    try {
      const response = await fetch('/api/user/profile');
      if (response.ok) {
        const data = await response.json();
        const userPersona = mapUserDataToPersona(data.user);
        setCurrentPersona(userPersona);
      } else {
        setCurrentPersona(defaultPersonas[0]);
      }
    } catch (error) {
      console.error('Error fetching user persona:', error);
      setCurrentPersona(defaultPersonas[0]);
    } finally {
      setIsLoading(false);
    }
  };

  const mapUserDataToPersona = (userData: any): UserPersona => {
    return {
      id: userData.id,
      name: userData.name || 'User',
      preferences: {
        categories: userData.preferences?.[0]?.categoryInterests || [],
        priceRange: {
          min: userData.preferences?.[0]?.priceRangeMin || 0,
          max: userData.preferences?.[0]?.priceRangeMax || 1000
        },
        brands: userData.preferences?.[0]?.brandPreferences || [],
        accessibilityNeeds: userData.accessibilityNeeds || [],
        languagePreference: userData.languagePreference || 'en'
      },
      uiSettings: {
        theme: userData.accessibilityNeeds?.includes('High Contrast') ? 'high-contrast' : 'light',
        fontSize: userData.accessibilityNeeds?.includes('Large Fonts') ? 'large' : 'medium',
        reducedMotion: userData.accessibilityNeeds?.includes('Reduced Motion') || false
      },
      shoppingBehavior: {
        frequency: userData.preferences?.[0]?.shoppingHabits?.frequency || 'monthly',
        avgOrderValue: userData.totalSpent || 0,
        loyaltyTier: userData.loyaltyTier || 'bronze'
      }
    };
  };

  const updatePersona = (personaUpdate: Partial<UserPersona>) => {
    if (currentPersona) {
      setCurrentPersona({ ...currentPersona, ...personaUpdate });
    }
  };

  const switchPersona = (personaId: string) => {
    const persona = availablePersonas.find(p => p.id === personaId);
    if (persona) {
      setCurrentPersona(persona);
    }
  };

  return (
    <PersonaContext.Provider value={{
      currentPersona,
      isLoading,
      updatePersona,
      switchPersona,
      availablePersonas
    }}>
      {children}
    </PersonaContext.Provider>
  );
}

export const usePersona = () => {
  const context = useContext(PersonaContext);
  if (!context) {
    throw new Error('usePersona must be used within a PersonaProvider');
  }
  return context;
};