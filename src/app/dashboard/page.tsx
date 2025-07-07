"use client";

import { useState, useEffect } from "react";
import { useSession } from "@/lib/auth-client";
import { usePersona } from "@/contexts/PersonaContext";
import ProductGrid from "@/components/ecommerce/ProductGrid";
import { 
  ShoppingBag, 
  Heart, 
  TrendingUp, 
  Clock,
  DollarSign,
  Star,
  User,
  Settings
} from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";

interface ActivityItem {
  id: string;
  actionType: string;
  timestamp: string;
  product?: {
    id: string;
    name: string;
    category: string;
    price: number;
    imageUrl?: string;
  };
}

interface DashboardStats {
  totalOrders: number;
  totalSpent: number;
  wishlistItems: number;
  loyaltyPoints: number;
}

export default function DashboardPage() {
  const { data: session } = useSession();
  const { currentPersona, switchPersona, availablePersonas } = usePersona();
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [stats, setStats] = useState<DashboardStats>({
    totalOrders: 0,
    totalSpent: 0,
    wishlistItems: 0,
    loyaltyPoints: 0
  });
  const [isLoading, setIsLoading] = useState(true);

  const theme = currentPersona?.uiSettings.theme || 'light';
  const fontSize = currentPersona?.uiSettings.fontSize || 'medium';

  useEffect(() => {
    if (session?.user) {
      fetchDashboardData();
    }
  }, [session]);

  const fetchDashboardData = async () => {
    try {
      const [activitiesResponse, profileResponse] = await Promise.all([
        fetch('/api/user/activity?limit=10'),
        fetch('/api/user/profile')
      ]);

      if (activitiesResponse.ok) {
        const activitiesData = await activitiesResponse.json();
        setActivities(activitiesData.activities);
      }

      if (profileResponse.ok) {
        const profileData = await profileResponse.json();
        setStats({
          totalOrders: 12, // Mock data
          totalSpent: profileData.user.totalSpent || 0,
          wishlistItems: 8, // Mock data
          loyaltyPoints: 1250 // Mock data
        });
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getActionIcon = (actionType: string) => {
    switch (actionType) {
      case 'view': return <Clock className="w-4 h-4" />;
      case 'add_to_cart': return <ShoppingBag className="w-4 h-4" />;
      case 'purchase': return <DollarSign className="w-4 h-4" />;
      case 'wishlist': return <Heart className="w-4 h-4" />;
      default: return <TrendingUp className="w-4 h-4" />;
    }
  };

  const formatActionType = (actionType: string) => {
    return actionType.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  if (!session?.user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Please log in to view your dashboard</h1>
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
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className={cn(
              "text-3xl font-bold text-gray-900",
              fontSize === 'large' && "text-4xl",
              theme === 'high-contrast' && "text-black",
              theme === 'dark' && "text-white"
            )}>
              Welcome back, {session.user.name || session.user.email}!
            </h1>
            <p className={cn(
              "text-gray-600 mt-2",
              fontSize === 'large' && "text-lg",
              theme === 'dark' && "text-gray-300"
            )}>
              {currentPersona?.shoppingBehavior.loyaltyTier.charAt(0).toUpperCase() + 
               currentPersona?.shoppingBehavior.loyaltyTier.slice(1)} Member
            </p>
          </div>

          {/* Persona Switcher */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <User className="w-5 h-5 text-gray-600" />
              <select
                value={currentPersona?.id || ''}
                onChange={(e) => switchPersona(e.target.value)}
                className={cn(
                  "border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary",
                  theme === 'dark' && "bg-gray-700 border-gray-600 text-white"
                )}
              >
                {availablePersonas.map((persona) => (
                  <option key={persona.id} value={persona.id}>
                    {persona.name}
                  </option>
                ))}
              </select>
            </div>
            
            <Link 
              href="/settings"
              className={cn(
                "p-2 border border-gray-300 rounded-lg hover:bg-gray-50",
                theme === 'dark' && "border-gray-600 hover:bg-gray-700"
              )}
            >
              <Settings className="w-5 h-5" />
            </Link>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { 
              label: "Total Orders", 
              value: stats.totalOrders, 
              icon: ShoppingBag, 
              color: "text-blue-600" 
            },
            { 
              label: "Total Spent", 
              value: `$${stats.totalSpent.toFixed(2)}`, 
              icon: DollarSign, 
              color: "text-green-600" 
            },
            { 
              label: "Wishlist Items", 
              value: stats.wishlistItems, 
              icon: Heart, 
              color: "text-red-600" 
            },
            { 
              label: "Loyalty Points", 
              value: stats.loyaltyPoints, 
              icon: Star, 
              color: "text-yellow-600" 
            }
          ].map((stat, index) => (
            <div 
              key={index}
              className={cn(
                "bg-white p-6 rounded-lg border shadow-sm",
                theme === 'high-contrast' && "border-black border-2",
                theme === 'dark' && "bg-gray-800 border-gray-700"
              )}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className={cn(
                    "text-sm text-gray-600",
                    fontSize === 'large' && "text-base",
                    theme === 'dark' && "text-gray-300"
                  )}>
                    {stat.label}
                  </p>
                  <p className={cn(
                    "text-2xl font-bold text-gray-900",
                    fontSize === 'large' && "text-3xl",
                    theme === 'high-contrast' && "text-black",
                    theme === 'dark' && "text-white"
                  )}>
                    {stat.value}
                  </p>
                </div>
                <stat.icon className={cn("w-8 h-8", stat.color)} />
              </div>
            </div>
          ))}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recommendations */}
          <div className="lg:col-span-2">
            <div className={cn(
              "bg-white rounded-lg border p-6",
              theme === 'high-contrast' && "border-black border-2",
              theme === 'dark' && "bg-gray-800 border-gray-700"
            )}>
              <h2 className={cn(
                "text-xl font-bold text-gray-900 mb-6",
                fontSize === 'large' && "text-2xl",
                theme === 'high-contrast' && "text-black",
                theme === 'dark' && "text-white"
              )}>
                Recommended for You
              </h2>
              <ProductGrid showRecommendations />
            </div>
          </div>

          {/* Recent Activity */}
          <div className={cn(
            "bg-white rounded-lg border p-6",
            theme === 'high-contrast' && "border-black border-2",
            theme === 'dark' && "bg-gray-800 border-gray-700"
          )}>
            <h2 className={cn(
              "text-xl font-bold text-gray-900 mb-6",
              fontSize === 'large' && "text-2xl",
              theme === 'high-contrast' && "text-black",
              theme === 'dark' && "text-white"
            )}>
              Recent Activity
            </h2>

            {isLoading ? (
              <div className="space-y-4">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="animate-pulse">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-gray-200 rounded"></div>
                      <div className="flex-1 space-y-1">
                        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                        <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {activities.map((activity) => (
                  <div 
                    key={activity.id} 
                    className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className={cn(
                      "p-2 rounded-full bg-gray-100",
                      theme === 'dark' && "bg-gray-700"
                    )}>
                      {getActionIcon(activity.actionType)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={cn(
                        "text-sm font-medium text-gray-900",
                        fontSize === 'large' && "text-base",
                        theme === 'dark' && "text-white"
                      )}>
                        {formatActionType(activity.actionType)}
                      </p>
                      {activity.product && (
                        <p className={cn(
                          "text-sm text-gray-600 truncate",
                          theme === 'dark' && "text-gray-300"
                        )}>
                          {activity.product.name}
                        </p>
                      )}
                      <p className={cn(
                        "text-xs text-gray-500",
                        theme === 'dark' && "text-gray-400"
                      )}>
                        {new Date(activity.timestamp).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
                
                {activities.length === 0 && (
                  <p className={cn(
                    "text-gray-500 text-center py-8",
                    theme === 'dark' && "text-gray-400"
                  )}>
                    No recent activity
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}