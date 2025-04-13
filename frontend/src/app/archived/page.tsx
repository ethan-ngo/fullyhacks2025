'use client';

import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { BottomNav } from "@/components/ui/bottom-nav";

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
    <div className="relative min-h-screen bg-gray-100 pb-24 px-4 pt-6">
      <h1 className="text-2xl font-bold text-center pb-4">Archived</h1>
      <Separator className="mb-6" />

      <div className="space-y-4 max-w-2xl mx-auto">
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
