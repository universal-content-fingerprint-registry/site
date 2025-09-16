---
sidebar_position: 3
---

# Content Hashing

This section demonstrates how to properly hash different types of content and interact with the smart contract to create verifiable claims.

## Hashing Different Content Types

### Text Documents

```javascript
import { createHash } from "crypto";

const textContent = "This is my important document content";

// Method 1: Using Node.js crypto (SHA-256) - most common for registry
const sha256Hash = createHash("sha256").update(textContent, "utf8").digest("hex");
const sha256Hex = "0x" + sha256Hash;
console.log("SHA-256 hash:", sha256Hex);

// Method 2: Using Node.js crypto (SHA-1) - if needed
const sha1Hash = createHash("sha1").update(textContent, "utf8").digest("hex");
const sha1Hex = "0x" + sha1Hash;
console.log("SHA-1 hash:", sha1Hex);

// Method 3: Using Node.js crypto (MD5) - for legacy compatibility
const md5Hash = createHash("md5").update(textContent, "utf8").digest("hex");
const md5Hex = "0x" + md5Hash;
console.log("MD5 hash:", md5Hex);
```

### Files (Binary Data)

```javascript
import fs from "fs";
import { createHash } from "crypto";

// Hash a file
const fileBuffer = fs.readFileSync("./document.pdf");

// Using SHA-256 (most common)
const fileHashSha256 = createHash("sha256").update(fileBuffer).digest("hex");
const fileHashSha256Hex = "0x" + fileHashSha256;

// Using SHA-1
const fileHashSha1 = createHash("sha1").update(fileBuffer).digest("hex");
const fileHashSha1Hex = "0x" + fileHashSha1;

// Using MD5 (for legacy compatibility)
const fileHashMd5 = createHash("md5").update(fileBuffer).digest("hex");
const fileHashMd5Hex = "0x" + fileHashMd5;

console.log("File SHA-256:", fileHashSha256Hex);
console.log("File SHA-1:", fileHashSha1Hex);
console.log("File MD5:", fileHashMd5Hex);
```

### JSON Data

```javascript
import { createHash } from "crypto";

// Hash structured data consistently
const jsonData = {
  title: "My Document",
  author: "John Doe",
  version: 1,
  content: "Document content here",
};

// Stringify with sorted keys for consistency
const canonicalJson = JSON.stringify(jsonData, Object.keys(jsonData).sort());

// Using SHA-256 (recommended)
const jsonHashSha256 = createHash("sha256").update(canonicalJson, "utf8").digest("hex");
const jsonHashSha256Hex = "0x" + jsonHashSha256;
console.log("JSON SHA-256 hash:", jsonHashSha256Hex);

// Using SHA-1 if needed
const jsonHashSha1 = createHash("sha1").update(canonicalJson, "utf8").digest("hex");
const jsonHashSha1Hex = "0x" + jsonHashSha1;
console.log("JSON SHA-1 hash:", jsonHashSha1Hex);
```

## Complete Interaction Example

Here's a full example showing the entire process from content hashing to smart contract interaction:

```javascript
import { ethers } from "ethers";
import { createHash } from "crypto";
import ClaimRegistryABI from "./GeneralizaedClaimRegistryABI.json";

// Setup wallet and provider
const privateKey =
  process.env.PRIVATE_KEY || ethers.Wallet.createRandom().privateKey;
const provider = new ethers.JsonRpcProvider(
  "https://rpc.stabilityprotocol.com/zgt/try-it-out"
);
const wallet = new ethers.Wallet(privateKey, provider);

// Contract address (replace with actual deployed address)
const registryAddress = "0x1234567890123456789012345678901234567890";
const registry = new ethers.Contract(
  registryAddress,
  ClaimRegistryABI.abi,
  wallet
);

async function createDocumentClaim() {
  try {
    // Step 1: Prepare your content
    const documentContent = `
      IMPORTANT RESEARCH FINDINGS
      Date: ${new Date().toISOString()}
      Author: Dr. Jane Smith
      
      This document contains groundbreaking research...
    `;

    // Step 2: Generate fingerprint using SHA-256
    const fingerprint = "0x" + createHash("sha256").update(documentContent, "utf8").digest("hex");

    console.log("Document fingerprint:", fingerprint);
    console.log(
      "Fingerprint length:",
      fingerprint.length - 2,
      "characters (",
      (fingerprint.length - 2) / 2,
      "bytes)"
    );

    // Step 3: Prepare claim data
    const methodId = 1; // SHA-256 method (must be registered first)
    const externalId = 0; // No external signature
    const metadata = "Research Document - Confidential";
    const extURI = "https://university.edu/research/doc-123";

    // Step 4: Check if method is registered and active
    try {
      const method = await registry.methods(methodId);
      console.log("Method details:", {
        name: method.name,
        active: method.active,
        fingerprintSize: method.fingerprintSize.toString(),
      });

      if (!method.active) {
        throw new Error("Method is not active");
      }
    } catch (error) {
      console.log("Method not found, registering SHA-256...");

      // Register SHA-256 method (admin only)
      const tx = await registry.registerMethod(
        1,
        "SHA-256",
        "https://tools.ietf.org/html/rfc6234",
        32
      );
      await tx.wait();
      console.log("SHA-256 method registered");
    }

    // Step 5: Check if claim already exists
    try {
      const existingClaim = await registry.getClaimById(methodId, fingerprint);
      if (existingClaim.owner !== ethers.ZeroAddress) {
        console.log("Claim already exists:", {
          owner: existingClaim.owner,
          timestamp: new Date(
            Number(existingClaim.timestamp) * 1000
          ).toISOString(),
          metadata: existingClaim.metadata,
        });
        return;
      }
    } catch (error) {
      // Claim doesn't exist, we can proceed
      console.log("No existing claim found, proceeding...");
    }

    // Step 6: Estimate gas cost
    const gasEstimate = await registry.claimById.estimateGas(
      methodId,
      externalId,
      fingerprint,
      metadata,
      extURI
    );
    console.log("Estimated gas:", gasEstimate.toString());

    // Step 7: Create the claim
    console.log("Creating claim...");
    const tx = await registry.claimById(
      methodId,
      externalId,
      fingerprint,
      metadata,
      extURI,
      {
        gasLimit: (gasEstimate * BigInt(120)) / BigInt(100), // Add 20% buffer
      }
    );

    console.log("Transaction hash:", tx.hash);

    // Step 8: Wait for confirmation
    const receipt = await tx.wait();
    console.log("Transaction confirmed in block:", receipt.blockNumber);

    // Step 9: Verify the claim was created
    const claim = await registry.getClaimById(methodId, fingerprint);
    console.log("Claim created successfully:", {
      owner: claim.owner,
      timestamp: new Date(Number(claim.timestamp) * 1000).toISOString(),
      metadata: claim.metadata,
      extURI: claim.extURI,
      blockNumber: receipt.blockNumber,
    });

    return {
      fingerprint,
      transactionHash: tx.hash,
      blockNumber: receipt.blockNumber,
      claim,
    };
  } catch (error) {
    console.error("Error creating claim:", error);
    throw error;
  }
}

// Execute the example
createDocumentClaim()
  .then((result) => {
    console.log("Success! Claim details:", result);
  })
  .catch((error) => {
    console.error("Failed to create claim:", error.message);
  });
```

