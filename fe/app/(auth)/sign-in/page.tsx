import Image from "next/image";
import Link from "next/link";

import { SignInForm } from "@/components/new/forms/SignInForm";
import config from "@/config.json";

const SignInPage = () => {
  // const isAdmin = searchParams?.admin === "true";

  let coverURL: string | undefined;

  const srcSource = coverURL ?? "/assets/images/onboarding-img.png";

  return (
    <div className="flex h-screen max-h-screen">
      {/* {isAdmin && <PasskeyModal />} */}

      <section className="remove-scrollbar container my-auto">
        <div className="sub-container max-w-[496px]">
          <Image
            src="/assets/icons/logo-full.svg"
            height={1000}
            width={1000}
            alt="patient"
            className="mb-12 h-10 w-fit"
          />

          <SignInForm />

          <div className="text-14-regular mt-20 flex justify-between">
            <p className="justify-items-end text-dark-600 xl:text-left">
              © {new Date().getFullYear()} {config.title}
            </p>
            <Link href="?admin=true" className="text-green-500">
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

export default SignInPage;
