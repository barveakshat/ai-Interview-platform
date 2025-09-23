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
      const jsonArrayMatch = Content.match(/\[[\s\S]*\]/);

      // helper: try to safely parse JSON array-like text returned by the AI
      const tryParseJsonArray = (raw) => {
        if (!raw || typeof raw !== "string") throw new Error("Invalid raw input");
        // remove markdown fences (```json ... ```)
        let text = raw.replace(/```[\s\S]*?```/g, (m) => m.replace(/```/g, ""));
        // trim everything before first [ and after last ]
        const first = text.indexOf("[");
        const last = text.lastIndexOf("]");
        if (first !== -1 && last !== -1) text = text.slice(first, last + 1);
        // normalize some quote characters
        text = text.replace(/[‘’`]/g, '"');
        // remove trailing commas before closing brackets/braces
        text = text.replace(/,\s*(\]|\})/g, "$1");
        // attempt to parse
        return JSON.parse(text);
      };

      let questionList = [];
      if (jsonArrayMatch) {
        try {
          questionList = tryParseJsonArray(jsonArrayMatch[0]);
          console.log(questionList);
        } catch (err) {
          console.error("JSON parse error:", err);
          toast("Invalid response from AI model");
          setLoading(false);
          return;
        }
      } else {
        console.error("Could not find JSON array in response");
        toast("Invalid response format from AI model");
        setLoading(false);
        return;
      }

      // Now save the interview
      const newInterviewId = uuidv4();

      // Convert duration string to integer (extract number from "5 Min" -> 5)
      const durationMinutes = formData.duration ? parseInt(formData.duration.split(' ')[0]) : null;

      // Prepare the data to insert
      const interviewData = {
        ...formData,
        duration: durationMinutes, // Convert to integer
        questionList: questionList,
        userEmail: user?.email,
        interview_id: newInterviewId,
      };

      // Insert interview data
      const { data, error } = await supabase
        .from("interviews")
        .insert([interviewData]);

      if (error) {
        toast.error(`Failed to save interview: ${error.message}`);
        setLoading(false);
        return;
      }

      // Update user credits
      const { data: userUpdateData, error: userUpdateError } = await supabase
        .from("Users")
        .update({ credits: Number(user?.credits) - 1 })
        .eq("email", user?.email)
        .select();

      if (userUpdateError) {
        toast.error("Interview saved but failed to update credits");
      }

      toast.success("Interview created successfully!");
      onCreateLink(newInterviewId);
      setLoading(false);

    } catch (error) {
      console.log(error);
      toast("Server error, try again after some time");
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