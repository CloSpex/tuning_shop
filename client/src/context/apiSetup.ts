import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5099/api",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const currentToken = localStorage.getItem("accessToken");
        if (!currentToken) {
          throw new Error("No access token available");
        }

        const refreshResponse = await api.post(
          "/auth/refresh",
          {},
          {
            headers: {
              Authorization: `Bearer ${currentToken}`,
            },
            withCredentials: true,
          }
        );

        localStorage.setItem("accessToken", refreshResponse.data.accessToken);
        localStorage.setItem("tokenExpiry", refreshResponse.data.expiresAt);

        originalRequest.headers.Authorization = `Bearer ${refreshResponse.data.accessToken}`;

        return api(originalRequest);
      } catch (refreshError) {
        localStorage.removeItem("user");
        localStorage.removeItem("accessToken");
        localStorage.removeItem("tokenExpiry");
        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
