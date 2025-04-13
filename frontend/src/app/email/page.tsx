'use client';
import { useState, useEffect } from "react";
import { Card, CardContent} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { BottomNav } from "@/components/ui/bottom-nav";

export default function Email() {
  const cards = [
    { id: 1, subject: "Amazon", label: "Order Confirmation", summary: "SwipeMail helps you organize emails!" },
    { id: 2, subject: "Walmart", label: "Marketing", summary: "Swipe through your inbox effortlessly." },
    { id: 3, subject: "Target", label: "Important", summary: "Keep your inbox clean and stress-free." },
  ];

  const [visibleCards, setVisibleCards] = useState(cards);
  const [swipeDirection, setSwipeDirection] = useState(""); // Tracks swipe direction

  const handleSwipe = (direction: "left" | "right") => {
    setSwipeDirection(direction); // Set the swipe direction
    setTimeout(() => {
      // Remove the top card after the animation
      setVisibleCards((prevCards) => prevCards.slice(1));
      setSwipeDirection(""); // Reset swipe direction
    }, 500); // Match the duration of the CSS transition
  };

  // Add keyboard event listener
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowLeft") {
        handleSwipe("left"); // Swipe left on left arrow key
      } else if (event.key === "ArrowRight") {
        handleSwipe("right"); // Swipe right on right arrow key
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    // Cleanup event listener on component unmount
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

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
            zIndex: cards.length - index,
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
