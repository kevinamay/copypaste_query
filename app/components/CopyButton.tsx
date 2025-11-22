// app/components/CopyButton.tsx
'use client'; 
import { useState } from 'react';
import { FaCopy, FaCheck } from 'react-icons/fa';

interface CopyButtonProps {
  codeToCopy: string;
}
export default function CopyButton({ codeToCopy }: CopyButtonProps) {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    navigator.clipboard.writeText(codeToCopy).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000); 
    });
  };
  return (
    <button
      onClick={handleCopy}
      className="absolute top-2 right-2 p-2 rounded-md bg-gray-700 hover:bg-gray-600 text-white transition-all"
      aria-label="Salin kode"
    >
      {copied ? <FaCheck /> : <FaCopy />}
    </button>
  );
}