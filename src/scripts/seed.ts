import { PrismaClient } from "../generated/prisma";

const prisma = new PrismaClient();

const sampleProducts = [
  {
    name: "iPhone 15 Pro",
    description: "Latest iPhone with advanced camera system and titanium design",
    price: 999.99,
    originalPrice: 1099.99,
    category: "Electronics",
    subcategory: "Smartphones",
    brand: "Apple",
    imageUrl: "https://images.pexels.com/photos/404280/pexels-photo-404280.jpeg",
    tags: ["smartphone", "premium", "camera"],
    features: ["A17 Pro chip", "Titanium design", "48MP camera", "120Hz display"],
    stockQuantity: 50,
    trending: true,
    trendingScore: 95,
    rating: 4.8,
    reviewCount: 1247
  },
  {
    name: "MacBook Air M3",
    description: "Lightweight laptop with M3 chip for incredible performance",
    price: 1299.99,
    category: "Electronics",
    subcategory: "Laptops",
    brand: "Apple",
    imageUrl: "https://images.pexels.com/photos/205421/pexels-photo-205421.jpeg",
    tags: ["laptop", "productivity", "portable"],
    features: ["M3 chip", "18-hour battery", "13.6-inch display", "2 Thunderbolt ports"],
    stockQuantity: 30,
    trending: true,
    trendingScore: 88,
    rating: 4.7,
    reviewCount: 892
  },
  {
    name: "Sony WH-1000XM5",
    description: "Industry-leading noise canceling wireless headphones",
    price: 349.99,
    originalPrice: 399.99,
    category: "Electronics",
    subcategory: "Audio",
    brand: "Sony",
    imageUrl: "https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg",
    tags: ["headphones", "wireless", "noise-canceling"],
    features: ["30-hour battery", "Quick charge", "Premium comfort", "Hi-Res Audio"],
    stockQuantity: 100,
    trending: true,
    trendingScore: 82,
    rating: 4.6,
    reviewCount: 2156
  },
  {
    name: "Nike Air Max 270",
    description: "Comfortable running shoes with Air Max technology",
    price: 149.99,
    category: "Clothing",
    subcategory: "Shoes",
    brand: "Nike",
    imageUrl: "https://images.pexels.com/photos/1598505/pexels-photo-1598505.jpeg",
    tags: ["shoes", "running", "comfort"],
    features: ["Air Max heel unit", "Mesh upper", "Durable rubber outsole", "Lightweight design"],
    stockQuantity: 200,
    trending: false,
    trendingScore: 65,
    rating: 4.4,
    reviewCount: 567
  },
  {
    name: "The Psychology of Money",
    description: "Timeless lessons on wealth, greed, and happiness",
    price: 16.99,
    category: "Books",
    subcategory: "Finance",
    brand: "Morgan Housel",
    imageUrl: "https://images.pexels.com/photos/159866/books-book-pages-read-literature-159866.jpeg",
    tags: ["finance", "psychology", "bestseller"],
    features: ["19 short stories", "Financial wisdom", "Behavioral economics", "Easy to read"],
    stockQuantity: 150,
    trending: true,
    trendingScore: 75,
    rating: 4.9,
    reviewCount: 3421
  },
  {
    name: "Instant Pot Duo 7-in-1",
    description: "Multi-use pressure cooker for quick and easy meals",
    price: 89.99,
    originalPrice: 119.99,
    category: "Kitchen & Dining",
    subcategory: "Appliances",
    brand: "Instant Pot",
    imageUrl: "https://images.pexels.com/photos/4057754/pexels-photo-4057754.jpeg",
    tags: ["kitchen", "cooking", "appliance"],
    features: ["7-in-1 functionality", "6-quart capacity", "Smart programming", "Safety features"],
    stockQuantity: 75,
    trending: false,
    trendingScore: 70,
    rating: 4.5,
    reviewCount: 1876
  },
  {
    name: "Yoga Mat Premium",
    description: "Non-slip yoga mat for all types of yoga practice",
    price: 39.99,
    category: "Sports Equipment",
    subcategory: "Fitness",
    brand: "YogaLife",
    imageUrl: "https://images.pexels.com/photos/3822166/pexels-photo-3822166.jpeg",
    tags: ["yoga", "fitness", "exercise"],
    features: ["Non-slip surface", "Extra thick padding", "Eco-friendly material", "Carrying strap"],
    stockQuantity: 120,
    trending: false,
    trendingScore: 55,
    rating: 4.3,
    reviewCount: 345
  },
  {
    name: "Smart Watch Series X",
    description: "Advanced fitness tracking with heart rate monitoring",
    price: 279.99,
    category: "Electronics",
    subcategory: "Wearables",
    brand: "TechWatch",
    imageUrl: "https://images.pexels.com/photos/393047/pexels-photo-393047.jpeg",
    tags: ["smartwatch", "fitness", "health"],
    features: ["GPS tracking", "Heart rate monitor", "Sleep tracking", "Water resistant"],
    stockQuantity: 80,
    trending: true,
    trendingScore: 78,
    rating: 4.2,
    reviewCount: 789
  }
];

