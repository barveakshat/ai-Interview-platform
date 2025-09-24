"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useRouter, useParams } from "next/navigation";
import { supabase } from "@/services/supabaseClient";
import { useUser } from "@/app/provider";
import { 
  CheckCircle, 
  Trophy, 
  TrendingUp, 
  MessageSquare, 
  Lightbulb, 
  Star,
  ArrowRight,
  Download,
  Share2,
  Calendar,
  Clock,
  User,
  Award,
  Target,
  Sparkles,
  BarChart3
} from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";

function InterviewCompleted() {
  const router = useRouter();
  const { interview_id } = useParams();
  const { user } = useUser();
  const [feedback, setFeedback] = useState(null);
  const [interviewData, setInterviewData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    fetchFeedbackData();
  }, [interview_id]);

  const fetchFeedbackData = async () => {
    try {
      // Fetch feedback data
      const { data: feedbackData, error: feedbackError } = await supabase
        .from("interview-feedback")
        .select("*")
        .eq("interview_id", interview_id)
        .order("created_at", { ascending: false })
        .limit(1);

      if (feedbackError) {
        console.error("Error fetching feedback:", feedbackError);
      } else if (feedbackData && feedbackData.length > 0) {
        setFeedback(feedbackData[0]);
      }

      // Fetch interview data
      const { data: interviewInfo, error: interviewError } = await supabase
        .from("interviews")
        .select("jobPosition, jobDescription, duration, type")
        .eq("interview_id", interview_id)
        .single();

      if (interviewError) {
        console.error("Error fetching interview data:", interviewError);
      } else {
        setInterviewData(interviewInfo);
      }
    } catch (error) {
      console.error("Error in fetchFeedbackData:", error);
    } finally {
      setLoading(false);
    }
  };

  const returnToDashboard = () => {
    router.push("/dashboard");
  };

  const viewAllInterviews = () => {
    router.push("/scheduled-interviews");
  };

  const shareResults = () => {
    if (navigator.share) {
      navigator.share({
        title: "My Interview Results",
        text: "I just completed an AI interview session!",
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success("Link copied to clipboard!");
    }
  };

  const getRatingColor = (rating) => {
    if (rating >= 8) return "text-emerald-400 bg-emerald-500/20";
    if (rating >= 6) return "text-yellow-400 bg-yellow-500/20";
    if (rating >= 4) return "text-orange-400 bg-orange-500/20";
    return "text-red-400 bg-red-500/20";
  };

  const getOverallPerformance = (rating) => {
    if (rating >= 8) return { label: "Excellent", icon: Trophy, color: "text-emerald-400" };
    if (rating >= 6) return { label: "Good", icon: TrendingUp, color: "text-yellow-400" };
    if (rating >= 4) return { label: "Fair", icon: Target, color: "text-orange-400" };
    return { label: "Needs Improvement", icon: Lightbulb, color: "text-red-400" };
  };

  if (loading) {
    return (
      <div className="h-screen bg-gray-900 flex items-center justify-center overflow-hidden">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-400 mx-auto"></div>
          <p className="text-gray-300">Loading your results...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-gray-900 overflow-hidden">
      <div className="container mx-auto px-4 py-8 max-w-6xl h-full overflow-y-auto">
        {/* Success Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="relative inline-flex items-center justify-center w-24 h-24 bg-emerald-500/20 backdrop-blur-sm rounded-full mb-6 border border-emerald-500/30">
            <CheckCircle className="w-12 h-12 text-emerald-400" />
            <div className="absolute inset-0 bg-emerald-400/20 rounded-full animate-ping"></div>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white via-gray-100 to-gray-300 mb-4">
            Interview Completed! 🎉
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Congratulations on completing your AI interview session. Your performance has been analyzed and feedback is ready.
          </p>
        </motion.div>

        {/* Interview Summary - Full Width */}
        {interviewData && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="bg-gray-800/90 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-700/50 mb-8"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-blue-500/20 backdrop-blur-sm rounded-lg flex items-center justify-center border border-blue-500/30">
                <User className="w-5 h-5 text-blue-400" />
              </div>
              <h2 className="text-xl font-semibold text-white">Interview Summary</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-gray-700/50 backdrop-blur-sm rounded-lg p-4 border border-gray-600/30">
                <div className="flex items-center gap-2 mb-2">
                  <Award className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-400">Position</span>
                </div>
                <p className="font-semibold text-white">{interviewData.jobPosition}</p>
              </div>
              
              <div className="bg-gray-700/50 backdrop-blur-sm rounded-lg p-4 border border-gray-600/30">
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-400">Duration</span>
                </div>
                <p className="font-semibold text-white">{interviewData.duration} minutes</p>
              </div>
              
              <div className="bg-gray-700/50 backdrop-blur-sm rounded-lg p-4 border border-gray-600/30">
                <div className="flex items-center gap-2 mb-2">
                  <Target className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-400">Type</span>
                </div>
                <p className="font-semibold text-white capitalize">
                  {Array.isArray(interviewData.type) 
                    ? interviewData.type.join(', ') 
                    : interviewData.type}
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Main Content - Improved Layout */}
        <div className="space-y-8">
          {/* Recommendation Card - Full Width for Better Impact */}
          {feedback?.feedback?.Recommendation && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className={`rounded-2xl p-8 shadow-2xl border backdrop-blur-sm max-w-2xl mx-auto ${
                feedback.feedback.Recommendation === 'Yes' 
                  ? 'bg-emerald-500/20 border-emerald-500/30' 
                  : 'bg-orange-500/20 border-orange-500/30'
              }`}
            >
              <div className="text-center mb-6">
                <div className={`w-24 h-24 rounded-full mx-auto mb-6 flex items-center justify-center backdrop-blur-sm border shadow-lg ${
                  feedback.feedback.Recommendation === 'Yes' 
                    ? 'bg-emerald-500/20 border-emerald-500/30 shadow-emerald-500/25' 
                    : 'bg-orange-500/20 border-orange-500/30 shadow-orange-500/25'
                }`}>
                  {feedback.feedback.Recommendation === 'Yes' ? (
                    <Trophy className="w-12 h-12 text-emerald-400" />
                  ) : (
                    <TrendingUp className="w-12 h-12 text-orange-400" />
                  )}
                </div>
                <h3 className="text-2xl font-bold text-white mb-3">
                  {feedback.feedback.Recommendation === 'Yes' ? 'Excellent Performance!' : 'Keep Practicing!'}
                </h3>
                <p className="text-gray-400">
                  {feedback.feedback.Recommendation === 'Yes' ? 'You\'re interview-ready!' : 'You\'re on the right track!'}
                </p>
              </div>
              
              {feedback.feedback.RecommendationMsg && (
                <div className="bg-black/20 rounded-lg p-6 border border-white/10">
                  <p className="text-gray-300 text-center leading-relaxed text-lg">
                    {feedback.feedback.RecommendationMsg}
                  </p>
                </div>
              )}
            </motion.div>
          )}

          {/* Two Column Layout for Action Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Enhanced What's Next Card - Takes 2 columns */}
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="lg:col-span-2 bg-gradient-to-br from-gray-800/90 to-gray-900/90 backdrop-blur-sm rounded-2xl p-8 shadow-2xl border border-gray-700/50"
            >
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-gradient-to-br from-emerald-400 to-blue-500 rounded-full mx-auto mb-4 flex items-center justify-center shadow-lg">
                  <Sparkles className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-blue-400 mb-2">
                  What's Next?
                </h3>
                <p className="text-gray-400 text-sm">Continue your interview journey</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Button 
                  onClick={returnToDashboard}
                  className="w-full bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white shadow-lg hover:shadow-emerald-500/25 transition-all duration-300 transform hover:scale-105 h-20 flex flex-col items-center justify-center gap-1"
                  size="lg"
                >
                  <ArrowRight className="w-5 h-5" />
                  <div className="font-semibold text-sm">Dashboard</div>
                  <div className="text-xs opacity-90">Continue practicing</div>
                </Button>
                
                <Button 
                  onClick={viewAllInterviews}
                  variant="outline"
                  className="w-full border-2 border-blue-500/50 text-blue-400 hover:bg-blue-500/10 hover:border-blue-400 transition-all duration-300 transform hover:scale-105 group h-20 flex flex-col items-center justify-center gap-1"
                  size="lg"
                >
                  <Calendar className="w-5 h-5 group-hover:text-blue-300" />
                  <div className="font-semibold text-sm">All Interviews</div>
                  <div className="text-xs opacity-75">Track progress</div>
                </Button>
                
                <Button 
                  onClick={shareResults}
                  variant="outline"
                  className="w-full border-2 border-purple-500/50 text-purple-400 hover:bg-purple-500/10 hover:border-purple-400 transition-all duration-300 transform hover:scale-105 group h-20 flex flex-col items-center justify-center gap-1"
                  size="lg"
                >
                  <Share2 className="w-5 h-5 group-hover:text-purple-300" />
                  <div className="font-semibold text-sm">Share Results</div>
                  <div className="text-xs opacity-75">Show achievements</div>
                </Button>
              </div>
            </motion.div>

            {/* Pro Tips Card - Takes 1 column */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="bg-gradient-to-br from-purple-500/20 to-blue-500/20 backdrop-blur-sm rounded-2xl p-6 border border-purple-500/30 h-fit"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center">
                  <Lightbulb className="w-6 h-6 text-yellow-400" />
                </div>
                <h3 className="font-semibold text-white text-lg">Pro Tips</h3>
              </div>
              <ul className="space-y-4 text-sm text-gray-300">
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-emerald-400 rounded-full mt-2 flex-shrink-0"></div>
                  <span>Practice regularly to build confidence</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
                  <span>Review feedback for improvement areas</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-purple-400 rounded-full mt-2 flex-shrink-0"></div>
                  <span>Use STAR method for behavioral questions</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-yellow-400 rounded-full mt-2 flex-shrink-0"></div>
                  <span>Research company and role thoroughly</span>
                </li>
              </ul>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default InterviewCompleted;
