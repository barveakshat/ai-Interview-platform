// app/guest/(main)/dashboard/_components/GuestUserMenu.jsx
import { useRouter } from "next/navigation";
import { User, Crown, ArrowRight } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

export default function GuestUserMenu() {
  const router = useRouter();

  const handleSignupRoute = () => {
    router.push("/auth");
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className="group flex items-center justify-center h-14 w-14 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-blue-500/20 border border-emerald-500/30 hover:border-emerald-400/50 text-emerald-400 hover:text-emerald-300 transition-all duration-300 hover:scale-110 cursor-pointer">
          <User className="h-7 w-7 group-hover:scale-110 transition-transform duration-300" />
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56 bg-gray-800/95 backdrop-blur-sm border-gray-700/50 shadow-2xl">
        <DropdownMenuLabel className="text-gray-300 flex items-center gap-2 p-3">
          <Crown className="h-4 w-4 text-emerald-400" />
          Wanna unlock all features?
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="bg-gray-700/50" />
        <DropdownMenuItem 
          onClick={handleSignupRoute}
          className="text-gray-300 hover:text-white hover:bg-emerald-500/20 p-3 cursor-pointer flex items-center gap-2 group"
        >
          <span>Sign up now</span>
          <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
