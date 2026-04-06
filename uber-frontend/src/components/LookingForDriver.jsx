import React, { useState } from 'react'
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import API from '../services/api';

const LookingForDriver = (props) => {
  const finalRide = useSelector((state) => state.currentRide.currentRide);
  const [isCancelling, setIsCancelling] = useState(false);

  const pickupAddress = finalRide?.pickup?.address || props.pickupLocation || "-";
  const dropoffAddress = finalRide?.dropoff?.address || props.destinationLocation || "-";
  const paymentMethod = finalRide?.paymentMethod || "-";
  const estimatedFare =
    typeof finalRide?.estimatedFare === "number"
      ? `₹${finalRide.estimatedFare.toFixed(2)}`
      : null;
  const distanceText =
    typeof finalRide?.distance === "number" ? `${finalRide.distance} km` : "-";

  const handleCancelRide = async () => {
    if (!finalRide?._id) {
      toast.error("Journey not found");
      return;
    }

    try {
      setIsCancelling(true);
      const response = await API.post(`/journey/${finalRide._id}/cancel`, {
        cancelledBy: "RIDER",
      });

      if (response.data?.success) {
        props.setvehicleFound(false);
        toast.success("Ride cancelled successfully");
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Failed to cancel ride";
      toast.error(errorMessage);
    } finally {
      setIsCancelling(false);
    }
  };

  return (
    <div>
      <h5
        className="p-1 text-center w-[93%] absolute top-0"
        onClick={() => {
          props.setvehicleFound(false);
        }}
      >
        <i className="text-3xl text-gray-300 ri-arrow-down-wide-line"></i>
      </h5>
      <h3 className="text-xl font-semibold mb-2">Looking for a driver</h3>

      <div className="flex justify-between items-center flex-col gap-1">
        <img
          className="h-16"
          src="https://swyft.pl/wp-content/uploads/2023/05/how-many-people-can-a-uberx-take.jpg"
          alt=""
        />
        <div className="w-full flex flex-col   mt-1">
          <div className="flex items-center gap-4 p-2.5 border-b-2 border-gray-200">
            <i className="ri-map-pin-fill text-base"></i>
            <div>
              <h3 className="font-medium text-base">Pickup</h3>
              <p className="text-sm -mt-1 text-gray-600">
                  {pickupAddress}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4 p-2.5 border-b-2 border-gray-200">
            <i className="ri-stop-fill text-base"></i>
            <div>
              <h3 className="font-medium text-base">Destination</h3>
              <p className="text-sm -mt-1 text-gray-600">
               {dropoffAddress}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4 p-2.5 border-b-2 border-gray-200">
            <i className="ri-route-fill text-base"></i>
            
            <div>
              <h3 className="font-medium text-base">Distance</h3>
              <p className="text-sm -mt-1 text-gray-600">
                {distanceText}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4 p-2.5 border-b-2 border-gray-200">
            <i className="ri-time-fill text-base"></i>
            <div>
              <h3 className="font-medium text-base">Duration</h3>
              <p className="text-sm -mt-1 text-gray-600">
                {Math.round(finalRide?.duration || 0)} mins
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4 p-2.5 border-b-2 border-gray-200">
            <i className="ri-money-rupee-circle-fill text-base"></i>
            <div>
              <h3 className="font-medium text-base">Selected Payment Option</h3>
              <button className="text-sm -mt-1 text-gray-600">
                {estimatedFare ? `${paymentMethod} • ${estimatedFare}` : paymentMethod}
              </button>
            </div>
          </div>

          <div className='w-full mt-2 flex justify-center'  >
              <button className="text-md mt-1 px-10 py-2 font-bold leading-tight border-gray-400 border rounded-lg text-red-600 disabled:opacity-50 disabled:cursor-not-allowed" onClick={handleCancelRide} disabled={isCancelling}>
                {isCancelling ? "Cancelling..." : "Cancel Ride"}
              </button>
            </div>
        </div>
        
      </div>
    </div>
  )
}

export default LookingForDriver