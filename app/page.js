'use client'
import { useAuth } from "@/context/authContext";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
export default function Home() {
  const router = useRouter();
  const { user, loading: authLoading, logout } = useAuth();
  const isAdmin = user?.role === 'admin';
  const isDoctor = user?.role === 'doctor';
  useEffect(() => {
    if (!authLoading) {
      if (isAdmin || isDoctor) {
        router.push('/dashboard')
      }
    }
  }, [])

  return (
    <div className="">

    </div>
  );
}
