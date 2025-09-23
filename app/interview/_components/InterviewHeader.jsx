// app/interview/_components/InterviewHeader.jsx
import React from "react";
import Image from "next/image";

function InterviewHeader() {
  return (
    <div className="flex flex-row items-center space-x-1 p-4 shadow-sm">
      <Image src="/gurujiLogoSm.png" alt="PrepTrack logo" width={150} height={150} />
    </div>
  );
}

export default InterviewHeader;
