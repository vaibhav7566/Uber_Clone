import React from "react";

const Services = () => {
  return (
    <div className="min-h-screen bg-white text-gray-900">

      {/* Back Button */}
      <div className="px-5 pt-4">
        <button
          type="button"
          onClick={() => window.history.back()}
          className="inline-flex items-center gap-2 text-sm font-medium text-gray-900 hover:text-gray-900"
        >
          <i className="ri-arrow-left-line text-lg"></i>
          Back
        </button>
      </div>

      {/* 🔥 Hero Section */}
      <div className="px-5 pt-4">
        <h1 className="text-3xl font-bold leading-tight">
          Use our app to travel your way
        </h1>

        <img
          src="https://cn-geo1.uber.com/image-proc/crop/resizecrop/udam/format=auto/width=552/height=368/srcb64=aHR0cHM6Ly90Yi1zdGF0aWMudWJlci5jb20vcHJvZC91ZGFtLWFzc2V0cy9mYzk3NmVhZS1hMzUyLTQ5NjQtODQwYy00YzBmMWQ1ZDM3NjUuanBn"
          alt="ride"
          className="w-full h-52 object-cover rounded-2xl mt-4"
        />
      </div>

      {/* 🔥 Suggestions Section */}
      <div className="px-5 mt-6">
        <h2 className="text-xl font-semibold mb-3">Suggestions</h2>

        <div className="space-y-4">

          {/* Card */}
          <div className="flex items-center justify-between bg-gray-100 p-4 rounded-2xl">
            <div>
              <h3 className="font-semibold text-lg">Ride</h3>
              <p className="text-sm text-gray-500">
                Go anywhere with our app
              </p>
              <button className="mt-2 text-sm bg-white px-4 py-1 rounded-full shadow">
                Details
              </button>
            </div>

            <img
              src="https://cdn-icons-png.flaticon.com/512/744/744465.png"
              alt="ride"
              className="w-16 h-16"
            />
          </div>

          {/* Card */}
          <div className="flex items-center justify-between bg-gray-100 p-4 rounded-2xl">
            <div>
              <h3 className="font-semibold text-lg">Reserve</h3>
              <p className="text-sm text-gray-500">
                Book your ride in advance
              </p>
              <button className="mt-2 text-sm bg-white px-4 py-1 rounded-full shadow">
                Details
              </button>
            </div>

            <img
              src="https://cdn-icons-png.flaticon.com/512/2921/2921222.png"
              alt="reserve"
              className="w-16 h-16"
            />
          </div>

          {/* Card */}
          <div className="flex items-center justify-between bg-gray-100 p-4 rounded-2xl">
            <div>
              <h3 className="font-semibold text-lg">Intercity</h3>
              <p className="text-sm text-gray-500">
                Travel between cities easily
              </p>
              <button className="mt-2 text-sm bg-white px-4 py-1 rounded-full shadow">
                Details
              </button>
            </div>

            <img
              src="https://cdn-icons-png.flaticon.com/512/854/854878.png"
              alt="intercity"
              className="w-16 h-16"
            />
          </div>

        </div>
      </div>

      {/* 🔥 Features Section */}
      <div className="px-5 mt-8 space-y-6 pb-10">

        {/* Feature 1 */}
        <div>
          <img
            src="https://vision360-s3.cdn.net.ar/s3i233/2024/08/vision360/images/96/22/962214_89261067550c6700e0cd7cdd436332e53c59ed6423f3246e16998682a0a53120/lg.webp"
            alt="cities"
            className="w-full h-52 object-cover rounded-2xl"
          />
          <h3 className="text-lg font-semibold mt-3">
            15,000+ cities
          </h3>
          <p className="text-sm text-gray-500">
            Available in thousands of cities worldwide so you can travel anywhere.
          </p>
        </div>

        {/* Feature 2 */}
        <div>
          <img
            src="https://tb-static.uber.com/prod/udam-assets/026251e5-393f-5d1b-b4cd-e8e6eebb1e5b.png"
            alt="airport"
            className="w-full h-52 object-cover rounded-2xl"
          />
          <h3 className="text-lg font-semibold mt-3">
            700+ airports
          </h3>
          <p className="text-sm text-gray-500">
            Schedule rides to and from airports without any hassle.
          </p>
        </div>

      </div>

    </div>
  );
};

export default Services;