import React from "react";
import Section from "./Section";
import CopyButton from "./CopyButton";
import styles from "./styles.module.css";

type HashContentProps = {
  content: string;
  onContentChange: (value: string) => void;
  sha256Hash: string;
};

export default function HashContent({
  content,
  onContentChange,
  sha256Hash,
}: HashContentProps) {
  return (
    <Section title="1. Hash Your Content">
      <textarea
        value={content}
        onChange={(e) => onContentChange(e.target.value)}
        placeholder="Enter your text content to hash... (e.g. This is my important document content)"
        className={styles.textarea}
        rows={4}
      />

      {content && (
        <div className={styles.hashes}>
          <div className={styles.hash}>
            <label>SHA-256 Hash (Method ID: 0):</label>
            <code className={styles.hashValue}>{sha256Hash}</code>
            <div className={styles.controlsRow}>
              <CopyButton value={sha256Hash} title="Copy SHA-256 hash" />
              <span className={styles.smallNote}>
                Use this fingerprint when verifying.
              </span>
            </div>
            <p className={styles.hashNote}>
              This fingerprint will be used to create your claim on the
              blockchain.
            </p>
          </div>
        </div>
      )}
    </Section>
  );
}
