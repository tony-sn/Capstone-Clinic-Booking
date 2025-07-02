"use client";

import { useState, useEffect } from "react";

import { Button } from "@/components/ui/button";
import { motion } from "@/lib/motion";

const Hero = () => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <section
      id="home"
      className="relative mx-auto overflow-hidden pt-28 md:pt-32 lg:pt-36"
    >
      <div className="container relative z-10 mx-auto px-4 pb-20 md:pb-28 lg:pb-36">
        <div className="mx-auto flex max-w-4xl flex-col items-center text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="font-playfair text-4xl leading-tight text-white md:text-5xl lg:text-6xl">
              Experience the Best Clinic{" "}
              <span className="text-green-500">Services</span>
            </h1>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <p className="mt-6 max-w-3xl text-lg text-white/80 md:text-xl">
              Discover how our professionals can help address general and
              specific issues, reduce inflammation, and promote recovery through
              tests and best practices.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mt-10 flex flex-col gap-4 sm:flex-row"
          >
            <Button
              size="lg"
              className="bg-theme-600 hover:bg-theme-700 px-8 text-white"
            >
              Book Your Session
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="text-theme border-theme-500 hover:bg-theme-600/20 hover:text-white"
            >
              Learn More
            </Button>
          </motion.div>
        </div>
      </div>

      <div className="from-background absolute inset-x-0 bottom-0 z-10 h-24 bg-gradient-to-t to-transparent" />
    </section>
  );
};

export default Hero;
