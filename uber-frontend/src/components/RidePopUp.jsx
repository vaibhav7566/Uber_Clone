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
      <h3 className="text-2xl font-semibold mb-3">New Ride Available!</h3>
      <div className="flex items-center justify-between bg-yellow-300 p-3 rounded-lg">
        <div className="flex items-center justify-start gap-3 ">
          <img
            className="h-12 w-12 rounded-full object-cover "
            src="https://imgs.search.brave.com/1RzVI4Bh8Vme04AJSqCVk66wDeDYkjV3hccATEFNWUo/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9tZWRp/YS5pc3RvY2twaG90/by5jb20vaWQvMTM2/NTEwNjU5Ni9waG90/by9hZG9yYWJsZS10/ZWVuYWdlLWdpcmwt/bG9va2luZy1hdC10/aGUtY2FtZXJhLW91/dGRvb3JzLmpwZz9z/PTYxMng2MTImdz0w/Jms9MjAmYz1GQXhk/SjZPcmVHUTRRa2xB/aWJuVjRHbDRBRmtv/ZjFBT1VFT0NtWWRl/UU9ZPQ"
            alt=""
          />
          <div>
            <h4 className="text-lg font-medium">John Doe</h4>
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
          <div className="flex items-center gap-5 p-3 border-b-2 border-gray-200">
            <i className="ri-map-pin-fill text-lg "></i>
            <div>
              <h3 className="font-medium text-lg">562/11-A</h3>
              <p className="text-small -mt-1 text-gray-600 ">
                Kankariya Talab Ahmedabad
              </p>
            </div>
          </div>
          <div className="flex items-center gap-5 p-3 border-b-2 border-gray-200">
            <i className="ri-stop-fill text-lg"></i>
            <div>
              <h3 className="font-medium text-lg">562/11-A</h3>
              <p className="text-small -mt-1 text-gray-600 ">
                Kankariya Talab Ahmedabad
              </p>
            </div>
          </div>
          <div className="flex items-center gap-5 p-3 border-b-2 border-gray-200">
            <i className="ri-money-rupee-circle-fill"></i>
            <div>
              <h3 className="font-medium text-lg">Select Payment Option</h3>
              <button className="text-small -mt-1 text-gray-600 ">
                bkejsbfkndn
              </button>
            </div>
          </div>
        </div>
        
        <div className="mt-5 flex w-full items-center justify-between">
        
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
