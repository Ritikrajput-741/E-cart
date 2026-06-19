import Feature from "@/components/Feature";
import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import Navbar from "@/components/Navbar";

const Home = () => {
  return (
    <div className="bg-gray-100 min-h-screen">
      <Navbar />
      <Hero />
      <Feature />
      <Footer />
    </div>
  );
};

export default Home;
