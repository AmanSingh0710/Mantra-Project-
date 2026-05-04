"use client";
import { useState, useEffect } from "react";

export default function AdminDashboard() {
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchDashboard = async () => {
      const token = localStorage.getItem("token");

      // 🔴 IMPORTANT CHECK
      if (!token) {
        console.error("No token found");
        return;
      }

      try {
        const res = await fetch("http://localhost:5000/dashboard", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const result = await res.json();

        if (!res.ok) {
          console.error("API Error:", result);
          return;
        }

        setData(result);
      } catch (err) {
        console.error("Fetch failed:", err);
      }
    };

    fetchDashboard();
  }, []);

  if (!data) return <p>Loading Analytics...</p>;

  return <></>;
}