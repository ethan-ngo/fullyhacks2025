"use client";

import ClientHeader from '@/components/ClientHeader';

interface ClientLayoutProps {
    userId: string | null;
    children: React.ReactNode;
}

export default function ClientLayout({ userId, children }: ClientLayoutProps) {
    return (
        <>
            <ClientHeader userId={userId} />
            {children}
        </>
    );
}