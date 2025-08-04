import Image from "next/image";

import { AppointmentForm } from "@/components/forms/AppointmentForm";
import { LogoutLink } from "@/components/LogoutLink";
import config from "@/config.json";
import { requireSpecificPatient } from "@/lib/auth-guard";

const Appointment = async ({ params: { userId } }: SearchParamProps) => {
  // Ensure only the specific patient can access their own data
  const { userInfo } = await requireSpecificPatient(userId);
  const patientId = userInfo?.id;
  console.log("user info: ", userInfo);

  return (
    <div className="flex h-screen max-h-screen">
      <section className="remove-scrollbar container my-auto">
        <div className="sub-container max-w-[860px] flex-1 justify-between">
          <Image
            src="/assets/icons/logo-full.svg"
            height={1000}
            width={1000}
            alt="logo"
            className="mb-12 h-10 w-fit"
          />

          <AppointmentForm
            patientId={patientId}
            userId={userId}
            type="create"
          />

          <div className="text-14-regular mt-20 flex justify-between">
            <p className="copyright justify-items-end text-dark-600 xl:text-left">
              © {new Date().getFullYear()} {config.title}
            </p>
            <LogoutLink />
          </div>
        </div>
      </section>

      <Image
        src="/assets/images/appointment-img.png"
        height={1500}
        width={1500}
        alt="appointment"
        className="side-img max-w-[390px] bg-bottom"
      />
    </div>
  );
};

export default Appointment;
