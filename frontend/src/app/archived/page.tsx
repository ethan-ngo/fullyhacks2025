'use client';

import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { BottomNav } from "@/components/ui/bottom-nav";
import { SignOutButton, UserButton } from "@clerk/clerk-react";

const archivedEmails = [
  {
    id: 1,
    subject: "📦 Amazon",
    body: "Your package has shipped and will arrive tomorrow.",
  },
  {
    id: 2,
    subject: "📨 Newsletter",
    body: "Check out our latest updates and offers.",
  },
  {
    id: 3,
    subject: "🔔 Reminder",
    body: "Don't forget your appointment at 3 PM tomorrow.",
  },
];

export default function ArchivedPage() {
  return (
    <div className="relative min-h-screen bg-transparent z-10">
      {/* Top section */}
      <div className="bg-gray-100 bg-opacity-90 backdrop-blur-sm px-4 pt-1 pb-1 shadow-md">
        <UserButton />
        <h1 className="text-2xl font-bold text-center pt-2">Archived</h1>
        <Separator className="mt-4" />
      </div>

      <div className="mt-8 max-w-xl mx-auto space-y-6">
        {archivedEmails.map((email) => (
          <Card key={email.id}>
            <CardContent className="p-6 space-y-2">
              <h2 className="text-lg font-semibold">{email.subject}</h2>
              <p className="text-sm text-gray-600">{email.body}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <BottomNav />
    </div>
  );
}
