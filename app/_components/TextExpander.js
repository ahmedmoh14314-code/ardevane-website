"use client";

import { useState } from "react";

const WORDS = 40;

function TextExpander({ children }) {
  const [isExpanded, setIsExpanded] = useState(false);

  const words = children.split(" ");

  // Short descriptions are shown whole, with no button
  if (words.length <= WORDS) return <span>{children}</span>;

  const displayText = isExpanded
    ? children
    : words.slice(0, WORDS).join(" ") + "…";

  return (
    <span>
      {displayText}{" "}
      <button
        className="font-display text-bark-700 underline decoration-sand-300 underline-offset-4 hover:decoration-bark-600"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        {isExpanded ? "Show less" : "Read more"}
      </button>
    </span>
  );
}

export default TextExpander;
