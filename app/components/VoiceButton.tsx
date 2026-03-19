"use client";

import { speak } from "@/app/utils/speech";

interface VoiceButtonProps {
  text: string;
  lang?: string;
  className?: string;
}

export default function VoiceButton({ text, lang = 'en-US', className = '' }: VoiceButtonProps) {
  return (
    <button
      onClick={() => speak(text, lang)}
      className={`flex items-center text-green-600 hover:text-green-700 ${className}`}
    >
      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
          d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
      </svg>
      播放
    </button>
  );
}