// app/guest/(main)/dashboard/_components/WelcomeContainer.jsx
"use client";
import React from "react";
import { useUser } from "@/app/provider";
import { Sparkles, User, Zap } from "lucide-react";
import Image from "next/image";
import GuestUserMenu from "./GuestUserMenu";

function GuestWelcomeContainer() {
  return (
    <div className="relative overflow-hidden backdrop-blur-sm bg-gray-800/50 rounded-2xl border border-gray-700/50 shadow-xl p-8 mr-5">
      <div className="flex justify-between items-center relative z-10">
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-emerald-400">
              Hey There!
            </h2>
            <div className="flex items-center gap-1">
              <Sparkles className="h-6 w-6 text-emerald-400 animate-pulse" />
              <Zap className="h-5 w-5 text-blue-400 animate-bounce delay-300" />
            </div>
          </div>
          <p className="text-gray-300 text-lg">
            AI-Driven interviews are just a few clicks away.
            <span className="text-emerald-400 font-semibold"> Start your journey now!</span>
          </p>
        </div>
        <GuestUserMenu />
      </div>
      
      {/* Enhanced decorative elements */}
      <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 via-transparent to-blue-500/10 pointer-events-none" />
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-emerald-400/20 to-blue-400/20 rounded-full blur-3xl -translate-y-8 translate-x-8 pointer-events-none" />
    </div>
  );
}

export default GuestWelcomeContainer;
