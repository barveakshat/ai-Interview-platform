// app/guest/(main)/dashboard/page.jsx
"use client";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Play, Sparkles, ArrowRight, Users, Clock, Trophy, Brain, Zap, Target } from "lucide-react";

function GuestDashboard() {
  const router = useRouter();

  const handleDemoClick = () => {
    try {
      router.push("/interview/066f5f08-6fbb-42d3-92ee-d237170a872f");
    } catch (error) {
      console.error("Navigation error:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl">
        {/* Main Card */}
        <div className="relative overflow-hidden backdrop-blur-sm bg-gray-800/50 rounded-2xl border border-gray-700/50 shadow-2xl p-6 md:p-8">
          {/* Background Elements */}
          <div className="absolute top-0 right-0 w-72 h-72 bg-gradient-to-br from-emerald-500/10 to-blue-500/10 rounded-full blur-3xl -translate-y-24 translate-x-24 pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-72 h-72 bg-gradient-to-tr from-blue-500/10 to-emerald-500/10 rounded-full blur-3xl translate-y-24 -translate-x-24 pointer-events-none" />
          
          {/* Header Section */}
          <div className="text-center mb-8 relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-gray-800/80 backdrop-blur-sm rounded-full shadow-sm border border-emerald-500/30 mb-4">
              <Sparkles className="h-3.5 w-3.5 text-emerald-400" />
              <span className="text-xs font-medium text-emerald-300">
                Live Demo Available
              </span>
            </div>
            
            <div className="flex items-center justify-center gap-3 mb-4">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white via-gray-100 to-emerald-400">
                Welcome to
              </h1>
            </div>
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 via-blue-400 to-emerald-300 mb-4">
              PrepTrack Demo
            </h2>
            <p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
              Experience the future of interviews with our AI-powered platform.
              <span className="text-emerald-400 font-semibold"> Get instant feedback</span> and improve your interview skills.
            </p>
          </div>

          {/* Enhanced Image Section */}
          <div className="relative mb-8 group">
            <div className="relative overflow-hidden rounded-2xl border border-gray-600/50 shadow-2xl">
              <Image
                src="/gurujiGuestDashboard.png"
                alt="AI Interview Demo"
                width={800}
                height={400}
                className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-105"
              />
              {/* Enhanced overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-gray-900/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              {/* Play button overlay */}
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500">
                <div className="bg-emerald-500/90 backdrop-blur-sm rounded-full p-4 shadow-2xl transform scale-75 group-hover:scale-100 transition-transform duration-500">
                  <Play className="h-8 w-8 text-white ml-1" />
                </div>
              </div>
            </div>

            {/* Enhanced floating badges */}
            <div className="absolute -top-4 -right-4 bg-gray-800/90 backdrop-blur-sm rounded-xl p-3 shadow-xl border border-emerald-500/30">
              <Trophy className="h-6 w-6 text-emerald-400" />
            </div>
            <div className="absolute -bottom-4 -left-4 bg-gray-800/90 backdrop-blur-sm rounded-xl p-3 shadow-xl border border-blue-500/30">
              <Clock className="h-6 w-6 text-blue-400" />
            </div>
            <div className="absolute top-1/2 -right-6 transform -translate-y-1/2 bg-gray-800/90 backdrop-blur-sm rounded-xl p-2.5 shadow-xl border border-emerald-500/30">
              <Brain className="h-5 w-5 text-emerald-400" />
            </div>
          </div>

          {/* Enhanced Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 relative z-10">
            <div className="group text-center p-6 rounded-xl bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 hover:shadow-xl hover:border-emerald-500/50 transition-all duration-500 hover:scale-105 hover:-translate-y-1">
              <div className="p-3 bg-gradient-to-br from-emerald-500/20 to-emerald-600/20 rounded-xl w-fit mx-auto mb-4 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500">
                <Play className="h-6 w-6 text-emerald-400 group-hover:text-emerald-300" />
              </div>
              <h3 className="font-bold text-lg text-white mb-2 group-hover:text-emerald-300 transition-colors duration-500">
                Interactive Demo
              </h3>
              <p className="text-gray-400 group-hover:text-gray-300 transition-colors duration-500 leading-relaxed text-sm">
                Experience real interview scenarios with our AI interviewer
              </p>
              <div className="mt-3 flex items-center justify-center gap-2 text-xs text-emerald-400 font-medium opacity-0 group-hover:opacity-100 transition-all duration-500 delay-200">
                <ArrowRight className="h-3 w-3" />
                <span>Try now</span>
              </div>
            </div>

            <div className="group text-center p-6 rounded-xl bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 hover:shadow-xl hover:border-blue-500/50 transition-all duration-500 hover:scale-105 hover:-translate-y-1">
              <div className="p-3 bg-gradient-to-br from-blue-500/20 to-blue-600/20 rounded-xl w-fit mx-auto mb-4 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500">
                <Sparkles className="h-6 w-6 text-blue-400 group-hover:text-blue-300" />
              </div>
              <h3 className="font-bold text-lg text-white mb-2 group-hover:text-blue-300 transition-colors duration-500">
                AI Feedback
              </h3>
              <p className="text-gray-400 group-hover:text-gray-300 transition-colors duration-500 leading-relaxed text-sm">
                Get instant performance insights and improvement suggestions
              </p>
              <div className="mt-3 flex items-center justify-center gap-2 text-xs text-blue-400 font-medium opacity-0 group-hover:opacity-100 transition-all duration-500 delay-200">
                <Zap className="h-3 w-3" />
                <span>Learn more</span>
              </div>
            </div>

            <div className="group text-center p-6 rounded-xl bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 hover:shadow-xl hover:border-emerald-500/50 transition-all duration-500 hover:scale-105 hover:-translate-y-1">
              <div className="p-3 bg-gradient-to-br from-emerald-500/20 to-emerald-600/20 rounded-xl w-fit mx-auto mb-4 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500">
                <Target className="h-6 w-6 text-emerald-400 group-hover:text-emerald-300" />
              </div>
              <h3 className="font-bold text-lg text-white mb-2 group-hover:text-emerald-300 transition-colors duration-500">
                Skill Assessment
              </h3>
              <p className="text-gray-400 group-hover:text-gray-300 transition-colors duration-500 leading-relaxed text-sm">
                Measure your interview readiness across multiple dimensions
              </p>
              <div className="mt-3 flex items-center justify-center gap-2 text-xs text-emerald-400 font-medium opacity-0 group-hover:opacity-100 transition-all duration-500 delay-200">
                <Trophy className="h-3 w-3" />
                <span>Assess now</span>
              </div>
            </div>
          </div>

          {/* Enhanced CTA Section */}
          <div className="text-center relative z-10">
            <div className="mb-6">
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">
                Ready to get started?
              </h2>
              <p className="text-lg text-gray-300 max-w-2xl mx-auto">
                Try our demo interview and see how AI can help you 
                <span className="text-emerald-400 font-semibold"> ace your next interview</span>.
              </p>
            </div>

            {/* Enhanced Demo Button */}
            <div className="relative group mb-6">
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-blue-500 rounded-xl blur-xl opacity-60 group-hover:opacity-80 transition-opacity duration-500"></div>
              <Button
                onClick={handleDemoClick}
                size="lg"
                className="relative bg-gradient-to-r from-emerald-500 to-blue-500 hover:from-emerald-600 hover:to-blue-600 text-white font-bold px-10 py-4 text-lg rounded-xl shadow-2xl hover:shadow-3xl transition-all duration-500 cursor-pointer group-hover:scale-105">
                <Play className="h-5 w-5 mr-2" />
                Try Demo Interview
                <ArrowRight className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
              </Button>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-gray-500">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-emerald-400"></div>
                <span>No registration required</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-blue-400"></div>
                <span>Takes 5-10 minutes</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-emerald-400"></div>
                <span>Instant results</span>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Bottom Stats */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="group text-center p-4 bg-gray-800/60 backdrop-blur-sm rounded-xl border border-gray-700/50 hover:border-emerald-500/50 transition-all duration-500 hover:scale-105">
            <div className="text-2xl md:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-emerald-300 mb-2">
              1000+
            </div>
            <div className="text-gray-400 group-hover:text-gray-300 transition-colors duration-300 font-medium text-sm">
              Interviews Completed
            </div>
            <div className="mt-2 h-1 bg-gradient-to-r from-emerald-500/20 to-emerald-400/20 rounded-full">
              <div className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 rounded-full w-3/4 group-hover:w-full transition-all duration-1000"></div>
            </div>
          </div>
          
          <div className="group text-center p-4 bg-gray-800/60 backdrop-blur-sm rounded-xl border border-gray-700/50 hover:border-blue-500/50 transition-all duration-500 hover:scale-105">
            <div className="text-2xl md:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-blue-300 mb-2">
              98%
            </div>
            <div className="text-gray-400 group-hover:text-gray-300 transition-colors duration-300 font-medium text-sm">
              Success Rate
            </div>
            <div className="mt-2 h-1 bg-gradient-to-r from-blue-500/20 to-blue-400/20 rounded-full">
              <div className="h-full bg-gradient-to-r from-blue-500 to-blue-400 rounded-full w-4/5 group-hover:w-full transition-all duration-1000 delay-200"></div>
            </div>
          </div>
          
          <div className="group text-center p-4 bg-gray-800/60 backdrop-blur-sm rounded-xl border border-gray-700/50 hover:border-emerald-500/50 transition-all duration-500 hover:scale-105">
            <div className="text-2xl md:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-emerald-300 mb-2">
              24/7
            </div>
            <div className="text-gray-400 group-hover:text-gray-300 transition-colors duration-300 font-medium text-sm">
              Available
            </div>
            <div className="mt-2 h-1 bg-gradient-to-r from-emerald-500/20 to-emerald-400/20 rounded-full">
              <div className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 rounded-full w-full group-hover:animate-pulse transition-all duration-1000 delay-400"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default GuestDashboard;
