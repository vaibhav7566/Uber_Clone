import { useForm } from "react-hook-form";
import { useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { registerDriver } from "../features/auth/authAPI";

const STEPS = ["Personal Info", "Documents", "Vehicle Info"];

function DriverRegistration() {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
    trigger,
    getValues,
  } = useForm({ mode: "onTouched" });

  const stepFields = [
    ["languagePreference", "city", "aadharNumber"], // profilePicture is optional
    ["licenseNumber", "rcNumber"], // expiry dates are optional
    ["vehicleType"], // vehicleNumber, vehicleModel, vehicleColor are optional
  ];

  const handleNext = async () => {
    const valid = await trigger(stepFields[currentStep]);
    if (valid) {
      setFormData((prev) => ({ ...prev, ...getValues() }));
      setCurrentStep((s) => s + 1);
    }
  };

  const onSubmit = async (data) => {
    const final = { ...formData, ...data };
    
    // Clean up data - remove empty strings, File objects, and undefined values
    const cleanedData = {};
    
    Object.entries(final).forEach(([key, value]) => {
      // Skip empty strings, File objects, undefined, null
      if (value === undefined || value === null || value === "" || value instanceof File) {
        return; // Skip this field
      }
      
      // Format date fields
      if ((key === "licenseExpiry" || key === "rcExpiry") && value) {
        cleanedData[key] = new Date(value).toISOString().split("T")[0];
      } else {
        cleanedData[key] = value;
      }
    });
    
    console.log("Cleaned data being sent:", cleanedData);
    
    setIsLoading(true);
    try {
      const response = await registerDriver(cleanedData);
      
      if (response.data.success) {
        // Show approval message
        toast.success("✅ Registration submitted! Awaiting admin approval...");
        
        // Redirect to rider home after 2 seconds
        // User can continue using the app while waiting for approval
        setTimeout(() => {
          navigate("/");  // Rider home page
        }, 4000);
      }
    } catch (error) {
      // Skip error handling for 401 - response interceptor handles it
      if (error.response?.status !== 401) {
        const errorMessage = error.response?.data?.message || "Registration failed. Please try again.";
        toast.error(`❌ ${errorMessage}`);
        console.error("Driver registration error:", error);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const inputClass = (hasError) =>
    `w-full border ${
      hasError ? "border-red-400" : "border-gray-300"
    } rounded-lg px-4 py-3 text-base text-black placeholder-gray-400 focus:outline-none focus:border-black transition-colors bg-white`;

  const selectClass = (hasError) =>
    `w-full border ${
      hasError ? "border-red-400" : "border-gray-300"
    } rounded-lg px-4 py-3 text-base text-black focus:outline-none focus:border-black transition-colors bg-white appearance-none`;

  return (
    <div
      style={{
        fontFamily:
          "'Uber Move', 'UberMoveText', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      }}
      className="min-h-screen bg-white flex flex-col"
    >
      {/* Sticky Navbar */}
      <header className="bg-black px-6 py-4 sticky top-0 z-50">
        <span className="text-white text-2xl font-bold tracking-tight">Uber</span>
      </header>

      <div className="flex-1 flex items-start justify-center px-4 py-10">
        <div className="w-full max-w-lg">

          {/* Heading */}
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-black">Driver Registration</h2>
            <p className="text-gray-400 text-sm mt-1">
              "Start earning on your own terms — complete your profile to get started."
            </p>
          </div>

          {/* Step Indicator */}
          <div className="flex items-center mb-10">
            {STEPS.map((step, i) => (
              <div key={i} className="flex items-center flex-1 last:flex-none">
                <div className="flex flex-col items-center">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors duration-200 ${
                      i < currentStep
                        ? "bg-black text-white"
                        : i === currentStep
                        ? "bg-black text-white"
                        : "bg-gray-200 text-gray-400"
                    }`}
                  >
                    {i < currentStep ? (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                      </svg>
                    ) : (
                      i + 1
                    )}
                  </div>
                  <span
                    className={`text-xs mt-1 font-medium ${
                      i <= currentStep ? "text-black" : "text-gray-400"
                    }`}
                  >
                    {step}
                  </span>
                </div>
                {i < STEPS.length - 1 && (
                  <div
                    className={`flex-1 h-px mx-2 mb-4 transition-colors duration-300 ${
                      i < currentStep ? "bg-black" : "bg-gray-200"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">

            {/* ── STEP 1: Personal Information ── */}
            {currentStep === 0 && (
              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-black mb-1.5">
                    Language Preference
                  </label>
                  <div className="relative">
                    <select
                      {...register("languagePreference", { required: "Language preference is required" })}
                      className={selectClass(errors.languagePreference)}
                      defaultValue=""
                    >
                      <option value="" disabled>Select language</option>
                      {["HINDI","ENGLISH","MARATHI","TAMIL","TELUGU","KANNADA","BENGALI","GUJARATI"].map((l) => (
                        <option key={l} value={l}>{l.charAt(0) + l.slice(1).toLowerCase()}</option>
                      ))}
                    </select>
                    <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">▾</div>
                  </div>
                  {errors.languagePreference && (
                    <p className="text-red-500 text-xs mt-1">{errors.languagePreference.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-black mb-1.5">
                    City of Operation
                  </label>
                  <div className="relative">
                    <select
                      {...register("city", { required: "City is required" })}
                      className={selectClass(errors.city)}
                      defaultValue=""
                    >
                      <option value="" disabled>Select city</option>
                      {["MUMBAI","DELHI","BANGALORE","HYDERABAD","CHENNAI","KOLKATA","PUNE","AHMEDABAD"].map((c) => (
                        <option key={c} value={c}>{c.charAt(0) + c.slice(1).toLowerCase()}</option>
                      ))}
                    </select>
                    <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">▾</div>
                  </div>
                  {errors.city && (
                    <p className="text-red-500 text-xs mt-1">{errors.city.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-black mb-1.5">
                    Aadhar Number
                  </label>
                  <input
                    {...register("aadharNumber", {
                      required: "Aadhar number is required",
                      pattern: { value: /^\d{12}$/, message: "Enter a valid 12-digit Aadhar number" },
                    })}
                    placeholder="12-digit Aadhar number"
                    maxLength={12}
                    className={inputClass(errors.aadharNumber)}
                  />
                  {errors.aadharNumber && (
                    <p className="text-red-500 text-xs mt-1">{errors.aadharNumber.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-black mb-1.5">
                    Profile Picture{" "}
                    <span className="text-gray-400 font-normal">(optional)</span>
                  </label>
                  <input
                    {...register("profilePicture")}
                    // type="file"
                    // accept="image/*"
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm text-gray-500 focus:outline-none focus:border-black transition-colors bg-white file:mr-4 file:py-1 file:px-3 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-black file:text-white hover:file:bg-zinc-800"
                  />
                </div>
              </div>
            )}

            {/* ── STEP 2: Documents ── */}
            {currentStep === 1 && (
              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-black mb-1.5">
                    Driving License Number
                  </label>
                  <input
                    {...register("licenseNumber", { required: "License number is required" })}
                    placeholder="e.g. MH1220210012345"
                    className={inputClass(errors.licenseNumber)}
                  />
                  {errors.licenseNumber && (
                    <p className="text-red-500 text-xs mt-1">{errors.licenseNumber.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-black mb-1.5">
                    License Expiry Date{" "}
                    <span className="text-gray-400 font-normal">(optional)</span>
                  </label>
                  <input
                    {...register("licenseExpiry")}
                    type="date"
                    className={inputClass(false)}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-black mb-1.5">
                    Vehicle RC Number
                  </label>
                  <input
                    {...register("rcNumber", { required: "RC number is required" })}
                    placeholder="e.g. CG04-2024-00098765"
                    className={inputClass(errors.rcNumber)}
                  />
                  {errors.rcNumber && (
                    <p className="text-red-500 text-xs mt-1">{errors.rcNumber.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-black mb-1.5">
                    RC Expiry Date{" "}
                    <span className="text-gray-400 font-normal">(optional)</span>
                  </label>
                  <input
                    {...register("rcExpiry")}
                    type="date"
                    className={inputClass(false)}
                  />
                </div>
              </div>
            )}

            {/* ── STEP 3: Vehicle Information ── */}
            {currentStep === 2 && (
              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-black mb-1.5">
                    Vehicle Type
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { value: "CAR", label: "🚗 Car" },
                      { value: "BIKE", label: "🏍️ Bike" },
                      { value: "AUTO", label: "🛺 Auto" },
                    //   { value: "E_RICKSHAW", label: "⚡ E-Rickshaw" },
                    //   { value: "ELECTRIC_SCOOTER", label: "🛵 E-Scooter" },
                    ].map((v) => (
                      <label key={v.value} className="cursor-pointer">
                        <input
                          {...register("vehicleType", { required: "Vehicle type is required" })}
                          type="radio"
                          value={v.value}
                          className="sr-only peer"
                        />
                        <div className="border border-gray-300 rounded-lg px-3 py-3 text-center text-sm font-medium text-gray-600 peer-checked:border-black peer-checked:bg-black peer-checked:text-white transition-all duration-200 hover:border-gray-400">
                          {v.label}
                        </div>
                      </label>
                    ))}
                  </div>
                  {errors.vehicleType && (
                    <p className="text-red-500 text-xs mt-1">{errors.vehicleType.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-black mb-1.5">
                    Vehicle Number{" "}
                    <span className="text-gray-400 font-normal">(optional)</span>
                  </label>
                  <input
                    {...register("vehicleNumber")}
                    placeholder="e.g. MH12AB1234"
                    className={inputClass(false)}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-black mb-1.5">
                    Vehicle Model{" "}
                    <span className="text-gray-400 font-normal">(optional)</span>
                  </label>
                  <input
                    {...register("vehicleModel")}
                    placeholder="e.g. Honda City, Royal Enfield"
                    className={inputClass(false)}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-black mb-1.5">
                    Vehicle Color{" "}
                    <span className="text-gray-400 font-normal">(optional)</span>
                  </label>
                  <input
                    {...register("vehicleColor")}
                    placeholder="e.g. White, Black, Silver"
                    className={inputClass(false)}
                  />
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className={`flex pt-2 ${currentStep > 0 ? "justify-between" : "justify-end"}`}>
              {currentStep > 0 && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    handleBack();
                  }}
                  className="border border-gray-300 hover:border-black text-black font-semibold py-3 px-8 rounded-lg text-base transition-colors duration-200"
                >
                  Back
                </button>
              )}

              {currentStep < STEPS.length - 1 ? (
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    handleNext();
                  }}
                  className="bg-black hover:bg-zinc-800 text-white font-semibold py-3 px-8 rounded-lg text-base transition-colors duration-200"
                >
                  Continue
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={isLoading}
                  className={`${
                    isLoading 
                      ? "bg-gray-400 cursor-not-allowed" 
                      : "bg-black hover:bg-zinc-800"
                  } text-white font-semibold py-3 px-8 rounded-lg text-base transition-colors duration-200 flex items-center justify-center gap-2`}
                >
                  {isLoading ? (
                    <>
                      <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Submitting...
                    </>
                  ) : (
                    "Submit"
                  )}
                </button>
              )}
            </div>

            {/* Step counter */}
            <p className="text-center text-xs text-gray-400 pt-1">
              Step {currentStep + 1} of {STEPS.length}
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}

export default DriverRegistration;