"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useRouter, useParams } from "next/navigation";
import { supabase } from "@/services/supabaseClient";
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
  const [feedback, setFeedback] = useState(null);
  const [interviewData, setInterviewData] = useState(null);
  const [loading, setLoading] = useState(true);

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
    if (rating >= 8) return "text-green-600 bg-green-100";
    if (rating >= 6) return "text-yellow-600 bg-yellow-100";
    if (rating >= 4) return "text-orange-600 bg-orange-100";
    return "text-red-600 bg-red-100";
  };

  const getOverallPerformance = (rating) => {
    if (rating >= 8) return { label: "Excellent", icon: Trophy, color: "text-green-600" };
    if (rating >= 6) return { label: "Good", icon: TrendingUp, color: "text-yellow-600" };
    if (rating >= 4) return { label: "Fair", icon: Target, color: "text-orange-600" };
    return { label: "Needs Improvement", icon: Lightbulb, color: "text-red-600" };
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground">Loading your results...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Success Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="relative inline-flex items-center justify-center w-24 h-24 bg-green-100 rounded-full mb-6">
            <CheckCircle className="w-12 h-12 text-green-600" />
            <div className="absolute inset-0 bg-green-400 rounded-full animate-ping opacity-20"></div>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Interview Completed! 🎉
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Congratulations on completing your AI interview session. Your performance has been analyzed and feedback is ready.
          </p>
        </motion.div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Left Column - Main Results */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Interview Summary Card */}
            {interviewData && (
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <User className="w-5 h-5 text-blue-600" />
                  </div>
                  <h2 className="text-xl font-semibold text-gray-900">Interview Summary</h2>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Award className="w-4 h-4 text-gray-600" />
                      <span className="text-sm text-gray-600">Position</span>
                    </div>
                    <p className="font-semibold text-gray-900">{interviewData.jobPosition}</p>
                  </div>
                  
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Clock className="w-4 h-4 text-gray-600" />
                      <span className="text-sm text-gray-600">Duration</span>
                    </div>
                    <p className="font-semibold text-gray-900">{interviewData.duration} minutes</p>
                  </div>
                  
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Target className="w-4 h-4 text-gray-600" />
                      <span className="text-sm text-gray-600">Type</span>
                    </div>
                    <p className="font-semibold text-gray-900 capitalize">{interviewData.type}</p>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Performance Results */}
            {feedback?.feedback ? (
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100"
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                    <BarChart3 className="w-5 h-5 text-purple-600" />
                  </div>
                  <h2 className="text-xl font-semibold text-gray-900">Performance Analysis</h2>
                </div>

                {/* Overall Score */}
                {feedback.feedback.rating?.overall && (
                  <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600 mb-1">Overall Performance</p>
                        <div className="flex items-center gap-2">
                          {(() => {
                            const performance = getOverallPerformance(feedback.feedback.rating.overall);
                            const Icon = performance.icon;
                            return (
                              <>
                                <Icon className={`w-5 h-5 ${performance.color}`} />
                                <span className={`text-lg font-semibold ${performance.color}`}>
                                  {performance.label}
                                </span>
                              </>
                            );
                          })()}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className={`text-3xl font-bold ${getRatingColor(feedback.feedback.rating.overall).split(' ')[0]}`}>
                          {feedback.feedback.rating.overall}/10
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Skill Ratings */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  {feedback.feedback.rating && Object.entries(feedback.feedback.rating).map(([skill, rating]) => {
                    if (skill === 'overall') return null;
                    
                    return (
                      <div key={skill} className="text-center p-4 bg-gray-50 rounded-lg">
                        <div className={`w-12 h-12 rounded-full mx-auto mb-2 flex items-center justify-center text-lg font-bold ${getRatingColor(rating)}`}>
                          {rating}
                        </div>
                        <p className="text-sm font-medium text-gray-900 capitalize">
                          {skill.replace(/([A-Z])/g, ' $1').trim()}
                        </p>
                        <div className="flex justify-center mt-1">
                          {[...Array(5)].map((_, i) => (
                            <Star 
                              key={i} 
                              className={`w-3 h-3 ${i < Math.round(rating/2) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
                            />
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Summary */}
                {feedback.feedback.summary && (
                  <div className="bg-blue-50 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <MessageSquare className="w-5 h-5 text-blue-600 mt-0.5" />
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-2">Interview Summary</h3>
                        <p className="text-gray-700 leading-relaxed">{feedback.feedback.summary}</p>
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            ) : null}
          </div>

          {/* Right Column - Actions & Recommendations */}
          <div className="space-y-6">
            
            {/* Recommendation Card */}
            {feedback?.feedback?.Recommendation && (
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className={`rounded-2xl p-6 shadow-lg border ${
                  feedback.feedback.Recommendation === 'Yes' 
                    ? 'bg-green-50 border-green-200' 
                    : 'bg-orange-50 border-orange-200'
                }`}
              >
                <div className="text-center mb-4">
                  <div className={`w-16 h-16 rounded-full mx-auto mb-3 flex items-center justify-center ${
                    feedback.feedback.Recommendation === 'Yes' 
                      ? 'bg-green-100' 
                      : 'bg-orange-100'
                  }`}>
                    {feedback.feedback.Recommendation === 'Yes' ? (
                      <Trophy className="w-8 h-8 text-green-600" />
                    ) : (
                      <TrendingUp className="w-8 h-8 text-orange-600" />
                    )}
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {feedback.feedback.Recommendation === 'Yes' ? 'Recommended for Hire!' : 'Keep Improving!'}
                  </h3>
                </div>
                
                {feedback.feedback.RecommendationMsg && (
                  <p className="text-gray-700 text-center text-sm leading-relaxed">
                    {feedback.feedback.RecommendationMsg}
                  </p>
                )}
              </motion.div>
            )}

            {/* Action Buttons */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 space-y-4"
            >
              <h3 className="font-semibold text-gray-900 mb-4">What's Next?</h3>
              
              <Button 
                onClick={returnToDashboard}
                className="w-full bg-primary hover:bg-primary/90 text-white"
                size="lg"
              >
                <ArrowRight className="w-4 h-4 mr-2" />
                Return to Dashboard
              </Button>
              
              <Button 
                onClick={viewAllInterviews}
                variant="outline"
                className="w-full"
                size="lg"
              >
                <Calendar className="w-4 h-4 mr-2" />
                View All Interviews
              </Button>
              
              <Button 
                onClick={shareResults}
                variant="outline"
                className="w-full"
                size="lg"
              >
                <Share2 className="w-4 h-4 mr-2" />
                Share Results
              </Button>
            </motion.div>

            {/* Tips Card */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-2xl p-6 border border-purple-100"
            >
              <div className="flex items-center gap-2 mb-3">
                <Sparkles className="w-5 h-5 text-purple-600" />
                <h3 className="font-semibold text-gray-900">Pro Tips</h3>
              </div>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-purple-400 rounded-full mt-2"></div>
                  Practice more interviews to improve your confidence
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-purple-400 rounded-full mt-2"></div>
                  Review your feedback to identify areas for improvement
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-purple-400 rounded-full mt-2"></div>
                  Prepare specific examples for behavioral questions
                </li>
              </ul>
            </motion.div>
          </div>
        </div>

        {/* Celebration Image */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.7 }}
          className="text-center"
        >
          <div className="relative inline-block">
            <Image
              src="/gurujiInterviewCompleted.png"
              alt="Interview Completed Celebration"
              width={400}
              height={200}
              className="rounded-2xl shadow-lg"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-2xl"></div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default InterviewCompleted;
