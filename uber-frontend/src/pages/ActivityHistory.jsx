import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import { toast } from "react-toastify";

const ActivityHistory = () => {
  const navigate = useNavigate();
  const [journeys, setJourneys] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchRiderJourneys = async () => {
      try {
        const response = await API.get("/journey/rider/history");
        setJourneys(response?.data?.data || []);
      } catch (error) {
        toast.error(error?.response?.data?.message || "Failed to fetch history");
      } finally {
        setIsLoading(false);
      }
    };

    fetchRiderJourneys();
  }, []);

  return (
    <div className="min-h-screen bg-white text-gray-900 px-5 py-6">
      <div className="flex items-center gap-3 mb-6">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-900"
        >
          <i className="ri-arrow-left-line text-lg"></i>
          Back
        </button>
        <h1 className="text-2xl font-bold">Activity History</h1>
      </div>

      {isLoading ? (
        <div className="text-sm text-gray-500">Loading history...</div>
      ) : journeys.length === 0 ? (
        <div className="text-sm text-gray-500">No journeys found.</div>
      ) : (
        <div className="space-y-3 pb-10">
          {journeys.map((journey) => (
            <div key={journey._id} className="border rounded-2xl p-4 bg-gray-50">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <p className="text-sm font-semibold truncate">
                    {journey?.pickup?.address || "Unknown pickup"}
                  </p>
                  <p className="text-xs text-gray-400 my-1">to</p>
                  <p className="text-sm font-semibold truncate">
                    {journey?.dropoff?.address || "Unknown destination"}
                  </p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-base font-bold">₹{journey?.fare ?? "N/A"}</p>
                  <p className="text-xs text-gray-500 capitalize">{journey?.status || "unknown"}</p>
                </div>
              </div>

              <div className="mt-3 pt-3 border-t text-xs text-gray-600 space-y-1">
                <p>
                  <span className="font-semibold">Vehicle:</span> {journey?.vehicleType || "N/A"}
                </p>
                <p>
                  <span className="font-semibold">Date:</span>{" "}
                  {journey?.createdAt
                    ? new Date(journey.createdAt).toLocaleString()
                    : "N/A"}
                </p>
                {journey?.driver?.name ? (
                  <p>
                    <span className="font-semibold">Driver:</span> {journey.driver.name}
                  </p>
                ) : null}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ActivityHistory;