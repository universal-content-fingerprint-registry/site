import React, { useState, useEffect } from "react";
import { createConfig, http, WagmiProvider } from "wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  useWriteContract,
  useReadContract,
  useWaitForTransactionReceipt,
} from "wagmi";
// Removed unused viem imports - using Web Crypto API for SHA-256
import { privateKeyToAccount } from "viem/accounts";
import styles from "./styles.module.css";
import GeneralizaedClaimRegistryABI from "@site/static/GeneralizaedClaimRegistryABI.json";

// Stability Protocol ZGT Network Configuration
const stabilityZGT = {
  id: 101010,
  name: "Global Trust Network",
  network: "global-trust-network",
  nativeCurrency: {
    decimals: 18,
    name: "FREE",
    symbol: "FREE",
  },
  rpcUrls: {
    default: {
      http: ["https://rpc.stabilityprotocol.com/zgt/try-it-out"],
    },
    public: {
      http: ["https://rpc.stabilityprotocol.com/zgt/try-it-out"],
    },
  },
  blockExplorers: {
    default: {
      name: "Stability Explorer",
      url: "https://explorer.stabilityprotocol.com",
    },
  },
} as const;

// Use the imported ABI
const ClaimRegistryABI = GeneralizaedClaimRegistryABI.abi;

const CONTRACT_ADDRESS = "0xEff0AFc2C6E289846F7939c4d6291c4E5E75E030";

// Deterministic demo wallet - always the same for consistency
const DEMO_PRIVATE_KEY =
  "0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d"; // Demo key
const demoAccount = privateKeyToAccount(DEMO_PRIVATE_KEY);

// WAGMI Configuration
const config = createConfig({
  chains: [stabilityZGT],
  connectors: [],
  transports: {
    [stabilityZGT.id]: http(),
  },
});

const queryClient = new QueryClient();

