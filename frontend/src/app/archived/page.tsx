'use client';

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { BottomNav } from "@/components/ui/bottom-nav";
import { SignOutButton, UserButton } from "@clerk/clerk-react";

export default function ArchivedPage() {
  
  interface ArchivedEmail {
    id: string;
    subject: string;
    summary?: string;
    body?: string;
  }

  const [archivedEmails, setArchivedEmails] = useState<ArchivedEmail[]>([]); // State to store archived emails

  // Load archived emails from localStorage on component mount
  useEffect(() => {
    const savedArchived = localStorage.getItem("archived");
    if (savedArchived) {
      setArchivedEmails(Object.values(JSON.parse(savedArchived))); // Convert object to array
    }
  }, []);

  return (
    <div className="relative min-h-screen bg-transparent z-10">
      {/* Top section */}
      <div className="bg-gray-100 bg-opacity-90 backdrop-blur-sm px-4 pt-1 pb-1 shadow-md">
        <UserButton />
        <h1 className="text-2xl font-bold text-center pt-2">Archived</h1>
        <Separator className="mt-4" />
      </div>

      <div className="mt-8 max-w-xl mx-auto space-y-6">
        {archivedEmails.length === 0 ? (
          <p className="text-gray-600 text-center">No archived emails found.</p>
        ) : (
          archivedEmails.map((email) => (
            <Card key={email.id}>
              <CardContent className="p-6 space-y-2">
                <h2 className="text-lg font-semibold">{email.subject}</h2>
                <p className="text-sm text-gray-600">{email.summary || email.body}</p>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      <BottomNav />
    </div>
  );
}
