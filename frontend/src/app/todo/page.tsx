'use client'

import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { BottomNav } from "@/components/ui/bottom-nav";
import { Separator } from "@/components/ui/separator"


export default function TodoPage() {
  const sections = [
    { label: "Important", emails: ["Follow up on grant proposal", "Feedback from investor"] },
    { label: "Calendar", emails: ["Meeting invite: Project Sync", "Event reminder: DevCon"] },
    { label: "Other", emails: ["LinkedIn message", "Blog comment notification"] },
  ];

  return (
    <div className="relative min-h-screen bg-gray-100 pb-24 px-4 pt-6">
      <h1 className="text-2xl font-bold text-center pb-4">To-Do</h1>
      <Separator className="mb-6" />
    <div className="max-w-xl mx-auto p-6 space-y-6">
      {sections.map((section, index) => (
        <Collapsible key={index} defaultOpen>
          <CollapsibleTrigger asChild>
            <Button variant="outline" className="w-full justify-between font-semibold">
              {section.label}
              <span>▾</span>
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="space-y-2 mt-2 p-2 border rounded-md bg-muted">
            {section.emails.map((email, i) => (
              <div key={i} className="p-2 rounded bg-background shadow-sm">
                {email}
              </div>
            ))}
          </CollapsibleContent>
        </Collapsible>
      ))}
      <BottomNav />
      </div>
    </div>
  );
}
