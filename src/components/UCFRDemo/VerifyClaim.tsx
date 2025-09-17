import React, { RefObject, useMemo } from "react";
import Section from "./Section";
import styles from "./styles.module.css";

type VerifyClaimProps = {
  verifyFingerprint: string;
  setVerifyFingerprint: (v: string) => void;
  onVerify: () => void;
  isValidVerifyHex: boolean;
  isVerifying: boolean;
  isVerifyFetching: boolean;
  verifyErrorMsg: string;
  verifyError?: Error | null;
  verifyResult: any;
  zeroAddress: string;
  sha256Hash: string;
  verifySectionRef: RefObject<HTMLDivElement>;
};

export default function VerifyClaim({
  verifyFingerprint,
  setVerifyFingerprint,
  onVerify,
  isValidVerifyHex,
  isVerifying,
  isVerifyFetching,
  verifyErrorMsg,
  verifyError,
  verifyResult,
  zeroAddress,
  sha256Hash,
  verifySectionRef,
}: VerifyClaimProps) {
  const useCurrentHash = () => {
    if (!sha256Hash) return;
    setVerifyFingerprint(sha256Hash);
    requestAnimationFrame(() => {
      verifySectionRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    });
  };

  const isInputNonEmpty = verifyFingerprint.length > 0;
  const showInlineInvalid =
    isInputNonEmpty && !isValidVerifyHex && !isVerifying && !isVerifyFetching;
  const lengthInfo = useMemo(
    () => `${verifyFingerprint.length}/66 chars`,
    [verifyFingerprint.length]
  );

  return (
    <Section
      id="verify"
      title="4. Verify Claim"
      description={
        <>
          Verify that a claim exists on the blockchain by entering its
          fingerprint (the MethodId is hardcoded to SHA-256). This will return
          the associated data including the External ID (Signature) if
          available.
        </>
      }
    >
      <div className={styles.inputs}>
        <div className={styles.pillGroup}>
          <span className={styles.pill}>Method: SHA-256 (ID 0)</span>
          <span className={styles.pill}>External ID: ECDSA (2)</span>
        </div>
        <div className={styles.controlsRow}>
          <input
            type="text"
            value={verifyFingerprint}
            onChange={(e) => setVerifyFingerprint(e.target.value.trim())}
            onKeyDown={(e) => {
              if (
                e.key === "Enter" &&
                isValidVerifyHex &&
                !isVerifying &&
                !isVerifyFetching
              ) {
                onVerify();
              }
            }}
            placeholder="Enter fingerprint to verify (0x...)"
            className={`${styles.input} ${styles.inputFull} ${
              showInlineInvalid ? styles.inputInvalid : ""
            }`.trim()}
            disabled={false}
            aria-invalid={showInlineInvalid}
          />
          <button
            onClick={onVerify}
            disabled={!isValidVerifyHex || isVerifying || isVerifyFetching}
            className={styles.button}
          >
            {isVerifying || isVerifyFetching
              ? "🔍 Verifying..."
              : "Verify Claim"}
          </button>
        </div>
        <div className={styles.controlsRow}>
          <button
            type="button"
            className={styles.buttonSecondary}
            onClick={useCurrentHash}
            disabled={!sha256Hash}
          >
            Use current hash
          </button>
          <button
            type="button"
            className={styles.buttonSecondary}
            onClick={() => setVerifyFingerprint("")}
            disabled={!isInputNonEmpty}
          >
            Clear
          </button>
          <span className={styles.smallNote}>
            Auto-fills with the hash from step 1. {lengthInfo}
          </span>
        </div>
        {showInlineInvalid && (
          <p className={styles.helperText}>
            Expected format: 0x followed by 64 hex characters.
          </p>
        )}
      </div>

      {(verifyErrorMsg || verifyError) && !isVerifying && !isVerifyFetching && (
        <div className={styles.error}>
          <p>
            {verifyErrorMsg ||
              (verifyError as Error)?.message ||
              "Error verifying claim"}
          </p>
        </div>
      )}

      {(isVerifying || isVerifyFetching) && (
        <div className={styles.verifyLoading}>
          <div className={styles.loadingSpinner}>🔄</div>
          <p>Checking blockchain for claim...</p>
        </div>
      )}

      {verifyResult && !isVerifying && !isVerifyFetching && (
        <div ref={verifySectionRef} className={styles.verifyResult}>
          {verifyResult.creator === zeroAddress ? (
            <div className={styles.noClaimFound}>
              <div className={styles.resultIcon}>❌</div>
              <h4>No Claim Found</h4>
              <p>No claim exists for this fingerprint on the blockchain.</p>
            </div>
          ) : (
            <div className={styles.claimFound}>
              <div className={styles.resultIcon}>✅</div>
              <h4>Claim Verified Successfully!</h4>
              <div className={styles.claimDetails}>
                <div className={styles.claimField}>
                  <strong>Creator:</strong>
                  <code>{verifyResult.creator}</code>
                </div>
                <div className={styles.claimField}>
                  <strong>Created:</strong>
                  <span>
                    {new Date(
                      Number(verifyResult.timestamp) * 1000
                    ).toLocaleString()}
                  </span>
                </div>
                <div className={styles.claimField}>
                  <strong>Metadata:</strong>
                  <span>{verifyResult.metadata || "None"}</span>
                </div>
                {verifyResult.extURI && (
                  <div className={styles.claimField}>
                    <strong>External URI:</strong>
                    <a
                      href={verifyResult.extURI}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {verifyResult.extURI}
                    </a>
                  </div>
                )}
                <div className={styles.claimField}>
                  <strong>Method ID:</strong>
                  <span>{verifyResult.methodId.toString()} (SHA-256)</span>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </Section>
  );
}
