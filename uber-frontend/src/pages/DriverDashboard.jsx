import { Link } from "react-router-dom";
import DriverDetails from "../components/DriverDetails";
import RidePopUp from "../components/RidePopUp";
import { useState } from "react";
import { useGSAP } from "@gsap/react";
import { useRef } from "react";
import gsap from "gsap";
import ConfirmRidePopup from "../components/ConfirmRidePopup";

function DriverDashboard() {
  const [ridePopupPanel, setRidePopupPanel] = useState(true);
  const ridePopupPanelRef = useRef(null);
  
  const [confirmRidePopupPanel, setConfirmRidePopupPanel] = useState(false);
  const confirmRidePopupPanelRef = useRef(null);

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
      <div className="fixed p-6 top-0 flex itmes-center justify-between w-screen ">
        <img
          className="w-16 h-6"
          src="https://upload.wikimedia.org/wikipedia/commons/c/cc/Uber_logo_2018.png"
          alt=""
        />
        <Link
          to="/driver/dashboard"
          className="h-10 w-10 bg-white flex items-center justify-center rounded-full"
        >
          <i className="text-lg font-medium ri-logout-box-r-line"></i>
        </Link>
      </div>

      <div className="h-3/5">
        <img
          className="h-full w-full object-cover"
          src="https://miro.medium.com/v2/resize:fit:1400/0*gwMx05pqII5hbfmX.gif"
          alt=""
        />
      </div>
      <div className="h-2/5 p-6">
        <DriverDetails />
      </div>
      <div ref={ridePopupPanelRef} className="fixed w-full z-10 translate-y-full bottom-0  bg-white px-3 py-10 pt-12">
        <RidePopUp setRidePopupPanel={setRidePopupPanel} setConfirmRidePopupPanel={setConfirmRidePopupPanel} />
      </div>

        <div ref={confirmRidePopupPanelRef} className="fixed w-full h-screen z-10 translate-y-full bottom-0  bg-white px-3 py-10 pt-12">
          <ConfirmRidePopup setConfirmRidePopupPanel={setConfirmRidePopupPanel} setRidePopupPanel={setRidePopupPanel} />
        </div>
    </div>
  );
}
export default DriverDashboard;
