import API from "../../services/api"

export const signupUser = (data) => {
  return API.post("/auth/signup", data)
}

export const loginUser = (data) => {
  return API.post("/auth/login", data)
}

export const getCurrentUser = () => {
  return API.get("/auth/me");
};

export const registerDriver = (data) => {
  return API.post("/driver/register", data)
}



// Admin approval APIs
export const approveDriver = (driverId, adminNotes) => {
  return API.post("/driver/admin/approve", {
    driverId,
    adminNotes,
  });
};

export const rejectDriver = (driverId, reason) => {
  return API.post("/driver/admin/reject", {
    driverId,
    reason,
  });
};

export const getPendingDrivers = () => {
  return API.get("/driver/admin/pending");
};
