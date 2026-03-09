import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import React, { useRef, useState } from "react";
import { Link } from "react-router-dom";
import FinishRide from "../components/FinishRide";

const DriverRiding = () => {

    const [finishRidePanel, setFinishRidePanel] = useState(false);
    const finishRidePanelRef = useRef(null);

    useGSAP(
    function () {
      if (finishRidePanel) {
        gsap.to(finishRidePanelRef.current, {
          transform: "translateY(0)",
        });
      } else {
        gsap.to(finishRidePanelRef.current, {
          transform: "translateY(100%)",
        });
      }
    },
    [finishRidePanel],
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

      <div className="h-4/5">
        <img
          className="h-full w-full object-cover"
          src="https://miro.medium.com/v2/resize:fit:1400/0*gwMx05pqII5hbfmX.gif"
          alt=""
        />
      </div>
      <div className="h-1/5 p-6 bg-amber-400 flex items-center relative justify-between"
        onClick={()=> {
            setFinishRidePanel(true);
        }}
      >
        <h5
          className="p-1 text-center w-[93%] absolute top-0"
          onClick={() => {}}
        >
          <i className="text-3xl text-gray-700 ri-arrow-up-wide-line"></i>
        </h5>

        <h2 className="text-lg font-semibold">2.5 KM away</h2>
        <button className="bg-green-600 text-white p-3 px-10  rounded-lg mt-3">
          End Ride
        </button>
      </div>

      <div
        ref={finishRidePanelRef}
        className="fixed w-full px-2 z-10 translate-y-full bottom-0 bg-white py-10 pt-12"
      >
        <FinishRide setFinishRidePanel={setFinishRidePanel} />
      </div>
    </div>
  );
};

export default DriverRiding;
