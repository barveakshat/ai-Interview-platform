// app/(main)/schedule-interview/[interview_id]/details/page.jsx
"use client";
import { useParams } from "next/navigation";
import { supabase } from "@/services/supabaseClient";
import React, { useEffect, useState } from "react";
import { useUser } from "@/app/provider";
import InterviewDetailContainer from "../../_components/InterviewDetailContainer";
import CandidateList from "../../_components/CandidateList";

function InterviewDetails() {
  const { interview_id } = useParams();
  const { user } = useUser();
  const [interviewDetail, setInterviewDetail] = useState(null);

  useEffect(() => {
    user && GetInterviewList();
  }, [user]);

  const GetInterviewList = async () => {
    let { data: interview, error } = await supabase
      .from("interviews")
      .select(
        "jobPosition, jobDescription, type, questionList, duration, interview_id, created_at, interview-feedback(userEmail, userName, feedback, created_at)"
      )
      .eq("userEmail", user?.email)
      .eq("interview_id", interview_id)
      .single();

    console.log(interview);
    setInterviewDetail(interview);
  };

  return (
    <div className="min-h-screen bg-background p-6 md:p-8 lg:p-12">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header Section */}
        <div className="relative overflow-hidden backdrop-blur-sm bg-card border border-border rounded-2xl p-6 shadow-lg">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-primary rounded-xl">
              <svg className="h-6 w-6 text-primary-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-foreground">
                Interview Details
              </h1>
              <p className="text-muted-foreground">
                Comprehensive feedback and candidate analysis
              </p>
            </div>
          </div>
          
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 pointer-events-none rounded-2xl" />
        </div>

        {/* Interview Details */}
        <InterviewDetailContainer interviewDetail={interviewDetail} />
        
        {/* Candidate List */}
        <CandidateList candidateList={interviewDetail?.["interview-feedback"]} />
      </div>
    </div>
  );
}

export default InterviewDetails;
