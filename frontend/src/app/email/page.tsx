'use client';

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { BottomNav } from "@/components/ui/bottom-nav";

export default function Email() {
  const [visibleCards, setVisibleCards] = useState<
    { id: number; subject: string; label: string; summary: string }[]
  >([]);
  const [swipeDirection, setSwipeDirection] = useState("");

  // 📨 Fetch emails on load
  /*useEffect(() => {
    const fetchEmails = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/protected", {
          method: "GET",
          credentials: "include", // Important for Clerk JWT cookie
        });
        const data = await res.json();

        if (res.ok && data.emails) {
          const parsedCards = data.emails.map((subject: string, i: number) => ({
            id: i + 1,
            subject,
            label: "Inbox",
            summary: "SwipeMail retrieved this email subject for you.",
          }));
          setVisibleCards(parsedCards);
        } else {
          console.error("Error fetching emails:", data.error);
        }
      } catch (err) {
        console.error("Request failed:", err);
      }
    };

    fetchEmails();
  }, []);*/
useEffect(() => {
  const fetchEmails = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/protected", {
        method: "GET",
        credentials: "include",
      });

      const contentType = res.headers.get("content-type");

      if (res.ok && contentType?.includes("application/json")) {
        const data = await res.json();

        if (data.emails) {
          const parsedCards = data.emails.map((subject: string, i: number) => ({
            id: i + 1,
            subject,
            label: "Inbox",
            summary: "SwipeMail retrieved this email subject for you.",
          }));
          setVisibleCards(parsedCards);
        } else {
          console.error("❌ Backend JSON had no emails:", data);
        }
      } else {
        const text = await res.text(); // safely read text once
        console.error("❌ Backend returned HTML or non-JSON:", text);
      }
    } catch (err) {
      console.error("❌ Request failed:", err);
    }
  };

  fetchEmails();
}, []);

const handleSwipe = (direction: "left" | "right") => {
  setSwipeDirection(direction);
  setTimeout(() => {
    setVisibleCards((prevCards) => prevCards.slice(1));
    setSwipeDirection("");
  }, 500);
};

  return (
    <div className="relative flex items-center justify-center h-screen bg-gray-100">
      {visibleCards.map((card, index) => (
        <div
          key={card.id}
          className={`absolute w-100 h-116 bg-white shadow-lg rounded-lg flex items-center justify-center transition-transform duration-500 ${
            index === 0 && swipeDirection === "left"
              ? "translate-x-[-200%] rotate-[-10deg]"
              : index === 0 && swipeDirection === "right"
              ? "translate-x-[200%] rotate-[10deg]"
              : ""
          }`}
          style={{
  transform: index !== 0 ? `translateY(${index * 10}px)` : undefined,
  zIndex: visibleCards.length - index,
}}

        >
          <Card className="w-full h-full">
            <CardContent className="flex flex-col items-center justify-center h-full">
              <p className="text-lg font-bold text-gray-800 p-4">{card.subject}</p>
              <p className="text-sm font-medium text-gray-700 bg-gray-200 px-3 py-1 rounded-full p-4">{card.label}</p>
              <p className="text-lg text-gray-800 p-4">{card.summary}</p>
              <div className="flex gap-4">
                <button
                  onClick={() => handleSwipe("left")}
                  className="mt-4 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
                >
                  Swipe Left
                </button>
                <button
                  onClick={() => handleSwipe("right")}
                  className="mt-4 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition"
                >
                  Swipe Right
                </button>
              </div>
              <form
                onSubmit={(e) => {
                  e.preventDefault(); // Prevent default form submission behavior
                  const formData = new FormData(e.target as HTMLFormElement);
                  const inputValue = formData.get("userInput");
                  console.log("Form submitted with input:", inputValue);
                }}
                className="mt-4 w-full"
              >
                <Input
                  name="userInput"
                  placeholder="Type something..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                />
                <button
                  type="submit"
                  className="mt-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
                >
                  Submit
                </button>
              </form>
            </CardContent>
          </Card>
          <BottomNav />
        </div>
      ))}
      {visibleCards.length === 0 && (
        <p className="text-gray-600 text-lg">No more cards to swipe!</p>
      )}
    </div>
  );
}
