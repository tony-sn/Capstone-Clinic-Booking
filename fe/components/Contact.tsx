"use client";

import { CalendarDays, Clock, MapPin, Phone } from "lucide-react";
import { useRef } from "react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useInView } from "@/hooks/use-in-view";
import { cn } from "@/lib/utils";

const contactInfo = [
  {
    icon: <MapPin className="size-5 text-theme-600" />,
    title: "Address",
    details: ["123 Healing Way", "Wellness District", "HCMC, VN 10001"],
  },
  {
    icon: <Phone className="size-5 text-theme-600" />,
    title: "Contact",
    details: ["(555) 123-4567", "info@cyberclinic.com.vn"],
  },
  {
    icon: <Clock className="size-5 text-theme-600" />,
    title: "Hours",
    details: [
      "Monday - Friday: 9am - 6pm",
      "Saturday: 10am - 3pm",
      "Sunday: Closed",
    ],
  },
  {
    icon: <CalendarDays className="size-5 text-theme-600" />,
    title: "Appointments",
    details: ["Book online or call us", "24-hour cancellation policy"],
  },
];

const Contact = () => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px 0px" });

  return (
    <section id="contact" className="bg-gray-50 py-20 dark:bg-gray-950">
      <div className="container mx-auto px-4">
        <div className="mx-auto mb-16 max-w-3xl text-center">
          <h2 className="font-sans text-3xl font-medium text-gray-900 dark:text-white md:text-4xl">
            Contact Us
          </h2>
          <p className="mt-4 text-muted-foreground">
            Schedule a consultation or ask questions about our clinic services
          </p>
        </div>

        <div ref={ref} className="mx-auto grid max-w-5xl gap-8 md:grid-cols-2">
          <div
            className={cn(
              "transition-all duration-700 transform",
              isInView
                ? "opacity-100 translate-x-0"
                : "opacity-0 -translate-x-12"
            )}
          >
            <Card>
              <CardHeader>
                <CardTitle className="font-sans text-2xl">
                  Send a Message
                </CardTitle>
                <CardDescription>
                  Fill out the form below and we&apos;ll respond within 24
                  hours.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="first-name">First name</Label>
                      <Input
                        id="first-name"
                        placeholder="Enter your first name"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="last-name">Last name</Label>
                      <Input
                        id="last-name"
                        placeholder="Enter your last name"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter your email"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="Enter your phone number"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="message">Message</Label>
                    <Textarea
                      id="message"
                      placeholder="Tell us about your interest in treatment services"
                      rows={4}
                    />
                  </div>
                  <Button className="w-full bg-theme-600 hover:bg-theme-700">
                    Send Message
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          <div
            className={cn(
              "space-y-6 transition-all duration-700 transform",
              isInView
                ? "opacity-100 translate-x-0"
                : "opacity-0 translate-x-12"
            )}
          >
            <div className="rounded-lg border border-gray-100 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
              <h3 className="mb-4 font-sans text-xl font-medium">
                Get In Touch
              </h3>

              <div className="space-y-6">
                {contactInfo.map((item, index) => (
                  <div key={index} className="flex gap-4">
                    <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-theme-50 dark:bg-theme-900/20">
                      {item.icon}
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white">
                        {item.title}
                      </h4>
                      <div className="mt-1 space-y-1">
                        {item.details.map((detail, i) => (
                          <p key={i} className="text-muted-foreground">
                            {detail}
                          </p>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-lg bg-theme-600 p-6 text-white">
              <h3 className="mb-4 font-sans text-xl font-medium">
                Your First Visit
              </h3>
              <p className="mb-4">
                New to our clinic? We make your first experience comfortable and
                informative.
              </p>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Arrive 15 minutes early to complete paperwork</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Wear loose, comfortable clothing</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Bring any relevant medical records</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>
                    Avoid caffeine or alcohol 6 hours before treatment
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
