// app/(main)/schedule-interview/_components/CandidateFeedbackDialog.jsx
import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

function CandidateFeedbackDialog({ candidate }) {
  const feedback = candidate?.feedback?.feedback;

  const getColorForScore = (score) => {
    if (score >= 7) return "text-green-500";
    if (score >= 5) return "text-yellow-500";
    return "text-red-500";
  };

  const getBadgeColorForScore = (score) => {
    if (score >= 7) return "bg-green-500/10 text-green-500 border-green-500/20";
    if (score >= 5) return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20";
    return "bg-red-500/10 text-red-500 border-red-500/20";
  };

  const onSend = () => {
    const subject = encodeURIComponent("Interview feedback from PrepTrack");
    const body = encodeURIComponent(`Hi,\n\nHere is the feedback:\n`);
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
  };

  const score = candidate?.feedback?.feedback?.rating?.overall ?? 0;
  const colorClass = getColorForScore(score);
  const badgeColorClass = getBadgeColorForScore(score);
  
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="cursor-pointer hover:bg-primary/10 hover:text-primary hover:border-primary/50 transition-colors">
          View Report <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="space-y-4">
          <DialogTitle className="text-2xl font-bold text-foreground">
            Interview Feedback Report
          </DialogTitle>
          <DialogDescription asChild>
            <div className="space-y-8">
              {/* Candidate Header */}
              <div className="relative overflow-hidden backdrop-blur-sm bg-secondary/30 border border-border/50 rounded-xl p-6">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xl font-bold shadow-lg">
                      {candidate.userName?.[0]?.toUpperCase() || "U"}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-foreground">
                        {candidate.userName || "Unknown"}
                      </h3>
                      <p className="text-muted-foreground">
                        {candidate?.userEmail || "No email provided"}
                      </p>
                    </div>
                  </div>

                  {/* Overall Score */}
                  <div className={`px-6 py-3 border rounded-xl ${badgeColorClass}`}>
                    <div className="text-center">
                      <div className="text-3xl font-bold">{score}</div>
                      <div className="text-sm opacity-75">/10</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Skill Assessment */}
              <div className="relative overflow-hidden backdrop-blur-sm bg-card border border-border rounded-xl p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-primary rounded-lg">
                    <svg className="h-5 w-5 text-primary-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-bold text-foreground">Skill Assessment</h3>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-foreground">Technical Skills</span>
                      <span className="text-sm font-bold text-foreground">
                        {feedback?.rating?.technicalSkills || 0}/10
                      </span>
                    </div>
                    <Progress
                      value={(feedback?.rating?.technicalSkills || 0) * 10}
                      className="h-2"
                    />
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-foreground">Communication</span>
                      <span className="text-sm font-bold text-foreground">
                        {feedback?.rating?.communication || 0}/10
                      </span>
                    </div>
                    <Progress
                      value={(feedback?.rating?.communication || 0) * 10}
                      className="h-2"
                    />
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-foreground">Problem Solving</span>
                      <span className="text-sm font-bold text-foreground">
                        {feedback?.rating?.problemSolving || 0}/10
                      </span>
                    </div>
                    <Progress
                      value={(feedback?.rating?.problemSolving || 0) * 10}
                      className="h-2"
                    />
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-foreground">Experience</span>
                      <span className="text-sm font-bold text-foreground">
                        {feedback?.rating?.experience || 0}/10
                      </span>
                    </div>
                    <Progress
                      value={(feedback?.rating?.experience || 0) * 10}
                      className="h-2"
                    />
                  </div>
                </div>
              </div>

              {/* Performance Summary */}
              <div className="relative overflow-hidden backdrop-blur-sm bg-card border border-border rounded-xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-primary rounded-lg">
                    <svg className="h-5 w-5 text-primary-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-bold text-foreground">Performance Summary</h3>
                </div>
                <div className="bg-secondary/30 border border-border/50 rounded-xl p-4">
                  <p className="text-foreground leading-relaxed">
                    {feedback?.summary || "No summary available."}
                  </p>
                </div>
              </div>

              {/* Recommendation */}
              <div className={`relative overflow-hidden backdrop-blur-sm border rounded-xl p-6 ${
                feedback?.Recommendation === "Yes"
                  ? "bg-green-500/10 border-green-500/20"
                  : "bg-red-500/10 border-red-500/20"
              }`}>
                <div className="flex items-center justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${
                        feedback?.Recommendation === "Yes"
                          ? "bg-green-500/20"
                          : "bg-red-500/20"
                      }`}>
                        {feedback?.Recommendation === "Yes" ? (
                          <svg className="h-5 w-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        ) : (
                          <svg className="h-5 w-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        )}
                      </div>
                      <h3 className={`text-lg font-bold ${
                        feedback?.Recommendation === "Yes"
                          ? "text-green-700"
                          : "text-red-700"
                      }`}>
                        Recommendation: {feedback?.Recommendation || "N/A"}
                      </h3>
                    </div>
                    <p className={`text-sm ${
                      feedback?.Recommendation === "Yes"
                        ? "text-green-600"
                        : "text-red-600"
                    }`}>
                      {feedback?.RecommendationMsg || "No recommendation message available."}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}

export default CandidateFeedbackDialog;
