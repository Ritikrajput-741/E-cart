import { ArrowRight } from "lucide-react";

import { useNavigate } from "react-router-dom";
import hero from "../assets/hero.png";
const Hero = () => {
  const navigate = useNavigate();

  return (
    <section className="bg-gray-100">
      <div className="max-w-7xl mx-auto px-4 py-16 grid md:grid-cols-2 gap-10 items-center">
        {/* LEFT SIDE */}
        <div>
          <p className="text-yellow-500 font-semibold mb-3">
            Welcome to E-Shop
          </p>

          <h1 className="text-5xl md:text-6xl font-bold leading-tight text-black">
            Discover Amazing Products For Your Lifestyle
          </h1>

          <p className="mt-6 text-gray-600 text-lg leading-8">
            Shop the latest fashion, electronics, shoes, watches, and trending
            products with secure payments and fast delivery.
          </p>

          <div className="flex gap-4 mt-8">
            <button
              onClick={() => navigate("/products")}
              className="bg-black hover:bg-gray-800 text-white px-6 py-3 rounded-lg flex items-center gap-2"
            >
              Shop Now
              <ArrowRight size={18} />
            </button>

            <button
              onClick={() => navigate("/about")}
              className="border border-black px-6 py-3 rounded-lg hover:bg-black hover:text-white"
            >
              Learn More
            </button>
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="flex justify-center">
          <img
            src={hero}
            alt="hero"
            className="w-full max-w-lg rounded-2xl shadow-2xl drop-shadow-2xl shadow-gray-300/20"
          />
        </div>
      </div>
    </section>
  );
};

export default Hero;
