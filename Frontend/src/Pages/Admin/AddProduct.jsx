import { ApiContext } from "@/context/ApiProvider";
import axios from "axios";
import { ImagePlus, Loader2, PackagePlus, X } from "lucide-react";
import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const AddProduct = () => {
  const { serverUrl } = useContext(ApiContext);

  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const [productData, setProductData] = useState({
    productName: "",
    productDesc: "",
    productPrice: "",
    category: "",
    brand: "",
  });

  const [productImg, setProductImg] = useState([]);

  const user = JSON.parse(localStorage.getItem("userAllData") || "{}");

  const accessToken = user?.accessToken;

  const inputHandler = (e) => {
    const { name, value } = e.target;

    setProductData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const imageHandler = (e) => {
    const files = Array.from(e.target.files);

    setProductImg((prev) => {
      const updatedImages = [...prev, ...files];

      if (updatedImages.length > 5) {
        toast.error("You can upload maximum 5 images");

        return prev;
      }

      return updatedImages;
    });
  };

  const removeImage = (index) => {
    const updatedImages = productImg.filter((_, i) => i !== index);

    setProductImg(updatedImages);
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    setLoading(true);

    if (productImg.length <= 0) {
      toast.error("Please select at least one image");

      setLoading(false);

      return;
    }

    try {
      const formData = new FormData();

      formData.append("productName", productData.productName);

      formData.append("productDesc", productData.productDesc);

      formData.append("productPrice", productData.productPrice);

      formData.append("category", productData.category);

      formData.append("brand", productData.brand);

      productImg.forEach((img) => {
        formData.append("files", img);
      });

      const res = await axios.post(
        `${serverUrl}/api/v1/product/addproduct`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );

      if (res.data.success) {
        toast.success("Product Added Successfully ✅");

        setProductData({
          productName: "",
          productDesc: "",
          productPrice: "",
          category: "",
          brand: "",
        });

        setProductImg([]);

        navigate("/products");
      }
    } catch (error) {
      console.log(error);

      toast.error(error?.response?.data?.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-5xl mx-auto bg-white rounded-3xl shadow-lg p-8">
        <div className="flex items-center gap-4 mb-10">
          <div className="bg-black text-white p-4 rounded-2xl">
            <PackagePlus size={28} />
          </div>

          <div>
            <h1 className="text-4xl font-bold">Add Product</h1>

            <p className="text-gray-500 mt-1">Create and upload new products</p>
          </div>
        </div>

        <form onSubmit={submitHandler} className="space-y-8">
          <div>
            <label className="text-lg font-semibold">Product Name</label>

            <input
              type="text"
              name="productName"
              value={productData.productName}
              onChange={inputHandler}
              placeholder="Enter product name"
              className="w-full mt-3 border rounded-2xl px-5 py-4 outline-none focus:border-black"
            />
          </div>

          <div>
            <label className="text-lg font-semibold">Product Description</label>

            <textarea
              rows={6}
              name="productDesc"
              value={productData.productDesc}
              onChange={inputHandler}
              placeholder="Enter product description"
              className="w-full mt-3 border rounded-2xl px-5 py-4 outline-none focus:border-black resize-none"
            />
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="text-lg font-semibold">Product Price</label>

              <input
                type="number"
                name="productPrice"
                value={productData.productPrice}
                onChange={inputHandler}
                placeholder="Enter product price"
                className="w-full mt-3 border rounded-2xl px-5 py-4 outline-none focus:border-black"
              />
            </div>

            <div>
              <label className="text-lg font-semibold">Brand</label>

              <input
                type="text"
                name="brand"
                value={productData.brand}
                onChange={inputHandler}
                placeholder="Enter brand name"
                className="w-full mt-3 border rounded-2xl px-5 py-4 outline-none focus:border-black"
              />
            </div>
          </div>

          <div>
            <label className="text-lg font-semibold">Category</label>

            <input
              type="text"
              name="category"
              value={productData.category}
              onChange={inputHandler}
              placeholder="Enter category"
              className="w-full mt-3 border rounded-2xl px-5 py-4 outline-none focus:border-black"
            />
          </div>

          <div>
            <label className="text-lg font-semibold">Product Images</label>

            <label className="mt-4 border-2 border-dashed rounded-3xl p-10 flex flex-col items-center justify-center cursor-pointer hover:border-black transition-all duration-300">
              <ImagePlus size={45} />

              <p className="mt-4 text-gray-500">Upload up to 5 Images</p>

              <input
                type="file"
                multiple
                hidden
                accept="image/*"
                onChange={imageHandler}
              />
            </label>

            {productImg.length > 0 && (
              <div className="flex flex-wrap gap-5 mt-8">
                {productImg.map((img, index) => (
                  <div key={index} className="relative">
                    <img
                      src={URL.createObjectURL(img)}
                      alt="preview"
                      className="h-32 w-32 object-cover rounded-2xl border"
                    />

                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <button
            disabled={loading}
            className="w-full bg-black text-white py-5 rounded-2xl hover:bg-gray-800 transition-all duration-300 text-lg font-semibold flex items-center justify-center gap-3"
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin" />
                Adding Product...
              </>
            ) : (
              <>
                <PackagePlus size={22} />
                Add Product
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddProduct;
