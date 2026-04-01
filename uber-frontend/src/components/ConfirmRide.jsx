// for rider to confirm the ride details before confirming the ride request to driver
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createRide } from "../features/ride/currentRideSlice";

const ConfirmRide = (props) => {
  const dispatch = useDispatch();
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const { originCoordinates, destinationCoordinates, selectedVehicle } = useSelector(
    (state) => state.ride,
  );

  const handleConfirm = async () => {
    if (!originCoordinates || !destinationCoordinates || !selectedVehicle) {
      return;
    }

    const payload = {
      pickupAddress: props.pickupLocation,
      pickupCoordinates: [originCoordinates.lng, originCoordinates.lat],
      dropoffAddress: props.destinationLocation,
      dropoffCoordinates: [destinationCoordinates.lng, destinationCoordinates.lat],
      vehicleType: selectedVehicle.vehicleType,
      paymentMethod: paymentMethod.toUpperCase(),
      estimatedFare: Number(selectedVehicle.estimatedFare),
      distance: Number(selectedVehicle.distanceKm),
      duration: Number(selectedVehicle.durationMin),
    };

    try {
      await dispatch(createRide(payload)).unwrap();
      props.setvehicleFound(true);
      props.setConfirmRidePanel(false);
      props.setVehiclePanelOpen(false);
    } catch (error) {
      console.error("Failed to create ride:", error);
    }
  };

  return (
    <div>
      <h5
        className="p-1 text-center w-[93%] absolute top-0"
        onClick={() => {
          props.setVehiclePanelOpen(false);
            props.setConfirmRidePanel(false);
            }}
            >
            <i className="text-3xl text-gray-300 ri-arrow-down-wide-line"></i>
            </h5>
            <h3 className="text-2xl font-semibold mb-3">Confirm Your Ride</h3>

            <div className="flex justify-between items-center flex-col gap-2">
            <img
            className="h-20"
            src="https://swyft.pl/wp-content/uploads/2023/05/how-many-people-can-a-uberx-take.jpg"
            alt=""
            />
            <div className="w-full flex flex-col   mt-1">
            <div className="flex items-center gap-5 p-3 border-b-2 border-gray-200">
            <i className="ri-map-pin-fill text-lg "></i>
            <div>
              <h3 className="font-medium text-lg">Pickup</h3>
              <p className="text-small -mt-1 text-gray-600 ">
              {props.pickupLocation}
              </p>
            </div>
            </div>
            <div className="flex items-center gap-5 p-3 border-b-2 border-gray-200">
            <i className="ri-stop-fill text-lg"></i>
            <div>
              <h3 className="font-medium text-lg">Destination</h3>
              <p className="text-small -mt-1 text-gray-600 ">
              {props.destinationLocation}
              </p>
            </div>
            </div>
            <div className="flex items-center gap-5 p-3 border-b-2 border-gray-200">
            <i className="ri-money-rupee-circle-fill"></i>
            
              <div>
                <h3 className="font-medium text-lg">Select Payment Option</h3>
                <select
                  className=""
                  value={paymentMethod}
                  onChange={(event) => setPaymentMethod(event.target.value)}
                >
                  <option className="" value="cash">Cash</option>
                  <option value="upi">UPI</option>
                </select>
              </div>
            
            </div>
            </div>
            </div>
            <button onClick={handleConfirm} className="w-full mt-5 bg-green-600 font-semibold text-white py-3 rounded-lg">
          Confirm
        </button>
      </div>
    
  );
};

export default ConfirmRide;
