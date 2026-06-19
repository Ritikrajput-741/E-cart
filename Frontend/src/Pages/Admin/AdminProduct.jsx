import { ApiContext } from "@/context/ApiProvider";
import { setProduct } from "@/Redux/Slice/productSlice";

import axios from "axios";

import { Pencil, Search, Trash2, X } from "lucide-react";

import { useContext, useMemo, useState } from "react";

import { useDispatch, useSelector } from "react-redux";

import { toast } from "sonner";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const AdminProduct = () => {
  const { serverUrl } = useContext(ApiContext);

  const dispatch = useDispatch();

  const products = useSelector((store) => store.product.product);

  const user = JSON.parse(localStorage.getItem("userAllData") || "{}");

  const accessToken = user?.accessToken;

  const [search, setSearch] = useState("");

  const [openDialog, setOpenDialog] = useState(false);

  const [selectedProduct, setSelectedProduct] = useState(null);

  const [newImages, setNewImages] = useState([]);

  const [editData, setEditData] = useState({
    productName: "",
    productDesc: "",
    productPrice: "",
    category: "",
    brand: "",
  });

  /* SEARCH */

  const filteredProducts = useMemo(() => {
    return products.filter((item) =>
      item.productName.toLowerCase().includes(search.toLowerCase()),
    );
  }, [products, search]);

  /* DELETE PRODUCT */

  const deleteHandler = async (productId) => {
    try {
      const res = await axios.delete(
        `${serverUrl}/api/v1/product/deleteproduct/${productId}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );

      if (res.data.success) {
        toast.success(res.data.message);

        const updatedProducts = products.filter(
          (item) => item._id !== productId,
        );

        dispatch(setProduct(updatedProducts));
      }
    } catch (error) {
      console.log(error);

      toast.error(error?.response?.data?.message);
    }
  };

  /* OPEN EDIT */

  const openEditDialog = (product) => {
    setSelectedProduct(product);

    setEditData({
      productName: product.productName,
      productDesc: product.productDesc,
      productPrice: product.productPrice,
      category: product.category,
      brand: product.brand,
    });

    setOpenDialog(true);
  };

  /* INPUT */

  const inputHandler = (e) => {
    const { name, value } = e.target;

    setEditData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  /* NEW IMAGE */

  const imageHandler = (e) => {
    const files = Array.from(e.target.files);

    setNewImages((prev) => [...prev, ...files]);
  };

  /* REMOVE OLD IMAGE */

  const removeOldImage = (public_id) => {
    const updatedImages = selectedProduct.productImg.filter(
      (img) => img.public_id !== public_id,
    );

    setSelectedProduct((prev) => ({
      ...prev,
      productImg: updatedImages,
    }));
  };

  /* REMOVE NEW IMAGE */

  const removeNewImage = (index) => {
    const updated = newImages.filter((_, i) => i !== index);

    setNewImages(updated);
  };

  /* UPDATE PRODUCT */

  const updateProductHandler = async () => {
    try {
      const formData = new FormData();

      formData.append("productName", editData.productName);

      formData.append("productDesc", editData.productDesc);

      formData.append("productPrice", editData.productPrice);

      formData.append("category", editData.category);

      formData.append("brand", editData.brand);

      formData.append(
        "existingImages",
        JSON.stringify(selectedProduct.productImg.map((img) => img.public_id)),
      );

      newImages.forEach((img) => {
        formData.append("files", img);
      });

      const res = await axios.put(
        `${serverUrl}/api/v1/product/updatedproduct/${selectedProduct._id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );

      if (res.data.success) {
        toast.success(res.data.message);

        const updatedProducts = products.map((item) =>
          item._id === selectedProduct._id ? res.data.product : item,
        );

        dispatch(setProduct(updatedProducts));

        setOpenDialog(false);

        setNewImages([]);
      }
    } catch (error) {
      console.log(error);

      toast.error(error?.response?.data?.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-5">
      {/* TOP */}

      <div className="bg-white rounded-3xl shadow-sm p-5">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5">
          <div>
            <h1 className="text-3xl font-bold">Admin Products</h1>

            <p className="text-gray-500 mt-1">Manage all products</p>
          </div>

          {/* SEARCH */}

          <div className="relative w-full md:w-[350px]">
            <Search
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
              size={20}
            />

            <input
              type="text"
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full border rounded-2xl pl-12 pr-4 py-3 outline-none focus:border-black bg-gray-50"
            />
          </div>
        </div>
      </div>

      {/* PRODUCTS */}

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-8">
        {filteredProducts.map((product) => (
          <div
            key={product._id}
            className="bg-white rounded-3xl shadow-sm overflow-hidden"
          >
            {/* IMAGE */}

            <div className="bg-gray-100 p-5">
              <img
                src={product?.productImg?.[0]?.url}
                alt="product"
                className="h-52 w-full object-contain"
              />
            </div>

            {/* CONTENT */}

            <div className="p-5">
              <h1 className="font-bold line-clamp-2">{product.productName}</h1>

              <p className="text-gray-500 text-sm mt-2 line-clamp-2">
                {product.productDesc}
              </p>

              <div className="flex items-center justify-between mt-5">
                <h2 className="text-2xl font-bold">₹{product.productPrice}</h2>

                <div className="flex items-center gap-3">
                  {/* EDIT */}

                  <Dialog open={openDialog} onOpenChange={setOpenDialog}>
                    <DialogTrigger asChild>
                      <button
                        onClick={() => openEditDialog(product)}
                        className="bg-blue-500 hover:bg-blue-600 text-white p-3 rounded-xl"
                      >
                        <Pencil size={18} />
                      </button>
                    </DialogTrigger>

                    <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto rounded-3xl">
                      <DialogHeader>
                        <DialogTitle className="text-2xl">
                          Edit Product
                        </DialogTitle>
                      </DialogHeader>

                      <div className="space-y-5 mt-5">
                        <input
                          type="text"
                          name="productName"
                          value={editData.productName}
                          onChange={inputHandler}
                          placeholder="Product Name"
                          className="w-full border rounded-2xl px-5 py-4 outline-none"
                        />

                        <textarea
                          rows={5}
                          name="productDesc"
                          value={editData.productDesc}
                          onChange={inputHandler}
                          placeholder="Description"
                          className="w-full border rounded-2xl px-5 py-4 outline-none"
                        />

                        <input
                          type="number"
                          name="productPrice"
                          value={editData.productPrice}
                          onChange={inputHandler}
                          placeholder="Price"
                          className="w-full border rounded-2xl px-5 py-4 outline-none"
                        />

                        <input
                          type="text"
                          name="category"
                          value={editData.category}
                          onChange={inputHandler}
                          placeholder="Category"
                          className="w-full border rounded-2xl px-5 py-4 outline-none"
                        />

                        <input
                          type="text"
                          name="brand"
                          value={editData.brand}
                          onChange={inputHandler}
                          placeholder="Brand"
                          className="w-full border rounded-2xl px-5 py-4 outline-none"
                        />

                        {/* OLD IMAGE */}

                        <div>
                          <h2 className="font-bold mb-4">Previous Images</h2>

                          <div className="flex flex-wrap gap-4">
                            {selectedProduct?.productImg?.map((img, index) => (
                              <div key={index} className="relative">
                                <img
                                  src={img.url}
                                  alt="product"
                                  className="h-28 w-28 rounded-2xl object-cover border"
                                />

                                <button
                                  type="button"
                                  onClick={() => removeOldImage(img.public_id)}
                                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
                                >
                                  <X size={16} />
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* NEW IMAGE */}

                        <div>
                          <input type="file" multiple onChange={imageHandler} />

                          <div className="flex flex-wrap gap-4 mt-5">
                            {newImages.map((img, index) => (
                              <div key={index} className="relative">
                                <img
                                  src={URL.createObjectURL(img)}
                                  alt="preview"
                                  className="h-28 w-28 rounded-2xl object-cover border"
                                />

                                <button
                                  type="button"
                                  onClick={() => removeNewImage(index)}
                                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
                                >
                                  <X size={16} />
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* UPDATE */}

                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <button className="w-full bg-black text-white py-4 rounded-2xl">
                              Update Product
                            </button>
                          </AlertDialogTrigger>

                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>
                                Update Product ?
                              </AlertDialogTitle>

                              <AlertDialogDescription>
                                This will update product data.
                              </AlertDialogDescription>
                            </AlertDialogHeader>

                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>

                              <AlertDialogAction onClick={updateProductHandler}>
                                Update
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </DialogContent>
                  </Dialog>

                  {/* DELETE */}

                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <button className="bg-red-500 hover:bg-red-600 text-white p-3 rounded-xl">
                        <Trash2 size={18} />
                      </button>
                    </AlertDialogTrigger>

                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete Product ?</AlertDialogTitle>

                        <AlertDialogDescription>
                          This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>

                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>

                        <AlertDialogAction
                          onClick={() => deleteHandler(product._id)}
                        >
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
export default AdminProduct;
