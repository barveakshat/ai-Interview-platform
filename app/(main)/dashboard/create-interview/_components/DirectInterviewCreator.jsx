"use client";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { LoaderCircle, Sparkles } from "lucide-react";
import { supabase } from "@/services/supabaseClient";
import { useUser } from "@/app/provider";
import { v4 as uuidv4 } from "uuid";

function DirectInterviewCreator({ formData, onCreateLink }) {
  const [loading, setLoading] = useState(true);
  const { user } = useUser();

  useEffect(() => {
    if (formData) {
      createInterview();
    }
  }, [formData]);

  const createInterview = async () => {
    try {
      // First, generate questions
      const result = await axios.post("/api/ai-model", {
        ...formData,
      });

      const Content = result.data.content;
      
      // Enhanced JSON parsing with multiple fallback strategies
      const tryParseJsonArray = (raw) => {
        if (!raw || typeof raw !== "string") {
          throw new Error("Invalid raw input");
        }
        
        try {
          // Strategy 1: Direct JSON parse if it's already valid
          return JSON.parse(raw);
        } catch (e1) {
          console.log("Direct parse failed, trying cleanup...");
        }
        
        try {
          // Strategy 2: Extract JSON array from the response
          const jsonArrayMatch = raw.match(/\[[\s\S]*\]/);
          if (jsonArrayMatch) {
            let text = jsonArrayMatch[0];
            
            // Clean up the JSON
            text = text.replace(/```[\s\S]*?```/g, (m) => m.replace(/```/g, ""));
            text = text.replace(/[''`]/g, '"');
            text = text.replace(/,\s*(\]|\})/g, "$1");
            text = text.replace(/([{,]\s*)([a-zA-Z_][a-zA-Z0-9_]*)\s*:/g, '$1"$2":');
            text = text.replace(/:\s*([a-zA-Z_][a-zA-Z0-9_]*)\s*([,\]\}])/g, ': "$1"$2');
            text = text.trim();
            
            console.log("Attempting to parse cleaned JSON:", text);
            return JSON.parse(text);
          }
        } catch (e2) {
          console.log("Array extraction failed, trying manual extraction...");
        }
        
        try {
          // Strategy 3: Extract questions manually using regex
          const questionMatches = raw.match(/"question"\s*:\s*"([^"]+)"/g);
          if (questionMatches && questionMatches.length > 0) {
            console.log("Using manual question extraction");
            return questionMatches.map((match, index) => {
              const questionText = match.match(/"question"\s*:\s*"([^"]+)"/)[1];
              return {
                id: index + 1,
                question: questionText,
                difficulty: "Medium",
                type: "Technical"
              };
            });
          }
        } catch (e3) {
          console.log("Manual extraction failed, using fallback...");
        }
        
        // Strategy 4: Create fallback questions based on job position
        console.log("Using fallback questions");
        const jobPosition = formData?.jobPosition || "Software Developer";
        return [
          { id: 1, question: `Tell me about your experience with ${jobPosition} role.`, type: "Experience" },
          { id: 2, question: "What are your strengths and weaknesses?", type: "Behavioral" },
          { id: 3, question: "Describe a challenging project you worked on.", type: "Experience" },
          { id: 4, question: "How do you handle tight deadlines?", type: "Behavioral" },
          { id: 5, question: "Where do you see yourself in 5 years?", type: "Behavioral" }
        ];
      };

      let questionList = [];
      try {
        // First try to parse the response directly as JSON
        let parsedResponse;
        try {
          parsedResponse = JSON.parse(Content);
        } catch (e) {
          // If direct parsing fails, try the fallback parsing
          parsedResponse = tryParseJsonArray(Content);
        }
        
        // Extract questions from the parsed response
        if (parsedResponse && parsedResponse.interviewQuestions) {
          questionList = parsedResponse.interviewQuestions;
        } else if (Array.isArray(parsedResponse)) {
          questionList = parsedResponse;
        } else {
          throw new Error("Invalid response structure");
        }
        
        console.log("Parsed questions:", questionList);
        
        // Validate the structure
        if (!Array.isArray(questionList)) {
          throw new Error("Result is not an array");
        }
        
        // Ensure each question has required fields
        questionList = questionList.map((q, index) => ({
          id: q.id || index + 1,
          question: q.question || `Question ${index + 1}`,
          type: q.type || "Technical",
          difficulty: q.difficulty || "Medium"
        }));
        
      } catch (err) {
        console.error("All JSON parse strategies failed:", err);
        toast.error("Failed to generate questions. Using fallback questions.");
        
        // Use fallback questions
        const jobPosition = formData?.jobPosition || "Software Developer";
        questionList = [
          { id: 1, question: `Tell me about your experience with ${jobPosition} role.`, type: "Experience" },
          { id: 2, question: "What are your strengths and weaknesses?", type: "Behavioral" },
          { id: 3, question: "Describe a challenging project you worked on.", type: "Experience" },
          { id: 4, question: "How do you handle tight deadlines?", type: "Behavioral" },
          { id: 5, question: "Where do you see yourself in 5 years?", type: "Behavioral" }
        ];
      }

      // Ensure we have at least some questions
      if (!questionList || questionList.length === 0) {
        throw new Error("No questions generated");
      }

      // Now save the interview
      const newInterviewId = uuidv4();

      // Convert duration string to integer (extract number from "5 Min" -> 5)
      const durationMinutes = formData.duration ? parseInt(formData.duration.split(' ')[0]) : 30;

      // Prepare the data to insert
      const interviewData = {
        ...formData,
        duration: durationMinutes,
        questionList: questionList,
        userEmail: user?.email,
        interview_id: newInterviewId,
      };

      console.log("Saving interview data:", interviewData);

      // Insert interview data
      const { data, error } = await supabase
        .from("interviews")
        .insert([interviewData]);

      if (error) {
        console.error("Supabase error:", error);
        toast.error(`Failed to save interview: ${error.message}`);
        setLoading(false);
        return;
      }

      // Update user credits
      if (user?.credits && Number(user.credits) > 0) {
        const { data: userUpdateData, error: userUpdateError } = await supabase
          .from("Users")
          .update({ credits: Number(user?.credits) - 1 })
          .eq("email", user?.email)
          .select();

        if (userUpdateError) {
          console.error("Credits update error:", userUpdateError);
          toast.error("Interview saved but failed to update credits");
        }
      }

      toast.success("Interview created successfully!");
      onCreateLink(newInterviewId);
      setLoading(false);

    } catch (error) {
      console.error("Create interview error:", error);
      toast.error("Server error, try again after some time");
      setLoading(false);
    }
  };

  return (
    <div className="relative overflow-hidden backdrop-blur-sm bg-primary/5 dark:bg-primary/10 rounded-xl border border-primary/20 shadow-sm p-6">
      <div className="flex items-center gap-4">
        <div className="flex items-center justify-center h-12 w-12 rounded-full bg-primary/10">
          <LoaderCircle className="h-6 w-6 text-primary animate-spin" />
        </div>
        <div className="space-y-1">
          <h3 className="font-medium text-card-foreground flex items-center gap-2">
            Creating Your Interview
            <Sparkles className="h-4 w-4 text-primary" />
          </h3>
          <p className="text-sm text-muted-foreground">
            Generating questions and setting up your interview link
          </p>
        </div>
      </div>

      <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-primary/5 dark:from-primary/10 dark:to-primary/10" />
    </div>
  );
}

export default DirectInterviewCreator;