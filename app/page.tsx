import { Navbar } from "@/components/landing/Navbar";
import { Hero } from "@/components/landing/Hero";
import { AgentsShowcase } from "@/components/landing/AgentsShowcase";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { StandardsSection } from "@/components/landing/StandardsSection";
import { CTASection } from "@/components/landing/CTASection";
import { Footer } from "@/components/landing/Footer";

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main>
        <Hero />
        <AgentsShowcase />
        <HowItWorks />
        <StandardsSection />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
}
