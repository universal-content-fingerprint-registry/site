import React, { useMemo } from "react";
import Section from "./Section";
import CopyButton from "./CopyButton";
import styles from "./styles.module.css";

type CreateClaimProps = {
  content: string;
  isConnected: boolean;
  methodActive: boolean;
  metadata: string;
  setMetadata: (v: string) => void;
  extURI: string;
  setExtURI: (v: string) => void;
  onCreate: () => void;
  isWritePending: boolean;
  isConfirming: boolean;
  isConfirmed: boolean;
  writeError?: Error | null;
  txHash?: `0x${string}` | undefined;
};

export default function CreateClaim({
  content,
  isConnected,
  methodActive,
  metadata,
  setMetadata,
  extURI,
  setExtURI,
  onCreate,
  isWritePending,
  isConfirming,
  isConfirmed,
  writeError,
  txHash,
}: CreateClaimProps) {
  const isUrlValid = useMemo(() => {
    const value = (extURI || "").trim();
    if (!value) return true;
    try {
      const url = new URL(value);
      return url.protocol === "http:" || url.protocol === "https:";
    } catch {
      return false;
    }
  }, [extURI]);

  const canCreate = Boolean(
    content && isConnected && methodActive && !isWritePending && isUrlValid
  );
  const disabledReason = useMemo(() => {
    if (!content) return "Enter content in step 1 to enable";
    if (!methodActive) return "Method inactive on network";
    if (!isUrlValid) return "External URI must be a valid http(s) URL";
    return undefined;
  }, [content, methodActive, isUrlValid]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && (e.metaKey || e.ctrlKey) && canCreate) {
      onCreate();
    }
  };

  return (
    <Section title="3. Create Claim">
      <div className={styles.pillGroup}>
        <span className={styles.pill}>Method: SHA-256 (ID 0)</span>
        <span className={styles.pill}>External ID: ECDSA (2)</span>
      </div>
      <div className={styles.inputs}>
        <input
          type="text"
          value={metadata}
          onChange={(e) => setMetadata(e.target.value)}
          placeholder="Metadata (optional)"
          className={styles.input}
          onKeyDown={handleKeyDown}
        />
        <input
          type="text"
          value={extURI}
          onChange={(e) => setExtURI(e.target.value)}
          placeholder="External URI (optional)"
          className={`${styles.input} ${
            !isUrlValid ? styles.inputInvalid : ""
          }`.trim()}
          onKeyDown={handleKeyDown}
        />
        {!isUrlValid && (
          <p className={styles.helperText}>
            External URI must be a valid http(s) URL.
          </p>
        )}
        <div className={styles.controlsRow}>
          <button
            type="button"
            className={styles.buttonSecondary}
            onClick={() => {
              setMetadata("");
              setExtURI("");
            }}
            disabled={!metadata && !extURI}
          >
            Clear optional fields
          </button>
          <span className={styles.smallNote}>
            Tip: Press Cmd/Ctrl+Enter to submit
          </span>
        </div>
      </div>

      <button
        onClick={onCreate}
        disabled={!canCreate}
        className={styles.button}
      >
        {isWritePending ? "Creating Claim..." : "Create Claim"}
      </button>
      {!canCreate && disabledReason && (
        <p className={styles.helperText}>{disabledReason}</p>
      )}

      {isConfirming && (
        <p className={styles.status}>Waiting for confirmation...</p>
      )}
      {isConfirmed && (
        <p className={styles.success}>Claim created successfully!</p>
      )}
      {writeError && (
        <div className={styles.error}>
          {(writeError.message || "").includes("claim exists") ? (
            <div className={styles.duplicateError}>
              <div className={styles.errorIcon}>⚠️</div>
              <div>
                <strong>Claim Already Exists</strong>
                <p>
                  A claim for this content fingerprint already exists on the
                  blockchain. Each piece of content can only be claimed once.
                </p>
                <p className={styles.errorSuggestion}>
                  The verification section below has been auto-filled with your
                  fingerprint. Click "Verify Claim" to see who owns this
                  content.
                </p>
              </div>
            </div>
          ) : (
            <p>Error: {writeError.message}</p>
          )}
        </div>
      )}
      {txHash && (
        <div className={styles.txHash}>
          <div className={styles.txHashHeader}>
            <span className={styles.txHashLabel}>✅ Transaction Hash</span>
            <CopyButton value={txHash} title="Copy transaction hash" />
          </div>
          <code className={styles.txHashValue}>{txHash}</code>
          <a
            href={`https://explorer.stabilityprotocol.com/tx/${txHash}`}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.explorerLink}
          >
            View on Explorer →
          </a>
        </div>
      )}
    </Section>
  );
}
