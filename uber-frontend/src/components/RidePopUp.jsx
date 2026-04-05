import React from "react";

const RidePopUp = (props) => {
  return (
    <div>
      <h5
        className="p-1 text-center w-[93%] absolute top-0"
        onClick={() => {
          props.setRidePopupPanel(false);
        }}
      >
        <i className="text-3xl text-gray-300 ri-arrow-down-wide-line"></i>
      </h5>
      <h3 className="text-xl font-semibold mb-2">New Ride Available!</h3>
      <div className="flex items-center justify-between bg-yellow-300 p-3 rounded-lg">
        <div className="flex items-center justify-start gap-3 ">
          <img
            className="h-12 w-12 rounded-full object-cover "
            src={props.ride?.riderId?.profilePicture || "https://cdn-icons-png.flaticon.com/512/149/149071.png"}
          />
          <div>
            <h4 className="text-lg font-medium capitalize">{props.ride?.riderId?.name}</h4>
            <h5 className="text-sm text-gray-600">
              {" "}
              <span className="font-semibold text-gray-800">2.5 km</span> away
              from you
            </h5>
          </div>
        </div>
      </div>

      <div className="flex justify-between items-center flex-col gap-2">
        <div className="w-full flex flex-col   mt-1">
          <div className="flex items-center gap-3 p-2 border-b-2 border-gray-200">
            <i className="ri-map-pin-fill text-base"></i>
            <div>
              <h3 className="font-medium text-md">Pickup</h3>
              <p className="text-sm -mt-1 text-gray-600 ">
                {props.ride?.pickup?.address}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-2 border-b-2 border-gray-200">
            <i className="ri-stop-fill text-base"></i>
            <div>
              <h3 className="font-medium text-md">Destination</h3>
              <p className="text-sm -mt-1 text-gray-600 ">
                {props.ride?.dropoff?.address}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-2 border-b-2 border-gray-200">
            <i className="ri-route-fill text-base"></i>
            <div>
              <h3 className="font-medium text-md">Distance</h3>
              <p className="text-sm -mt-1 text-gray-600">
                {typeof props.ride?.distance === 'number' ? `${props.ride.distance} km` : '-'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-2 border-b-2 border-gray-200">
            <i className="ri-time-fill text-base"></i>
            <div>
              <h3 className="font-medium text-md">Duration</h3>
              <p className="text-sm -mt-1 text-gray-600">
                {typeof props.ride?.duration === 'number' ? `${props.ride.duration} mins` : '-'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-2 border-b-2 border-gray-200">
            <i className="ri-money-rupee-circle-fill text-base"></i>
            <div>
              {/* <h3 className="font-medium text-base">Selected Payment Option</h3>
              <button className="text-xs -mt-1 text-gray-600 ">
                bkejsbfkndn
              </button> */}
               <h3 className="font-medium text-md">Selected Payment Option</h3>
              <p className="text-sm text-gray-600">{props.ride?.paymentMethod  +" ₹" + props.ride?.estimatedFare}</p>
            </div>
          </div>
        </div>
        
        <div className="mt-3 flex w-full items-center justify-between">
        
        <button
          onClick={() => {
                props.setRidePopupPanel(false);
          }}
          className=" bg-gray-300 font-semibold text-gray-900  px-10 py-3 rounded-lg"
        >
          Ignore
        </button>
        
          <button
          onClick={() => {
            props.setConfirmRidePopupPanel(true);
            //  props.setRidePopupPanel(false);
            props.confirmRide();
          }}
          className=" bg-green-600 font-semibold text-white py-3 px-10  rounded-lg"
        >
          Accept
        </button>

        
        </div>
      </div>
    </div>
  );
};

export default RidePopUp;
