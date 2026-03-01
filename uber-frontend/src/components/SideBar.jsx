// import React from "react";

// const Sidebar = ({ menuOpen, setMenuOpen }) => {
//   return (
//     <>
//       {/* DARK OVERLAY */}
//       <div
//         onClick={() => setMenuOpen(false)}
//         className={`fixed inset-0 bg-black/40 z-40 transition-opacity duration-300
//         ${menuOpen ? "opacity-100 visible" : "opacity-0 invisible"}`}
//       ></div>

//       {/* SLIDING PANEL */}
//       <div
//         className={`fixed top-0 right-0 h-full w-72 bg-white shadow-xl z-50
//         transform transition-transform duration-300 ease-in-out
//         ${menuOpen ? "translate-x-13" : "translate-x-full"}`}
//       >
//         <div className="p-6 flex flex-col h-full">

//           {/* HEADER */}
//           <div className="flex justify-between items-center border-b pb-4">
//             <h2 className="text-lg font-semibold">Menu</h2>
//             <i
//               onClick={() => setMenuOpen(false)}
//               className="ri-close-line text-2xl cursor-pointer"
//             ></i>
//           </div>

//           {/* MENU ITEMS */}
//           <div className="flex flex-col gap-5 mt-6 text-lg">
//             <button className="text-left hover:text-gray-600">👤  Profile</button>
//             <button className="text-left hover:text-gray-600">📜 Activity History</button>
//             <button className="text-left hover:text-gray-600">🚗 Earn by Driving</button>
//             <button className="text-left text-red-500 hover:text-red-600">🚪 Logout</button>
//           </div>

//         </div>
//       </div>
//     </>
//   );
// };

// export default Sidebar;

import React from "react";
import { useNavigate } from "react-router-dom";

const Sidebar = ({ menuOpen, setMenuOpen }) => {
  const navigate = useNavigate();

  return (
    <>
      {/* OVERLAY */}
      <div
        onClick={() => setMenuOpen(false)}
        className={`fixed inset-0 bg-black/40 z-40 transition-opacity duration-300
        ${menuOpen ? "opacity-100 visible" : "opacity-0 invisible"}`}
      ></div>

      {/* SLIDING PANEL */}
      <div
        className={`fixed top-0 right-0 h-full w-72 bg-white shadow-xl z-50
        transform transition-transform duration-300 ease-in-out
        ${menuOpen ? "translate-x-0" : "translate-x-full"}`}
      >
        <div className="p-6 flex flex-col h-full">
          {/* HEADER */}
          <div className="flex justify-between items-center border-b pb-4">
            <h2 className="text-lg font-semibold">Menu</h2>

            {/* CLOSE BUTTON */}
            <button
              onClick={() => setMenuOpen(false)}
              className="text-2xl hover:text-gray-600"
            >
              <i className="ri-close-line"></i>
            </button>
          </div>

          {/* MENU ITEMS */}
          <div className="flex flex-col gap-6 mt-6 text-lg">
            <button className="flex items-center gap-3 hover:text-gray-600">
              <i className="ri-user-line text-xl"></i>
              Profile
            </button>

            <button className="flex items-center gap-3 hover:text-gray-600">
              <i className="ri-file-list-3-line text-xl"></i>
              Activity History
            </button>

            <button className="flex items-center gap-3 hover:text-gray-600">
              <i className="ri-customer-service-2-line text-xl"></i>
              Services
            </button>

            <button 
              onClick={() => {
                setMenuOpen(false);
                navigate("/driver/registration");
              }} 
              className="flex items-center gap-3 hover:text-gray-600"
            >
              <i className="ri-car-line text-xl"></i>
              Earn by Driving
            </button>

            <button className="flex items-center gap-3 text-red-500 hover:text-red-600 mt-auto">
              <i className="ri-logout-box-r-line text-xl"></i>
              Logout
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
