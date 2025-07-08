"use client";

import { useRef } from "react";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useInView } from "@/hooks/use-in-view";
import { cn } from "@/lib/utils";

const faqs = [
  {
    question: "What diagnostic services do you offer?",
    answer:
      "We provide a full suite of in-house diagnostics: comprehensive blood panels, urine tests, X-ray, MRI and ultrasound imaging, plus ECG and other specialized labs.",
  },
  {
    question: "How should I prepare for my lab tests?",
    answer:
      "Most blood panels require 8–12 hours fasting (water only), stay well-hydrated, and avoid alcohol or strenuous exercise for 24 hours prior. Specific prep instructions will be emailed when you book.",
  },
  {
    question: "How long until I get my results?",
    answer:
      "Standard blood and urine results are available within 24 hours, imaging reports (X-ray/MRI) within 48 hours. You’ll get a notification via our secure patient portal as soon as each is ready.",
  },
  {
    question: "Are your imaging procedures safe?",
    answer:
      "Yes. Our X-ray units use low-dose radiation and are operated by certified radiographers, while our MRI machines are FDA-approved and monitored by board-certified radiologists throughout every scan.",
  },
  {
    question: "Do you accept insurance or offer self-pay options?",
    answer:
      "We direct-bill most major private insurers and work with HICAPS for on-the-spot claims. If you’re self-funding, we’ll provide a detailed invoice for your records and rebates.",
  },
  {
    question: "How are medications handled?",
    answer:
      "Our clinical pharmacists review your test and imaging results, counsel you on any prescribed therapies, and dispense all medications on-site—complete with clear dosing and interaction guidance.",
  },
  {
    question: "How can I access my records and schedule follow-ups?",
    answer:
      "All your reports, prescriptions, and care plans are available 24/7 in our secure online portal. You can book in-clinic or telehealth follow-ups directly through the same system.",
  },
];

const Faq = () => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px 0px" });

  return (
    <section id="faq" className="bg-background py-20">
      <div className="container mx-auto px-4">
        <div className="mx-auto mb-16 max-w-3xl text-center">
          <h2 className="font-playfair text-3xl font-medium text-gray-900 dark:text-white md:text-4xl">
            Frequently Asked Questions
          </h2>
          <p className="mt-4 text-muted-foreground">
            Find answers to common questions about leech therapy and our
            treatment approach
          </p>
        </div>

        <div
          ref={ref}
          className={cn(
            "max-w-3xl mx-auto transition-all duration-700",
            isInView ? "opacity-100" : "opacity-0"
          )}
        >
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className={cn(
                  "transition-all duration-700 transform border-b",
                  isInView
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-8"
                )}
                style={{
                  transitionDelay: isInView ? `${index * 100}ms` : "0ms",
                }}
              >
                <AccordionTrigger className="text-left text-lg font-medium">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
};

export default Faq;