## Verification Example

```javascript
async function verifyClaim(fingerprint, expectedOwner) {
  try {
    const methodId = 1; // SHA-256
    const claim = await registry.getClaimById(methodId, fingerprint);

    const verification = {
      exists: claim.owner !== ethers.ZeroAddress,
      owner: claim.owner,
      isCorrectOwner: claim.owner.toLowerCase() === expectedOwner.toLowerCase(),
      timestamp: new Date(Number(claim.timestamp) * 1000),
      metadata: claim.metadata,
      extURI: claim.extURI,
    };

    console.log("Claim verification:", verification);
    return verification;
  } catch (error) {
    console.error("Verification failed:", error);
    return { exists: false, error: error.message };
  }
}

// Usage
const myFingerprint = "0x1234..."; // Your document hash
const myAddress = wallet.address;
verifyClaim(myFingerprint, myAddress);
```

## Best Practices for Hashing

### Consistent Fingerprint Generation

Always use the same method and encoding when generating fingerprints:

```javascript
import { createHash } from "crypto";

// Good: Consistent approach using SHA-256
const content = "My document content";
const fingerprint = "0x" + createHash("sha256").update(content, "utf8").digest("hex");

// Bad: Inconsistent encoding could lead to different hashes
const badFingerprint1 = "0x" + createHash("sha256").update(content, "ascii").digest("hex");
const badFingerprint2 = "0x" + createHash("sha256").update(content, "utf16le").digest("hex");
```

### Handle File Types Appropriately

```javascript
import fs from "fs";
import { createHash } from "crypto";

// For text files - ensure consistent encoding
const textContent = fs.readFileSync("document.txt", "utf8");
const textHash = "0x" + createHash("sha256").update(textContent, "utf8").digest("hex");

// For binary files - read as buffer
const binaryContent = fs.readFileSync("image.jpg");
const binaryHash = "0x" + createHash("sha256").update(binaryContent).digest("hex");
```

### Normalize Data Before Hashing

```javascript
import { createHash } from "crypto";

// For JSON data, sort keys and remove whitespace
const data = { b: 2, a: 1, c: 3 };
const normalized = JSON.stringify(data, Object.keys(data).sort());
const hash = "0x" + createHash("sha256").update(normalized, "utf8").digest("hex");

// For text, consider normalizing whitespace
const text = "  Multiple   spaces   ";
const normalizedText = text.trim().replace(/\s+/g, " ");
const textHash = "0x" + createHash("sha256").update(normalizedText, "utf8").digest("hex");
```

## Error Handling and Recovery

### Common Scenarios

```javascript
async function robustClaimCreation(content, metadata, extURI) {
  try {
    // Generate fingerprint using SHA-256
    const fingerprint = "0x" + createHash("sha256").update(content, "utf8").digest("hex");

    // Check if claim exists first
    const existingClaim = await registry.getClaimById(1, fingerprint);
    if (existingClaim.owner !== ethers.ZeroAddress) {
      return {
        success: false,
        reason: "CLAIM_EXISTS",
        existingOwner: existingClaim.owner,
        timestamp: existingClaim.timestamp,
      };
    }

    // Create claim with retry logic
    let retries = 3;
    while (retries > 0) {
      try {
        const tx = await registry.claimById(
          1,
          0,
          fingerprint,
          metadata,
          extURI
        );
        const receipt = await tx.wait();

        return {
          success: true,
          fingerprint,
          transactionHash: tx.hash,
          blockNumber: receipt.blockNumber,
        };
      } catch (error) {
        retries--;
        if (error.code === "INSUFFICIENT_FUNDS") {
          throw new Error("Insufficient funds for transaction");
        }
        if (retries === 0) throw error;

        // Wait before retry
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }
    }
  } catch (error) {
    return {
      success: false,
      reason: "ERROR",
      message: error.message,
    };
  }
}
```

This comprehensive guide covers the essential aspects of content hashing and smart contract interaction, providing practical examples and best practices for working with the Universal Content Fingerprinting Registry.
