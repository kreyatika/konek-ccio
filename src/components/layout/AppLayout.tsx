
import React, { ReactNode } from 'react';
import Navbar from './Navbar';
import Sidebar from './sidebar'; // Changed from './Sidebar' to './sidebar'
import { SidebarProvider } from '@/components/ui/sidebar';
import { useIsMobile } from '@/hooks/use-mobile';

interface AppLayoutProps {
  children: ReactNode;
}

const AppLayout: React.FC<AppLayoutProps> = ({
  children
}) => {
  const isMobile = useIsMobile();
  
  return <div className="flex min-h-screen flex-col">
      <Navbar />
      <div className="flex flex-1 w-full">
        <SidebarProvider defaultOpen={!isMobile}>
          <Sidebar />
          <main className="flex-1 p-4 md:p-6 overflow-auto mx-[52px] my-0 py-0 px-[6px]">
            {children}
          </main>
        </SidebarProvider>
      </div>
    </div>;
};

export default AppLayout;
