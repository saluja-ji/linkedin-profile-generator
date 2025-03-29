import { Zap, BookOpenCheck, LayoutTemplate, Globe } from "lucide-react";

interface FeatureItem {
  icon: React.ReactNode;
  title: string;
  description: string;
}

export default function Features() {
  const features: FeatureItem[] = [
    {
      icon: <Zap className="h-6 w-6" />,
      title: "LinkedIn Integration",
      description: "Import your professional experience, skills, and accomplishments directly from your LinkedIn profile with a single click."
    },
    {
      icon: <BookOpenCheck className="h-6 w-6" />,
      title: "AI Content Enhancement",
      description: "Our AI analyzes your experience and generates professional copy tailored to your industry and career goals."
    },
    {
      icon: <LayoutTemplate className="h-6 w-6" />,
      title: "Professional Templates",
      description: "Choose from dozens of industry-specific templates designed to highlight your skills and experience effectively."
    },
    {
      icon: <Globe className="h-6 w-6" />,
      title: "Custom Domain",
      description: "Get your own personalized subdomain or connect your existing domain for a truly professional online presence."
    }
  ];

  return (
    <section id="features" className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="lg:text-center">
          <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
            Everything you need to showcase your professional identity
          </p>
          <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
            One platform. Multiple templates. Endless possibilities.
          </p>
        </div>

        <div className="mt-10">
          <dl className="space-y-10 md:space-y-0 md:grid md:grid-cols-2 md:gap-x-8 md:gap-y-10">
            {features.map((feature, index) => (
              <div key={index} className="relative">
                <dt>
                  <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-primary text-white">
                    {feature.icon}
                  </div>
                  <p className="ml-16 text-lg leading-6 font-medium text-gray-900">{feature.title}</p>
                </dt>
                <dd className="mt-2 ml-16 text-base text-gray-500">
                  {feature.description}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
