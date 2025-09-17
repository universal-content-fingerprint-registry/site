import React, { useState } from "react";
import styles from "./styles.module.css";

type CopyButtonProps = {
  value: string;
  title?: string;
  className?: string;
  children?: React.ReactNode;
  onCopy?: () => void;
};

export default function CopyButton({
  value,
  title = "Copy",
  className,
  children,
  onCopy,
}: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      onCopy?.();
      setTimeout(() => setCopied(false), 1200);
    } catch {}
  };

  return (
    <button
      type="button"
      className={`${styles.copyButton} ${className || ""}`.trim()}
      title={title}
      onClick={handleCopy}
    >
      {children || (copied ? "✅ Copied" : "📋 Copy")}
    </button>
  );
}
