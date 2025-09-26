// app/services/Constants.jsx
import { Calendar } from "lucide-react";
import { LayoutDashboard } from "lucide-react";
import { RxHamburgerMenu } from "react-icons/rx";
import { CiCreditCard1 } from "react-icons/ci";
import { User } from "lucide-react";
import { Code2Icon } from "lucide-react";
import { User2Icon } from "lucide-react";
import { Puzzle } from "lucide-react";
import { Briefcase } from "lucide-react";
import { Speech } from "lucide-react";

export const SidebarOptions = [
  {
    name: "Dashboard",
    icon: LayoutDashboard,
    path: "/dashboard",
  },
  {
    name: "Interview Feedbacks",
    icon: Calendar,
    path: "/scheduled-interviews",
  },
  {
    name: "All Interviews",
    icon: RxHamburgerMenu,
    path: "/all-interviews",
  },
  {
    name: "Billing",
    icon: CiCreditCard1,
    path: "/billing",
  },
  {
    name: "Profile",
    icon: User,
    path: "/profile",
  },
];

export const InterviewType = [
  {
    title: "Technical",
    icon: Code2Icon,
  },
  {
    title: "Behavioral",
    icon: User2Icon,
  },
  {
    title: "Problem Solving",
    icon: Puzzle,
  },
  {
    title: "Experience",
    icon: Briefcase,
  },
  {
    title: "Leadership",
    icon: Speech,
  },
];

export const QUESTIONS_PROMPT = `You are an expert technical interviewer.
Based on the following inputs, generate a well-structured list of high-quality interview questions:

Job Title: {{jobTitle}}
Job Description: {{jobDescription}}
Interview Duration: {{duration}}
Interview Type: {{type}}

Your task:
Analyze the job description to identify key responsibilities, required skills, and expected experience.
Generate a list of interview questions depends on interview duration
Adjust the number and depth of questions to match the interview duration.
Ensure the questions match the tone and structure of a real-life {{type}} interview.

Format your response in JSON format with array list of questions.

IMPORTANT: You must respond with valid JSON only. No additional text, explanations, or markdown formatting.

Response format (valid JSON object):
{
  "interviewQuestions": [
    {
      "id": 1,
      "question": "Your question text here",
      "type": "Technical/Behavioral/Experience/Problem Solving/Leadership",
      "difficulty": "Easy/Medium/Hard"
    }
  ]
}

The goal is to create a structured, relevant, and time-optimized interview plan for a {{jobTitle}} role.
Return only valid JSON. No markdown, no extra text, just the JSON object.
Try avoiding asking questions where user has to code something (just ask for their approach to solve that problem).
`;

export const FEEDBACK_PROMPT = `
Interview Conversation:
{{conversation}}

Based on this Interview Conversation between assistant and user, 
give me feedback for user interview. Give me rating out of 10 for technical Skills, 
Communication, Problem Solving, Experience. Also give me summary in 3 lines 
about the interview and one line to let me know whether is recommended 
for hire or not with msg.

IMPORTANT: You must respond with valid JSON only. No additional text, explanations, or markdown formatting.

Response format (valid JSON object):
{
  "feedback": {
    "rating": {
      "technicalSkills": 5,
      "communication": 6,
      "problemSolving": 4,
      "experience": 7,
      "overall": 6
    },
    "summary": "Summary in 3 lines about the interview performance and key observations.",
    "Recommendation": "Yes",
    "RecommendationMsg": "Brief message explaining the recommendation"
  }
}

Return only valid JSON. Give the recommendation in only Yes or No.

When you get absolutely no response from the user in the interview, don't generate a generic response give 0 rating to all aspects.  
For those interviews with very less response or no response from the user give recommendation as "No".
For those interviews with very less response or no response from the user give summary as "No response from the user, need further evaluation".
`;
