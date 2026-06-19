

import { Headphones, ShoppingBag, Truck } from "lucide-react";
import { BsInstagram, BsTwitter } from "react-icons/bs";
import { FaFacebook } from "react-icons/fa";
import { LiaLinkedin } from "react-icons/lia";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-black text-white">

      <div className="max-w-7xl mx-auto px-4 py-14 grid sm:grid-cols-2 md:grid-cols-4 gap-10">

        {/* LOGO */}
        <div>

          <div className="flex items-center gap-2">

            <ShoppingBag className="text-yellow-400 " />

            <h1 className="text-3xl font-bold">
              E-
              <span className="text-yellow-400">
                Shop
              </span>
            </h1>

          </div>

          <p className="text-gray-400 mt-4 leading-7">
            Your trusted online shopping destination
            for fashion, electronics, and more.
          </p>

        </div>

        {/* CUSTOMER SERVICE */}
        <div>

          <h2 className="text-xl font-semibold mb-4">
            Customer Service
          </h2>

          <div className="flex flex-col gap-4 text-gray-400">

            <div className="flex items-center gap-2 hover:text-yellow-400 duration-300">
              <Headphones size={18} />
              <Link to="/">Help Center</Link>
            </div>

            <div className="flex items-center gap-2 hover:text-yellow-400 duration-3">
              <Truck size={18} />
              <Link to="/">Shipping Info</Link>
            </div>

            <div className="flex items-center gap-2 hover:text-yellow-400 duration-3">
              <ShoppingBag size={18} />
              <Link to="/">Track Order</Link>
            </div>

          </div>

        </div>

        {/* QUICK LINKS */}
        <div>

          <h2 className="text-xl font-semibold mb-4">
            Quick Links
          </h2>

          <div className="flex flex-col gap-3 text-gray-400 ">

            <Link to="/" className="hover:text-yellow-400  duration-300">Home</Link>

            <Link to="/products" className="hover:text-yellow-400 duration-300">
              Products 
            </Link>

            <Link to="/about" className="hover:text-yellow-400 duration-300" >
              About
            </Link>

            <Link to="/contact" className="hover:text-yellow-400 duration-300">
              Contact
            </Link>

          </div>

        </div>

        {/* FOLLOW US */}
        <div>

          <h2 className="text-xl font-semibold mb-4">
            Follow Us
          </h2>

          <div className="flex items-center gap-4">

            <a
              href="/"
              className="h-10 w-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-yellow-400 hover:text-black  duration-300"
            >
              <FaFacebook size={25} />
            </a>

            <a
              href="/"
              className="h-10 w-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-yellow-400 hover:text-black duration-300"
            >
              <BsInstagram size={25} />
            </a>

            <a
              href="/"
              className="h-10 w-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-yellow-400 hover:text-black duration-300"
            >
              <BsTwitter size={25} />
            </a>

            <a
              href="/"
              className="h-10 w-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-yellow-400 hover:text-black duration-300"
            >
              <LiaLinkedin size={25} />
            </a>

          </div>

        </div>

      </div>

      {/* BOTTOM */}
      <div className="border-t border-gray-800 py-5 text-center text-gray-400 text-sm">
        © 2026 E-Shop. All rights reserved.
      </div>

    </footer>
  );
};

export default Footer;