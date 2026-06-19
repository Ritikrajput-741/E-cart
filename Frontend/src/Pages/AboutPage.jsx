import { FaHeadset, FaShieldAlt, FaTruck } from "react-icons/fa";

const features = [
  {
    icon: <FaTruck className="text-yellow-400 text-2xl" />,
    title: "Free Shipping",
    desc: "We deliver your orders to your doorstep at no extra cost.",
  },
  {
    icon: <FaShieldAlt className="text-yellow-400 text-2xl" />,
    title: "Secure Payment",
    desc: "Your transactions are fully encrypted and always protected.",
  },
  {
    icon: <FaHeadset className="text-yellow-400 text-2xl" />,
    title: "24/7 Support",
    desc: "Our team is always here to help you, any time of the day.",
  },
];

const stats = [
  { number: "10K+", label: "Happy Customers" },
  { number: "500+", label: "Products" },
  { number: "50+", label: "Brands" },
  { number: "99%", label: "Satisfaction" },
];

const AboutPage = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      {/* HERO */}
      <div className="py-20 px-6 md:px-16">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-12">
          <div className="flex-1 space-y-5">
            <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 leading-tight">
              About E-CART
            </h1>
            <p className="text-gray-500 text-base leading-relaxed">
              E-CART is your one-stop online shopping destination. We provide
              the latest fashion, electronics, shoes, watches, and trending
              lifestyle products — all in one place.
            </p>
            <p className="text-gray-500 text-base leading-relaxed">
              We want your shopping experience to be simple, safe, and
              enjoyable. That's why we offer secure payments, fast delivery, and
              24/7 customer support — every single day.
            </p>
            <a
              href="/products"
              className="inline-block bg-gray-900 hover:bg-gray-700 text-white font-bold text-sm px-8 py-4 rounded-full transition-all duration-200"
            >
              Shop Now →
            </a>
          </div>

          <div className="flex-1 flex justify-center">
            <div className="bg-gray-200 rounded-2xl w-100 h-100 flex flex-col items-center justify-center gap-2 ml-30">
              <span className="text-7xl font-extrabold text-yellow-400">E</span>
              <span className="text-xl font-bold text-gray-800 tracking-widest">
                E-CART
              </span>
              <span className="text-gray-400 text-sm">Est. 2024</span>
            </div>
          </div>
        </div>
      </div>

      {/* FEATURES */}
      <section className="py-12 px-6 md:px-16">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
          {features.map((f) => (
            <div
              key={f.title}
              className="bg-white rounded-2xl p-8 text-center shadow-sm"
            >
              <div className="w-14 h-14 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-5">
                {f.icon}
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                {f.title}
              </h3>
              <p className="text-gray-400 text-sm leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* STATS */}
      <section className="py-12 px-6 md:px-16">
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((s) => (
            <div
              key={s.label}
              className="bg-white rounded-2xl p-6 text-center shadow-sm"
            >
              <div className="text-3xl font-extrabold text-gray-900 mb-1">
                {s.number}
              </div>
              <div className="text-sm text-gray-400">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* MISSION */}
      <div className="py-12 px-6 md:px-16 pb-20">
        <div className="max-w-6xl mx-auto bg-gray-900 rounded-2xl p-12 flex flex-col md:flex-row items-center justify-between gap-10">
          <div className="flex-1 space-y-4">
            <h2 className="text-3xl font-extrabold text-white">Our Mission</h2>
            <p className="text-gray-400 text-base leading-relaxed">
              We believe everyone deserves access to quality products at fair
              prices. E-CART was built to make that possible — no matter where
              you are.
            </p>
            <p className="text-gray-400 text-base leading-relaxed">
              We are constantly growing our catalog, improving delivery, and
              making your experience better with every order.
            </p>
          </div>
          <a
            href="/products"
            className="shrink-0 bg-yellow-400 hover:bg-yellow-300 text-gray-900 font-bold text-sm px-10 py-4 rounded-full transition-all duration-200"
          >
            Shop Now →
          </a>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
