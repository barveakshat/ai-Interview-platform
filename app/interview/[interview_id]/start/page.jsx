// app/interview/[interview_id]/start/page.jsx
"use client";
import { InterviewDataContext } from "@/app/context/InterviewDataContext";
import { useUser } from "@/app/provider";
import { Mic, MicOff, Video, VideoOff, Loader2 } from "lucide-react";
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
  const { user } = useUser();
  const vapi = new Vapi(process.env.NEXT_PUBLIC_VAPI_PUBLIC_KEY);
  
  // Validate VAPI key
  useEffect(() => {
    if (!process.env.NEXT_PUBLIC_VAPI_PUBLIC_KEY) {
      console.error("VAPI public key is missing");
      toast.error("Configuration error: VAPI key missing");
    } else {
      console.log("VAPI initialized with key:", process.env.NEXT_PUBLIC_VAPI_PUBLIC_KEY?.substring(0, 10) + "...");
    }
  }, []);
  
  const [activeUser, setActiveUser] = useState(false);
  const [conversation, setConversation] = useState();
  const [isCameraOn, setIsCameraOn] = useState(false);
  const [isMicOn, setIsMicOn] = useState(true);
  const [stream, setStream] = useState(null);
  const [timer, setTimer] = useState(0);
  const [isInterviewActive, setIsInterviewActive] = useState(false);
  const [isGeneratingFeedback, setIsGeneratingFeedback] = useState(false);
  const [isCallActive, setIsCallActive] = useState(false);
  const [imageError, setImageError] = useState(false);
  const interviewEndedRef = useRef(false);
  const videoRef = useRef(null);
  const timerRef = useRef(null);
  const autoStopTimeoutRef = useRef(null);
  const { interview_id } = useParams();
  const router = useRouter();

  useEffect(() => {
    if (interviewInfo) {
      console.log("Interview info received:", interviewInfo);
      // Add a small delay to ensure all components are ready
      setTimeout(() => {
        startCall();
      }, 500);
    }
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

  // Microphone functions
  const toggleMicrophone = () => {
    setIsMicOn(!isMicOn);
    if (isMicOn) {
      toast("Microphone muted");
    } else {
      toast("Microphone unmuted");
    }
  };

  // Cleanup camera and timer on component unmount
  useEffect(() => {
    return () => {
      // Stop camera
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
      
      // Stop timer
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      
      // Stop auto-stop timeout
      if (autoStopTimeoutRef.current) {
        clearTimeout(autoStopTimeoutRef.current);
      }
      
      // Stop all audio - comprehensive cleanup
      try {
        // Stop VAPI call
        if (vapi) {
          vapi.stop();
        }
        
        // Stop speech synthesis
        if (window.speechSynthesis) {
          window.speechSynthesis.cancel();
        }
        
        // Stop all audio elements
        const audioElements = document.querySelectorAll('audio');
        audioElements.forEach(audio => {
          audio.pause();
          audio.currentTime = 0;
          audio.src = '';
          audio.load(); // Reset the audio element completely
        });
        
        // Stop any WebRTC streams
        if (stream) {
          stream.getTracks().forEach(track => {
            track.stop();
            track.enabled = false;
          });
        }
        
      } catch (cleanupError) {
        console.log("Error in cleanup:", cleanupError);
      }
    };
  }, [stream]);

  const startCall = () => {
    let questionList = "";
    interviewInfo?.interviewData?.questionList.forEach(
      (item, index) => (questionList = questionList + item?.question + ", ")
    );
    // Remove trailing comma and space
    questionList = questionList.replace(/,\s*$/, "");
    
    console.log("Starting call with interview data:", interviewInfo);
    console.log("Question list:", questionList);
    
    if (!questionList || questionList.trim() === "") {
      console.error("No questions found - cannot start interview");
      toast.error("No questions available for this interview");
      return;
    }

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
    
    try {
      console.log("Starting VAPI with assistant options:", assistantOptions);
      vapi.start(assistantOptions);
    } catch (error) {
      console.error("Error starting VAPI call:", error);
      toast.error("Failed to start interview: " + error.message);
      interviewEndedRef.current = false; // Reset so user can try again
    }
  };

  const stopInterview = async () => {
    if (interviewEndedRef.current) return;
    interviewEndedRef.current = true;
    console.log("Stopping interview...");
    setIsGeneratingFeedback(true);
    try {
      // Stop the call and ensure audio is completely stopped
      if (vapi) {
        vapi.stop();
        // Additional safety: try to access and stop any active audio contexts
        try {
          // Force stop any ongoing speech synthesis
          if (window.speechSynthesis) {
            window.speechSynthesis.cancel();
          }
          
          // Stop any active audio contexts
          const audioContexts = [];
          if (window.AudioContext) {
            audioContexts.push(window.AudioContext);
          }
          if (window.webkitAudioContext) {
            audioContexts.push(window.webkitAudioContext);
          }
          
          // Stop any active audio elements
          const audioElements = document.querySelectorAll('audio');
          audioElements.forEach(audio => {
            audio.pause();
            audio.currentTime = 0;
            audio.src = '';
          });
          
        } catch (audioError) {
          console.log("Error stopping audio contexts:", audioError);
        }
      }
      
      // Stop camera and timer immediately
      stopCamera();
      stopTimer();
      setIsCallActive(false);
      setActiveUser(false);
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
    // Override console.error to suppress Daily.co meeting ejection errors
    const originalConsoleError = console.error;
    console.error = (...args) => {
      const message = args.join(' ');
      if (message && /Meeting ended due to ejection|Meeting has ended/i.test(message)) {
        // Suppress this specific error and handle it gracefully
        console.log("Suppressed Daily.co meeting ejection error:", message);
        return;
      }
      // For all other errors, use the original console.error
      originalConsoleError.apply(console, args);
    };

    const handleCallStart = () => {
      if (interviewEndedRef.current) {
        console.log("Call start ignored - interview already ended");
        return;
      }
      console.log("Call has started successfully.");
      setIsCallActive(true);
      startTimer(); // Start timer when call starts
      toast("Interview Started...");
      
      // Show helpful reminder after 30 seconds if no conversation yet
      setTimeout(() => {
        if (!conversation && isCallActive && !interviewEndedRef.current) {
          toast("💡 Remember to speak clearly when the AI asks questions to get meaningful feedback!", {
            duration: 5000,
          });
        }
      }, 30000);
    };    const handleSpeechStart = () => {
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
      if (interviewEndedRef.current) {
        console.log("Call end ignored - interview already ended");
        return;
      }
      interviewEndedRef.current = true;
      console.log("Call has ended naturally. Timer value:", timer);
      
      // Additional safety: ensure all audio is stopped
      try {
        // Force stop any ongoing speech synthesis
        if (window.speechSynthesis) {
          window.speechSynthesis.cancel();
        }
        
        // Stop any active audio elements
        const audioElements = document.querySelectorAll('audio');
        audioElements.forEach(audio => {
          audio.pause();
          audio.currentTime = 0;
          audio.src = '';
        });
      } catch (audioError) {
        console.log("Error stopping audio in handleCallEnd:", audioError);
      }
      
      setIsCallActive(false);
      setActiveUser(false);
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
            
            // Stop all audio immediately
            try {
              if (window.speechSynthesis) {
                window.speechSynthesis.cancel();
              }
              const audioElements = document.querySelectorAll('audio');
              audioElements.forEach(audio => {
                audio.pause();
                audio.currentTime = 0;
                audio.src = '';
              });
            } catch (audioError) {
              console.log("Error stopping audio in handleVapiError:", audioError);
            }
            
            stopTimer();
            stopCamera();
            setIsCallActive(false);
            setActiveUser(false);
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
          
          // Prevent the error from being logged to console
          event.preventDefault();
          event.stopPropagation();
          
          if (!interviewEndedRef.current) {
            interviewEndedRef.current = true;
            
            // Stop all audio immediately
            try {
              if (window.speechSynthesis) {
                window.speechSynthesis.cancel();
              }
              const audioElements = document.querySelectorAll('audio');
              audioElements.forEach(audio => {
                audio.pause();
                audio.currentTime = 0;
                audio.src = '';
              });
            } catch (audioError) {
              console.log("Error stopping audio in windowErrorHandler:", audioError);
            }
            
            stopTimer();
            stopCamera();
            setIsCallActive(false);
            setActiveUser(false);
            setIsGeneratingFeedback(true);
            toast("Interview ended. Generating feedback...");
            // small delay to allow last messages to flush
            await new Promise((r) => setTimeout(r, 300));
            await GenerateFeedback();
          }
          
          return false; // Prevent default error handling
        }
      } catch (err) {
        console.error("Error in windowErrorHandler:", err);
      }
      // let the event continue to default handling for other errors
    };
    // Handler for unhandled promise rejections (like Daily.co SDK errors)
    const unhandledRejectionHandler = async (event) => {
      try {
        const reason = event?.reason;
        const message = reason?.message || reason?.toString() || "";
        
        if (message && /Meeting ended due to ejection|Meeting has ended/i.test(message)) {
          console.log("Unhandled promise rejection detected meeting end:", message);
          
          // Prevent the error from being logged to console
          event.preventDefault();
          
          if (!interviewEndedRef.current) {
            interviewEndedRef.current = true;
            
            // Stop all audio immediately
            try {
              if (window.speechSynthesis) {
                window.speechSynthesis.cancel();
              }
              const audioElements = document.querySelectorAll('audio');
              audioElements.forEach(audio => {
                audio.pause();
                audio.currentTime = 0;
                audio.src = '';
              });
            } catch (audioError) {
              console.log("Error stopping audio in unhandledRejectionHandler:", audioError);
            }
            
            stopTimer();
            stopCamera();
            setIsCallActive(false);
            setActiveUser(false);
            setIsGeneratingFeedback(true);
            toast("Interview ended. Generating feedback...");
            // small delay to allow last messages to flush
            await new Promise((r) => setTimeout(r, 300));
            await GenerateFeedback();
          }
        }
      } catch (err) {
        console.error("Error in unhandledRejectionHandler:", err);
      }
    };

    window.addEventListener("error", windowErrorHandler);
    window.addEventListener("unhandledrejection", unhandledRejectionHandler);

    return () => {
      // Restore original console.error
      console.error = originalConsoleError;
      
      vapi.off("call-start", handleCallStart);
      vapi.off("speech-start", handleSpeechStart);
      vapi.off("speech-end", handleSpeechEnd);
      vapi.off("call-end", handleCallEnd);
      vapi.off("message", handleMessage);
      try {
        vapi.off("error", handleVapiError);
      } catch (e) {}
      window.removeEventListener("error", windowErrorHandler);
      window.removeEventListener("unhandledrejection", unhandledRejectionHandler);
    };
  }, [isGeneratingFeedback, conversation]);

  const GenerateFeedback = async () => {
    console.log("GenerateFeedback called with conversation:", conversation);

    try {
      // Check if conversation data exists and has meaningful content
      if (!conversation || conversation.trim() === "" || conversation === "[]" || conversation === "{}") {
        console.log("No meaningful conversation data available - user may not have spoken during interview");
        
        // Create a default feedback entry for silent interviews
        const defaultFeedback = {
          overall_score: "N/A",
          overall_feedback: "No conversation data was recorded during this interview session. This could happen if the user didn't speak or if there were technical issues with audio recording.",
          areas_for_improvement: ["Try speaking during the interview to get meaningful feedback", "Check microphone permissions and audio settings"],
          strengths: [],
          recommendations: ["Restart the interview and ensure your microphone is working", "Speak clearly when the AI interviewer asks questions"],
          Recommendation: "No",
          RecommendationMsg: "No conversation was recorded during this interview session. Please try again and make sure to speak when the AI interviewer asks questions. Check your microphone settings and ensure you have proper audio permissions enabled."
        };

        // Save the default feedback to Supabase
        const { data, error } = await supabase
          .from("interview-feedback")
          .insert([
            {
              userName: interviewInfo?.userName,
              userEmail: interviewInfo?.userEmail,
              interview_id,
              feedback: defaultFeedback,
              recommended: false,
            },
          ])
          .select();

        if (error) {
          console.error("Supabase insert error for default feedback:", error);
          toast.error("Failed to save interview session");
        } else {
          console.log("Default feedback saved successfully:", data);
          toast("Interview session saved. No conversation was recorded.");
        }
        
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
    <div className="relative h-screen bg-gray-900 overflow-hidden">
      {/* Main Content */}
      <div
        className={`p-6 md:p-8 lg:p-12 xl:p-16 h-full overflow-y-auto ${
          isGeneratingFeedback ? "blur-sm pointer-events-none" : ""
        }`}>
        
        {/* Header */}
        <div className="flex justify-between items-center mb-8 p-6 bg-gray-800/90 backdrop-blur-sm border border-gray-700/50 rounded-2xl shadow-lg">
          <h1 className="text-2xl font-bold text-white">
            AI Interview Session
          </h1>
          <div className="flex items-center gap-2 px-4 py-2 bg-blue-500/20 border border-blue-500/30 rounded-full text-blue-400">
            <Timer className="h-4 w-4" />
            <span className="font-mono text-sm font-medium">
              {formatTime(timer)}
            </span>
          </div>
        </div>

        {/* Video Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          {/* AI Recruiter Section */}
          <div className="relative overflow-hidden backdrop-blur-sm bg-gray-800/90 border border-gray-700/50 rounded-2xl p-8 shadow-lg">
            <div className="flex flex-col items-center justify-center h-[364px] space-y-6">
              <div className="relative">
                {!activeUser && isCallActive && (
                  <div className="absolute inset-0 rounded-full bg-blue-500/20 animate-ping" />
                )}
                <div className="relative">
                  <Image
                    src="/gurujiPortrait.png"
                    alt="AI Interviewer"
                    width={120}
                    height={120}
                    className="w-[120px] h-[120px] rounded-full object-cover border-4 border-blue-500/30 shadow-lg"
                  />
                  {!activeUser && isCallActive && (
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 border-2 border-gray-800 rounded-full animate-pulse" />
                  )}
                </div>
              </div>
              
              <div className="text-center space-y-2">
                <h2 className="text-xl font-semibold text-white">
                  AI Recruiter
                </h2>
                <p className="text-sm text-gray-400">
                  {isCallActive ? "Speaking..." : "Ready to interview"}
                </p>
              </div>
            </div>
            
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-purple-500/5 pointer-events-none rounded-2xl" />
          </div>

          {/* User Video Section */}
          <div className="relative overflow-hidden backdrop-blur-sm bg-gray-800/90 border border-gray-700/50 rounded-2xl p-8 shadow-lg">
            {isCameraOn ? (
              <div className="flex flex-col items-center justify-center h-[364px] space-y-4">
                <div className="relative w-[450px] h-[380px] bg-gray-700/50 rounded-2xl overflow-hidden border border-gray-600/50 shadow-lg">
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className="w-full h-full object-cover rounded-2xl"
                    onLoadedMetadata={() => console.log("Video metadata loaded")}
                    onError={(e) => console.log("Video error:", e)}
                  />
                  <div className="absolute inset-0 rounded-2xl ring-2 ring-emerald-500/30"></div>
                </div>
                <div className="text-center space-y-1">
                  <h2 className="text-xl font-semibold text-white">
                    {user?.name || interviewInfo?.userName || "User"}
                  </h2>
                  <p className="text-sm text-gray-400">Camera On</p>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-[364px] space-y-6">
                <div className="relative">
                  {activeUser && !isCameraOn && isCallActive && (
                    <div className="absolute inset-0 rounded-full bg-emerald-500/20 animate-ping" />
                  )}
                  <div className="relative">
                    <Image
                      src={imageError || !user?.picture ? "/default-avatar-large.svg" : user.picture}
                      alt={user?.name || interviewInfo?.userName || "User"}
                      width={120}
                      height={120}
                      className="w-[120px] h-[120px] rounded-full object-cover border-4 border-emerald-500/30 shadow-lg"
                      onError={() => setImageError(true)}
                    />
                    {activeUser && isCallActive && (
                      <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 border-2 border-gray-800 rounded-full animate-pulse" />
                    )}
                  </div>
                </div>
                <div className="text-center space-y-2">
                  <h2 className="text-xl font-semibold text-white">
                    {user?.name || interviewInfo?.userName || "User"}
                  </h2>
                  <p className="text-sm text-gray-400">
                    {isCameraOn ? "Camera On" : "Camera Off"}
                  </p>
                </div>
              </div>
            )}
            
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 via-transparent to-blue-500/5 pointer-events-none rounded-2xl" />
          </div>
        </div>

        {/* Control Buttons */}
        <div className="flex justify-center items-center gap-8 mb-8">
          {/* Microphone Button */}
          <div className="flex flex-col items-center gap-3">
            <button 
              onClick={toggleMicrophone}
              disabled={isGeneratingFeedback}
              className={`${
                isMicOn 
                  ? 'bg-blue-500 hover:bg-blue-600' 
                  : 'bg-red-500 hover:bg-red-600'
              } text-white rounded-full h-16 w-16 transition-all duration-200 hover:scale-110 hover:shadow-lg flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed shadow-md`}
            >
              {isMicOn ? (
                <Mic className="h-6 w-6" />
              ) : (
                <MicOff className="h-6 w-6" />
              )}
            </button>
            <span className="text-xs text-muted-foreground font-medium text-center">
              {isMicOn ? "Mute Microphone" : "Unmute Microphone"}
            </span>
          </div>

          {/* Camera Toggle Button */}
          <div className="flex flex-col items-center gap-3">
            <button
              onClick={toggleCamera}
              disabled={isGeneratingFeedback}
              className="bg-green-500 hover:bg-green-600 text-white rounded-full h-16 w-16 transition-all duration-200 hover:scale-110 hover:shadow-lg flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed shadow-md">
              {isCameraOn ? (
                <Video className="h-6 w-6" />
              ) : (
                <VideoOff className="h-6 w-6" />
              )}
            </button>
            <span className="text-xs text-muted-foreground font-medium text-center">
              {isCameraOn ? "Turn Off Camera" : "Turn On Camera"}
            </span>
          </div>

          {/* End Interview Button */}
          <div className="flex flex-col items-center gap-3">
            <AlertConfirmation
              stopInterview={stopInterview}
              disabled={isGeneratingFeedback}>
              <button className="bg-red-500 hover:bg-red-600 text-white rounded-full h-16 w-16 transition-all duration-200 hover:scale-110 hover:shadow-lg flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed shadow-md">
                <Phone className="h-6 w-6" />
              </button>
            </AlertConfirmation>
            <span className="text-xs text-muted-foreground font-medium">End Interview</span>
          </div>
        </div>

        {/* Status */}
        <div className="text-center space-y-2">
          <p className="text-muted-foreground text-sm">
            {isCallActive ? "Interview in progress..." : "Preparing interview..."}
          </p>
          {isCallActive && activeUser && (
            <div className="bg-blue-500/20 border border-blue-500/30 rounded-lg p-3 max-w-md mx-auto">
              <p className="text-blue-300 text-xs">
                💡 The AI is waiting for your response. Please speak clearly to continue the interview and receive meaningful feedback.
              </p>
            </div>
          )}
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
