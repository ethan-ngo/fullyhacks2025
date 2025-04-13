import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

export async function GET() {
  try {
    // Retrieve the Clerk session token
    const { getToken } = await auth();
    const sessionToken = await getToken();

    if (!sessionToken) {
      return NextResponse.json(
        { error: "Session token not found" },
        { status: 401 }
      );
    }

    // Send the session token to the Flask backend
    const response = await fetch("http://127.0.0.1:5000/api/protected", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${sessionToken}`, // Send the session token in the Authorization header
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      return NextResponse.json(
        { error: "Failed to fetch data from Flask backend", details: errorData },
        { status: response.status }
      );
    }

    // Parse the response from the Flask backend
    const data = await response.json();
    return NextResponse.json(data); // Return the data to the frontend
  } catch (error) {
    console.error("Error in Next.js API route:", error);
    return NextResponse.json(
      { error: "Internal Server Error", details: error },
      { status: 500 }
    );
  }
}