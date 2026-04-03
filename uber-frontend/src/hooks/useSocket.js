import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import {
  initializeSocket,
  sendMessage,
  receiveMessage,
  clearMessages,
  disconnectSocket,
  getGlobalSocket,
} from "../features/socket/socketSlice";

/**
 * Custom hook for Socket.IO operations
 * @returns {Object} Socket utilities and state
 */
export const useSocket = () => {
  const dispatch = useDispatch();
  const socketState = useSelector((state) => state.socket);
  const authState = useSelector((state) => state.auth);

  /**
   * Send a message to a specific event
   * @param {string} eventName - Event name to emit to
   * @param {Object} payload - Data to send
   */
  const emitEvent = (eventName, payload) => {
    dispatch(sendMessage({ eventName, payload }));
  };

  /**
   * Listen to a specific socket event and receive messages
   * @param {string} eventName - Event name to listen to
   * @param {Function} callback - Callback function when message is received
   */
  const onEvent = (eventName, callback) => {
    const socket = getGlobalSocket();
    if (socket) {
      socket.on(eventName, (data) => {
        // Dispatch to store
        dispatch(receiveMessage({ eventName, message: data }));
        // Call user's callback
        if (callback) {
          callback(data);
        }
      });
    } else {
      console.warn("[SOCKET] Socket not available for listening to:", eventName);
    }
  };

  /**
   * Remove event listener
   * @param {string} eventName - Event name to stop listening to
   */
  const offEvent = (eventName) => {
    const socket = getGlobalSocket();
    if (socket) {
      socket.off(eventName);
    }
  };

  /**
   * Clear all messages or messages for a specific event
   */
  const clearEventMessages = (eventName) => {
    dispatch(clearMessages({ eventName }));
  };

  /**
   * Auto-connect socket on mount if user is authenticated
   */
  useEffect(() => {
    if (authState.token && authState.user?._id && !socketState.isConnected) {
      console.log("[SOCKET HOOK] Auto-connecting with user:", authState.user._id, authState.role);
      dispatch(initializeSocket(authState.user._id, authState.role));
    }
  }, [
    authState.token,
    authState.user?._id,
    authState.role,
    socketState.isConnected,
    dispatch,
  ]);

  /**
   * Send join event after socket connects
   */
  useEffect(() => {
    if (socketState.isConnected && authState.user?._id && authState.role) {
      const socket = getGlobalSocket();
      if (socket) {
        const joinPayload = {
          userId: authState.user._id,
          userType: String(authState.role).toLowerCase(),
        };
        socket.emit("join", joinPayload);
        console.log("[SOCKET HOOK] Emitted join event:", joinPayload);
      }
    }
  }, [socketState.isConnected, authState.user?._id, authState.role]);

  /**
   * Cleanup on logout
   */
  useEffect(() => {
    if (!authState.token && socketState.isConnected) {
      console.log("[SOCKET HOOK] User logged out, disconnecting socket");
      dispatch(disconnectSocket());
    }
  }, [authState.token, dispatch, socketState.isConnected]);

  return {
    // State
    isConnected: socketState.isConnected,
    messages: socketState.messages,
    lastMessage: socketState.lastMessage,
    connectionError: socketState.connectionError,
    userId: socketState.userId,
    userType: socketState.userType,

    // Methods
    emitEvent,
    onEvent,
    offEvent,
    clearEventMessages,
  };
};
