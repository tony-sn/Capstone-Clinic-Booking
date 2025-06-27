import Image from "next/image";
import Link from "next/link";

import { PatientForm } from "@/components/forms/PatientForm";
import { PasskeyModal } from "@/components/PasskeyModal";
import config from "@/config.json";
import { UNSPLASH_ACCESS_KEY } from "@/lib/app.config";

const Home = async ({ searchParams }: SearchParamProps) => {
  const isAdmin = searchParams?.admin === "true";

  const unsplash = async () => {
    const res = await fetch(
      "https://api.unsplash.com/photos/random?query=doctor",
      {
        method: "GET",
        headers: {
          Authorization: `Client-ID ${UNSPLASH_ACCESS_KEY}`,
        },
        mode: "cors",
      },
    );
    return res.json();
  };
  let coverURL: string | undefined;

  if (UNSPLASH_ACCESS_KEY) {
    const data = await unsplash();
    coverURL = data?.urls?.full;
  }

  const srcSource = coverURL ?? "/assets/images/onboarding-img.png";

  return (
    <div className="flex h-screen max-h-screen">
      {isAdmin && <PasskeyModal />}

      <section className="remove-scrollbar container my-auto">
        <div className="sub-container max-w-[496px]">
          <Image
            src="/assets/icons/logo-full.svg"
            height={1000}
            width={1000}
            alt="patient"
            className="mb-12 h-10 w-fit"
          />

          <PatientForm />

          <div className="text-14-regular mt-20 flex justify-between">
            <p className="justify-items-end text-dark-600 xl:text-left">
              © {new Date().getFullYear()} {config.title}
            </p>
            <Link href="/?admin=true" className="text-green-500">
              Admin
            </Link>
          </div>
        </div>
      </section>

      <Image
        src={srcSource}
        height={1000}
        width={1000}
        alt="patient"
        className="side-img max-w-[50%]"
      />
    </div>
  );
};

export default Home;
