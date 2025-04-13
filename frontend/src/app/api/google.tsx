import { getAuth } from "@clerk/nextjs/server";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    // Authenticate the user
    const { userId, sessionId } = getAuth(req);

    if (!userId || !sessionId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    // Fetch the Google token from the session
    const googleToken = await getAuth(req).getToken({ template: "oauth_google" });

    if (!googleToken) {
      return res.status(404).json({ error: "Google token not found" });
    }

    // Return the Google token
    res.status(200).json({ googleToken });
  } catch (error) {
    console.error("Error fetching Google token:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}