"use client";

import Image from "next/image";
import { useRef } from "react";

import { useInView } from "@/hooks/use-in-view";
import { cn } from "@/lib/utils";

const steps = [
  {
    number: "01",
    title: "Initial Consultation",
    description:
      "Our physicians review your medical history, perform a physical exam, and determine which diagnostic tests (lab work, imaging) are needed.",
  },
  {
    number: "02",
    title: "Laboratory Testing",
    description:
      "We draw blood, urine, and other samples in-house. State-of-the-art labs analyze biomarkers, hormones, and panels to pinpoint underlying issues.",
  },
  {
    number: "03",
    title: "Imaging Diagnostics",
    description:
      "If indicated, we perform X-rays or MRI scans on-site. Our radiologists interpret images to identify structural or soft-tissue concerns.",
  },
  {
    number: "04",
    title: "Pharmacist Review & Medication Dispensation",
    description:
      "Our clinical pharmacists review your test and imaging results, counsel you on prescribed therapies, and dispense medications with clear usage instructions.",
  },
  {
    number: "05",
    title: "Treatment Implementation & Follow-Up",
    description:
      "We implement your personalized care plan—medications, referrals, lifestyle guidance—and schedule follow-ups to monitor progress and adjust as needed.",
  },
];

const Process = () => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px 0px" });

  return (
    <section id="process" className="bg-gray-50 py-20 dark:bg-gray-950">
      <div className="container mx-auto px-4">
        <div className="mx-auto mb-16 max-w-3xl text-center">
          <h2 className="font-sans text-3xl font-medium text-gray-900 dark:text-white md:text-4xl">
            Our Treatment Process
          </h2>
          <p className="mt-4 text-muted-foreground">
            Experience our carefully developed therapeutic protocol, designed
            for maximum efficacy and comfort
          </p>
        </div>

        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div className="relative aspect-[4/5] overflow-hidden rounded-2xl shadow-xl">
            <Image
              src="/assets/images/recovery-process.jpg"
              alt="Inpatient treatment"
              fill
              className="object-cover"
            />
          </div>

          <div ref={ref} className="space-y-8">
            {steps.map((step, index) => (
              <div
                key={index}
                className={cn(
                  "flex gap-6 transition-all duration-700 transform",
                  isInView
                    ? "opacity-100 translate-x-0"
                    : "opacity-0 translate-x-12"
                )}
                style={{
                  transitionDelay: isInView ? `${index * 150}ms` : "0ms",
                }}
              >
                <div>
                  <span className="font-sans text-4xl text-theme-600 opacity-80">
                    {step.number}
                  </span>
                </div>
                <div>
                  <h3 className="mb-2 text-xl font-medium text-gray-900 dark:text-white">
                    {step.title}
                  </h3>
                  <p className="text-muted-foreground">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Process;
