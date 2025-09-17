import React from "react";
import Section from "./Section";
import styles from "./styles.module.css";

type MethodStatusProps = {
  isLoading: boolean;
  error?: Error | null;
  methodData?: any;
};

export default function MethodStatus({
  isLoading,
  error,
  methodData,
}: MethodStatusProps) {
  return (
    <Section title="2. Method Status">
      {isLoading ? (
        <div className={styles.methodInfo}>
          <p>Loading method information...</p>
        </div>
      ) : error ? (
        <div className={styles.methodInfo}>
          <p>❌ Error loading method: {error.message}</p>
          <p className={styles.methodNote}>
            Make sure you're connected to the Global Trust Network.
          </p>
        </div>
      ) : methodData ? (
        <div className={styles.methodInfo}>
          <p>
            <strong>SHA-256 Method (ID: 0):</strong>{" "}
            {methodData[4] ? "✅ Active" : "❌ Inactive"}
          </p>
          <p>
            <strong>Name:</strong> {methodData[1]}
          </p>
          <p>
            <strong>Fingerprint Size:</strong> {methodData[3].toString()} bytes
          </p>
          <p className={styles.methodNote}>
            This method is pre-registered and ready to use for creating claims.
          </p>
        </div>
      ) : (
        <div className={styles.methodInfo}>
          <p>No method data available</p>
        </div>
      )}
    </Section>
  );
}
