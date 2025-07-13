"use client";
import Image from "next/image";
import React, { useRef } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useInView } from "@/hooks/use-in-view";
import { cn } from "@/lib/utils";

const services = [
  {
    name: "Consultation",
    description: "Get a free consultation with our doctors.",
    imageUrl: "/assets/images/dr-cruz.png",
  },
  {
    name: "Pathology Test",
    description:
      "Blood, urine, and other samples are drawn and analyzed in-house.",
    imageUrl: "/assets/images/pathology.jpg",
  },
  {
    name: "Imaging",
    description: "X-rays and MRI scans are performed on-site.",
    imageUrl: "/assets/images/machine.jpg",
  },
  {
    name: "Dry Needle",
    description: "Acientic treatment for the best possible care.",
    imageUrl: "/assets/images/needle.png",
  },
  {
    name: "Prescriptions",
    description: "Dispatch prescriptions with clear usage instructions.",
    imageUrl: "/assets/images/medicine.jpg",
  },
  {
    name: "Telehealth",
    description: "Convenient online consultations with our doctors.",
    imageUrl: "/assets/images/telehealth.jpg",
  },
];

const Services = () => {
  const ref = useRef<HTMLUListElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px 0px" });
  return (
    <section
      id="services"
      className="bg-gradient-to-b from-background to-gray-50 py-20 dark:to-gray-950"
    >
      <div className="container mx-auto px-4">
        <div className="mx-auto mb-16 max-w-3xl text-center">
          <h2 className="font-sans text-3xl font-medium text-gray-900 dark:text-white md:text-4xl">
            Our Services
          </h2>
          <p className="mt-4 text-muted-foreground">
            Find the best options that suit your health needs and goals
          </p>
        </div>

        <ul
          role="list"
          ref={ref}
          className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3"
        >
          {services.map((service, index) => (
            <li
              key={service.name}
              className={cn(
                "transition-all duration-700",
                isInView ? "opacity-100" : "opacity-0"
              )}
            >
              <div className="mb-8 hidden gap-6 lg:flex">
                <ServiceCard service={service} delay={index * 150} isInView />
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};

interface ServiceCardProps {
  service: {
    name: string;
    description: string;
    imageUrl: string;
  };
  delay: number;
  isInView: boolean;
}
const ServiceCard = ({ service, delay, isInView }: ServiceCardProps) => {
  return (
    <Card
      className={cn(
        "transition-all duration-700 transform",
        isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
      )}
      style={{
        transitionDelay: isInView ? `${delay}ms` : "0ms",
      }}
    >
      <CardContent className="p-6">
        <div className="mb-4 flex">
          <Image
            alt={`${service.name} photo`}
            className="mb-4 flex size-12 items-center justify-center rounded-full bg-theme-50 dark:bg-theme-900/20 dark:hover:bg-gray-700/20 [&_svg]:hover:animate-pulse"
            {...{
              width: 64,
              height: 64,
              src: service.imageUrl,
            }}
          />
        </div>
        <h3 className="mb-2 text-xl font-medium text-gray-900 dark:text-white">
          {service.name}
        </h3>
        <p className="text-muted-foreground">{service.description}</p>

        <dl className="mt-1 flex grow flex-col justify-between">
          <dt className="sr-only">Description</dt>
          <dd className="sr-only text-sm text-gray-500">
            {service.description}
          </dd>
          <dt className="sr-only">Book</dt>
          <dd className="mt-3">
            <Button
              className="relative h-10 w-40 overflow-hidden rounded-full border border-teal-900 bg-teal-900 text-white shadow-2xl transition-all before:absolute before:inset-x-0 before:top-0 before:h-0 before:w-full before:bg-white before:duration-500 after:absolute after:inset-x-0 after:bottom-0 after:h-0 after:w-full after:bg-white after:duration-500 hover:cursor-pointer hover:border-teal-900 hover:text-teal-900 hover:shadow-white hover:before:h-2/4 hover:after:h-2/4"
              onClick={() => (window.location.href = "tel:(03)96870881")}
            >
              <span className="relative z-10 text-base">Book Now</span>
            </Button>
          </dd>
        </dl>
      </CardContent>
    </Card>
  );
};

export default Services;
