// app/guest/(main)/_components/Guest.jsx
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
import { toast } from "sonner"; // <-- NEW
import { UserPlus, Sparkles, Crown } from "lucide-react"; // icon for the extra menu item
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";

export function GuestAppSidebar() {
  const path = usePathname();
  const router = useRouter();

  /** Show toast, then navigate */
  const handleMenuClick = (dest) => {
    toast.info("Sign up to unlock all features ✨");
    // router.push(dest);
  };

  return (
    <Sidebar className="bg-gray-900 border-gray-800">
      {/* ---------- Header ---------- */}
      <SidebarHeader className="border-b border-gray-800/50">
        <div className="flex flex-col space-y-4 justify-center items-center p-4">
          <div className="flex flex-row items-center space-x-2 p-3">
            <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-blue-500 rounded-xl flex items-center justify-center shadow-lg">
              <Image
                src="/gurujiLogoSm.png"
                alt="logo small"
                width={24}
                height={24}
                className="rounded-lg"
              />
            </div>
            <div className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-blue-400">
              PrepTrack
            </div>
          </div>

          {/* Enhanced "Create interview" button */}
          <Button
            variant="default"
            onClick={() => handleMenuClick("/auth")}
            className="w-full bg-gradient-to-r from-emerald-500 to-blue-500 hover:from-emerald-600 hover:to-blue-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 group"
          >
            <FaPlus className="group-hover:rotate-90 transition-transform duration-300" />
            Create New Interview
            <Sparkles className="h-4 w-4 ml-1 group-hover:scale-110 transition-transform duration-300" />
          </Button>
        </div>
      </SidebarHeader>

      {/* ---------- Main items ---------- */}
      <SidebarContent className="list-none bg-gray-900">
        <SidebarGroup>
          {SidebarOptions.map((opt) => (
            <SidebarMenuItem key={opt.path} className="p-1">
              <SidebarMenuButton
                className={`p-5 flex items-center space-x-3 rounded-xl mx-2 transition-all duration-300 hover:bg-gray-800/50 group ${
                  path === opt.path 
                    ? "bg-emerald-500/20 border border-emerald-500/30 text-emerald-400" 
                    : "text-gray-400 hover:text-gray-300"
                }`}
                onClick={() => handleMenuClick(opt.path)}>
                <opt.icon
                  className={`h-5 w-5 transition-colors duration-300 ${
                    path === opt.path ? "text-emerald-400" : "group-hover:text-emerald-400"
                  }`}
                />
                <span
                  className={`text-sm font-medium ${
                    path === opt.path ? "text-emerald-400" : ""
                  }`}>
                  {opt.name}
                </span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}

          {/* ---------- Enhanced "Sign-up now" item ---------- */}
          <SidebarMenuItem className="p-1 mt-4">
            <div className="mx-2 p-4 bg-gradient-to-r from-emerald-500/10 to-blue-500/10 rounded-xl border border-emerald-500/20">
              <div className="flex items-center gap-2 mb-2">
                <Crown className="h-4 w-4 text-emerald-400" />
                <span className="text-sm font-semibold text-emerald-400">Unlock Premium</span>
              </div>
              <SidebarMenuButton
                className="w-full p-3 flex items-center justify-center space-x-2 bg-gradient-to-r from-emerald-500 to-blue-500 hover:from-emerald-600 hover:to-blue-600 text-white rounded-lg transition-all duration-300 hover:scale-105"
                onClick={() => router.push("/auth")} // direct, no toast
              >
                <UserPlus className="h-4 w-4" />
                <span className="text-sm font-medium">Sign up now</span>
              </SidebarMenuButton>
            </div>
          </SidebarMenuItem>
        </SidebarGroup>
      </SidebarContent>

      {/* ---------- Enhanced Footer ---------- */}
      <SidebarFooter className="border-t border-gray-800/50 p-4 bg-gray-900">
        <div className="text-xs text-center text-gray-500">
          © 2025 PrepTrack
          <div className="text-emerald-400 font-medium mt-1">Demo Mode</div>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}