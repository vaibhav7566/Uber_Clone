// for DriverDashboard.jsx

import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import API from "../services/api";
import { useNavigate } from "react-router-dom";

const ConfirmRidePopup = (props) => {
  const [otp, setOtp] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setOtp("");
  }, [props.ride?._id]);

  const submitHandler = async (e) => {
    e.preventDefault();
    const normalizedOtp = otp.trim();

    if (!normalizedOtp) {
      toast.error("Please enter OTP");
      return;
    }

    if (!/^\d+$/.test(normalizedOtp)) {
      toast.error("OTP should contain only numbers");
      return;
    }

    if (!/^\d{4}$/.test(normalizedOtp)) {
      toast.error("OTP should be exactly 4 digits");
      return;
    }

    try {
      setIsSubmitting(true);
      
      const response = await API.patch(
        `/journey/${props.ride?._id}/status`,
        {
          status: "STARTED",
          otp: normalizedOtp,
        }
      );

      if (response.data.success) {
        toast.success("Journey started successfully!");
        setOtp("");
        props.setConfirmRidePopupPanel(false);
        props.setRidePopupPanel(false);
        navigate("/driver/riding", { state: { journey: response.data.data } });
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Failed to start journey";
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      {/* <h5
        className="p-1 text-center w-[93%] absolute top-0"
        onClick={() => {
          props.setConfirmRidePopupPanel(false);
        }}
      >
        <i className="text-3xl text-gray-300 ri-arrow-down-wide-line"></i>
      </h5> */}
      <h3 className="text-2xl font-semibold mb-6 flex items-center justify-center ">
        Confirm this ride to Start
      </h3>
      <div className="flex items-center justify-between border-2 border-yellow-400 p-2 rounded-lg">
        <div className="flex items-center justify-start gap-3 ">
          <img
            className="h-12 w-12 rounded-full object-cover "
            src={
              props.ride?.riderId?.profilePicture ||
              "https://cdn-icons-png.flaticon.com/512/149/149071.png"
            }
            alt=""
          />
          <div>
            <h4 className="text-lg font-medium capitalize">
              {props.ride?.riderId?.name || "John Doe"}
            </h4>
            <h5 className="text-sm text-gray-600">
              {" "}
              <span className="font-semibold text-gray-800">2.5 km</span> away
              from you
            </h5>
          </div>
        </div>
      </div>

      <div className="flex justify-between items-center flex-col gap-1">
        <div className="w-full flex flex-col   mt-2">
          <div className="flex items-center gap-5 p-2.5 border-b-2 border-gray-200">
            <i className="ri-map-pin-fill text-lg "></i>
            <div>
              <h3 className="font-medium text-lg">Pickup</h3>
              <p className="text-small -mt-1 text-gray-600 ">
                {props.ride?.pickup?.address || "Kankariya Talab Ahmedabad"}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-5 p-2.5 border-b-2 border-gray-200">
            <i className="ri-stop-fill text-lg"></i>
            <div>
              <h3 className="font-medium text-lg">Destination</h3>
              <p className="text-small -mt-1 text-gray-600 ">
                {props.ride?.dropoff?.address || "Kankariya Talab Ahmedabad"}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-5 p-2.5 border-b-2 border-gray-200">
            <i className="ri-money-rupee-circle-fill"></i>
            <div>
              <h3 className="font-medium text-lg">Selected Payment Option</h3>
              <button className="text-small -mt-1 text-gray-600 ">
                {`Pay ₹${props.ride?.estimatedFare || 250} via ${props.ride?.paymentMethod}`}
              </button>
            </div>
          </div>
        </div>

        <div className="mt-2 w-full">
          <form
            noValidate
            onSubmit={submitHandler}
          >
            <input
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              type="text"
              placeholder="Enter OTP"
              maxLength="4"
              inputMode="numeric"
              disabled={isSubmitting}
              className="bg-[#eee] border-2 border-blue-500 px-6 py-3 font-mono text-lg rounded-lg w-full mt-4 disabled:opacity-50"
            />

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full mt-5 bg-green-600 font-semibold text-white flex justify-center py-2 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Starting..." : "Confirm"}
            </button>

            <button
              type="button"
              onClick={() => {
                setOtp("");
                props.setConfirmRidePopupPanel(false);
                props.setRidePopupPanel(false);
              }}
              disabled={isSubmitting}
              className="w-full mt-2  bg-red-500 font-semibold text-white  py-2 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ConfirmRidePopup;
