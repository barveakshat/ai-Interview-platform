// app/(main)/schedule-interview/_components/InterviewDetailContainer.jsx
import React from "react";
import moment from "moment";
import {
  Clock,
  Calendar,
  Tag,
  FileText,
  HelpCircle,
  Sparkles,
} from "lucide-react";

// Helper function to format duration
const formatDuration = (duration) => {
  if (!duration) return "N/A";
  
  // If it's already a string like "5 Min", return as is
  if (typeof duration === 'string') {
    return duration;
  }
  
  // If it's a number, convert to "X Min" format
  if (typeof duration === 'number') {
    return `${duration} Min`;
  }
  
  return "N/A";
};

function InterviewDetailContainer({ interviewDetail }) {
  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="relative overflow-hidden backdrop-blur-sm bg-card border border-border rounded-2xl p-8 shadow-lg">
        <div className="flex items-center gap-4 mb-6">
          <div className="p-3 bg-primary rounded-xl">
            <FileText className="h-6 w-6 text-primary-foreground" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-foreground">
              {interviewDetail?.jobPosition || "Loading..."}
            </h2>
            <p className="text-muted-foreground">Position Details</p>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="group relative overflow-hidden backdrop-blur-sm bg-secondary/50 border border-border/50 rounded-xl p-6 transition-all duration-300 hover:shadow-md hover:border-primary/50">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors">
                <Clock className="h-5 w-5 text-primary" />
              </div>
              <span className="text-sm font-medium text-muted-foreground">Duration</span>
            </div>
            <p className="text-xl font-bold text-foreground">
              {formatDuration(interviewDetail?.duration)}
            </p>
          </div>

          <div className="group relative overflow-hidden backdrop-blur-sm bg-secondary/50 border border-border/50 rounded-xl p-6 transition-all duration-300 hover:shadow-md hover:border-primary/50">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors">
                <Calendar className="h-5 w-5 text-primary" />
              </div>
              <span className="text-sm font-medium text-muted-foreground">Created on</span>
            </div>
            <p className="text-xl font-bold text-foreground">
              {moment(interviewDetail?.created_at).format("DD MMM YYYY")}
            </p>
          </div>

          <div className="group relative overflow-hidden backdrop-blur-sm bg-secondary/50 border border-border/50 rounded-xl p-6 transition-all duration-300 hover:shadow-md hover:border-primary/50">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors">
                <Tag className="h-5 w-5 text-primary" />
              </div>
              <span className="text-sm font-medium text-muted-foreground">Type</span>
            </div>
            <p className="text-xl font-bold text-foreground">
              {interviewDetail?.type
                ? JSON.parse(interviewDetail.type).join(" + ")
                : "Not specified"}
            </p>
          </div>
        </div>

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 pointer-events-none rounded-2xl" />
      </div>

      {/* Job Description Section */}
      <div className="relative overflow-hidden backdrop-blur-sm bg-card border border-border rounded-2xl p-8 shadow-lg">
        <div className="flex items-center gap-4 mb-6">
          <div className="p-3 bg-primary rounded-xl">
            <FileText className="h-6 w-6 text-primary-foreground" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-foreground">Job Description</h3>
            <p className="text-muted-foreground">Position requirements and details</p>
          </div>
        </div>
        
        <div className="relative overflow-hidden backdrop-blur-sm bg-secondary/30 border border-border/50 rounded-xl p-6">
          <p className="text-foreground leading-relaxed">
            {interviewDetail?.jobDescription || "No description provided."}
          </p>
        </div>

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-accent/5 via-transparent to-primary/5 pointer-events-none rounded-2xl" />
      </div>

      {/* Interview Questions Section */}
      <div className="relative overflow-hidden backdrop-blur-sm bg-card border border-border rounded-2xl p-8 shadow-lg">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-primary rounded-xl">
              <HelpCircle className="h-6 w-6 text-primary-foreground" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-foreground">Interview Questions</h3>
              <p className="text-muted-foreground">AI-generated interview questions</p>
            </div>
          </div>
          <div className="px-4 py-2 bg-primary/10 border border-primary/20 rounded-full">
            <span className="text-primary text-sm font-medium">
              {interviewDetail?.questionList?.length || 0} Questions
            </span>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {interviewDetail?.questionList?.map((item, index) => (
            <div
              key={item?.question || index}
              className="group relative overflow-hidden backdrop-blur-sm bg-secondary/30 border border-border/50 rounded-xl p-6 transition-all duration-300 hover:shadow-md hover:border-primary/50">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-primary text-primary-foreground text-sm font-bold rounded-full flex items-center justify-center">
                  {index + 1}
                </div>
                <p className="text-foreground leading-relaxed group-hover:text-primary/90 transition-colors">
                  {item?.question}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 pointer-events-none rounded-2xl" />
      </div>
    </div>
  );
}

export default InterviewDetailContainer;
