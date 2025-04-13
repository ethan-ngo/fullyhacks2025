'use client';

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { BottomNav } from "@/components/ui/bottom-nav";
import { SignOutButton} from "@clerk/clerk-react";
export default function Email() {
  const [visibleCards, setVisibleCards] = useState([
    {
      id: 1,
      subject: "Welcome to SwipeMail!",
      label: "Inbox",
      summary: "This is your first email. Swipe to explore more!"
    },
    {
      id: 2,
      subject: "Your Weekly Newsletter",
      label: "Promotions",
      summary: "Check out the latest updates and offers in this week's newsletter."
    },
    {
      id: 3,
      subject: "Meeting Reminder",
      label: "Work",
      summary: "Don't forget about the meeting scheduled for tomorrow at 10 AM."
    },
    {
      id: 4,
      subject: "Your Order Has Shipped",
      label: "Updates",
      summary: "Your recent order has been shipped and is on its way!"
    },
    {
      id: 5,
      subject: "Happy Birthday!",
      label: "Personal",
      summary: "Wishing you a fantastic birthday filled with joy and surprises!"
    }
  ]);
  const [swipeDirection, setSwipeDirection] = useState("");


const handleSwipe = (direction: "left" | "right") => {
  setSwipeDirection(direction);
  setTimeout(() => {
    setVisibleCards((prevCards) => prevCards.slice(1));
    setSwipeDirection("");
  }, 500);
};

  return (
    <div>
      <SignOutButton/>
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
        </div>
      ))}
      {visibleCards.length === 0 && (
        <p className="text-gray-600 text-lg">No more cards to swipe!</p>
      )}
    </div>
    <BottomNav />
    </div>
    
  );
}
