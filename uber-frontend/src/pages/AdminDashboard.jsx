import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { getPendingDrivers, approveDriver, rejectDriver } from "../features/auth/authAPI";

function AdminDashboard() {
  const navigate = useNavigate();
  const { role } = useSelector((state) => state.auth);
  
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [approving, setApproving] = useState(null);
  const [rejecting, setRejecting] = useState(null);
  const [rejectReason, setRejectReason] = useState({});

  // Check if user is admin
  useEffect(() => {
    if (role !== "ADMIN") {
      toast.error("Access denied. Admin only.");
      navigate("/");
      return;
    }

    fetchPendingDrivers();
  }, [role, navigate]);

  // Fetch pending drivers
  const fetchPendingDrivers = async () => {
    try {
      setLoading(true);
      const response = await getPendingDrivers();
      // console.log("Pending Drivers Response:", response);
      
      if (response.data.success) {
        setDrivers(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching drivers:", error);
      toast.error("Failed to fetch pending drivers");
    } finally {
      setLoading(false);
    }
  };

  // Approve driver
  const handleApprove = async (driverId) => {
    try {
      setApproving(driverId);
      console.log("Approving driver ID:", driverId);
      const response = await approveDriver(driverId, "Approved by admin");
      console.log("Approve Driver Response:", response);

      if (response.data.success) {
        toast.success("✅ Driver approved successfully!");
        // Remove from list
        setDrivers(drivers.filter((d) => d._id !== driverId));
        // Refresh list
        fetchPendingDrivers();
      }
    } catch (error) {
      console.error("Error approving driver:", error);
      toast.error(error.response?.data?.message || "Failed to approve driver");
    } finally {
      setApproving(null);
    }
  };

  // Reject driver
  const handleReject = async (driverId) => {
    const reason = rejectReason[driverId];
    
    if (!reason || reason.trim().length < 5) {
      toast.error("Please provide a reason (at least 5 characters)");
      return;
    }

    try {
      setRejecting(driverId);
      const response = await rejectDriver(driverId, reason);

      if (response.data.success) {
        toast.success("❌ Driver rejected successfully!");
        // Remove from list
        setDrivers(drivers.filter((d) => d._id !== driverId));
        // Clear reason
        setRejectReason({ ...rejectReason, [driverId]: "" });
        // Refresh list
        fetchPendingDrivers();
      }
    } catch (error) {
      console.error("Error rejecting driver:", error);
      toast.error(error.response?.data?.message || "Failed to reject driver");
    } finally {
      setRejecting(null);
    }
  };

  if (!role || role !== "ADMIN") {
    return null;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-black border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-600">Loading pending drivers...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-black text-white px-6 py-4 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl font-bold">Admin Dashboard</h1>
          <p className="text-gray-400 text-sm mt-1">Driver Approval Management</p>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <div className="text-3xl font-bold text-black">{drivers.length}</div>
            <p className="text-gray-600 text-sm mt-1">Pending Applications</p>
          </div>
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <div className="text-3xl font-bold text-blue-600">📋</div>
            <p className="text-gray-600 text-sm mt-1">Awaiting Review</p>
          </div>
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <div className="text-3xl font-bold text-green-600">✓</div>
            <p className="text-gray-600 text-sm mt-1">Ready to Action</p>
          </div>
        </div>

        {/* Pending Drivers */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-bold text-black">Pending Driver Applications</h2>
          </div>

          {drivers.length === 0 ? (
            <div className="px-6 py-12 text-center">
              <p className="text-gray-500 text-lg">No pending applications</p>
              <p className="text-gray-400 text-sm mt-1">All drivers have been reviewed</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {drivers.map((driver) => (
                <div key={driver._id} className="px-6 py-6 hover:bg-gray-50 transition">
                  {/* Driver Info */}
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-black">
                        {driver.userName}
                      </h3>
                      <p className="text-gray-600 text-sm">{driver.userEmail}</p>
                      <p className="text-gray-600 text-sm">{driver.userPhone}</p>
                    </div>
                    <div className="text-right">
                      <span className="inline-block bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-medium">
                        {driver.approvalStatus}
                      </span>
                      <p className="text-gray-500 text-xs mt-2">
                        {new Date(driver.submittedAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  {/* Driver Details */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 bg-gray-50 p-4 rounded-lg">
                    <div>
                      <p className="text-xs text-gray-500 uppercase">City</p>
                      <p className="font-semibold text-black">
                        {driver.personalInfo?.city || "-"}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 uppercase">Vehicle Type</p>
                      <p className="font-semibold text-black">
                        {driver.vehicleInfo?.vehicleType || "-"}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 uppercase">License</p>
                      <p className="font-semibold text-black">
                        {driver.documents?.licenseNumber || "-"}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 uppercase">Profile Complete</p>
                      <div className="mt-1">
                        <div className="w-full bg-gray-300 rounded-full h-2">
                          <div
                            className="bg-black h-2 rounded-full"
                            style={{
                              width: `${driver.profileCompletion}%`,
                            }}
                          ></div>
                        </div>
                        <p className="text-sm font-semibold mt-1">
                          {driver.profileCompletion}%
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="space-y-3">
                    {/* Approve Button */}
                    <button
                      onClick={() => handleApprove(driver._id)}
                      disabled={approving === driver._id}
                      className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      {approving === driver._id ? (
                        <>
                          <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Approving...
                        </>
                      ) : (
                        <>✅ Approve Driver</>
                      )}
                    </button>

                    {/* Reject Section */}
                    <div className="border border-red-200 rounded-lg p-4 bg-red-50">
                      <textarea
                        placeholder="Rejection reason (min 5 characters)..."
                        value={rejectReason[driver._id] || ""}
                        onChange={(e) =>
                          setRejectReason({
                            ...rejectReason,
                            [driver._id]: e.target.value,
                          })
                        }
                        className="w-full border border-red-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-red-500 resize-none"
                        rows="3"
                      />
                      <button
                        onClick={() => handleReject(driver._id)}
                        disabled={rejecting === driver._id}
                        className="w-full mt-3 bg-red-600 hover:bg-red-700 text-white font-semibold py-2 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                      >
                        {rejecting === driver._id ? (
                          <>
                            <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Rejecting...
                          </>
                        ) : (
                          <>❌ Reject</>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default AdminDashboard;