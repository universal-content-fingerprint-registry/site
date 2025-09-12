---
sidebar_position: 2
---

# How to Use

This guide explains how to interact with the GeneralizedClaimRegistry smart contract to create and manage content fingerprint claims.

## Contract Deployment

Deploy the contract using your preferred method:

```javascript
// Using ethers.js
const GeneralizedClaimRegistry = await ethers.getContractFactory("GeneralizedClaimRegistry");
const registry = await GeneralizedClaimRegistry.deploy();
await registry.waitForDeployment();
console.log("Registry deployed to:", await registry.getAddress());
```

## Setting Up Methods and External IDs

Before creating claims, an admin must register the cryptographic methods and external signature types:

### Register Cryptographic Methods

```javascript
// Connect to the deployed contract
const registry = await ethers.getContractAt("GeneralizedClaimRegistry", registryAddress);

// Register SHA-256 method
await registry.registerMethod(
    1,                                              // Method ID
    "SHA-256",                                      // Method name
    "https://tools.ietf.org/html/rfc6234",        // Specification URI
    32                                              // Fingerprint size in bytes
);

// Register MD5 method
await registry.registerMethod(2, "MD5", "https://tools.ietf.org/html/rfc1321", 16);
```

### Register External Signature Methods

```javascript
// Register RSA-2048 signature method
await registry.registerExternalID(
    1,                                              // External ID
    "https://tools.ietf.org/html/rfc8017",        // Specification URI
    256                                             // Signature size hint (0 = variable)
);

// Register ECDSA signature method
await registry.registerExternalID(2, "https://tools.ietf.org/html/rfc6979", 64);
```

## Creating Claims

### Simple Claim (without external signature)

```javascript
const fingerprint = "0x1234567890abcdef..."; // Your content fingerprint
const methodId = 1;     // SHA-256
const externalId = 0;   // No external signature
const metadata = "My document claim";
const extURI = "https://mydomain.com/document";

await registry.claimById(methodId, externalId, fingerprint, metadata, extURI);
```

### Claim with External Signature

```javascript
const fingerprint = "0x1234567890abcdef...";
const methodId = 1;           // SHA-256
const externalId = 1;         // RSA-2048
const externalSig = "0x...";  // RSA signature
const pubKey = "0x...";       // RSA public key
const metadata = "Signed document claim";
const extURI = "https://mydomain.com/document";

await registry.claimByIdwithExternalSig(
    methodId, externalId, fingerprint, externalSig, pubKey, metadata, extURI
);
```

### Batch Claims

For efficiency when creating multiple claims:

```javascript
// Create multiple claims at once
const fingerprints = ["0x123...", "0x456...", "0x789..."];
const metadatas = ["Doc 1", "Doc 2", "Doc 3"];
const extURIs = ["https://example.com/1", "https://example.com/2", "https://example.com/3"];

await registry.batchClaimById(methodId, externalId, fingerprints, metadatas, extURIs);
```

## Retrieving and Verifying Claims

### Basic Claim Retrieval

```javascript
// Get a specific claim
const claim = await registry.getClaimById(methodId, fingerprint);
console.log("Claim owner:", claim.owner);
console.log("Timestamp:", claim.timestamp);
console.log("Metadata:", claim.metadata);
```

### Advanced Claim Queries

```javascript
// Get claim with external ID
const claimWithExtId = await registry.getClaimByIdWithExtId(methodId, fingerprint, externalId);

// Get only metadata
const metadata = await registry.getMetadataById(methodId, fingerprint, externalId);
```

## Common Usage Patterns

### Document Timestamping

Perfect for creating immutable timestamps for any document:

```javascript
// Set up SHA-256 method
await registry.registerMethod(1, "SHA-256", "https://tools.ietf.org/html/rfc6234", 32);

// Create a claim for a document
const documentHash = ethers.keccak256(ethers.toUtf8Bytes(documentContent));
await registry.claimById(1, 0, documentHash, "Important Document", "https://example.com/doc");
```

### Signed Content Verification

Combine content hashes with external signatures for stronger authenticity:

```javascript
// Set up methods and external signatures
await registry.registerMethod(1, "SHA-256", "", 32);
await registry.registerExternalID(1, "RSA-2048", "", 256);

// Create a claim with RSA signature
await registry.claimByIdwithExternalSig(
    1, 1, contentHash, rsaSignature, publicKey, "Signed Content", "https://example.com"
);
```

## Admin Management

### Transferring Admin Rights

```javascript
// Transfer admin to another address (only current admin)
await registry.transferAdmin(newAdminAddress);

// Lock admin functions permanently (irreversible!)
await registry.lockAdmin();
```

### Managing Method Status

```javascript
// Temporarily disable a method
await registry.setMethodActive(methodId, false);

// Re-enable it
await registry.setMethodActive(methodId, true);

// Same for external IDs
await registry.setExternalIDActive(externalId, false);
```

## Best Practices

### Fingerprint Generation

Ensure consistent fingerprint generation:

```javascript
// For text content
const fingerprint = ethers.keccak256(ethers.toUtf8Bytes(content));

// For binary data
const fingerprint = ethers.keccak256(binaryData);
```

### Gas Optimization

- Use batch operations for multiple claims to save gas costs
- Estimate gas before submitting transactions
- Consider the trade-off between on-chain storage and gas costs

### Security Considerations

- Verify method and external ID configurations before creating claims
- Store private keys securely for external signatures
- Consider the permanence of claims before submission

## Troubleshooting

### Common Errors

**"method inactive" error**: The method ID hasn't been registered or has been deactivated.
```javascript
// Check method status
const method = await registry.methods(methodId);
console.log("Active:", method.active);
```

**"claim exists" error**: A claim with the same fingerprint and method already exists.
```javascript
// Check if claim exists
const existingClaim = await registry.getClaimById(methodId, fingerprint);
console.log("Existing owner:", existingClaim.owner);
```

**"auth" error**: You're not the admin or admin functions are locked.
```javascript
// Check admin status
const admin = await registry.admin();
const adminLocked = await registry.adminLocked();
console.log("Admin:", admin, "Locked:", adminLocked);
```

### Gas Estimation

```javascript
// Estimate gas before submitting
const gasEstimate = await registry.claimById.estimateGas(
    methodId, externalId, fingerprint, metadata, extURI
);
console.log("Estimated gas:", gasEstimate.toString());
```

## Next Steps

- Explore the [smart contract repository](https://github.com/universal-content-fingerprint-registry/core) for implementation details
- Review the contract source code to understand the full functionality
- Test with a local blockchain before deploying to mainnet
- Consider integrating with existing content management systems