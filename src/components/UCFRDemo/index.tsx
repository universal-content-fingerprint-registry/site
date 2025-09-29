import React, { useState, useEffect, useRef } from "react";
import { createConfig, http, WagmiProvider } from "wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  useWriteContract,
  useReadContract,
  useWaitForTransactionReceipt,
} from "wagmi";
// Removed unused viem imports - using Web Crypto API for SHA-256
import { generatePrivateKey, privateKeyToAccount } from "viem/accounts";
import styles from "./styles.module.css";
import GeneralizaedClaimRegistryABI from "@site/static/GeneralizedClaimRegistryABI.json";
import HashContent from "./HashContent";
import MethodStatus from "./MethodStatus";
import CreateClaim from "./CreateClaim";
import VerifyClaim from "./VerifyClaim";

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

const CONTRACT_ADDRESS = "0xa462D0F7c54fFc3dEC60EaBeFE3762af4540B760";

// Deterministic demo wallet - always the same for consistency
const DEMO_PRIVATE_KEY = generatePrivateKey(); // Demo key
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
  const [verifyResult, setVerifyResult] = useState(null);
  const [verifyErrorMsg, setVerifyErrorMsg] = useState("");
  const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000" as const;
  const isValidVerifyHex = /^0x[0-9a-fA-F]{64}$/.test(verifyFingerprint);
  const verifySectionRef = useRef<HTMLDivElement>(null);

  const isConnected = true; // Always connected with demo wallet

  const {
    writeContract,
    data: hash,
    error: writeError,
    isPending: isWritePending,
    reset: resetWriteContract,
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
    error: verifyError,
  } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: ClaimRegistryABI,
    functionName: "getClaimByIdWithExtId",
    args: isValidVerifyHex
      ? [0n, verifyFingerprint as `0x${string}`, 1n]
      : undefined,
    chainId: stabilityZGT.id,
    query: {
      enabled: false,
      retry: false,
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
      setVerifyResult(null);
      await writeContract({
        address: CONTRACT_ADDRESS,
        abi: ClaimRegistryABI,
        functionName: "claim",
        args: [
          {
            methodId: 0n,
            externalId: 1n,
            fingerprint: sha256Hash as `0x${string}`,
            externalSig: "0x",
            pubKey: "0x",
            metadata: metadata || "",
            extURI: extURI || "",
          },
        ],
        chain: stabilityZGT,
        account: demoAccount,
      });
    } catch (error) {
      console.error("Error creating claim:", error);
    }
  };

  // Handle verify claim
  const handleVerifyClaim = async () => {
    if (!isValidVerifyHex) {
      setVerifyErrorMsg(
        "Invalid fingerprint. Expected 0x followed by 64 hex characters."
      );
      return;
    }
    setVerifyErrorMsg("");
    // Reset previous results before starting new verification
    setVerifyResult(null);
    try {
      const result = await refetchVerify();
      // Force new reference to ensure UI updates even if data is identical
      // result may be of shape { data, error, status }
      const data = (result as any)?.data ?? result;
      if (data) {
        setVerifyResult({ ...(data as object) });
        requestAnimationFrame(() => {
          verifySectionRef.current?.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        });
      } else {
        setVerifyResult(null);
      }
    } catch (e) {
      setVerifyErrorMsg((e as Error)?.message || "Error verifying claim");
    }
  };

  // Update verify result when data changes
  useEffect(() => {
    if (verifyData) {
      setVerifyResult(verifyData);
    }
  }, [verifyData]);

  useEffect(() => {
    if (isValidVerifyHex && verifyErrorMsg) {
      setVerifyErrorMsg("");
    }
  }, [isValidVerifyHex, verifyErrorMsg]);

  // Auto-fill verify fingerprint when claim is created successfully or when duplicate error occurs
  useEffect(() => {
    if (isConfirmed && sha256Hash) {
      setTimeout(() => {
        setVerifyFingerprint(sha256Hash);
      }, 1_000);
    }
  }, [isConfirmed, sha256Hash]);

  // Auto-fill verify fingerprint when duplicate claim error occurs
  useEffect(() => {
    if (
      writeError &&
      writeError.message.includes("claim exists") &&
      sha256Hash
    ) {
      setVerifyFingerprint(sha256Hash);
    }
  }, [writeError, sha256Hash]);

  return (
    <div className={styles.demo}>
      <div className={styles.header}>
        <h2>Universal Content Fingerprinting Registry Demo</h2>
        <div className={styles.controlsRow}>
          <button
            type="button"
            className={styles.buttonSecondary}
            onClick={() => {
              setContent("");
              setMetadata("");
              setExtURI("");
              setVerifyFingerprint("");
              setVerifyResult(null);
              setVerifyErrorMsg("");
              resetWriteContract();
            }}
          >
            Reset demo
          </button>
        </div>
      </div>

      <HashContent
        content={content}
        onContentChange={(val) => {
          setContent(val);
          setMetadata("");
          setExtURI("");
          setVerifyFingerprint("");
          setVerifyResult(null);
          resetWriteContract();
        }}
        sha256Hash={sha256Hash}
      />

      <MethodStatus
        isLoading={isLoadingMethod}
        error={methodError as Error | null}
        methodData={methodData}
      />

      <CreateClaim
        content={content}
        isConnected={isConnected}
        methodActive={Boolean(methodData?.[4])}
        metadata={metadata}
        setMetadata={setMetadata}
        extURI={extURI}
        setExtURI={setExtURI}
        onCreate={handleCreateClaim}
        isWritePending={isWritePending}
        isConfirming={isConfirming}
        isConfirmed={isConfirmed}
        writeError={writeError as Error | null}
        txHash={hash}
      />

      <VerifyClaim
        verifyFingerprint={verifyFingerprint}
        setVerifyFingerprint={(v) => {
          if (verifyResult) setVerifyResult(null);
          setVerifyFingerprint(v);
        }}
        onVerify={handleVerifyClaim}
        isValidVerifyHex={isValidVerifyHex}
        isVerifying={isVerifying}
        isVerifyFetching={isVerifyFetching}
        verifyErrorMsg={verifyErrorMsg}
        verifyError={verifyError as Error | null}
        verifyResult={verifyResult}
        zeroAddress={ZERO_ADDRESS}
        sha256Hash={sha256Hash}
        verifySectionRef={verifySectionRef}
      />
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
