"use client";
import React, { useContext, useEffect } from "react";
import Image from "next/image";
import { Clock } from "lucide-react";
import { Info } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { VideoIcon } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "@/services/supabaseClient";
import { useState } from "react";
import { toast } from "sonner";
import { InterviewDataContext } from "@/app/context/InterviewDataContext";
import { Loader2Icon } from "lucide-react";

function Interview() {
  const { interview_id } = useParams();
  const [interviewData, setInterviewData] = useState();
  const [userName, setUserName] = useState();
  const [userEmail, setUserEmail] = useState();
  const [loading, setLoading] = useState(false);
  const { interviewInfo, setInterviewInfo } = useContext(InterviewDataContext);
  const router = useRouter();

  useEffect(() => {
    interview_id && GetInterviewDetails();
  }, [interview_id]);

  const GetInterviewDetails = async () => {
    setLoading(true);
    try {
      let { data: interviews, error } = await supabase
        .from("interviews")
        .select("jobPosition, jobDescription, type, duration")
        .eq("interview_id", interview_id);
      setInterviewData(interviews[0]);
      setLoading(false);
      if (interviews?.length == 0) {
        toast("Incorrect interview link");
        return;
      }
    } catch (error) {
      setLoading(false);
      toast("Incorrect interview link");
    }
  };

  const onJoinInterview = async () => {
    setLoading(true);
    let { data: interviews, error } = await supabase
      .from("interviews")
      .select("*")
      .eq("interview_id", interview_id);
    console.log(interviews[0]);
    setInterviewInfo({
      userName: userName,
      userEmail: userEmail,
      interviewData: interviews[0],
    });
    router.push("/interview/" + interview_id + "/start");
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-900 px-4 py-8 md:px-8 lg:px-16">
      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
          
          {/* Left Card - Interview Image */}
          <div className="relative overflow-hidden backdrop-blur-sm bg-gray-800/90 border border-gray-700/50 rounded-2xl p-8 shadow-lg">
            <div className="flex flex-col items-center justify-center h-full space-y-6">
              <div className="relative w-full max-w-md">
                <Image
                  src="/joinInterview.png"
                  alt="joinInterview"
                  width={500}
                  height={300}
                  className="w-full h-auto rounded-xl border border-gray-700/50 shadow-lg"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900/20 to-transparent rounded-xl" />
              </div>
              
              <div className="text-center space-y-2">
                <h2 className="text-xl font-semibold text-white">
                  Ready to showcase your skills?
                </h2>
                <p className="text-gray-400 text-sm">
                  Join your AI-powered interview session and demonstrate your expertise
                </p>
              </div>
            </div>
            
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-emerald-500/5 pointer-events-none rounded-2xl" />
          </div>

          {/* Right Card - Form and Details */}
          <div className="relative overflow-hidden backdrop-blur-sm bg-gray-800/90 border border-gray-700/50 rounded-2xl p-8 shadow-lg">
            
            {/* Job Position Header */}
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-white mb-3">
                {interviewData?.jobPosition || "Loading..."} Interview
              </h1>
              <div className="flex items-center justify-center gap-2 text-blue-400 bg-blue-500/20 px-4 py-2 rounded-full border border-blue-500/30">
                <Clock className="h-4 w-4" />
                <span className="font-medium">{interviewData?.duration} minutes</span>
              </div>
            </div>

            {/* Form Section */}
            <div className="space-y-6 mb-8">
              <div className="space-y-2">
                <label className="text-sm font-medium text-white">
                  Full Name
                </label>
                <Input
                  placeholder="e.g. Akshat Barve"
                  className="bg-gray-700/50 border-gray-600/50 text-white placeholder:text-gray-400 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-colors h-11"
                  onChange={(event) => setUserName(event.target.value)}
                  value={userName || ""}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-white">
                  Email Address
                </label>
                <Input
                  type="email"
                  placeholder="e.g. abcd@gmail.com"
                  className="bg-gray-700/50 border-gray-600/50 text-white placeholder:text-gray-400 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-colors h-11"
                  onChange={(event) => setUserEmail(event.target.value)}
                  value={userEmail || ""}
                />
              </div>
            </div>

            {/* Info Section */}
            <div className="mb-8 p-6 bg-blue-500/10 border border-blue-500/30 rounded-xl">
              <div className="flex gap-3">
                <Info className="h-5 w-5 text-blue-400 mt-0.5 flex-shrink-0" />
                <div className="space-y-3">
                  <h3 className="font-semibold text-white">Before you begin</h3>
                  <ul className="space-y-2 text-sm text-gray-400">
                    <li className="flex items-start gap-2">
                      <span className="text-blue-400 mt-1 font-bold">•</span>
                      <span>Ensure you have a stable internet connection</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-400 mt-1 font-bold">•</span>
                      <span>Test your camera and microphone beforehand</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-400 mt-1 font-bold">•</span>
                      <span>Find a quiet, well-lit space for the interview</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Join Button */}
            <Button
              className="w-full h-14 bg-blue-500 hover:bg-blue-600 text-white font-semibold text-lg transition-all duration-200 hover:shadow-xl hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 border border-blue-500/30"
              disabled={loading || !userName?.trim() || !userEmail?.trim()}
              onClick={() => onJoinInterview()}
            >
              {loading ? (
                <>
                  <Loader2Icon className="h-5 w-5 mr-3 animate-spin" />
                  Joining Interview...
                </>
              ) : (
                <>
                  <VideoIcon className="h-5 w-5 mr-3" />
                  Join Interview
                </>
              )}
            </Button>

            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/3 via-transparent to-emerald-500/3 pointer-events-none rounded-2xl" />
          </div>
          
        </div>
      </div>
    </div>
  );
}

export default Interview;
