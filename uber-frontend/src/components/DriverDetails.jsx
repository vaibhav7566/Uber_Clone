import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import API from "../services/api";

const DriverDetails = () => {
  const currentUser = useSelector((state) => state.auth.user);
  const [isOnline, setIsOnline] = useState(false);
  const [isStatusLoading, setIsStatusLoading] = useState(true);
  const [isToggling, setIsToggling] = useState(false);

  useEffect(() => {
    const fetchDriverStatus = async () => {
      try {
        const response = await API.get("/driver/me");
        const onlineStatus = Boolean(response?.data?.data?.status?.isOnline);
        setIsOnline(onlineStatus);
      } catch (error) {
        console.error("Failed to load driver status:", error);
      } finally {
        setIsStatusLoading(false);
      }
    };

    fetchDriverStatus();
  }, []);

  const handleToggleStatus = async () => {
    if (isToggling || isStatusLoading) {
      return;
    }

    const nextStatus = !isOnline;

    try {
      setIsToggling(true);
      const response = await API.patch("/driver/me/status", {
        isOnline: nextStatus,
      });

      console.log("DriverDetails => Status update response:", response);
      const updatedStatus = response?.data?.data?.status?.isOnline;
      setIsOnline(typeof updatedStatus === "boolean" ? updatedStatus : nextStatus);

      toast.success(nextStatus ? "You are now online" : "You are now offline");
    } catch (error) {
      const message =
        error?.response?.data?.message || "Failed to update status";
      toast.error(message);
    } finally {
      setIsToggling(false);
    }
  };

  return (
    <div className="w-full h-full overflow-hidden rounded-3xl bg-white shadow-sm border border-gray-100 p-3 sm:p-4 flex flex-col">

      <button
        onClick={handleToggleStatus}
        disabled={isStatusLoading || isToggling}
        className={`w-full py-2.5 mb-3 text-white rounded-xl font-semibold transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed ${
          isOnline
            ? "bg-gray-700 hover:bg-gray-800"
            : "bg-green-600 hover:bg-green-700"
        }`}
      >
        {isStatusLoading
          ? "LOADING..."
          : isToggling
            ? "UPDATING..."
            : isOnline
              ? "GO OFFLINE"
              : "GO ONLINE"}
      </button>

      <div className="flex items-center justify-between gap-3 mb-3">
        <div className="flex items-center gap-3 min-w-0">
          <img
            className="h-10 w-10 rounded-xl object-cover border border-gray-200"
            src="https://imgs.search.brave.com/Jp_TVZo6jxEYGqfKhL2ccL630RX-lmTFERJqJ6oa-ww/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9waG90/b3N3ZWVrLmluL3dw/LWNvbnRlbnQvdXBs/b2Fkcy9BZXN0aGV0/aWMtR2lybC1QaWMu/anBn"
            alt="Driver profile"
          />
          <div className="min-w-0">
            <h4 className="text-base font-semibold text-gray-900 truncate">
              {currentUser?.name || "Driver"}
            </h4>
            <p className="text-xs text-gray-500">Ready for your next ride</p>
          </div>
        </div>

        <div className="text-right shrink-0">
          <h4 className="text-xl font-bold text-gray-900">₹310</h4>
          <p className="text-xs text-gray-500">Earned Today</p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2 mb-3">
        <div className="rounded-xl bg-gray-50 border border-gray-100 p-2 text-center">
          <i className="text-xl text-gray-700 ri-timer-2-line"></i>
          <h5 className="text-sm font-semibold text-gray-900 mt-1">10.2</h5>
          <p className="text-[11px] text-gray-500 leading-tight">
            Hours Online
          </p>
        </div>

        <div className="rounded-xl bg-gray-50 border border-gray-100 p-2 text-center">
          <i className="text-xl text-gray-700 ri-road-map-line"></i>
          <h5 className="text-sm font-semibold text-gray-900 mt-1">15</h5>
          <p className="text-[11px] text-gray-500 leading-tight">Rides Done</p>
        </div>

        <div className="rounded-xl bg-gray-50 border border-gray-100 p-2 text-center">
          <i className="text-xl text-gray-700 ri-star-smile-line"></i>
          <h5 className="text-sm font-semibold text-gray-900 mt-1">4.9</h5>
          <p className="text-[11px] text-gray-500 leading-tight">Rating</p>
        </div>
      </div>
    </div>
  );
};

export default DriverDetails;
