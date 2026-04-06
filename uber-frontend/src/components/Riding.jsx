import React, { useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useSocket } from "../hooks/useSocket";
import Map from "../components/Map";

const Riding = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { onEvent, offEvent } = useSocket();
  const journey = location.state?.journey || null;

  useEffect(() => {
    onEvent("journey-completed", () => {
      toast.success("Ride is successfully finished");
      navigate("/rider/home");
    });

    return () => {
      offEvent("journey-completed");
    };
  }, [navigate, onEvent, offEvent]);

  return (
    <div className="h-screen ">
      <Link
        to="/rider/home"
        className="fixed right-2 top-2 z-50 h-10 w-10 bg-white flex items-center justify-center rounded-full"
      >
        <i className="text-lg font-medium ri-home-5-line"></i>
      </Link>
       <div className="fixed top-0 left-0 w-full z-40 px-5 pt-4 pb-2 flex items-center justify-between pointer-events-none">
                <img
                  className="w-16 h-auto block"
                  src="https://upload.wikimedia.org/wikipedia/commons/c/cc/Uber_logo_2018.png"
                  alt="Uber"
                />

              </div>
      <div className="h-1/2">
       <Map/>
      </div>
      <div className="h-1/2 p-4 mb-2">
        <div className="flex items-center justify-between">
          <img
            className="h-12"
            src="https://swyft.pl/wp-content/uploads/2023/05/how-many-people-can-a-uberx-take.jpg"
            alt=""
          />
          <div className="text-right">
            <h2 className="text-lg font-medium capitalize">{journey?.driver?.name || "Driver"}</h2>
            <h4 className="text-xl font-semibold -mt-1 -mb-1">{journey?.driver?.vehicleNumber || "-"}</h4>
            <p className="text-sm text-gray-600">{journey?.driver?.vehicleModel || "Vehicle details unavailable"}</p>
          </div>
        </div>

        <div className="flex  justify-between flex-col items-center">
          <div className="w-full mt-3">
            <div className="flex items-center gap-5 p-3 border-b-2">
              <i className="text-lg ri-map-pin-2-fill"></i>
              <div>
                <h3 className="text-lg font-medium">Destination</h3>
                <p className="text-sm  text-gray-600">
                  {journey?.dropoff?.address || "Destination location unavailable"}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-5 p-3">
              <i className="ri-currency-line"></i>
              <div>
                <h3 className="text-lg font-medium">₹{journey?.actualFare ?? journey?.estimatedFare ?? 0}</h3>
                <p className="text-sm -mt-1 text-gray-600">{journey?.paymentMethod || "Payment method unavailable"}</p>
              </div>
            </div>
          </div>
        </div>
        <button className="w-full mt-3 bg-green-600 text-white font-semibold p-2 rounded-lg">
          Make a Payment
        </button>
      </div>
    </div>
  );
};

export default Riding;
