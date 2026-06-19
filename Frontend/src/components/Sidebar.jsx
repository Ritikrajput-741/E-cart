import { Input } from "@/components/ui/input";

const Sidebar = ({
  search,
  setSearch,
  category,
  setCategory,
  minPrice,
  setMinPrice,
  maxPrice,
  setMaxPrice,
}) => {
  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm border h-fit">
      <div>
        <h1 className="font-semibold text-lg mb-3">Search</h1>

        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search products..."
        />
      </div>

      <div className="mt-8">
        <h1 className="font-semibold text-lg mb-3">Price Range</h1>

        <div className="flex flex-col gap-4">
          <Input
            type="number"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            placeholder="Min Price"
          />

          <Input
            type="number"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            placeholder="Max Price"
          />
        </div>
      </div>

      <div className="mt-8">
        <h1 className="font-semibold text-lg mb-3">Category</h1>

        <div className="flex flex-col gap-3">
          <button
            onClick={() => setCategory("")}
            className={`text-left ${
              category === "" ? "font-bold text-black" : "text-gray-500"
            }`}
          >
            All
          </button>

          <button
            onClick={() => setCategory("Mobile")}
            className={`text-left ${
              category === "Mobile" ? "font-bold text-black" : "text-gray-500"
            }`}
          >
            Mobile
          </button>

          <button
            onClick={() => setCategory("Laptop")}
            className={`text-left ${
              category === "Laptop" ? "font-bold text-black" : "text-gray-500"
            }`}
          >
            Laptop
          </button>

          <button
            onClick={() => setCategory("Fashion")}
            className={`text-left ${
              category === "Fashion" ? "font-bold text-black" : "text-gray-500"
            }`}
          >
            Fashion
          </button>
        </div>
      </div>

      <button
        onClick={() => {
          setSearch("");
          setCategory("");
          setMinPrice("");
          setMaxPrice("");
        }}
        className="w-full mt-8 bg-black text-white py-3 rounded-xl hover:bg-gray-800 transition-all duration-300"
      >
        Reset Filters
      </button>
    </div>
  );
};

export default Sidebar;
