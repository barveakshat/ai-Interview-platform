// app/interview/[interview_id]/start/page.jsx
"use client";
import { InterviewDataContext } from "@/app/context/InterviewDataContext";
import { Mic, Video, VideoOff, Loader2 } from "lucide-react";
import { Phone } from "lucide-react";
import { Timer } from "lucide-react";
import Image from "next/image";
import React, { useContext, useEffect, useState, useRef } from "react";
import Vapi from "@vapi-ai/web";
import AlertConfirmation from "./_components/AlertConfirmation";
import { toast } from "sonner";
import axios from "axios";
import { supabase } from "@/services/supabaseClient";
import { useParams, useRouter } from "next/navigation";

function StartInterview() {
  const { interviewInfo, setInterviewInfo } = useContext(InterviewDataContext);
  const vapi = new Vapi(process.env.NEXT_PUBLIC_VAPI_PUBLIC_KEY);
  const [activeUser, setActiveUser] = useState(false);
  const [conversation, setConversation] = useState();
  const [isCameraOn, setIsCameraOn] = useState(false);
  const [stream, setStream] = useState(null);
  const [timer, setTimer] = useState(0);
  const [isInterviewActive, setIsInterviewActive] = useState(false);
  const [isGeneratingFeedback, setIsGeneratingFeedback] = useState(false);
  const [isCallActive, setIsCallActive] = useState(false);
  const interviewEndedRef = useRef(false);
  const videoRef = useRef(null);
  const timerRef = useRef(null);
  const autoStopTimeoutRef = useRef(null);
  const { interview_id } = useParams();
  const router = useRouter();

  useEffect(() => {
    interviewInfo && startCall();
  }, [interviewInfo]);

  // Timer functions
  const startTimer = () => {
    setIsInterviewActive(true);
    setTimer(0);
    timerRef.current = setInterval(() => {
      setTimer((prevTimer) => prevTimer + 1);
    }, 1000);

    // Setup auto-stop based on interview duration (minutes -> seconds)
    const durationMinutes = interviewInfo?.interviewData?.duration;
    if (durationMinutes && !autoStopTimeoutRef.current) {
      const durationSeconds = Number(durationMinutes) * 60;
      autoStopTimeoutRef.current = setTimeout(() => {
        // Only stop if not already ended
        if (!interviewEndedRef.current) {
          toast("Interview time is over. Ending interview...");
          stopInterview();
        }
      }, durationSeconds * 1000);
    }
  };

  const stopTimer = () => {
    setIsInterviewActive(false);
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    if (autoStopTimeoutRef.current) {
      clearTimeout(autoStopTimeoutRef.current);
      autoStopTimeoutRef.current = null;
    }
  };

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  // Camera functions
  const startCamera = async () => {
    try {
      // Check if getUserMedia is supported
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error("Camera not supported by this browser");
      }

      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 640 },
          height: { ideal: 480 },
        },
        audio: false,
      });

      setStream(mediaStream);
      setIsCameraOn(true);

      // Wait for next render cycle before setting video source
      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
          videoRef.current
            .play()
            .catch((e) => console.log("Video play error:", e));
        }
      }, 100);

      toast("Camera turned on successfully");
    } catch (error) {
      console.error("Error accessing camera:", error);

      // Provide specific error messages
      let errorMessage = "Failed to access camera";

      if (error.name === "NotAllowedError") {
        errorMessage =
          "Camera permission denied. Please allow camera access and try again.";
      } else if (error.name === "NotFoundError") {
        errorMessage =
          "No camera found. Please connect a camera and try again.";
      } else if (error.name === "NotReadableError") {
        errorMessage =
          "Camera is being used by another application. Please close other apps and try again.";
      } else if (error.name === "OverconstrainedError") {
        errorMessage =
          "Camera doesn't support the requested settings. Trying with default settings...";

        // Try again with basic settings
        try {
          const basicStream = await navigator.mediaDevices.getUserMedia({
            video: true,
          });
          setStream(basicStream);
          setIsCameraOn(true);

          setTimeout(() => {
            if (videoRef.current) {
              videoRef.current.srcObject = basicStream;
              videoRef.current
                .play()
                .catch((e) => console.log("Video play error:", e));
            }
          }, 100);

          toast("Camera turned on with basic settings");
          return;
        } catch (basicError) {
          errorMessage = "Camera access failed even with basic settings";
        }
      } else if (error.name === "NotSupportedError") {
        errorMessage = "Camera not supported by this browser";
      } else if (error.message.includes("not supported")) {
        errorMessage = "Camera not supported by this browser or device";
      }

      toast(errorMessage);
      setIsCameraOn(false);
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setIsCameraOn(false);
    toast("Camera turned off");
  };

  const toggleCamera = () => {
    if (isCameraOn) {
      stopCamera();
    } else {
      startCamera();
    }
  };

  // Cleanup camera and timer on component unmount
  useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [stream]);

  const startCall = () => {
    let questionList;
    interviewInfo?.interviewData?.questionList.forEach(
      (item, index) => (questionList = item?.question + "," + questionList)
    );

    const assistantOptions = {
      name: "AI Recruiter",
      firstMessage:
        "Hi" +
        interviewInfo?.userName +
        ", how are you? Ready for your interview on " +
        interviewInfo?.interviewData?.jobPosition +
        "?",
      transcriber: {
        provider: "deepgram",
        model: "nova-2",
        language: "en-US",
      },
      voice: {
        provider: "11labs",
        voiceId: "6MoEUz34rbRrmmyxgRm4", // Manav
        similarityBoost: 0.75,
        stability: 0.5,
        model: "eleven_turbo_v2_5",
      },
      model: {
        provider: "openai",
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content:
              `
  You are an AI voice assistant conducting interviews.
Your job is to ask candidates provided interview questions, assess their responses.
Begin the conversation with a friendly introduction, setting a relaxed yet professional tone. Example:
"Hey there! Welcome to your ` +
              interviewInfo?.interviewData?.jobPosition +
              ` interview. Lets get started with a few questions!"
Ask one question at a time and wait for the candidates response before proceeding. Keep the questions clear and concise. Below Are the questions ask one by one:
Questions: ` +
              questionList +
              `
If the candidate struggles, offer hints or rephrase the question without giving away the answer. Example:
"Need a hint? Think about how React tracks component updates!"
Provide brief, encouraging feedback after each answer. Example:
"Nice! Thats a solid answer."
"Hmm, not quite! Want to try again?"
Keep the conversation natural and engaging—use casual phrases like "Alright, next up..." or "Lets tackle a tricky one!"
After 5-7 questions, wrap up the interview smoothly by summarizing their performance. Example:
"That was great! You handled some tough questions well. Keep sharpening your skills!"
End on a positive note:
"Thanks for chatting! Hope to see you crushing projects soon!"
Key Guidelines:
- Be friendly, engaging, and witty
- Keep responses short and natural, like a real conversation
- Adapt based on the candidates confidence level
- Ensure the interview remains focused on React
`.trim(),
          },
        ],
      },
    };
    vapi.start(assistantOptions);
  };

  const stopInterview = async () => {
    if (interviewEndedRef.current) return;
    interviewEndedRef.current = true;
    console.log("Stopping interview...");
    setIsGeneratingFeedback(true);
    try {
      // Stop the call
      vapi.stop();
      // Stop camera and timer immediately
      stopCamera();
      stopTimer();
      setIsCallActive(false);
      toast("Interview ended. Generating feedback...");
      // Wait for conversation to be set, up to 2 seconds
      let waited = 0;
      while (!conversation && waited < 2000) {
        await new Promise((res) => setTimeout(res, 200));
        waited += 200;
      }
      await GenerateFeedback();
    } catch (error) {
      console.error("Error stopping interview:", error);
      setIsGeneratingFeedback(false);
      toast.error("Error ending interview");
    }
  };

  // Set up VAPI event listeners in useEffect
  useEffect(() => {
  const handleCallStart = () => {
      if (interviewEndedRef.current) return;
      console.log("Call has started.");
      setIsCallActive(true);
      startTimer(); // Start timer when call starts
      toast("Interview Started...");
    };

    const handleSpeechStart = () => {
      if (interviewEndedRef.current) return;
      console.log("Assistant speech has started.");
      setActiveUser(false);
    };

    const handleSpeechEnd = () => {
      if (interviewEndedRef.current) return;
      console.log("Assistant speech has ended.");
      setActiveUser(true);
    };

    const handleCallEnd = async () => {
      if (interviewEndedRef.current) return;
      interviewEndedRef.current = true;
      console.log("Call has ended naturally.");
      setIsCallActive(false);
      stopTimer(); // Stop timer when call ends
      if (!isGeneratingFeedback) {
        setIsGeneratingFeedback(true);
        toast("Interview ended. Generating feedback...");
        // Wait for conversation to be set, up to 2 seconds
        let waited = 0;
        while (!conversation && waited < 2000) {
          await new Promise((res) => setTimeout(res, 200));
          waited += 200;
        }
        await GenerateFeedback();
      }
    };

    const handleVapiError = async (err) => {
      // Try to detect meeting-ejection / "Meeting has ended" messages and recover gracefully
      try {
        const msg = err?.message || JSON.stringify(err || "");
        if (msg && /eject|ejection|meeting has ended/i.test(msg)) {
          console.log("Detected meeting end via error event:", msg);
          if (!interviewEndedRef.current) {
            interviewEndedRef.current = true;
            stopTimer();
            stopCamera();
            setIsCallActive(false);
            setIsGeneratingFeedback(true);
            toast("Interview ended. Generating feedback...");
            // small delay to allow last messages to flush
            await new Promise((r) => setTimeout(r, 300));
            await GenerateFeedback();
          }
          return;
        }
      } catch (e) {
        console.error("Error handling vapi error event:", e);
      }
      // Fallback: log normally
      console.error(err);
    };

    const handleMessage = (message) => {
      if (interviewEndedRef.current) return;
      console.log("Message: ", message);
      if (message?.conversation) {
        const ConvoString = JSON.stringify(message.conversation);
        console.log("Conversation String: ", ConvoString);
        setConversation(ConvoString);
      }
    };

    vapi.on("call-start", handleCallStart);
    vapi.on("speech-start", handleSpeechStart);
    vapi.on("speech-end", handleSpeechEnd);
    vapi.on("call-end", handleCallEnd);
    vapi.on("message", handleMessage);
    // If vapi exposes error events, handle them
    try {
      vapi.on("error", handleVapiError);
    } catch (e) {
      // ignore if not supported
    }

    // Global window error handler to catch daily-js console errors like meeting ejection
    const windowErrorHandler = async (event) => {
      try {
        const message = event?.message || (event?.error && event.error.message) || "";
        if (message && /Meeting ended due to ejection|Meeting has ended/i.test(message)) {
          console.log("Global error detected meeting end:", message);
          if (!interviewEndedRef.current) {
            interviewEndedRef.current = true;
            stopTimer();
            stopCamera();
            setIsCallActive(false);
            setIsGeneratingFeedback(true);
            toast("Interview ended. Generating feedback...");
            // small delay to allow last messages to flush
            await new Promise((r) => setTimeout(r, 300));
            await GenerateFeedback();
          }
        }
      } catch (err) {
        console.error("Error in windowErrorHandler:", err);
      }
      // let the event continue to default handling
    };
    window.addEventListener("error", windowErrorHandler);

    return () => {
      vapi.off("call-start", handleCallStart);
      vapi.off("speech-start", handleSpeechStart);
      vapi.off("speech-end", handleSpeechEnd);
      vapi.off("call-end", handleCallEnd);
      vapi.off("message", handleMessage);
      try {
        vapi.off("error", handleVapiError);
      } catch (e) {}
      window.removeEventListener("error", windowErrorHandler);
    };
  }, [isGeneratingFeedback, conversation]);

  const GenerateFeedback = async () => {
    console.log("GenerateFeedback called with conversation:", conversation);

    try {
      // Check if conversation data exists
      if (!conversation) {
        console.error("No conversation data available");
        toast.error("No conversation data to generate feedback");
        router.push(`/interview/${interview_id}/completed`);
        return;
      }

      const result = await axios.post("/api/ai-feedback", {
        conversation,
      });

      // 1️ Check HTTP status
      if (result.status !== 200) {
        console.error("AI provider error:", result.data);
        toast.error("Could not generate feedback (AI service error)");
        router.push(`/interview/${interview_id}/completed`);
        return;
      }

      // 2️ Check payload
      const Content = result.data?.content;
      if (typeof Content !== "string") {
        console.error("Unexpected AI response:", result.data);
        toast.error("Invalid feedback format");
        router.push(`/interview/${interview_id}/completed`);
        return;
      }

      // 3️ Clean up markdown fences
      const FINAL_CONTENT = Content.replace(/```json\s*/, "")
        .replace(/```/, "")
        .trim();

      // 4️ Parse JSON safely
      let feedbackObj;
      try {
        feedbackObj = JSON.parse(FINAL_CONTENT);
      } catch (parseErr) {
        console.error("JSON parse error:", parseErr);
        toast.error("Could not parse feedback");
        router.push(`/interview/${interview_id}/completed`);
        return;
      }

      // 5️ Persist to Supabase
      const { data, error } = await supabase
        .from("interview-feedback")
        .insert([
          {
            userName: interviewInfo?.userName,
            userEmail: interviewInfo?.userEmail,
            interview_id,
            feedback: feedbackObj,
            recommended: false,
          },
        ])
        .select();

      if (error) {
        console.error("Supabase insert error:", error);
        toast.error("Failed to save feedback");
        router.push(`/interview/${interview_id}/completed`);
        return;
      }

      console.log("Feedback saved successfully:", data);
      toast.success("Feedback generated successfully!");

      // 6️ Go to completed screen
      router.push(`/interview/${interview_id}/completed`);
    } catch (err) {
      // 7️ Network / Axios errors
      console.error("Unexpected error in GenerateFeedback:", err);
      toast.error("Server error—please try again later");
      router.push(`/interview/${interview_id}/completed`);
    } finally {
      setIsGeneratingFeedback(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-background">
      {/* Main Content */}
      <div
        className={`p-6 md:p-8 lg:p-12 xl:p-16 ${
          isGeneratingFeedback ? "blur-sm pointer-events-none" : ""
        }`}>
        
        {/* Header */}
        <div className="flex justify-between items-center mb-8 p-6 bg-card border border-border rounded-2xl shadow-sm">
          <h1 className="text-2xl font-bold text-foreground">
            AI Interview Session
          </h1>
          <div className="flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/20 rounded-full text-primary">
            <Timer className="h-4 w-4" />
            <span className="font-mono text-sm font-medium">
              {formatTime(timer)}
            </span>
          </div>
        </div>

        {/* Video Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          {/* AI Recruiter Section */}
          <div className="relative overflow-hidden backdrop-blur-sm bg-card border border-border rounded-2xl p-8 shadow-lg">
            <div className="flex flex-col items-center space-y-6">
              <div className="relative">
                {!activeUser && isCallActive && (
                  <div className="absolute inset-0 rounded-full bg-primary/20 animate-ping" />
                )}
                <div className="relative">
                  <Image
                    src="/gurujiPortrait.png"
                    alt="AI Interviewer"
                    width={120}
                    height={120}
                    className="w-[120px] h-[120px] rounded-full object-cover border-4 border-primary shadow-lg"
                  />
                  {!activeUser && isCallActive && (
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 border-2 border-card rounded-full animate-pulse" />
                  )}
                </div>
              </div>
              
              <div className="text-center space-y-2">
                <h2 className="text-xl font-semibold text-foreground">
                  AI Recruiter
                </h2>
                <p className="text-sm text-muted-foreground">
                  {isCallActive ? "Speaking..." : "Ready to interview"}
                </p>
              </div>
            </div>
            
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 pointer-events-none rounded-2xl" />
          </div>

          {/* User Video Section */}
          <div className="relative overflow-hidden backdrop-blur-sm bg-card border border-border rounded-2xl p-8 shadow-lg">
            <div className="relative h-[300px] bg-secondary/50 rounded-xl overflow-hidden border border-border/50">
              {isCameraOn ? (
                <>
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className="absolute inset-0 w-full h-full object-cover rounded-xl"
                    onLoadedMetadata={() => console.log("Video metadata loaded")}
                    onError={(e) => console.log("Video error:", e)}
                  />
                  <div className="absolute bottom-4 left-4 right-4">
                    <div className="bg-background/80 backdrop-blur-sm border border-border/50 rounded-lg px-3 py-2">
                      <p className="text-sm font-medium text-foreground text-center">
                        {interviewInfo?.userName}
                      </p>
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex flex-col items-center justify-center h-full space-y-4">
                  <div className="relative">
                    {activeUser && !isCameraOn && isCallActive && (
                      <div className="absolute inset-0 rounded-full bg-primary/20 animate-ping" />
                    )}
                    <div className="w-20 h-20 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-2xl font-bold shadow-lg">
                      {interviewInfo?.userName?.[0]?.toUpperCase() || "U"}
                    </div>
                    {activeUser && isCallActive && (
                      <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 border-2 border-card rounded-full animate-pulse" />
                    )}
                  </div>
                  <div className="text-center space-y-1">
                    <h3 className="text-lg font-semibold text-foreground">
                      {interviewInfo?.userName}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {isCameraOn ? "Camera On" : "Camera Off"}
                    </p>
                  </div>
                </div>
              )}
            </div>
            
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-accent/5 via-transparent to-primary/5 pointer-events-none rounded-2xl" />
          </div>
        </div>

        {/* Control Buttons */}
        <div className="flex justify-center gap-6 mb-8">
          {/* Microphone Button */}
          <div className="flex flex-col items-center gap-2">
            <button className="bg-blue-500 hover:bg-blue-600 text-white rounded-full h-14 w-14 p-4 transition-all duration-200 hover:scale-110 hover:shadow-lg flex items-center justify-center">
              <Mic className="h-6 w-6" />
            </button>
            <span className="text-xs text-muted-foreground">Microphone</span>
          </div>

          {/* Camera Toggle Button */}
          <div className="flex flex-col items-center gap-2">
            <button
              onClick={toggleCamera}
              disabled={isGeneratingFeedback}
              className="bg-green-500 hover:bg-green-600 text-white rounded-full h-14 w-14 p-4 transition-all duration-200 hover:scale-110 hover:shadow-lg flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed">
              {isCameraOn ? (
                <Video className="h-6 w-6" />
              ) : (
                <VideoOff className="h-6 w-6" />
              )}
            </button>
            <span className="text-xs text-muted-foreground">
              {isCameraOn ? "Turn Off Camera" : "Turn On Camera"}
            </span>
          </div>

          {/* End Interview Button */}
          <div className="flex flex-col items-center gap-2">
            <AlertConfirmation
              stopInterview={stopInterview}
              disabled={isGeneratingFeedback}>
              <button className="bg-red-500 hover:bg-red-600 text-white rounded-full h-14 w-14 p-4 transition-all duration-200 hover:scale-110 hover:shadow-lg flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed">
                <Phone className="h-6 w-6" />
              </button>
            </AlertConfirmation>
            <span className="text-xs text-muted-foreground">End Interview</span>
          </div>
        </div>

        {/* Status */}
        <div className="text-center">
          <p className="text-muted-foreground">
            {isCallActive ? "Interview in progress..." : "Preparing interview..."}
          </p>
        </div>
      </div>

      {/* Loading Overlay */}
      {isGeneratingFeedback && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="relative overflow-hidden backdrop-blur-sm bg-card border border-border rounded-2xl p-8 shadow-2xl max-w-md mx-4">
            <div className="flex flex-col items-center space-y-6">
              <div className="relative">
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
                <div className="absolute inset-0 rounded-full bg-primary/20 animate-ping" />
              </div>
              
              <div className="text-center space-y-2">
                <h3 className="text-xl font-semibold text-foreground">
                  Generating Feedback
                </h3>
                <p className="text-muted-foreground">
                  Please wait while we analyze your interview and generate personalized feedback...
                </p>
              </div>
            </div>
            
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 pointer-events-none rounded-2xl" />
          </div>
        </div>
      )}
    </div>
  );
}

export default StartInterview;
