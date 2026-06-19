import ProductCard from "@/components/ProductCard";
import Sidebar from "@/components/Sidebar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ApiContext } from "@/context/ApiProvider";
import { setProduct } from "@/Redux/Slice/productSlice";
import axios from "axios";
import { SlidersHorizontal } from "lucide-react";
import { useContext, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { toast } from "sonner";

const Product = () => {
  const { serverUrl } = useContext(ApiContext);

  const [products, setProducts] = useState([]);

  const [loading, setLoading] = useState(false);

  const [openSidebar, setOpenSidebar] = useState(false);

  const [search, setSearch] = useState("");

  const [category, setCategory] = useState("");

  const [sort, setSort] = useState("");

  const [minPrice, setMinPrice] = useState("");

  const [maxPrice, setMaxPrice] = useState("");

  const dispatch = useDispatch();

  const fetchProducts = async () => {
    setLoading(true);

    try {
      const res = await axios.get(`${serverUrl}/api/v1/product/getallproducts`);

      if (res.data.success) {
        // redux
        dispatch(setProduct(res.data.products));

        // local state
        setProducts(res.data.products);
      }
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const filteredProducts = products

    .filter((item) => {
      const searchMatch = item.productName
        .toLowerCase()
        .includes(search.toLowerCase());

      const categoryMatch = category ? item.category === category : true;

      const minMatch = minPrice
        ? Number(item.productPrice) >= Number(minPrice)
        : true;

      const maxMatch = maxPrice
        ? Number(item.productPrice) <= Number(maxPrice)
        : true;

      return searchMatch && categoryMatch && minMatch && maxMatch;
    })

    .sort((a, b) => {
      if (sort === "low") {
        return Number(a.productPrice) - Number(b.productPrice);
      }

      if (sort === "high") {
        return Number(b.productPrice) - Number(a.productPrice);
      }

      return 0;
    });

  return (
    <div className="min-h-screen bg-gray-100 px-4 py-10">
      <div className="max-w-7xl mx-auto">
        <button
          onClick={() => setOpenSidebar(!openSidebar)}
          className="lg:hidden flex items-center gap-2 bg-black text-white px-5 py-3 rounded-xl mb-6"
        >
          <SlidersHorizontal size={18} />
          Filters
        </button>

        <div className="grid lg:grid-cols-4 gap-8">
          <div
            className={`
              ${openSidebar ? "block" : "hidden"}
              lg:block
            `}
          >
            <Sidebar
              search={search}
              setSearch={setSearch}
              category={category}
              setCategory={setCategory}
              minPrice={minPrice}
              setMinPrice={setMinPrice}
              maxPrice={maxPrice}
              setMaxPrice={setMaxPrice}
            />
          </div>

          <div className="lg:col-span-3">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5 mb-8">
              <div>
                <h1 className="text-3xl font-bold">Products</h1>

                <p className="text-gray-500 mt-2">Discover latest products</p>
              </div>

              <Select onValueChange={setSort}>
                <SelectTrigger className="w-[220px] bg-white">
                  <SelectValue placeholder="Sort Products" />
                </SelectTrigger>

                <SelectContent>
                  <SelectItem value="low">Price: Low to High</SelectItem>

                  <SelectItem value="high">Price: High to Low</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {loading ? (
              <div className="flex items-center justify-center h-96">
                <h1 className="text-2xl font-semibold">Loading...</h1>
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredProducts.length > 0 ? (
                  filteredProducts.map((product) => (
                    <ProductCard
                      key={product._id}
                      product={product}
                      serverUrl={serverUrl}
                    />
                  ))
                ) : (
                  <div className="col-span-full h-60 bg-white rounded-2xl border flex items-center justify-center">
                    <h1 className="text-2xl font-semibold text-gray-400">
                      No Products Found
                    </h1>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Product;
