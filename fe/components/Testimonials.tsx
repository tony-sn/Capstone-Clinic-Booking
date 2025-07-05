"use client";

import { ChevronLeft, ChevronRight, Star } from "lucide-react";
import { useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useInView } from "@/hooks/use-in-view";
import { cn } from "@/lib/utils";


const testimonials = [
  {
    quote:
      "Lightning-fast lab results and a physician-led review gave me clarity on my cholesterol and inflammation markers within 24 hours. Now I’m on a personalized plan that actually works.",
    author: "Laura S.",
    title: "Wellness Seeker",
    rating: 5,
  },
  {
    quote:
      "After weeks of nagging back pain, the on-site MRI pinpointed the injury immediately. The tailored treatment plan and pharmacist-approved medications had me back at the gym in no time.",
    author: "Jason M.",
    title: "Fitness Enthusiast",
    rating: 5,
  },
  {
    quote:
      "Routine blood work flagged my prediabetes early. With the clinic’s lifestyle program and monthly follow-ups, I’ve reversed my blood sugar trends and feel more in control than ever.",
    author: "Priya R.",
    title: "Project Manager",
    rating: 5,
  },
  {
    quote:
      "As a busy CEO, efficiency is everything. From blood draw to radiology to my doctor consult, the seamless one-stop experience saved me weeks of appointments—and gave me answers fast.",
    author: "David K.",
    title: "CEO",
    rating: 4,
  },
  {
    quote:
      "Their holistic monitoring dashboard tracks every health metric. The pharmacist’s supplement optimizations and monthly check-ins have boosted my energy and kept me on track.",
    author: "Emily T.",
    title: "Entrepreneur",
    rating: 5,
  },
]

const Testimonials = () => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px 0px" });
  const [activeIndex, setActiveIndex] = useState(0);

  const next = () => {
    setActiveIndex((prev) => (prev === testimonials.length - 3 ? 0 : prev + 1));
  };

  const prev = () => {
    setActiveIndex((prev) => (prev === 0 ? testimonials.length - 3 : prev - 1));
  };

  return (
    <section id="testimonials" className="bg-background py-20">
      <div className="container mx-auto px-4">
        <div className="mx-auto mb-16 max-w-3xl text-center">
          <h2 className="font-sans text-3xl font-medium text-gray-900 dark:text-white md:text-4xl">
            What Our Patients Say
          </h2>
          <p className="mt-4 text-muted-foreground">
            Real experiences from people who have benefited from our treatments
          </p>
        </div>

        <div ref={ref} className="relative">
          <div
            className={cn(
              "transition-all duration-700",
              isInView ? "opacity-100" : "opacity-0",
            )}
          >
            <div className="mb-8 hidden gap-6 lg:flex">
              {testimonials
                .slice(activeIndex, activeIndex + 3)
                .map((testimonial, index) => (
                  <TestimonialCard
                    key={index}
                    testimonial={testimonial}
                    delay={index * 150}
                    isInView={isInView}
                  />
                ))}
            </div>

            <div className="lg:hidden">
              <TestimonialCard
                testimonial={testimonials[activeIndex]}
                delay={0}
                isInView={isInView}
              />
            </div>

            <div className="mt-8 flex justify-center gap-4">
              <Button
                variant="outline"
                size="icon"
                onClick={prev}
                className="rounded-full"
              >
                <ChevronLeft className="size-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={next}
                className="rounded-full"
              >
                <ChevronRight className="size-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

interface TestimonialCardProps {
  testimonial: {
    quote: string;
    author: string;
    title: string;
    rating: number;
  };
  delay: number;
  isInView: boolean;
}

const TestimonialCard = ({
  testimonial,
  delay,
  isInView,
}: TestimonialCardProps) => {
  return (
    <Card
      className={cn(
        "transition-all duration-700 transform",
        isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12",
      )}
      style={{
        transitionDelay: isInView ? `${delay}ms` : "0ms",
      }}
    >
      <CardContent className="p-6">
        <div className="mb-4 flex">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              className={cn(
                "h-4 w-4",
                i < testimonial.rating
                  ? "text-yellow-500 fill-yellow-500"
                  : "text-gray-300",
              )}
            />
          ))}
        </div>
        <p className="mb-4 text-gray-700 dark:text-gray-300">
          &quot;{testimonial.quote}&quot;
        </p>
        <div>
          <p className="font-medium text-gray-900 dark:text-white">
            {testimonial.author}
          </p>
          <p className="text-sm text-muted-foreground">{testimonial.title}</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default Testimonials;
