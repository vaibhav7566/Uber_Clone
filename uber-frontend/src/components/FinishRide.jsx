import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import API from '../services/api';

const FinishRide = (props) => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const endRideHandler = async () => {
    const journeyId = props.journey?._id;

    if (!journeyId) {
      toast.error("Journey not found");
      return;
    }

    try {
      setIsSubmitting(true);
      const response = await API.post(`/journey/${journeyId}/complete`, {});

      if (response.data?.success) {
        toast.success("Ride finished successfully");
        props.setFinishRidePanel(false);
        navigate("/driver/dashboard");
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Failed to finish ride";
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <h5
        className="p-1 text-center w-[93%] absolute top-0"
        onClick={() => {
          props.setFinishRidePanel(false);
        }}
      >
        <i className="text-3xl text-gray-300 ri-arrow-down-wide-line"></i>
      </h5>
      <h3 className="text-2xl font-semibold mb-6 flex items-center justify-center ">
        Finish this Ride
      </h3>
      <div className="flex items-center justify-between border-2 border-yellow-400 p-3 rounded-lg">
        <div className="flex items-center justify-start gap-3 ">
          <img
            className="h-12 w-12 rounded-full object-cover "
            src="https://imgs.search.brave.com/1RzVI4Bh8Vme04AJSqCVk66wDeDYkjV3hccATEFNWUo/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9tZWRp/YS5pc3RvY2twaG90/by5jb20vaWQvMTM2/NTEwNjU5Ni9waG90/by9hZG9yYWJsZS10/ZWVuYWdlLWdpcmwt/bG9va2luZy1hdC10/aGUtY2FtZXJhLW91/dGRvb3JzLmpwZz9z/PTYxMng2MTImdz0w/Jms9MjAmYz1GQXhk/SjZPcmVHUTRRa2xB/aWJuVjRHbDRBRmtv/ZjFBT1VFT0NtWWRl/UU9ZPQ"
            alt=""
          />
          <div>
            <h4 className="text-lg font-medium capitalize">{props.journey?.rider?.name || "John Doe"}</h4>
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
              <h3 className="font-medium text-lg">Pickup</h3>
              <p className="text-small -mt-1 text-gray-600 ">
                {props.journey?.pickup?.address || "Kankariya Talab Ahmedabad"}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-5 p-3 border-b-2 border-gray-200">
            <i className="ri-stop-fill text-lg"></i>
            <div>
              <h3 className="font-medium text-lg">Destination</h3>
              <p className="text-small -mt-1 text-gray-600 ">
                {props.journey?.dropoff?.address || "Kankariya Talab Ahmedabad"}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-5 p-3 border-b-2 border-gray-200">
            <i className="ri-money-rupee-circle-fill"></i>
            <div>
              <h3 className="font-medium text-lg">Total Fare</h3>
              <button className="text-small -mt-1 text-gray-600 ">
                {`Pay ₹${props.journey?.estimatedFare || 250} via ${props.journey?.paymentMethod}`}
              </button>
            </div>
          </div>
        </div>
        

       <div className="mt-2 w-full">
            <button
          onClick={endRideHandler}
          disabled={isSubmitting}
          className="w-full mt-5 bg-green-600 text-lg font-semibold text-white flex justify-center py-3 rounded-lg"
        >
          {isSubmitting ? "Finishing..." : "Finish Ride"}
        </button>
        <p className='mt-7 text-xs '>Click on finish ride if you have completed the payment.</p>
      
       </div>
      </div>
    </div>
  )
}

export default FinishRide