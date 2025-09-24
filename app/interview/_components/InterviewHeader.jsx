// app/interview/_components/InterviewHeader.jsx
import React from "react";
import Image from "next/image";

function InterviewHeader() {
  return (
    <div className="flex flex-row items-center space-x-1 p-6 bg-gray-900/95 backdrop-blur-sm shadow-lg">
      <Image src="/gurujiLogoSm.png" alt="PrepTrack logo" width={200} height={200} />
    </div>
  );
}

export default InterviewHeader;
