'use client';

import { Menubar, MenubarMenu, MenubarTrigger } from "@/components/ui/menubar";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

export function BottomNav() {
  const pathname = usePathname();
  const router = useRouter();

  const navItems = [
    { label: "Archived", href: "/archived" },
    { label: "Unread", href: "/email" },
    { label: "To-Do", href: "/todo" },
  ];

    return (
        <Menubar className="fixed bottom-0 left-0 right-0 w-full justify-around border-t rounded-none z-50 h-20">
            {navItems.map((item) => (
                <MenubarMenu key={item.href}>
                    <MenubarTrigger
                        onClick={() => router.push(item.href)}
                        className={cn(
                            "w-full h-full flex items-center justify-center py-4 px-2 text-base font-medium transition-all",
                            pathname === item.href
                                ? "text-primary font-semibold"
                                : "text-muted-foreground hover:text-primary"
                        )}
                    >
                        {item.label}
                    </MenubarTrigger>
                </MenubarMenu>
            ))}
        </Menubar>
    );
}
