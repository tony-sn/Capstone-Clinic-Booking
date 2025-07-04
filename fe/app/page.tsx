import Hero from "@/components/Hero";
import Navbar from "@/components/Navbar";

const Home = async ({ searchParams }: SearchParamProps) => {
  const isAdmin = searchParams?.admin === "true";

  return (
    <div className="flex h-screen max-h-screen">
      <Navbar />
      <Hero />
    </div>
  );
};

export default Home;
