import { io } from 'socket.io-client';

/**
 * Resolve Socket.IO server base URL without hardcoding localhost in production
 */
const getSocketUrl = () => {
  if (import.meta.env.VITE_SOCKET_URL) {
    return import.meta.env.VITE_SOCKET_URL;
  }

  const apiUrl = import.meta.env.VITE_API_URL;
  if (apiUrl) {
    // Strip trailing /api or /api/ and clean trailing slashes
    return apiUrl.replace(/\/api\/?$/, '').replace(/\/+$/, '');
  }

  // Safe environment-based defaults
  if (import.meta.env.DEV) {
    return 'http://localhost:5001';
  }

  return 'https://sandhubtiq-backen.vercel.app';
};

class SocketService {
  constructor() {
    this.socket = null;
    this.currentToken = null;
    this.listeners = new Map(); // Track listeners to prevent duplicates: event -> Set<Function>
  }

  /**
   * Connect to Socket.IO server with JWT token
   * @param {string|null} token
   */
  connect(token = null) {
    const authToken = token || localStorage.getItem('sandh_token') || null;

    // If already connected with the same token, do not reconnect
    if (this.socket && this.socket.connected && this.currentToken === authToken) {
      return this.socket;
    }

    // If connected with a different token (e.g. user switch/login/logout), disconnect first
    if (this.socket) {
      this.disconnect();
    }

    this.currentToken = authToken;
    const socketUrl = getSocketUrl();

    try {
      this.socket = io(socketUrl, {
        auth: {
          token: authToken,
        },
        withCredentials: true,
        transports: ['websocket', 'polling'],
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 1500,
        reconnectionDelayMax: 6000,
        timeout: 10000,
        autoConnect: true,
      });

      this.socket.on('connect', () => {
        console.log(`⚡ [SocketService] Connected to server (${this.socket.id}) at ${socketUrl}`);
      });

      this.socket.on('connect_error', (error) => {
        // Log gracefully without crashing or interrupting UI operations
        console.warn(`⚠️ [SocketService] Real-time connection notice: ${error.message}. (App running smoothly on REST APIs)`);
      });

      this.socket.on('disconnect', (reason) => {
        console.log(`🔌 [SocketService] Disconnected from server: ${reason}`);
      });

      this.socket.on('reconnect', (attemptNumber) => {
        console.log(`🔄 [SocketService] Reconnected to server after ${attemptNumber} attempt(s)`);
      });

      // Re-bind existing registered listeners to the new socket instance
      this.listeners.forEach((handlers, event) => {
        handlers.forEach((handler) => {
          this.socket.on(event, handler);
        });
      });
    } catch (err) {
      console.warn(`[SocketService] Failed to initialize socket connection:`, err.message);
    }

    return this.socket;
  }

  /**
   * Disconnect the active socket connection cleanly
   */
  disconnect() {
    if (this.socket) {
      try {
        this.socket.removeAllListeners();
        this.socket.disconnect();
      } catch (err) {
        console.warn('[SocketService] Error while disconnecting socket:', err.message);
      }
      this.socket = null;
    }
    this.currentToken = null;
  }

  /**
   * Register an event listener and prevent duplicate registrations
   * @param {string} event
   * @param {Function} handler
   */
  on(event, handler) {
    if (typeof handler !== 'function') return;

    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }

    const eventHandlers = this.listeners.get(event);
    if (!eventHandlers.has(handler)) {
      eventHandlers.add(handler);
      if (this.socket) {
        this.socket.on(event, handler);
      }
    }
  }

  /**
   * Unregister an event listener safely
   * @param {string} event
   * @param {Function} handler
   */
  off(event, handler) {
    if (this.listeners.has(event)) {
      const eventHandlers = this.listeners.get(event);
      eventHandlers.delete(handler);
      if (eventHandlers.size === 0) {
        this.listeners.delete(event);
      }
    }

    if (this.socket) {
      this.socket.off(event, handler);
    }
  }

  /**
   * Emit an event to the server
   * @param {string} event
   * @param {*} data
   */
  emit(event, data) {
    if (this.socket && this.socket.connected) {
      this.socket.emit(event, data);
    }
  }

  /**
   * Check if socket is currently connected
   */
  isConnected() {
    return Boolean(this.socket && this.socket.connected);
  }

  /**
   * Get current socket ID
   */
  getSocketId() {
    return this.socket?.id || null;
  }
}

export const socketService = new SocketService();
export default socketService;
