import React, { useState, useEffect } from 'react';

interface TypewriterTextProps {
  content: string;
  speed?: number;
  onUpdate?: () => void;
  onComplete?: () => void;
  isNew?: boolean;
}

export const TypewriterText: React.FC<TypewriterTextProps> = ({
  content,
  speed = 12,
  onUpdate,
  onComplete,
  isNew = false,
}) => {
  const [displayedLength, setDisplayedLength] = useState(() => (isNew ? 0 : content.length));

  useEffect(() => {
    if (!isNew) {
      setDisplayedLength(content.length);
      return;
    }

    setDisplayedLength(0);
    let currentIdx = 0;
    const totalLength = content.length;

    // Stream in chunks for fluid, natural LLM typewriter feel
    const interval = setInterval(() => {
      // Chunk size scaled slightly so longer texts don't take forever, maintaining snappy responsiveness
      const step = totalLength > 400 ? 5 : totalLength > 150 ? 3 : 2;
      currentIdx = Math.min(currentIdx + step, totalLength);
      setDisplayedLength(currentIdx);
      onUpdate?.();

      if (currentIdx >= totalLength) {
        clearInterval(interval);
        onComplete?.();
      }
    }, speed);

    return () => clearInterval(interval);
  }, [content, isNew, speed]);

  const isTyping = displayedLength < content.length;
  const visibleText = content.slice(0, displayedLength);

  return (
    <div className="whitespace-pre-wrap font-sans relative">
      <span>{visibleText}</span>
      {isTyping && (
        <span className="inline-block w-1.5 h-4 ml-0.5 align-middle bg-cyan-400 animate-pulse rounded-sm shadow-[0_0_8px_rgba(0,210,255,0.8)]" />
      )}
    </div>
  );
};
