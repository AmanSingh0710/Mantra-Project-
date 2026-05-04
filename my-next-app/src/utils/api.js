export const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

// 🔥 Safe logout helper (reusable inside API layer)
const logoutUser = () => {
  if (typeof window === "undefined") return;

  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");

  window.location.href = "/login";
};

export async function fetchFromAPI(endpoint, options = {}) {
  const url = `${BASE_URL}${endpoint}`;

  let accessToken =
    typeof window !== "undefined"
      ? localStorage.getItem("accessToken")
      : null;

  const refreshToken =
    typeof window !== "undefined"
      ? localStorage.getItem("refreshToken")
      : null;

  // 🔹 Build headers properly
  const isFormData = options.body instanceof FormData;

  const headers = {
    ...(isFormData ? {} : { "Content-Type": "application/json" }),
    ...(options.headers || {}),
    ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
  };

  // 🔹 First request
  let res;

  try {
    res = await fetch(url, {
      ...options,
      headers,
    });
  } catch (err) {
    console.error("Network Error:", err);
    throw new Error("Network error. Please try again.");
  }

  // 🔴 Token expired → refresh flow
  if (res.status === 401 && refreshToken) {
    try {
      const refreshRes = await fetch(`${BASE_URL}/auth/refresh`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refreshToken }),
      });

      if (!refreshRes.ok) {
        logoutUser();
        return;
      }

      const data = await refreshRes.json();

      if (!data?.accessToken) {
        logoutUser();
        return;
      }

      // ✅ Save new token
      localStorage.setItem("accessToken", data.accessToken);

      // 🔁 Retry original request
      res = await fetch(url, {
        ...options,
        headers: {
          ...(isFormData ? {} : { "Content-Type": "application/json" }),
          ...(options.headers || {}),
          Authorization: `Bearer ${data.accessToken}`,
        },
      });
    } catch (err) {
      console.error("Refresh failed:", err);
      logoutUser();
      return;
    }
  }

  // ❌ API error handling
  if (!res.ok) {
    let message = "Something went wrong";

    try {
      const errData = await res.json();
      message = errData?.message || message;
    } catch {
      const text = await res.text();
      message = text || message;
    }

    console.error("API Error:", message);
    throw new Error(message);
  }

  // ✅ Safe JSON return
  try {
    return await res.json();
  } catch {
    return null;
  }
}