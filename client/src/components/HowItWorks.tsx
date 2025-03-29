export default function HowItWorks() {
  const steps = [
    {
      number: 1,
      title: "Connect LinkedIn",
      description: "Add your LinkedIn profile URL and let us extract your professional experience, skills, and achievements."
    },
    {
      number: 2,
      title: "Customize Template",
      description: "Choose your preferred template, adjust AI-generated content, and personalize colors, fonts, and layout."
    },
    {
      number: 3,
      title: "Publish & Share",
      description: "Publish your website with one click, get your own subdomain, and share your professional presence with the world."
    }
  ];

  return (
    <section id="how-it-works" className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="lg:text-center">
          <h2 className="text-base text-primary font-semibold tracking-wide uppercase">Process</h2>
          <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
            How It Works
          </p>
          <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
            Three simple steps to create your professional website
          </p>
        </div>

        <div className="mt-10">
          <div className="relative">
            <div className="absolute inset-0 flex items-center" aria-hidden="true">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center">
              <span className="px-3 bg-gray-50 text-lg font-medium text-gray-900">
                Your journey from LinkedIn to website
              </span>
            </div>
          </div>

          <div className="mt-12 max-w-lg mx-auto grid gap-8 lg:grid-cols-3 lg:max-w-none">
            {steps.map((step) => (
              <div key={step.number} className="flex flex-col rounded-lg shadow-lg overflow-hidden">
                <div className="flex-shrink-0 bg-primary h-2"></div>
                <div className="flex-1 bg-white p-6 flex flex-col justify-between">
                  <div className="flex-1">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 rounded-full bg-primary flex items-center justify-center text-white font-bold">
                        {step.number}
                      </div>
                      <h3 className="ml-3 text-xl font-semibold text-gray-900">{step.title}</h3>
                    </div>
                    <p className="mt-3 text-base text-gray-500">
                      {step.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
