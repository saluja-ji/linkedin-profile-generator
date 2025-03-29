import { Star } from "lucide-react";

interface Testimonial {
  avatar: string;
  name: string;
  profession: string;
  content: string;
  stars: number;
}

export default function Testimonials() {
  const testimonials: Testimonial[] = [
    {
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
      name: "Sarah Johnson",
      profession: "UX Designer",
      content: "\"The AI content generation saved me hours of writing. My portfolio site looks professional and has already helped me land client meetings.\"",
      stars: 5
    },
    {
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
      name: "David Chen",
      profession: "Full Stack Developer",
      content: "\"From LinkedIn to a complete developer portfolio in under 10 minutes. The tech template perfectly highlights my projects and skills.\"",
      stars: 5
    },
    {
      avatar: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
      name: "Emily Rodriguez",
      profession: "Marketing Consultant",
      content: "\"Having my own professional website has completely changed my consulting business. The professional template was exactly what I needed to showcase my services.\"",
      stars: 5
    }
  ];

  return (
    <section id="testimonials" className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="lg:text-center">
          <h2 className="text-base text-primary font-semibold tracking-wide uppercase">Testimonials</h2>
          <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
            What professionals are saying
          </p>
        </div>

        <div className="mt-12 grid gap-8 md:grid-cols-3 sm:grid-cols-2 grid-cols-1">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="bg-white rounded-lg shadow-lg p-6">
              <div className="flex items-center mb-4">
                <img className="h-12 w-12 rounded-full" src={testimonial.avatar} alt={`${testimonial.name} avatar`} />
                <div className="ml-4">
                  <h4 className="text-lg font-semibold">{testimonial.name}</h4>
                  <p className="text-gray-600">{testimonial.profession}</p>
                </div>
              </div>
              <div className="text-gray-700">
                <p className="mb-2">{testimonial.content}</p>
                <div className="flex text-yellow-400">
                  {[...Array(testimonial.stars)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 fill-current" />
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
