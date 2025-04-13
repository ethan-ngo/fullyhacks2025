// src/lib/api.ts (assuming server-side context)
import { auth } from "@clerk/nextjs/server";

export const callMyBackendServerSide = async () => {
  const { getToken } = await auth(); // Correct way to access getToken

  try {
    const token = await getToken(); // Now you can call getToken to get the JWT

    const response = await fetch("http://localhost:8000/api/protected", { // Replace with your actual backend URL
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      console.error("Backend error:", response);
      return { error: `Failed to fetch data: ${response.status}` };
    }

    const data = await response.json();
    return { data };

  } catch (error) {
    console.error("Error calling backend:", error);
    return { error: "Failed to call backend" };
  }
};