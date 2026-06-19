import { Button } from "@/components/ui/button";

import { Input } from "@/components/ui/input";

import { Label } from "@/components/ui/label";

import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

import { ApiContext } from "@/context/ApiProvider";

import axios from "axios";

import { Loader } from "lucide-react";

import { useContext, useEffect, useState } from "react";

import { useParams } from "react-router-dom";

import { toast } from "sonner";

const UserInfo = () => {
  const { id } = useParams();

  const { serverUrl } = useContext(ApiContext);

  const [loading, setLoading] = useState(false);

  const [user, setUser] = useState(null);

  const [file, setFile] = useState(null);

  const userData = JSON.parse(localStorage.getItem("userAllData") || "{}");

  const token = userData?.accessToken;

  const [updateUser, setUpdateUser] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNo: "",
    address: "",
    city: "",
    zipcode: "",
    profilePic: "",
    role: "user",
  });

  /* GET USER */

  const getUser = async () => {
    try {
      const res = await axios.get(`${serverUrl}/api/v1/auth/getUser/${id}`);

      if (res.data.success) {
        setUser(res.data.user);

        setUpdateUser({
          firstName: res.data.user.firstName || "",

          lastName: res.data.user.lastName || "",

          email: res.data.user.email || "",

          phoneNo: res.data.user.phoneNo || "",

          address: res.data.user.address || "",

          city: res.data.user.city || "",

          zipcode: res.data.user.zipcode || "",

          profilePic: res.data.user.profilePic || "",

          role: res.data.user.role || "user",
        });
      }
    } catch (error) {
      console.log(error);

      toast.error(error?.response?.data?.message);
    }
  };

  useEffect(() => {
    getUser();
  }, []);

  /* INPUT */

  const handleChange = (e) => {
    setUpdateUser({
      ...updateUser,
      [e.target.name]: e.target.value,
    });
  };

  /* FILE */

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];

    setFile(selectedFile);

    setUpdateUser({
      ...updateUser,
      profilePic: URL.createObjectURL(selectedFile),
    });
  };

  /* UPDATE */

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);

    try {
      const formData = new FormData();

      formData.append("firstName", updateUser.firstName);

      formData.append("lastName", updateUser.lastName);

      formData.append("phoneNo", updateUser.phoneNo);

      formData.append("address", updateUser.address);

      formData.append("city", updateUser.city);

      formData.append("zipcode", updateUser.zipcode);

      formData.append("role", updateUser.role);

      if (file) {
        formData.append("file", file);
      }

      const res = await axios.put(
        `${serverUrl}/api/v1/auth/update/${id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (res.data.success) {
        toast.success(res.data.message);

        setUser(res.data.user);
      }
    } catch (error) {
      console.log(error);

      toast.error(error?.response?.data?.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-5">
      <div className="max-w-6xl mx-auto bg-white rounded-3xl shadow-sm p-8">
        {/* HEADING */}

        <div className="mb-10">
          <h1 className="text-4xl font-bold">User Details</h1>

          <p className="text-gray-500 mt-2">
            Admin can manage user information
          </p>
        </div>

        {/* FORM */}

        <form onSubmit={handleSubmit}>
          <div className="grid lg:grid-cols-3 gap-10">
            {/* LEFT */}

            <div className="flex flex-col items-center">
              <img
                src={
                  updateUser.profilePic ||
                  "https://cdn-icons-png.flaticon.com/512/149/149071.png"
                }
                alt="profile"
                className="h-44 w-44 rounded-full object-cover border-4 border-black"
              />

              <label className="mt-5 bg-black text-white px-5 py-3 rounded-2xl cursor-pointer hover:bg-gray-800">
                Upload Image
                <input
                  type="file"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>
            </div>

            {/* RIGHT */}

            <div className="lg:col-span-2">
              <div className="grid sm:grid-cols-2 gap-5">
                <div>
                  <Label>First Name</Label>

                  <Input
                    name="firstName"
                    value={updateUser.firstName}
                    onChange={handleChange}
                    className="mt-2"
                  />
                </div>

                <div>
                  <Label>Last Name</Label>

                  <Input
                    name="lastName"
                    value={updateUser.lastName}
                    onChange={handleChange}
                    className="mt-2"
                  />
                </div>

                <div>
                  <Label>Email</Label>

                  <Input value={updateUser.email} disabled className="mt-2" />
                </div>

                <div>
                  <Label>Phone Number</Label>

                  <Input
                    name="phoneNo"
                    value={updateUser.phoneNo}
                    onChange={handleChange}
                    className="mt-2"
                  />
                </div>

                <div className="sm:col-span-2">
                  <Label>Address</Label>

                  <Input
                    name="address"
                    value={updateUser.address}
                    onChange={handleChange}
                    className="mt-2"
                  />
                </div>

                <div>
                  <Label>City</Label>

                  <Input
                    name="city"
                    value={updateUser.city}
                    onChange={handleChange}
                    className="mt-2"
                  />
                </div>

                <div>
                  <Label>Zipcode</Label>

                  <Input
                    name="zipcode"
                    value={updateUser.zipcode}
                    onChange={handleChange}
                    className="mt-2"
                  />
                </div>
              </div>

              {/* ROLE */}

              <div className="mt-8">
                <Label className="text-lg">User Role</Label>

                <RadioGroup
                  value={updateUser.role}
                  onValueChange={(value) =>
                    setUpdateUser({
                      ...updateUser,
                      role: value,
                    })
                  }
                  className="flex items-center gap-10 mt-5"
                >
                  <div className="flex items-center gap-3">
                    <RadioGroupItem value="user" id="user" />

                    <Label htmlFor="user">User</Label>
                  </div>

                  <div className="flex items-center gap-3">
                    <RadioGroupItem value="admin" id="admin" />

                    <Label htmlFor="admin">Admin</Label>
                  </div>
                </RadioGroup>
              </div>

              {/* BUTTON */}

              <Button
                type="submit"
                className="mt-10 bg-black hover:bg-gray-800 w-[14rem] h-[3.5rem] text-lg rounded-2xl"
              >
                {loading ? <Loader className="animate-spin" /> : "Update User"}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserInfo;
