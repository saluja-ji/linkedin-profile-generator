interface Template {
  image: string;
  title: string;
  description: string;
}

export default function Templates() {
  const templates: Template[] = [
    {
      image: "https://images.unsplash.com/photo-1561070791-2526d30994b5?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      title: "Modern Portfolio",
      description: "Perfect for creatives and designers"
    },
    {
      image: "https://images.unsplash.com/photo-1606857521015-7f9fcf423740?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      title: "Corporate Professional",
      description: "Ideal for executives and managers"
    },
    {
      image: "https://images.unsplash.com/photo-1563986768609-322da13575f3?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      title: "Tech Innovator",
      description: "For developers and tech professionals"
    }
  ];

  const handleNavLinkClick = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="templates" className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="lg:text-center">
          <h2 className="text-base text-primary font-semibold tracking-wide uppercase">Templates</h2>
          <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
            Professional templates for every industry
          </p>
          <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
            Choose the perfect design to showcase your professional identity
          </p>
        </div>

        <div className="mt-12 grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {templates.map((template, index) => (
            <div key={index} className="group relative rounded-lg overflow-hidden shadow-lg bg-white hover:shadow-xl transition-shadow duration-300">
              <div className="aspect-w-16 aspect-h-9 bg-gray-200">
                <img src={template.image} alt={template.title} className="w-full h-64 object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end">
                  <div className="p-4 text-white">
                    <h3 className="text-lg font-bold">{template.title}</h3>
                    <p className="text-sm opacity-80">{template.description}</p>
                  </div>
                </div>
              </div>
              <div className="absolute inset-0 bg-primary bg-opacity-90 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <button className="bg-white text-primary font-medium py-2 px-4 rounded-md hover:bg-gray-100 transition">
                  Preview Template
                </button>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-10 text-center">
          <a
            href="#waitlist"
            onClick={(e) => {
              e.preventDefault();
              handleNavLinkClick('waitlist');
            }}
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-primary hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
          >
            See All Templates
          </a>
        </div>
      </div>
    </section>
  );
}
