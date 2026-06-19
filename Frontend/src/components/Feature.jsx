import {
  Truck,
  ShieldCheck,
  Headphones,
} from "lucide-react";

const Feature = () => {
  return (
    <section className="bg-white py-16">

      <div className="max-w-7xl mx-auto px-4 grid sm:grid-cols-2 md:grid-cols-3 gap-6">

        {/* CARD 1 */}
        <div className="bg-gray-100 rounded-2xl p-6 text-center">

          <div className="flex justify-center">
            <div className="h-14 w-14 rounded-full bg-yellow-100 flex items-center justify-center">
              <Truck className="text-black" />
            </div>
          </div>

          <h1 className="text-2xl font-bold mt-5">
            Free Shipping
          </h1>

          <p className="text-gray-600 mt-3">
            On orders over $50
          </p>

        </div>

        {/* CARD 2 */}
        <div className="bg-gray-100 rounded-2xl p-6 text-center">

          <div className="flex justify-center">
            <div className="h-14 w-14 rounded-full bg-yellow-100 flex items-center justify-center">
              <ShieldCheck className="text-black" />
            </div>
          </div>

          <h1 className="text-2xl font-bold mt-5">
            Secure Payment
          </h1>

          <p className="text-gray-600 mt-3">
            100% secure payment
          </p>

        </div>

        {/* CARD 3 */}
        <div className="bg-gray-100 rounded-2xl p-6 text-center">

          <div className="flex justify-center">
            <div className="h-14 w-14 rounded-full bg-yellow-100 flex items-center justify-center">
              <Headphones className="text-black" />
            </div>
          </div>

          <h1 className="text-2xl font-bold mt-5">
            24/7 Support
          </h1>

          <p className="text-gray-600 mt-3">
            Dedicated customer support
          </p>

        </div>

      </div>

    </section>
  );
};

export default Feature;