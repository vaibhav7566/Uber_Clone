import React from 'react'
import API from '../services/api';
import { toast } from 'react-toastify';

const WaitingForDriver = (props) => {
  // console.log("WaitingForDriver => Received journey prop:", props.journey);

  const handleCancelRide = async () => {
    try {
      await API.post(`/journey/${props.journey?._id}/cancel`, {
        cancelledBy: 'RIDER',
      });

      toast.success('Ride cancelled successfully');
      props.setWaitingForDriver(false);
      if (typeof props.setRideStarted === 'function') {
        props.setRideStarted(true);
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || 'Failed to cancel ride';
      toast.error(errorMessage);
    }
  };

  return (
    <div>
      <h5
        className="p-1 text-center w-[93%] absolute top-0"
        onClick={() => {
          props.setWaitingForDriver(false);
          
        }}
      >
        <i className="text-3xl text-gray-300 ri-arrow-down-wide-line"></i>
      </h5>
      <h3 className="text-xl font-semibold mb-2">Meet at the pickup location</h3>


      <div className="flex justify-between items-center flex-col gap-1.5">

        <div className='flex justify-between gap-10 items-center'>
            <img
          className="h-16 w-16 rounded-full object-cover"
          src= {props.journey?.driver?.userId?.profilePicture || "https://cdn-icons-png.flaticon.com/512/149/149071.png"  }
        />

        <div className='text-right flex flex-col items-end gap-0.5'>
            <h2 className="text-lg font-medium capitalize">{props.journey?.driver?.name}</h2>
                <h4 className='text-base font-semibold -mt-1 -mb-1'>{props.journey?.driver?.vehicleNumber || "MP 38 MD 5861"}</h4>
                <h4 className='text-xs text-black'>{props.journey?.driver?.vehicleModel || "Maruti Suzuki"}</h4>
                <h5 className="text-sm text-black -mt-1"> <i className="ri-star-fill text-yellow-500 "></i> {props.journey?.driver?.rating || 4.5}</h5>
                <h5 className="text-gray-800 text-base font-bold">OTP: {props.journey?.otp}</h5>
{/* <h4 className="text-gray-600">Driver is on the way</h4> */}
        </div>
        </div>
        
        <div className="w-full flex flex-col mt-1">
          <div className="flex items-center gap-4 p-2.5 border-b-2 border-gray-200">
            <i className="ri-map-pin-fill text-base "></i>
            <div>
              <h3 className="font-medium text-base">Pickup</h3>
              <p className="text-sm -mt-1 text-gray-600 ">
                {props.journey?.pickup?.address}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4 p-2.5 border-b-2 border-gray-200">
            <i className="ri-stop-fill text-base"></i>
            <div>
              <h3 className="font-medium text-base">Destination</h3>
              <p className="text-sm -mt-1 text-gray-600 ">
                {props.journey?.dropoff?.address}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4 p-2.5 border-b-2 border-gray-200">
            <i className="ri-money-rupee-circle-fill text-base"></i>
            <div>
              <h3 className="font-medium text-base">Payment {props.journey?.paymentMethod}</h3>
              <button className="text-sm -mt-1 text-gray-700 ">
                Pay ₹{props.journey?.estimatedFare || 250} after ride
              </button>
            </div>
          </div>

<div>
  <button className="bg-red-500 text-white py-2 w-full mt-3 rounded-md hover:bg-blue-600 text-sm" onClick={handleCancelRide}>
    Cancel Ride
  </button>
</div>

        </div>
        
      </div>
    </div>
  )
}

export default WaitingForDriver;