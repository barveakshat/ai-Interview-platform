// app/(main)/schedule-interview/_components/CandidateList.jsx
import React from "react";
import moment from "moment";
import CandidateFeedbackDialog from "./CandidateFeedbackDialog";

function CandidateList({ candidateList }) {
  // Color based on technicalSkills rating
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

  // Normalize input to an array to avoid runtime errors when relation returns a single object or null
  const list = Array.isArray(candidateList)
    ? candidateList
    : candidateList
    ? [candidateList]
    : [];

  return (
    <div className="relative overflow-hidden backdrop-blur-sm bg-card border border-border rounded-2xl p-8 shadow-lg">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-primary rounded-xl">
            <svg className="h-6 w-6 text-primary-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <div>
            <h2 className="text-xl font-bold text-foreground">Candidates</h2>
            <p className="text-muted-foreground">Interview feedback and analysis</p>
          </div>
        </div>
        <div className="px-4 py-2 bg-primary/10 border border-primary/20 rounded-full">
          <span className="text-primary text-sm font-medium">
            {list.length} {list.length === 1 ? 'Candidate' : 'Candidates'}
          </span>
        </div>
      </div>

      {/* Candidate List */}
      <div className="space-y-4">
        {list.map((candidate, index) => {
          // Fallback score if not present
          const score =
            candidate?.feedback?.feedback?.rating?.overall ??
            candidate?.feedback?.rating?.overall ??
            0;
          const colorClass = getColorForScore(score);
          const badgeColorClass = getBadgeColorForScore(score);
          const displayInitial = (
            candidate?.userName || candidate?.userEmail || "?"
          )
            .toString()
            .charAt(0)
            .toUpperCase();

          return (
            <div
              key={index}
              className="group relative overflow-hidden backdrop-blur-sm bg-secondary/30 border border-border/50 rounded-xl p-6 transition-all duration-300 hover:shadow-md hover:border-primary/50">
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  {/* Avatar */}
                  <div className="relative">
                    <div className="w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-lg font-bold shadow-lg">
                      {displayInitial}
                    </div>
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 border-2 border-card rounded-full"></div>
                  </div>

                  {/* Candidate Info */}
                  <div className="space-y-1">
                    <h3 className="text-lg font-semibold text-foreground">
                      {candidate?.userName || "Unknown"}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {candidate?.userEmail || "No email provided"}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Completed on{" "}
                      {moment(candidate.created_at).format("DD MMM YYYY, hh:mm A")}
                    </p>
                  </div>
                </div>

                {/* Score and Action */}
                <div className="flex items-center gap-4">
                  <div className={`px-3 py-2 border rounded-lg ${badgeColorClass}`}>
                    <span className="text-lg font-bold">{score}</span>
                    <span className="text-sm opacity-75">/10</span>
                  </div>
                  <CandidateFeedbackDialog candidate={candidate} />
                </div>
              </div>
            </div>
          );
        })}
        
        {list.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="p-4 bg-muted/50 rounded-full mb-4">
              <svg className="h-8 w-8 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">No candidates yet</h3>
            <p className="text-muted-foreground">
              Candidates will appear here once they complete the interview.
            </p>
          </div>
        )}
      </div>

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-accent/5 via-transparent to-primary/5 pointer-events-none rounded-2xl" />
    </div>
  );
}

export default CandidateList;
