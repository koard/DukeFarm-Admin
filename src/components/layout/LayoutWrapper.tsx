'use client';

import { usePathname } from 'next/navigation';
import Sidebar from "./Sidebar";

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isLoginPage = pathname === '/login';

  if (isLoginPage) {
    // Login page - no sidebar
    return <>{children}</>;
  }

  // Dashboard pages - with sidebar
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 ml-0 lg:ml-64 transition-all duration-300 p-0 bg-[#F9FAFB] w-full min-w-0">
        {children}
      </main>
    </div>
  );
}