// Demo Component
function UCFRDemoInner() {
  const [content, setContent] = useState("");
  const [metadata, setMetadata] = useState("");
  const [extURI, setExtURI] = useState("");
  const [sha256Hash, setSha256Hash] = useState("");
  const [verifyFingerprint, setVerifyFingerprint] = useState("");
  const [claimResult, setClaimResult] = useState(null);
  const [verifyResult, setVerifyResult] = useState(null);

  // Use deterministic demo account
  const address = demoAccount.address;
  const isConnected = true; // Always connected with demo wallet

  const {
    writeContract,
    data: hash,
    error: writeError,
    isPending: isWritePending,
  } = useWriteContract({});

  // Wait for transaction receipt
  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({
      hash,
    });

  // Read contract - check if SHA-256 method exists (method ID 0)
  const {
    data: methodData,
    isLoading: isLoadingMethod,
    error: methodError,
  } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: ClaimRegistryABI,
    functionName: "methods",
    args: [0n], // Method ID 0 for SHA-256 (pre-registered)
    chainId: stabilityZGT.id,
  });

  // Read contract - verify claim
  const {
    data: verifyData,
    refetch: refetchVerify,
    isLoading: isVerifying,
    isFetching: isVerifyFetching,
  } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: ClaimRegistryABI,
    functionName: "getClaimByIdWithExtId",
    args: verifyFingerprint
      ? [0n, verifyFingerprint as `0x${string}`, 2n]
      : undefined,
    chainId: stabilityZGT.id,
    query: {
      enabled: !!verifyFingerprint,
    },
  });

  // Generate SHA-256 hash when content changes
  useEffect(() => {
    if (content) {
      // SHA-256 hash (using Web Crypto API)
      const generateSHA256 = async () => {
        const encoder = new TextEncoder();
        const data = encoder.encode(content);
        const hashBuffer = await crypto.subtle.digest("SHA-256", data);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        const hashHex =
          "0x" + hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
        setSha256Hash(hashHex);
      };
      generateSHA256();
    } else {
      setSha256Hash("");
    }
  }, [content]);

  // Handle claim creation
  const handleCreateClaim = async () => {
    if (!content || !isConnected || !sha256Hash) return;

    try {
      await writeContract({
        address: CONTRACT_ADDRESS,
        abi: ClaimRegistryABI,
        functionName: "claimById",
        args: [
          0n, // methodId (SHA-256, pre-registered)
          2n, // externalId (ECDSA signature)
          sha256Hash as `0x${string}`,
          metadata || "",
          extURI || "",
        ],
        chain: stabilityZGT,
        account: demoAccount,
      });
    } catch (error) {
      console.error("Error creating claim:", error);
    }
  };

  // Handle verify claim
  const handleVerifyClaim = () => {
    if (verifyFingerprint) {
      refetchVerify();
    }
  };

  // Update verify result when data changes
  useEffect(() => {
    if (verifyData) {
      setVerifyResult(verifyData);
    }
  }, [verifyData]);

  // Auto-fill verify fingerprint when claim is created successfully
  useEffect(() => {
    if (isConfirmed && sha256Hash) {
      setTimeout(() => {
        setVerifyFingerprint(sha256Hash);
      }, 2_000);
    }
  }, [isConfirmed, sha256Hash]);

  return (
    <div className={styles.demo}>
      <div className={styles.header}>
        <h2>Universal Content Fingerprinting Registry Demo</h2>
        {/* <div className={styles.connection}>
          <div className={styles.connected}>
            <span>
              Demo Wallet: {address?.slice(0, 6)}...{address?.slice(-4)}
            </span>
            <span className={styles.demoNote}>(Deterministic demo wallet)</span>
          </div>
        </div> */}
      </div>

      {/* Content Hashing Section */}
      <div className={styles.section}>
        <h3>1. Hash Your Content</h3>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Enter your text content to hash... (e.g. This is my important document content)"
          className={styles.textarea}
          rows={4}
        />

        {content && (
          <div className={styles.hashes}>
            <div className={styles.hash}>
              <label>SHA-256 Hash (Method ID: 0):</label>
              <code className={styles.hashValue}>{sha256Hash}</code>
              <p className={styles.hashNote}>
                This fingerprint will be used to create your claim on the
                blockchain.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Method Status Section */}
      <div className={styles.section}>
        <h3>2. Method Status</h3>
        {isLoadingMethod ? (
          <div className={styles.methodInfo}>
            <p>Loading method information...</p>
          </div>
        ) : methodError ? (
          <div className={styles.methodInfo}>
            <p>❌ Error loading method: {methodError.message}</p>
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
              <strong>Fingerprint Size:</strong> {methodData[3].toString()}{" "}
              bytes
            </p>
            <p className={styles.methodNote}>
              This method is pre-registered and ready to use for creating
              claims.
            </p>
          </div>
        ) : (
          <div className={styles.methodInfo}>
            <p>No method data available</p>
          </div>
        )}
      </div>

      {/* Create Claim Section */}
      <div className={styles.section}>
        <h3>3. Create Claim</h3>
        <div className={styles.inputs}>
          <input
            type="text"
            value={metadata}
            onChange={(e) => setMetadata(e.target.value)}
            placeholder="Metadata (optional)"
            className={styles.input}
          />
          <input
            type="text"
            value={extURI}
            onChange={(e) => setExtURI(e.target.value)}
            placeholder="External URI (optional)"
            className={styles.input}
          />
        </div>

        <button
          onClick={handleCreateClaim}
          disabled={
            !content || !isConnected || isWritePending || !methodData?.[4]
          }
          className={styles.button}
        >
          {isWritePending ? "Creating Claim..." : "Create Claim"}
        </button>

        {isConfirming && (
          <p className={styles.status}>Waiting for confirmation...</p>
        )}
        {isConfirmed && (
          <p className={styles.success}>Claim created successfully!</p>
        )}
        {writeError && (
          <p className={styles.error}>Error: {writeError.message}</p>
        )}
        {hash && (
          <div className={styles.txHash}>
            <div className={styles.txHashHeader}>
              <span className={styles.txHashLabel}>✅ Transaction Hash</span>
              <button
                className={styles.copyButton}
                onClick={() => navigator.clipboard.writeText(hash)}
                title="Copy transaction hash"
              >
                📋
              </button>
            </div>
            <code className={styles.txHashValue}>{hash}</code>
            <a
              href={`https://explorer.stabilityprotocol.com/tx/${hash}`}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.explorerLink}
            >
              View on Explorer →
            </a>
          </div>
        )}
      </div>

      {/* Verify Claim Section */}
      <div className={styles.section}>
        <h3>4. Verify Claim</h3>
        <p className={styles.sectionDescription}>
          Verify that a claim exists on the blockchain by entering its SHA-256
          fingerprint. This will show you who owns the claim and when it was
          created.
        </p>
        <div className={styles.inputs}>
          <input
            type="text"
            value={verifyFingerprint}
            onChange={(e) => setVerifyFingerprint(e.target.value)}
            placeholder="Enter fingerprint to verify (0x...)"
            className={styles.input}
            disabled={!isConfirmed}
          />
          <button
            onClick={handleVerifyClaim}
            disabled={
              !verifyFingerprint ||
              !isConfirmed ||
              isVerifying ||
              isVerifyFetching
            }
            className={styles.button}
          >
            {isVerifying || isVerifyFetching
              ? "🔍 Verifying..."
              : "Verify Claim"}
          </button>
        </div>
        {!isConfirmed && (
          <p className={styles.disabledNote}>
            Create a claim first to enable verification
          </p>
        )}

        {/* Loading state */}
        {(isVerifying || isVerifyFetching) && (
          <div className={styles.verifyLoading}>
            <div className={styles.loadingSpinner}>🔄</div>
            <p>Checking blockchain for claim...</p>
          </div>
        )}

        {/* Results */}
        {verifyResult && !isVerifying && !isVerifyFetching && (
          <div className={styles.verifyResult}>
            {verifyResult[0] ===
            "0x0000000000000000000000000000000000000000" ? (
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
                    <strong>Owner:</strong>
                    <code>{verifyResult.owner}</code>
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
      </div>
    </div>
  );
}

// Main component with providers
export default function UCFRDemo() {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <UCFRDemoInner />
      </QueryClientProvider>
    </WagmiProvider>
  );
}
