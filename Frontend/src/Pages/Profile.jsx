import MyOrders from "@/components/MyOrders";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ApiContext } from "@/context/ApiProvider";
import { setUser } from "@/Redux/Slice/userSlice";
import axios from "axios";
import { Loader } from "lucide-react";
import { useContext, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { toast } from "sonner";

const Profile = () => {
  const user = useSelector((store) => store?.user?.user);
  const { serverUrl } = useContext(ApiContext);
  const params = useParams();
  const userId = params.userId;
  const userData = JSON.parse(localStorage.getItem("userAllData"));
  const token = userData?.accessToken;
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  const [updateUser, setUpdateUser] = useState({
    firstName: user?.firstName,
    lastName: user?.lastName,
    email: user?.email,
    phoneNo: user?.phoneNo,
    address: user?.address,
    city: user?.city,
    zipcode: user?.zipcode,
    profilePic: user?.profilePic,
    role: user?.role,
  });

  /* HANDLE CHANGE FOR USER DETAILS */
  const handleChange = (e) => {
    setUpdateUser({ ...updateUser, [e.target.name]: e.target.value });
  };

  const [file, setFile] = useState(null);

  /* HANDLE CHANGE FOR USER FILE */
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    setUpdateUser({
      ...updateUser,
      profilePic: URL.createObjectURL(selectedFile),
    });
  };

  /* HANDLE SUBMIT */

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      //use form data for text + file
      const formData = new FormData();
      formData.append("firstName", updateUser.firstName);
      formData.append("lastName", updateUser.lastName);
      formData.append("email", updateUser.email);
      formData.append("phoneNo", updateUser.phoneNo);
      formData.append("address", updateUser.address);
      formData.append("city", updateUser.city);
      formData.append("zipcode", updateUser.zipcode);
      formData.append("role", updateUser.role);

      if (file) {
        formData.append("file", file); // name similar as multer file name (uploadSingle)
      }

      const res = await axios.put(
        `${serverUrl}/api/v1/auth/update/${userId}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (res.data.success) {
        setLoading(true);
        toast.success(res.data.message);
        dispatch(setUser(res.data.user));
      }
    } catch (error) {
      toast.error(error?.response?.data?.message);
      console.log(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4">
      <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-sm p-6">
        {/* HEADING */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold">My Profile</h1>

          <p className="text-gray-500 mt-2">Manage your profile and orders</p>
        </div>

        {/* TABS */}
        <Tabs defaultValue="profile">
          <TabsList className="mb-8">
            <TabsTrigger value="profile">Profile</TabsTrigger>

            <TabsTrigger value="orders">Orders</TabsTrigger>
          </TabsList>

          {/* PROFILE TAB */}
          <TabsContent value="profile">
            <form onSubmit={handleSubmit}>
              <div className="grid md:grid-cols-3 gap-10">
                {/* LEFT SIDE */}
                <div className="flex flex-col items-center">
                  <img
                    src={updateUser.profilePic || "https://i.pravatar.cc/200"}
                    alt="profile"
                    className="h-40 w-40 rounded-full object-cover border-4 border-yellow-400"
                  />

                  {/* FILE INPUT */}
                  <div className="bg-red-50 flex items-center justify-center mt-4">
                    <label className="bg-black text-white py-2 px-4 rounded-2xl cursor-pointer">
                      Upload Image
                      <input
                        type="file"
                        onChange={handleFileChange}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>

                {/* RIGHT SIDE */}
                <div className="md:col-span-2">
                  <div className="grid sm:grid-cols-2 gap-5">
                    {/* FIRST NAME */}
                    <div>
                      <Label>First Name</Label>

                      <Input
                        name="firstName"
                        value={updateUser.firstName}
                        onChange={handleChange}
                        placeholder="Enter first name"
                        className="mt-2"
                      />
                    </div>

                    {/* LAST NAME */}
                    <div>
                      <Label>Last Name</Label>

                      <Input
                        name="lastName"
                        value={updateUser.lastName}
                        onChange={handleChange}
                        placeholder="Enter last name"
                        className="mt-2"
                      />
                    </div>

                    {/* EMAIL */}
                    <div>
                      <Label>Email</Label>

                      <Input
                        type="email"
                        name="email"
                        value={updateUser.email}
                        onChange={handleChange}
                        placeholder="Enter email"
                        className="mt-2"
                      />
                    </div>

                    {/* PHONE */}
                    <div>
                      <Label>Phone Number</Label>

                      <Input
                        name="phoneNo"
                        value={updateUser.phoneNo}
                        onChange={handleChange}
                        placeholder="Enter phone number"
                        className="mt-2"
                      />
                    </div>

                    {/* ADDRESS */}
                    <div className="sm:col-span-2">
                      <Label>Address</Label>

                      <Input
                        name="address"
                        value={updateUser.address}
                        onChange={handleChange}
                        placeholder="Enter address"
                        className="mt-2"
                      />
                    </div>

                    {/* CITY */}
                    <div>
                      <Label>City</Label>

                      <Input
                        name="city"
                        value={updateUser.city}
                        onChange={handleChange}
                        placeholder="Enter city"
                        className="mt-2"
                      />
                    </div>

                    {/* ZIP CODE */}
                    <div>
                      <Label>Zip Code</Label>

                      <Input
                        name="zipcode"
                        value={updateUser.zipcode}
                        onChange={handleChange}
                        placeholder="Enter zip code"
                        className="mt-2"
                      />
                    </div>
                  </div>

                  {/* BUTTON */}
                  <Button
                    type="submit"
                    className="mt-8 bg-black hover:bg-gray-800 text-white w-[10rem] "
                  >
                    {loading ? (
                      <Loader className="animate-spin" />
                    ) : (
                      "Update Profile"
                    )}
                  </Button>
                </div>
              </div>
            </form>
          </TabsContent>

          {/* ORDER TAB */}
          <TabsContent value="orders">
            <MyOrders/>
            
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Profile;
