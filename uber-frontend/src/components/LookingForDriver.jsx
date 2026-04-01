import React from 'react'
import { useSelector } from 'react-redux';

const LookingForDriver = (props) => {
  const finalRide = useSelector((state) => state.currentRide.currentRide);

  const pickupAddress = finalRide?.pickup?.address || props.pickupLocation || "-";
  const dropoffAddress = finalRide?.dropoff?.address || props.destinationLocation || "-";
  const paymentMethod = finalRide?.paymentMethod || "-";
  const estimatedFare =
    typeof finalRide?.estimatedFare === "number"
      ? `₹${finalRide.estimatedFare.toFixed(2)}`
      : null;
  const distanceText =
    typeof finalRide?.distance === "number" ? `${finalRide.distance} km` : "-";
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
      <h3 className="text-2xl font-semibold mb-3">Looking for a driver</h3>

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
                  {pickupAddress}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-5 p-3 border-b-2 border-gray-200">
            <i className="ri-stop-fill text-lg"></i>
            <div>
              <h3 className="font-medium text-lg">Destination</h3>
              <p className="text-small -mt-1 text-gray-600 ">
               {dropoffAddress}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-5 p-3 border-b-2 border-gray-200">
            <i className="ri-route-fill text-lg"></i>
            <div>
              <h3 className="font-medium text-lg">Distance</h3>
              <p className="text-small -mt-1 text-gray-600 ">
                {distanceText}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-5 p-3 border-b-2 border-gray-200">
            <i className="ri-money-rupee-circle-fill"></i>
            <div>
              <h3 className="font-medium text-lg">Selected Payment Option</h3>
              <button className="text-small -mt-1 text-gray-600 ">
                {estimatedFare ? `${paymentMethod} • ${estimatedFare}` : paymentMethod}
              </button>
            </div>
          </div>
        </div>
        
      </div>
    </div>
  )
}

export default LookingForDriver