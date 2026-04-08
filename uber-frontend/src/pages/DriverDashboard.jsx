import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../features/auth/authSlice";
import { toast } from "react-toastify";
import DriverDetails from "../components/DriverDetails";
import RidePopUp from "../components/RidePopUp";
import { useEffect, useState } from "react";
import { useGSAP } from "@gsap/react";
import { useRef } from "react";
import gsap from "gsap";
import ConfirmRidePopup from "../components/ConfirmRidePopup";
import { useSocket } from "../hooks/useSocket";
// import { socket } from "socket.io-client";
// const { socket } = useSocket();
import Map from "../components/Map";
import API from "../services/api";


function DriverDashboard() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isConnected, emitEvent, onEvent, offEvent } = useSocket();
  const authState = useSelector((state) => state.auth);

  const [ridePopupPanel, setRidePopupPanel] = useState(false);
  const ridePopupPanelRef = useRef(null);

  const [confirmRidePopupPanel, setConfirmRidePopupPanel] = useState(false);
  const confirmRidePopupPanelRef = useRef(null);

  const [ride, setRide] = useState(null);

  const handleLogout = () => {
    dispatch(logout());
    toast.success("Logged out successfully");
    navigate("/login");
  };

  useEffect(() => {
    if (!isConnected || authState.role !== "DRIVER") {
      return;
    }

    const sendLocation = () => {
      if (!navigator.geolocation) {
        return;
      }

      navigator.geolocation.getCurrentPosition((position) => {
        console.log("DriverDashboard => Emitting location update:", {
          userId: authState.user?._id,
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });

        emitEvent("update-location-driver", {
          userId: authState.user?._id,
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      });
    };

    const intervalId = setInterval(sendLocation, 10000);
    sendLocation();

    return () => clearInterval(intervalId);
  }, [isConnected, authState.role, authState.user?._id, emitEvent]);

  // socket.on("new-journey", (data) => {
  //   console.log("New journey request received:", data);
  //   // setRidePopupPanel(true);
  // });
  useEffect(() => {
    if (!isConnected || authState.role !== "DRIVER") {
      return;
    }

    onEvent("new-journey", (data) => {
      console.log("New journey request received:", data);
      setRide(data);
      setRidePopupPanel(true);
    });

    return () => {
      offEvent("new-journey");
    };
  }, [isConnected, authState.role, onEvent, offEvent]);

  useEffect(() => {
    if (!isConnected || authState.role !== "DRIVER") {
      return;
    }

    onEvent("journey-cancelled-by-rider", (data) => {
      const cancelledJourneyId = data?._id;

      if (!cancelledJourneyId) {
        return;
      }

      if (ride?._id && ride._id !== cancelledJourneyId) {
        return;
      }

      setRide(null);
      setRidePopupPanel(false);
      setConfirmRidePopupPanel(false);
      toast.error("Journey cancelled by rider");
      navigate("/driver/dashboard", { replace: true });
    });

    return () => {
      offEvent("journey-cancelled-by-rider");
    };
  }, [isConnected, authState.role, onEvent, offEvent, ride?._id, navigate]);

    const confirmRide = async () => {
      if (!ride || !ride._id) {
        console.error("Invalid ride data");
        return;
      }
      const journeyId = ride._id;
      const res = await API.post(`/journey/${journeyId}/accept`, {});
      console.log("Ride confirmed response:", res.data);
    }

  useGSAP(
    function () {
      if (ridePopupPanel) {
        gsap.to(ridePopupPanelRef.current, {
          transform: "translateY(0)",
        });
      } else {
        gsap.to(ridePopupPanelRef.current, {
          transform: "translateY(100%)",
        });
      }
    },
    [ridePopupPanel],
  );

  useGSAP(
    function () {
      if (confirmRidePopupPanel) {
        gsap.to(confirmRidePopupPanelRef.current, {
          transform: "translateY(0)",
        });
      } else {
        gsap.to(confirmRidePopupPanelRef.current, {
          transform: "translateY(100%)",
        });
      }
    },
    [confirmRidePopupPanel],
  );
  

  return (
    <div className="h-screen">
      <div className="fixed z-1 p-6 top-0 flex itmes-center justify-between w-screen ">
        <img
          className="w-16 h-6"
          src="https://upload.wikimedia.org/wikipedia/commons/c/cc/Uber_logo_2018.png"
          alt=""
        />

        <button
          onClick={handleLogout}
          className="h-10 w-10 bg-white flex items-center justify-center rounded-full"
        >
          <i className="text-lg font-medium ri-logout-box-r-line"></i>
        </button>
      </div>

      <div className="h-3/5">
        <Map/>
      </div>

      <div className="h-1/2 p-4 overflow-y-auto">
        <DriverDetails />
      </div>
      <div
        ref={ridePopupPanelRef}
        className="fixed w-full z-10 translate-y-full bottom-0  bg-white px-3 py-10 pt-12"
      >
        <RidePopUp
        ride={ride}
          setRidePopupPanel={setRidePopupPanel}
          setConfirmRidePopupPanel={setConfirmRidePopupPanel}
          confirmRide = {confirmRide}
        />
      </div>

      <div
        ref={confirmRidePopupPanelRef}
        className="fixed w-full h-screen z-10 translate-y-full bottom-0  bg-white px-3 py-10 pt-12"
      >
        {console.log("Rendering ConfirmRidePopup with ride data:", ride)}
        <ConfirmRidePopup
            ride={ride}
          setConfirmRidePopupPanel={setConfirmRidePopupPanel}
          setRidePopupPanel={setRidePopupPanel}
        />
      </div>
    </div>
  );
}
export default DriverDashboard;
