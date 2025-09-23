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
    <div className="min-h-screen bg-background px-4 py-8 md:px-8 lg:px-16 xl:px-32">
      <div className="mx-auto max-w-2xl">
        <div className="relative overflow-hidden backdrop-blur-sm bg-card border border-border rounded-2xl p-8 shadow-lg">
          {/* Interview Image */}
          <div className="flex flex-col items-center space-y-6 mb-8">
            <div className="relative">
              <Image
                src="/joinInterview.png"
                alt="joinInterview"
                width={500}
                height={200}
                className="rounded-xl border border-border/50"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/20 to-transparent rounded-xl" />
            </div>
          </div>

          {/* Job Position */}
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold text-foreground mb-2">
              {interviewData?.jobPosition || "Loading..."} Interview
            </h1>
            <div className="flex items-center justify-center gap-2 text-muted-foreground">
              <Clock className="h-4 w-4" />
              <span>{interviewData?.duration} minutes</span>
            </div>
          </div>

          {/* Form Section */}
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                Full Name
              </label>
              <Input
                placeholder="e.g. Anoop Lanjekar"
                className="bg-input border-border text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors"
                onChange={(event) => setUserName(event.target.value)}
                value={userName || ""}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                Email Address
              </label>
              <Input
                type="email"
                placeholder="e.g. anoop@gmail.com"
                className="bg-input border-border text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors"
                onChange={(event) => setUserEmail(event.target.value)}
                value={userEmail || ""}
              />
            </div>
          </div>

          {/* Info Section */}
          <div className="mt-8 p-4 bg-primary/5 border border-primary/20 rounded-xl">
            <div className="flex gap-3">
              <Info className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
              <div className="space-y-2">
                <h3 className="font-semibold text-foreground">Before you begin</h3>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span>Ensure you have a stable internet connection</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span>Test your camera and microphone beforehand</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span>Find a quiet, well-lit space for the interview</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Join Button */}
          <Button
            className="w-full mt-8 h-12 bg-primary hover:bg-primary/90 text-primary-foreground font-medium transition-all duration-200 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={loading || !userName?.trim() || !userEmail?.trim()}
            onClick={() => onJoinInterview()}
          >
            {loading ? (
              <>
                <Loader2Icon className="h-4 w-4 mr-2 animate-spin" />
                Joining Interview...
              </>
            ) : (
              <>
                <VideoIcon className="h-4 w-4 mr-2" />
                Join Interview
              </>
            )}
          </Button>

          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 pointer-events-none rounded-2xl" />
        </div>
      </div>
    </div>
  );
}

export default Interview;
