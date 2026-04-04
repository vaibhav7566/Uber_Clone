import React from 'react'

const WaitingForDriver = (props) => {
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
      <h3 className="text-2xl font-semibold mb-3">Meet at the pickup location</h3>


      <div className="flex justify-between items-center flex-col gap-2">

        <div className='flex justify-between gap-15 items-center'>
            <img
          className="h-20 w-20 rounded-full object-cover"
          src= {props.journey?.driver?.userId?.profilePicture || "https://cdn-icons-png.flaticon.com/512/149/149071.png"  }
        />

        <div className='text-right'>
            <h2 className="text-xl font-medium capitalize">{props.journey?.driver?.name}</h2>
                <h4 className='text-lg font-semibold -mt-1 -mb-1'>{props.journey?.driver?.vehicleNumber || "MP 38 MD 5861"}</h4>
                <h4 className='text-sm text-black'>{props.journey?.driver?.vehicleModel || "Maruti Suzuki"}</h4>
                <h5 className="text-black -mt-1"> <i className="ri-star-fill text-yellow-500 "></i> {props.journey?.driver?.rating || 4.5}</h5>
                <h5 className="text-gray-800 text-lg font-bold">OTP: {props.journey?.otp}</h5>
{/* <h4 className="text-gray-600">Driver is on the way</h4> */}
        </div>
        </div>
        
        <div className="w-full flex flex-col   mt-1">
          <div className="flex items-center gap-5 p-3 border-b-2 border-gray-200">
            <i className="ri-map-pin-fill text-lg "></i>
            <div>
              <h3 className="font-medium text-lg">Pickup</h3>
              <p className="text-small -mt-1 text-gray-600 ">
                {props.journey?.pickup?.address}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-5 p-3 border-b-2 border-gray-200">
            <i className="ri-stop-fill text-lg"></i>
            <div>
              <h3 className="font-medium text-lg">Destination</h3>
              <p className="text-small -mt-1 text-gray-600 ">
                {props.journey?.dropoff?.address}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-5 p-3 border-b-2 border-gray-200">
            <i className="ri-money-rupee-circle-fill"></i>
            <div>
              <h3 className="font-medium text-lg">Payment {props.journey?.paymentMethod}</h3>
              <button className="text-small -mt-1 text-gray-700 ">
                Pay ₹{props.journey?.estimatedFare || 250} after ride
              </button>
            </div>
          </div>
        </div>
        
      </div>
    </div>
  )
}

export default WaitingForDriver;