'use client';

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { BottomNav } from "@/components/ui/bottom-nav";
import { SignOutButton, UserButton} from "@clerk/clerk-react";
import LoadingOverlay from "@/components/LoadingOverlay";
export default function Email() {
  interface Card {
    id: number | string; // Unique identifier for the card
    subject: string; // Email subject
    label: string; // Email label (e.g., "Inbox")
    summary: string; // Email summary
  }

  type TopCard = Card; // TopCard has the same structure as Card

  const [visibleCards, setVisibleCards] = useState<Card[]>([]); // Array of cards
  const [swipeDirection, setSwipeDirection] = useState("");
  const [loading, setLoading] = useState(true)
  const [todo, setTodo] = useState({})
  const [archived, setArchived] = useState({})
  const [fetched, setFetched] = useState(false); // Track if emails have been fetched

const getEmail = async () => {
  try {
    const response = await fetch("http://localhost:3001/api")
    console.log("test")
    if(response.ok){
      const data = await response.json()
      if (data.emails) {
        const newCards = data.emails.map((email: string, index: number) => ({
          id: visibleCards.length + index + 1,
          subject: "Amazon",
          label: "Inbox", // Default label for fetched emails
          summary: email, // Default summary
        }));

        setVisibleCards((prevCards) => [...prevCards, ...newCards]);
      }
      setVisibleCards((prevCards) => prevCards.slice(1)); // Remove the top empty card
      setLoading(false)
    }
  } catch(error) {
    console.error(error)
  }
}

useEffect(()=>{
  getEmail();
}, [])

useEffect(() => {
  localStorage.setItem("archived", JSON.stringify(archived));
}, [archived]); // Runs whenever `archived` changes

useEffect(() => {
  localStorage.setItem("todo", JSON.stringify(todo));
}, [todo]);

const handleSwipe = (direction: "left" | "right") => {
  setSwipeDirection(direction);
  setTimeout(() => {
    setVisibleCards((prevCards) => {
      const topCard = prevCards[0]; // Get the top card
      console.log("Top Card:", topCard); // Log the top card for debugging

      if (direction === "left") {
        // Store the top card in archived
        setArchived((prevArchived) => ({
          ...prevArchived,
          [topCard.id]: topCard,
        }));
      } else if (direction === "right") {
        // Store the top card in todo
        setTodo((prevTodo) => ({
          ...prevTodo,
          [topCard.id]: topCard,
        }));
      }

      return prevCards.slice(1); // Remove the top card from visibleCards
    });

    setSwipeDirection(""); // Reset swipe direction after animation
  }, 500);
};

  return (
    <div>
      <UserButton/>
      {loading ? <LoadingOverlay/> :
      <div className="relative flex justify-center h-screen bg-gray-100">
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
    }
    <BottomNav />
    </div>
    
  );
}
