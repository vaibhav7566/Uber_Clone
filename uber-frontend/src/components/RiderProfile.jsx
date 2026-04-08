import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import API from "../services/api";

const RiderProfile = () => {
  const authUser = useSelector((state) => state.auth.user);
  const [rider, setRider] = useState({
    name: "Rohit Sharma",
    email: "sha@gmail.com",
    phone: "9876543221",
    role: "RIDER",
    isActive: true,
  });

  useEffect(() => {
    const fetchProfile = async () => {
      if (!authUser?._id) {
        return;
      }

      try {
        const response = await API.get(`/profile/${authUser._id}/welcome`);
        const profile = response.data?.data;

        if (profile) {
          setRider((current) => ({
            ...current,
            name: profile.name || current.name,
            email: profile.email || current.email,
            role: profile.role || current.role,
            isActive: true,
          }));
        }
      } catch (error) {
        void error;
      }
    };

    fetchProfile();
  }, [authUser?._id]);

//   return (
//     <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      
//       {/* Card */}
//       <div className="w-full max-w-sm bg-white rounded-2xl shadow-lg p-6">

//         {/* Profile Image */}
//         <div className="flex flex-col items-center">
//           <img
//             src="https://i.pravatar.cc/150?img=12"
//             alt="profile"
//             className="w-24 h-24 rounded-full object-cover border-4 border-gray-200"
//           />
//           <h2 className="mt-3 text-xl font-semibold">{rider.name}</h2>
//           <p className="text-sm text-gray-500">{rider.role}</p>
//         </div>

//         {/* Info Section */}
//         <div className="mt-6 space-y-4">

//           <div className="flex justify-between">
//             <span className="text-gray-500">Email</span>
//             <span className="font-medium">{rider.email}</span>
//           </div>

//           <div className="flex justify-between">
//             <span className="text-gray-500">Phone</span>
//             <span className="font-medium">{rider.phone}</span>
//           </div>

//           <div className="flex justify-between items-center">
//             <span className="text-gray-500">Status</span>
//             <span
//               className={`px-3 py-1 rounded-full text-sm ${
//                 rider.isActive
//                   ? "bg-green-100 text-green-600"
//                   : "bg-red-100 text-red-600"
//               }`}
//             >
//               {rider.isActive ? "Active" : "Inactive"}
//             </span>
//           </div>
//         </div>

//         {/* Button */}
//         <button className="w-full mt-6 bg-black text-white py-2 rounded-lg hover:bg-zinc-800 transition">
//           Edit Profile
//         </button>
//       </div>
//     </div>
//   );

return (
  <div className="min-h-screen bg-gradient-to-b from-gray-100 to-gray-200 flex items-center justify-center p-4">
    
    {/* Card */}
    <div className="w-full max-w-sm bg-white rounded-3xl shadow-xl p-6">
      <button
        type="button"
        onClick={() => window.history.back()}
        className="mb-4 inline-flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-900"
      >
        <i className="ri-arrow-left-line text-lg"></i>
        
      </button>

      {/* Profile Section */}
      <div className="flex flex-col items-center">

        {/* Avatar (No random person) */}
        <div className="w-24 h-24 rounded-full bg-black text-white flex items-center justify-center text-3xl font-bold shadow-md capitalize">
          {rider.name?.charAt(0)}
        </div>

        <h2 className="mt-4 text-xl font-semibold text-gray-800">
          {rider.name}
        </h2>

        <p className="text-sm text-gray-500 tracking-wide">
          {rider.role}
        </p>

        {/* ✨ Quote */}
        <p className="mt-3 text-xs text-gray-400 text-center px-4 italic">
          "Ride smarter, travel faster — your journey starts with us 🚗"
        </p>
      </div>

      {/* Divider */}
      <div className="my-5 border-t border-gray-200"></div>

      {/* Info Section */}
      <div className="space-y-4 text-sm">

        <div className="flex justify-between items-center bg-gray-50 px-3 py-2 rounded-lg">
          <span className="text-gray-500">Email</span>
          <span className="font-medium text-gray-800">{rider.email}</span>
        </div>

        <div className="flex justify-between items-center bg-gray-50 px-3 py-2 rounded-lg">
          <span className="text-gray-500">Phone</span>
          <span className="font-medium text-gray-800">{rider.phone}</span>
        </div>

        <div className="flex justify-between items-center bg-gray-50 px-3 py-2 rounded-lg">
          <span className="text-gray-500">Status</span>
          <span
            className={`px-3 py-1 rounded-full text-xs font-medium ${
              rider.isActive
                ? "bg-green-100 text-green-600"
                : "bg-red-100 text-red-600"
            }`}
          >
            {rider.isActive ? "Active" : "Inactive"}
          </span>
        </div>
      </div>

      {/* Button */}
      <button className="w-full mt-6 bg-black text-white py-2.5 rounded-xl font-medium hover:bg-zinc-800 transition shadow">
        Edit Profile
      </button>

    </div>
  </div>
);
};

export default RiderProfile;