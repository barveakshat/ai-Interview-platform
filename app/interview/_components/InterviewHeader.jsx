// app/interview/_components/InterviewHeader.jsx
import React from "react";
import Image from "next/image";

function InterviewHeader() {
  return (
    <div className="flex flex-row items-center space-x-1 p-4 shadow-sm">
  <Image src="/gurujiLogoSm.png" alt="PrepTrack logo" width={40} height={40} />
  <div className="text-2xl text-green-700">PrepTrack</div>
    </div>
  );
}

export default InterviewHeader;
