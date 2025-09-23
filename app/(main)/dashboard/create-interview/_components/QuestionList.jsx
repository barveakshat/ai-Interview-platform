// app/(main)/dashboard/create-interview/_components/QuestionList.jsx
"use client";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { LoaderCircle, ArrowRight, Sparkles } from "lucide-react";
import QuestionListContainer from "./QuestionListContainer";
import { supabase } from "@/services/supabaseClient";
import { useUser } from "@/app/provider";
import { v4 as uuidv4 } from "uuid";
import { Button } from "@/components/ui/button";
import Image from "next/image";

function QuestionList({ formData, onCreateLink }) {
  const [loading, setLoading] = useState(false);
  const [questionList, setQuestionList] = useState();
  const [saveLoading, setSaveLoading] = useState(false);
  const [saveFinished, setSaveFinished] = useState(false);
  const [interviewId, setInterviewId] = useState(null);

  const { user } = useUser();

  useEffect(() => {
    if (formData) {
      GenerateQuestionList();
    }
  }, [formData]);



  const GenerateQuestionList = async () => {
    setLoading(true);
    try {
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

      if (jsonArrayMatch) {
        try {
          const parsed = tryParseJsonArray(jsonArrayMatch[0]);
          console.log(parsed);
          setQuestionList(parsed);
        } catch (err) {
          console.error("JSON parse error:", err);
          toast("Invalid response from AI model");
        }
      } else {
        console.error("Could not find JSON array in response");
        toast("Invalid response format from AI model");
      }
      setLoading(false);
    } catch (error) {
      console.log(error);
      toast("Server error, try again after some time");
      setLoading(false);
    }
  };

  const onFinish = async () => {
    if (saveFinished) {
      onCreateLink(interviewId);
      return;
    }

    setSaveLoading(true);
    setSaveFinished(false);
    
    try {
      // Validate required data
      if (!formData || !questionList || !user?.email) {
        toast.error("Missing required data. Please try again.");
        setSaveLoading(false);
        return;
      }

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
        setSaveLoading(false);
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

      setSaveLoading(false);
      setSaveFinished(true);
      setInterviewId(newInterviewId);
      toast.success("Interview created successfully!");
      
    } catch (error) {
      toast.error("An unexpected error occurred. Please try again.");
      setSaveLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {loading && (
        <div className="relative overflow-hidden backdrop-blur-sm bg-primary/5 dark:bg-primary/10 rounded-xl border border-primary/20 shadow-sm p-6">
          <div className="flex items-center gap-4">
            <div className="flex items-center justify-center h-12 w-12 rounded-full bg-primary/10">
              <LoaderCircle className="h-6 w-6 text-primary animate-spin" />
            </div>
            <div className="space-y-1">
              <h3 className="font-medium text-card-foreground flex items-center gap-2">
                Generating Interview Questions
                <Sparkles className="h-4 w-4 text-primary" />
              </h3>
              <p className="text-sm text-muted-foreground">
                Our AI is crafting personalized interview questions for your job
                description
              </p>
            </div>
          </div>

          <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-primary/5 dark:from-primary/10 dark:to-primary/10" />
        </div>
      )}

      {!loading && questionList && questionList.length > 0 && (
        <div className="space-y-6">
          <QuestionListContainer questionList={questionList} />

          <div className="flex justify-end">
            <Button
              onClick={onFinish}
              disabled={saveLoading}
              className="flex items-center gap-2 transition-all duration-200 hover:shadow-md cursor-pointer">
              {saveLoading ? (
                <>
                  <LoaderCircle className="h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : saveFinished ? (
                <>
                  Create Interview Link and Finish
                  <Image src="/check.png" alt="Check" width={16} height={16} className="object-contain" />
                </>
              ) : (
                <>
                  Finish
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

export default QuestionList;
