import '../theme.css';

import { cookies } from 'next/headers';
import { NuqsAdapter } from 'nuqs/adapters/next/app';

import KBar from '@/components/kbar';
import AppSidebar from '@/components/layout/app-sidebar';
import Header from '@/components/layout/header';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { Toaster } from '@/components/ui/sonner';

export default async function WithAuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  return (
    <NuqsAdapter>
      <Toaster position="top-right" richColors />
      <KBar>
        <SidebarProvider>
          <AppSidebar />
          <SidebarInset>
            <Header />
            {children}
          </SidebarInset>
        </SidebarProvider>
      </KBar>
    </NuqsAdapter>
  );
}
