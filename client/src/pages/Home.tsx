import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Features from "@/components/Features";
import HowItWorks from "@/components/HowItWorks";
import Templates from "@/components/Templates";
import Testimonials from "@/components/Testimonials";
import Pricing from "@/components/Pricing";
import WaitlistForm from "@/components/WaitlistForm";
import Footer from "@/components/Footer";
import { useState } from "react";
import SuccessModal from "@/components/SuccessModal";

export default function Home() {
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const handleWaitlistSuccess = () => {
    setShowSuccessModal(true);
  };

  const closeSuccessModal = () => {
    setShowSuccessModal(false);
  };

  return (
    <div className="min-h-screen font-sans bg-gray-50 text-gray-900">
      <Navbar />
      <Hero />
      <Features />
      <HowItWorks />
      <Templates />
      <Testimonials />
      <Pricing />
      <section id="waitlist" className="py-16 bg-gray-50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="pt-10 pb-12 px-6 sm:px-16">
              <div className="text-center">
                <h2 className="text-3xl font-extrabold text-gray-900">
                  Join our waitlist
                </h2>
                <p className="mt-4 text-lg text-gray-600">
                  Be among the first to create your AI-powered professional website
                </p>
              </div>
              <WaitlistForm onSuccess={handleWaitlistSuccess} />
            </div>
          </div>
        </div>
      </section>
      <Footer />
      
      {showSuccessModal && <SuccessModal onClose={closeSuccessModal} />}
    </div>
  );
}
