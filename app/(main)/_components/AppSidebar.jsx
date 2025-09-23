// app/(main)/_components/AppSidebar.jsx
"use client";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { FaPlus } from "react-icons/fa";
import { SidebarOptions } from "@/services/Constants";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { useRouter } from "next/navigation";

export function AppSidebar() {
  const path = usePathname();
  const router = useRouter();

  return (
    <Sidebar className="border-r border-border/20">
      <SidebarHeader className="border-b border-border/20 bg-sidebar">
        <div className="flex flex-col space-y-3 justify-center items-center">
          <Link 
            href="/dashboard"
            className="flex flex-row items-center space-x-1 p-3 cursor-pointer hover:opacity-80 transition-opacity"
          >
            <Image
              src="/gurujiLogoSm.png"
              alt="PrepTrack logo"
              width={250}
              height={250}
            />
          </Link>
          <Button
            variant="default"
            className="cursor-pointer w-full mx-4 hover:bg-[#1f67ff] text-white border border-[#1f67ff]/50 hover:border-[#1f67ff] transition-all duration-200"
            onClick={() =>
              router.push(
                `${process.env.NEXT_PUBLIC_SITE_URL}/dashboard/create-interview`
              )
            }>
            <FaPlus />
            Create New Interview
          </Button>
        </div>
      </SidebarHeader>
      <SidebarContent className="list-none bg-sidebar">
        <SidebarGroup className="px-2 py-4">
          {SidebarOptions.map((option, index) => (
            <SidebarMenuItem key={index} className="mb-1">
              <SidebarMenuButton
                asChild
                className={`p-4 rounded-lg transition-all duration-200 transform ${
                  path === option.path 
                    ? "bg-[#1f67ff]/15 border-l-4 border-[#1f67ff] text-[#1f67ff] scale-105 shadow-md" 
                    : "hover:bg-[#1f67ff]/10 hover:scale-105 hover:shadow-md text-sidebar-foreground hover:border-l-4 hover:border-[#1f67ff]/50"
                }`}>
                <Link
                  href={option.path}
                  className="flex items-center space-x-3 group">
                  <option.icon
                    className={`w-5 h-5 transition-all duration-200 ${
                      path === option.path ? "text-[#4F70FE]" : "text-sidebar-foreground/70"
                    }`}
                  />
                  <span
                    className={`text-sm font-medium transition-all duration-200 ${
                      path === option.path ? "text-[#4F70FE]" : "text-sidebar-foreground"
                    }`}>
                    {option.name}
                  </span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="border-t border-border/20 p-4 bg-sidebar">
        <div className="text-xs text-center text-sidebar-foreground/60">
          © 2025 PrepTrack
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
