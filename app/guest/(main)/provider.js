import React from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import GuestWelcomeContainer from "./dashboard/_components/GuestWelcomeContainer";
import { GuestAppSidebar } from "./_components/GuestAppSidebar";

function GuestDashboardProvider({ children }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <SidebarProvider>
        <GuestAppSidebar />
        <div className="w-full">
          {/* <SidebarTrigger /> */}
          <div className="p-5">
            <GuestWelcomeContainer />
          </div>
          {children}
        </div>
      </SidebarProvider>
    </div>
  );
}

export default GuestDashboardProvider;
