import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";

import Benefits from "@/components/Benefits";
import Contact from "@/components/Contact";
import Faq from "@/components/Faq";
import Hero from "@/components/Hero";
import Footer from "@/components/layout/Footer";
import Navbar from "@/components/layout/Navbar";
import Process from "@/components/Process";
import Services from "@/components/Services";
import Testimonials from "@/components/Testimonials";
import { SESSION_COOKIE_NAME } from "@/constants";
import { getUserInfo } from "@/lib/api/patient.actions";

const Home = async () => {
  const cookieStore = cookies();

  const headersList = await headers();
  const headersObj = Object.fromEntries(headersList.entries());
  const { data: userInfo } = await getUserInfo({
    headers: headersObj,
  });
  const session = cookieStore.get(SESSION_COOKIE_NAME);
  const role = userInfo?.roles?.[0];

  if (session) {
    if (role === "User") {
      redirect(`/patients/${userInfo?.id}/new-appointment`);
    } else {
      redirect("/admin");
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <Hero />
      <Benefits />
      <Process />
      <Testimonials />
      <Services />
      <Faq />
      <Contact />
      <Footer />
    </div>
  );
};

export default Home;
