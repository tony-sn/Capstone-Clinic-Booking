import { Activity, Facebook, Instagram, Twitter } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import config from '@/config.json'

const Footer = () => {
  return (
    <footer className="bg-gray-900 pb-8 pt-16 text-white">
      <div className="container mx-auto px-4">
        <div className="mb-12 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <div className="mb-4 flex items-center gap-2">
              <Activity className="size-6 text-theme-400" />
              <span className="font-sans text-xl font-medium">
                {config.title}
              </span>
            </div>
            <p className="mb-4 text-gray-400">
              Reconnecting with ancient healing wisdom through modern medical
              practices.
            </p>
            <div className="flex gap-4">
              <Link
                href="#"
                className="text-gray-400 transition-colors hover:text-theme-400"
              >
                <Facebook className="size-5" />
              </Link>
              <Link
                href="#"
                className="text-gray-400 transition-colors hover:text-theme-400"
              >
                <Instagram className="size-5" />
              </Link>
              <Link
                href="#"
                className="text-gray-400 transition-colors hover:text-theme-400"
              >
                <Twitter className="size-5" />
              </Link>
            </div>
          </div>

          <div>
            <h3 className="mb-4 text-lg font-medium">Quick Links</h3>
            <ul className="space-y-3">
              {[
                "Home",
                "Benefits",
                "Process",
                "Testimonials",
                "Services",
                "FAQ",
                "Contact",
              ].map((item) => (
                <li key={item}>
                  <Link
                    href={`#${item.toLowerCase()}`}
                    className="text-gray-400 transition-colors hover:text-theme-400"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-lg font-medium">Resources</h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href="#"
                  className="text-gray-400 transition-colors hover:text-theme-400"
                >
                  About Cyber Clinic
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-gray-400 transition-colors hover:text-theme-400"
                >
                  Scientific Research
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-gray-400 transition-colors hover:text-theme-400"
                >
                  Patient Resources
                </Link>
              </li>
              <li>
                <Link
                  href="/preparation"
                  className="text-gray-400 transition-colors hover:text-theme-400"
                >
                  Treatment Preparation
                </Link>
              </li>
              <li>
                <Link
                  href="/aftercare"
                  className="text-gray-400 transition-colors hover:text-theme-400"
                >
                  Aftercare Guide
                </Link>
              </li>
              <li>
                <Link
                  href="/blog"
                  className="text-gray-400 transition-colors hover:text-theme-400"
                >
                  Blog
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-lg font-medium">Newsletter</h3>
            <p className="mb-4 text-gray-400">
              Subscribe to our newsletter for the latest research and special
              offers.
            </p>
            <div className="flex gap-2">
              <Input
                placeholder="Your email"
                className="border-gray-700 bg-gray-800 text-white"
              />
              <Button className="bg-theme-600 hover:bg-theme-700">
                Subscribe
              </Button>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8 text-center text-sm text-gray-400 md:flex md:justify-between md:text-left">
          <p>
            © {new Date().getFullYear()} {config.title}. All rights reserved.
          </p>
          <div className="mt-4 space-x-4 md:mt-0">
            <Link href="#" className="transition-colors hover:text-theme-400">
              Privacy Policy
            </Link>
            <Link href="#" className="transition-colors hover:text-theme-400">
              Terms of Service
            </Link>
            <Link href="#" className="transition-colors hover:text-theme-400">
              Cookie Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
