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
import { ApiContext } from "@/context/ApiProvider";
import axios from "axios";
import { Edit, Eye, Search } from "lucide-react";
import { useContext, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const AdminUsers = () => {
  const { serverUrl } = useContext(ApiContext);
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [newImage, setNewImage] = useState(null);
  const [editData, setEditData] = useState({
    firstName: "",
    lastName: "",
    address: "",
    city: "",
    zipcode: "",
    phoneNo: "",
    role: "",
  });

  const user = JSON.parse(localStorage.getItem("userAllData") || "{}");
  const accessToken = user?.accessToken;

  /* GET USERS */

  const getAllUsers = async () => {
    try {
      const res = await axios.get(`${serverUrl}/api/v1/auth/allUsers`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (res.data.success) {
        setUsers(res.data.users);
      }
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.message);
    }
  };

  useEffect(() => {
    getAllUsers();
  }, []);

  /* SEARCH */

  const filteredUsers = useMemo(() => {
    return users.filter((user) =>
      `${user.firstName} ${user.lastName}`
        .toLowerCase()
        .includes(search.toLowerCase()),
    );
  }, [users, search]);

  /* OPEN EDIT */

  const openEditDialog = (user) => {
    setSelectedUser(user);

    setEditData({
      firstName: user.firstName || "",
      lastName: user.lastName || "",
      address: user.address || "",
      city: user.city || "",
      zipcode: user.zipcode || "",
      phoneNo: user.phoneNo || "",
      role: user.role || "",
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

  /* IMAGE */

  const imageHandler = (e) => {
    setNewImage(e.target.files[0]);
  };

  /* UPDATE USER */

  const updateUserHandler = async () => {
    try {
      const formData = new FormData();

      formData.append("firstName", editData.firstName);
      formData.append("lastName", editData.lastName);
      formData.append("address", editData.address);
      formData.append("city", editData.city);
      formData.append("zipcode", editData.zipcode);
      formData.append("phoneNo", editData.phoneNo);
      formData.append("role", editData.role);

      if (newImage) {
        formData.append("file", newImage);
      }

      const res = await axios.put(
        `${serverUrl}/api/v1/user/updateuser/${selectedUser._id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );

      if (res.data.success) {
        toast.success(res.data.message);
        const updatedUsers = users.map((item) =>
          item._id === selectedUser._id ? res.data.user : item,
        );
        setUsers(updatedUsers);
        setOpenDialog(false);
        setNewImage(null);
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
            <h1 className="text-3xl font-bold">Admin Users</h1>
            <p className="text-gray-500 mt-1">Manage all users</p>
          </div>

          {/* SEARCH */}

          <div className="relative w-full md:w-[350px]">
            <Search
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
              size={20}
            />

            <input
              type="text"
              placeholder="Search users..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full border rounded-2xl pl-12 pr-4 py-3 outline-none focus:border-black bg-gray-50"
            />
          </div>
        </div>
      </div>

      {/* USERS */}

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-8">
        {filteredUsers.map((user) => (
          <div
            key={user._id}
            className="bg-white rounded-3xl shadow-sm overflow-hidden"
          >
            {/* IMAGE */}

            <div className="bg-gray-100 p-5 flex items-center justify-center">
              <img
                src={
                  user.profilePic ||
                  "https://cdn-icons-png.flaticon.com/512/149/149071.png"
                }
                alt="user"
                className="h-32 w-32 rounded-full object-cover border-4 border-white shadow-lg"
              />
            </div>

            {/* CONTENT */}

            <div className="p-5 text-center">
              <h1 className="text-xl font-bold">
                {user.firstName} {user.lastName}
              </h1>

              <p className="text-gray-500 text-sm mt-2">{user.email}</p>

              <div className="mt-3">
                <span className="bg-black text-white px-4 py-1 rounded-full text-sm">
                  {user.role}
                </span>
              </div>

              {/* BUTTONS */}

              <div className="flex items-center justify-center gap-3 mt-6">
                {/* VIEW ORDERS */}

                <button
                  onClick={() => navigate(`/dashboard/user/${user._id}`)}
                  className="bg-black hover:bg-gray-800 text-white p-3 rounded-xl flex items-center gap-2"
                >
                  <Edit size={18} /> <span>Edit</span>
                </button>

                {/* EDIT */}

                <Dialog open={openDialog} onOpenChange={setOpenDialog}>
                  <DialogTrigger asChild>
                    <button
                      onClick={() => navigate(`/profile/${users[0]._id}`)}
                      className="bg-blue-500 hover:bg-blue-600 text-white p-3 rounded-xl flex items-center gap-2"
                    >
                      <Eye size={18} /> <span>Show Order</span>
                    </button>
                  </DialogTrigger>

                  <DialogContent className="max-w-3xl rounded-3xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle className="text-2xl">
                        Update User
                      </DialogTitle>
                    </DialogHeader>

                    <div className="space-y-5 mt-5">
                      {/* IMAGE */}

                      <div className="flex flex-col items-center gap-4">
                        <img
                          src={
                            newImage
                              ? URL.createObjectURL(newImage)
                              : selectedUser?.profilePic ||
                                "https://cdn-icons-png.flaticon.com/512/149/149071.png"
                          }
                          alt="profile"
                          className="h-32 w-32 rounded-full object-cover border"
                        />

                        <input type="file" onChange={imageHandler} />
                      </div>

                      {/* INPUTS */}

                      <input
                        type="text"
                        name="firstName"
                        value={editData.firstName}
                        onChange={inputHandler}
                        placeholder="First Name"
                        className="w-full border rounded-2xl px-5 py-4 outline-none"
                      />

                      <input
                        type="text"
                        name="lastName"
                        value={editData.lastName}
                        onChange={inputHandler}
                        placeholder="Last Name"
                        className="w-full border rounded-2xl px-5 py-4 outline-none"
                      />

                      <input
                        type="text"
                        name="address"
                        value={editData.address}
                        onChange={inputHandler}
                        placeholder="Address"
                        className="w-full border rounded-2xl px-5 py-4 outline-none"
                      />

                      <input
                        type="text"
                        name="city"
                        value={editData.city}
                        onChange={inputHandler}
                        placeholder="City"
                        className="w-full border rounded-2xl px-5 py-4 outline-none"
                      />

                      <input
                        type="number"
                        name="zipcode"
                        value={editData.zipcode}
                        onChange={inputHandler}
                        placeholder="Zipcode"
                        className="w-full border rounded-2xl px-5 py-4 outline-none"
                      />

                      <input
                        type="number"
                        name="phoneNo"
                        value={editData.phoneNo}
                        onChange={inputHandler}
                        placeholder="Phone Number"
                        className="w-full border rounded-2xl px-5 py-4 outline-none"
                      />

                      <input
                        type="text"
                        name="role"
                        value={editData.role}
                        onChange={inputHandler}
                        placeholder="Role"
                        className="w-full border rounded-2xl px-5 py-4 outline-none"
                      />

                      {/* UPDATE */}

                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <button className="w-full bg-black text-white py-4 rounded-2xl">
                            Update User
                          </button>
                        </AlertDialogTrigger>

                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Update User ?</AlertDialogTitle>

                            <AlertDialogDescription>
                              This will update user info.
                            </AlertDialogDescription>
                          </AlertDialogHeader>

                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>

                            <AlertDialogAction onClick={updateUserHandler}>
                              Update
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminUsers;
