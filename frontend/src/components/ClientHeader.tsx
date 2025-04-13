"use client";
import dynamic from 'next/dynamic';

const ClientClerkWrapper = dynamic(
  () => import('@/components/ClientClerkWrapper'),
  {
    ssr: false,
    loading: () => <header className="h-16" />
  }
);

export default function ClientHeader({ userId }: { userId: string | null }) {
  return <ClientClerkWrapper userId={userId} />;
}