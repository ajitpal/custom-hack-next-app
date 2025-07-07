import Hero from "@/components/home/Hero";
import FeaturedProducts from "@/components/home/FeaturedProducts";
import PersonaShowcase from "@/components/home/PersonaShowcase";

export default async function Home() {
  return (
    <div className="min-h-screen">
      <Hero />
      <FeaturedProducts />
      <PersonaShowcase />
    </div>
  );
}
