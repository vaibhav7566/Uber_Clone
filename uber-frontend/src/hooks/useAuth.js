import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getCurrentUser } from "../features/auth/authAPI";
import { setUser, logout } from "../features/auth/authSlice";

export const useAuth = () => {
  const dispatch = useDispatch();
  const { token, user } = useSelector((state) => state.auth);

  useEffect(() => {
    const fetchUser = async () => {
      // Only fetch if we have token but no user data
      if (token && !user) {
        try {
          const response = await getCurrentUser();
          if (response.data.success) {
            dispatch(setUser(response.data.data));
          }
        } catch (error) {
          console.error("Failed to fetch user:", error);
          // If token is invalid, logout
          dispatch(logout());
        }
      }
    };

    fetchUser();
  }, [token, user, dispatch]);
};
