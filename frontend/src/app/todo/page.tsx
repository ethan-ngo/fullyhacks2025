'use client';

import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { BottomNav } from "@/components/ui/bottom-nav";
import { Separator } from "@/components/ui/separator";import { UserButton } from "@clerk/clerk-react"


export default function TodoPage() {
  interface Card {
    id: number | string; // Unique identifier for the card
    subject: string; // Email subject
    label: string; // Email label (e.g., "Inbox")
    summary: string; // Email summary
  }

  const [todoEmails, setTodoEmails] = useState<Card[]>([]); // State to store emails from localStorage

  // Load emails from localStorage on component mount
  useEffect(() => {
    const savedTodo = localStorage.getItem("todo");
    if (savedTodo) {
      setTodoEmails(Object.values(JSON.parse(savedTodo))); // Convert object to array
    }
  }, []);

  return (
    <div className="relative min-h-screen bg-transparent z-10">
      {/* Top section */}
      <div className="bg-gray-100 bg-opacity-90 backdrop-blur-sm px-4 pt-1 pb-1 shadow-md">
        <UserButton />
        <h1 className="text-2xl font-bold text-center pt-2">To-Do</h1>
        <Separator className="mt-4" />
        </div>

      <div className="mt-8 max-w-xl mx-auto px-4 space-y-6">
          {todoEmails.length === 0 ? (
          <p className="text-gray-600 text-center">No to-do emails found.</p>
        ) : (
            <Collapsible defaultOpen>
              <CollapsibleTrigger asChild>
                <Button variant="outline" className="w-full justify-between font-semibold">
                  To-Do Emails
                  <span>▾</span>
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent className="space-y-2 mt-2 p-2 border rounded-md bg-muted">
                {todoEmails.map((email) => (
                  <div key={email.id} className="p-2 rounded bg-background shadow-sm">
                    <h2 className="font-semibold">{email.subject}</h2>
                  <p className="text-sm text-gray-600">{email.summary}</p>
                  </div>
                ))}
              </CollapsibleContent>
            </Collapsible>
          )}
        </div>
      <BottomNav />
    </div>
  );
}