const sampleCategories = [
  { name: "Electronics", slug: "electronics", description: "Latest tech gadgets and devices" },
  { name: "Clothing", slug: "clothing", description: "Fashion and apparel for all occasions" },
  { name: "Books", slug: "books", description: "Educational and entertainment reading materials" },
  { name: "Kitchen & Dining", slug: "kitchen-dining", description: "Cookware and dining essentials" },
  { name: "Sports Equipment", slug: "sports-equipment", description: "Gear for fitness and sports activities" },
  { name: "Home Decor", slug: "home-decor", description: "Beautiful items to decorate your home" },
  { name: "Beauty Products", slug: "beauty-products", description: "Skincare, makeup, and personal care" },
  { name: "Toys & Games", slug: "toys-games", description: "Fun activities for kids and adults" }
];

async function seed() {
  try {
    console.log("🌱 Starting database seed...");

    // Create categories
    console.log("📁 Creating categories...");
    for (const category of sampleCategories) {
      await prisma.category.upsert({
        where: { slug: category.slug },
        update: {},
        create: category
      });
    }

    // Create products
    console.log("🛍️ Creating products...");
    for (const product of sampleProducts) {
      const createdProduct = await prisma.product.upsert({
        where: { name: product.name },
        update: {},
        create: product
      });

      // Add some sample reviews
      const reviewTexts = [
        "Great product! Exactly what I was looking for.",
        "Good quality but could be better for the price.",
        "Excellent purchase, highly recommend!",
        "Works as expected, no complaints.",
        "Amazing quality and fast shipping!"
      ];

      for (let i = 0; i < 3; i++) {
        await prisma.productReview.create({
          data: {
            productId: createdProduct.id,
            source: "manual",
            rating: Math.floor(Math.random() * 2) + 4, // 4-5 stars
            title: `Review ${i + 1}`,
            content: reviewTexts[Math.floor(Math.random() * reviewTexts.length)],
            author: `Customer ${i + 1}`,
            verified: true,
            helpful: Math.floor(Math.random() * 20)
          }
        });
      }
    }

    // Create sample personas
    console.log("👤 Creating personas...");
    const personas = [
      {
        id: "tech-enthusiast",
        name: "Tech Enthusiast",
        description: "Loves the latest gadgets and technology",
        preferences: {
          categories: ["Electronics", "Gaming"],
          brands: ["Apple", "Samsung", "Sony"],
          priceRange: { min: 100, max: 2000 }
        },
        accessibilitySettings: {
          theme: "dark",
          fontSize: "medium",
          reducedMotion: false
        },
        demographicProfile: {
          ageRange: "25-35",
          income: "high",
          location: "urban"
        },
        shoppingBehavior: {
          frequency: "weekly",
          avgOrderValue: 500,
          preferredChannels: ["online"]
        },
        uiSettings: {
          theme: "dark",
          layout: "grid"
        }
      },
      {
        id: "accessibility-focused",
        name: "Accessibility Focused",
        description: "Prioritizes accessibility and inclusive design",
        preferences: {
          categories: ["Books", "Health & Beauty"],
          brands: [],
          priceRange: { min: 20, max: 200 }
        },
        accessibilitySettings: {
          theme: "high-contrast",
          fontSize: "large",
          reducedMotion: true,
          screenReader: true
        },
        demographicProfile: {
          ageRange: "45-65",
          income: "medium",
          location: "suburban"
        },
        shoppingBehavior: {
          frequency: "monthly",
          avgOrderValue: 75,
          preferredChannels: ["online", "phone"]
        },
        uiSettings: {
          theme: "high-contrast",
          layout: "list"
        }
      }
    ];

    for (const persona of personas) {
      await prisma.persona.upsert({
        where: { name: persona.name },
        update: {},
        create: persona
      });
    }

    console.log("✅ Database seeded successfully!");
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

seed().catch((error) => {
  console.error(error);
  process.exit(1);
});