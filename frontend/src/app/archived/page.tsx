'use client';

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { BottomNav } from "@/components/ui/bottom-nav";

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
    <div className="relative min-h-screen bg-gray-100 pb-24 px-4 pt-6">
      <h1 className="text-2xl font-bold text-center pb-4">Archived</h1>
      <Separator className="mb-6" />

      <div className="space-y-4 max-w-2xl mx-auto">
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
