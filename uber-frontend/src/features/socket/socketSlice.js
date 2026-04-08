import { createSlice } from "@reduxjs/toolkit";
import io from "socket.io-client";

// Global socket instance (outside Redux to persist across re-renders)
let globalSocket = null;

const SOCKET_BASE_URL = import.meta.env.VITE_API_URL;

const initialState = {
  isConnected: false,
  connectionError: null,
  userId: null,
  userType: null, // 'rider' or 'driver'
  messages: {}, // { eventName: [message1, message2, ...] }
  lastMessage: null,
};

const socketSlice = createSlice({
  name: "socket",
  initialState,
  reducers: {
    // Set connection status
    setConnectionStatus: (state, action) => {
      const { isConnected, error } = action.payload;
      state.isConnected = isConnected;
      if (error) {
        state.connectionError = error;
      } else {
        state.connectionError = null;
      }
    },

    // Set user info
    setSocketUserInfo: (state, action) => {
      const { userId, userType } = action.payload;
      state.userId = userId;
      state.userType = userType;
    },

    // Send message to a specific event
    sendMessage: (state, action) => {
      const { eventName, payload } = action.payload;

      if (globalSocket && state.isConnected) {
        globalSocket.emit(eventName, payload);
        console.log(`[SOCKET] Sent to ${eventName}:`, payload);
      } else {
        console.warn(
          `[SOCKET] Not connected. Cannot send to ${eventName}. Connected: ${state.isConnected}, Socket: ${!!globalSocket}`
        );
      }
    },

    // Receive message from a specific event
    receiveMessage: (state, action) => {
      const { eventName, message } = action.payload;

      // Initialize event array if it doesn't exist
      if (!state.messages[eventName]) {
        state.messages[eventName] = [];
      }

      // Add message to the event's message array
      state.messages[eventName].push(message);
      state.lastMessage = {
        eventName,
        message,
        timestamp: new Date().toISOString(),
      };

      console.log(`[SOCKET] Received from ${eventName}:`, message);
    },

    // Clear messages for a specific event
    clearMessages: (state, action) => {
      const { eventName } = action.payload;
      if (eventName) {
        state.messages[eventName] = [];
      } else {
        state.messages = {};
      }
    },

    // Reset socket state (on logout)
    resetSocketState: (state) => {
      state.isConnected = false;
      state.connectionError = null;
      state.userId = null;
      state.userType = null;
      state.messages = {};
      state.lastMessage = null;
    },
  },
});

export const {
  setConnectionStatus,
  setSocketUserInfo,
  sendMessage,
  receiveMessage,
  clearMessages,
  resetSocketState,
} = socketSlice.actions;

export default socketSlice.reducer;

/**
 * Initialize socket connection (thunk - call from app initialization)
 */
export const initializeSocket = (userId, userType) => {
  return (dispatch) => {
    const normalizedUserType = String(userType || "").toLowerCase();

    if (globalSocket && globalSocket.connected) {
      dispatch(setSocketUserInfo({ userId, userType: normalizedUserType }));
      return;
    }

    if (!SOCKET_BASE_URL) {
      dispatch(
        setConnectionStatus({
          isConnected: false,
          error: "VITE_API_URL is not configured",
        }),
      );
      return;
    }

    // Create new socket connection
    globalSocket = io(SOCKET_BASE_URL, {
      transports: ["websocket"],
      withCredentials: true,
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: 5,
    });

    console.log("[SOCKET] Initializing socket connection...");

    // Handle connection
    globalSocket.on("connect", () => {
      console.log("[SOCKET] ✅ Connected with ID:", globalSocket.id);
      dispatch(setConnectionStatus({ isConnected: true }));
    });

    // Handle disconnection
    globalSocket.on("disconnect", () => {
      console.log("[SOCKET] ❌ Disconnected");
      dispatch(setConnectionStatus({ isConnected: false }));
    });

    // Handle connection errors
    globalSocket.on("connect_error", (error) => {
      console.error("[SOCKET] Connection error:", error);
      dispatch(setConnectionStatus({ isConnected: false, error: error.message }));
    });

    // Set user info in Redux
    dispatch(setSocketUserInfo({ userId, userType: normalizedUserType }));
  };
};

/**
 * Disconnect socket (call on logout)
 */
export const disconnectSocket = () => {
  return (dispatch) => {
    if (globalSocket) {
      globalSocket.disconnect();
      globalSocket = null;
      console.log("[SOCKET] Disconnected and cleaned up");
    }
    dispatch(resetSocketState());
  };
};

/**
 * Get the global socket instance (for direct access if needed)
 */
export const getGlobalSocket = () => globalSocket;
