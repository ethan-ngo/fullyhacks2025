"use client";
import { useEffect } from "react";
import { clientFetchProtectedData } from "@/lib/api";

export default function TestPage() {
  useEffect(() => {
    clientFetchProtectedData()
      .then(res => res.json())
      .then(data => console.log("Test page data:", data))
      .catch(console.error);
  }, []);

  return <div>Check console for API response</div>;
}