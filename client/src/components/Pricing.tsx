import { Check } from "lucide-react";

interface PricingPlan {
  name: string;
  price: string;
  description: string;
  features: string[];
  popular?: boolean;
}

export default function Pricing() {
  const plans: PricingPlan[] = [
    {
      name: "Basic",
      price: "$0",
      description: "Perfect for professionals just getting started",
      features: [
        "LinkedIn profile import",
        "Basic AI content generation",
        "3 website templates",
        "Profiler subdomain (yourname.profiler.com)"
      ]
    },
    {
      name: "Professional",
      price: "$9",
      description: "Everything you need for a professional online presence",
      features: [
        "All Basic features",
        "Advanced AI content enhancement",
        "10 premium templates",
        "Custom domain connection",
        "Advanced theme customization"
      ],
      popular: true
    },
    {
      name: "Enterprise",
      price: "$29",
      description: "Advanced features for serious professionals",
      features: [
        "All Professional features",
        "Premium AI content generation",
        "All templates (20+)",
        "Multiple website profiles",
        "Advanced analytics"
      ]
    }
  ];

  const handleNavLinkClick = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="pricing" className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="lg:text-center">
          <h2 className="text-base text-primary font-semibold tracking-wide uppercase">Pricing</h2>
          <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
            Simple, transparent pricing
          </p>
          <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
            Choose the plan that's right for your professional needs
          </p>
        </div>

        <div className="mt-12 space-y-12 lg:space-y-0 lg:grid lg:grid-cols-3 lg:gap-x-8">
          {plans.map((plan, index) => (
            <div 
              key={index} 
              className={`border ${plan.popular ? 'border-primary' : 'border-gray-200'} rounded-lg shadow-sm p-8 relative flex flex-col`}
            >
              {plan.popular && (
                <div className="absolute top-0 right-0 -mr-px -mt-px rounded-tr-lg rounded-bl-lg bg-primary px-4 py-1">
                  <p className="text-xs font-medium text-white">Most Popular</p>
                </div>
              )}

              <div className="flex-1">
                <h3 className="text-xl font-semibold text-gray-900">{plan.name}</h3>
                <p className="mt-4 flex items-baseline text-gray-900">
                  <span className="text-5xl font-extrabold tracking-tight">{plan.price}</span>
                  <span className="ml-1 text-xl font-semibold">/month</span>
                </p>
                <p className="mt-6 text-gray-500">{plan.description}</p>

                <ul className="mt-6 space-y-4">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex">
                      <Check className="flex-shrink-0 h-6 w-6 text-green-500" />
                      <span className="ml-3 text-gray-500">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              <a
                href="#waitlist"
                onClick={(e) => {
                  e.preventDefault();
                  handleNavLinkClick('waitlist');
                }}
                className="mt-8 block w-full bg-primary py-3 px-6 border border-transparent rounded-md text-center font-medium text-white hover:bg-blue-700"
              >
                Join Waitlist
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
