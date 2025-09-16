---
sidebar_position: 2
---

# Concepts

This page explains the core concepts for making claims in the Universal Content Fingerprinting Registry (UCFR) system.

## What is a Claim?

### Claim

- A record that associates a digital fingerprint (hash) of content with metadata, ownership information, and cryptographic signatures
- Claims are immutable once created and provide verifiable proof of when and by whom they were made
- Links a content fingerprint to an owner address with cryptographic proof

## Method ID - How Content is Fingerprinted

### What is a Method ID?

- A 16-bit identifier that specifies which fingerprinting algorithm was used to generate the content fingerprint
- Each method represents a different way to create a unique digital signature of content
- Required for every claim to identify how the fingerprint was created

### Method ID Examples

- **SHA-256 hashing** - standard cryptographic hash
- **Perceptual hashing** - for images/media content
- **Content-specific algorithms** - specialized for certain file types
- **Custom fingerprinting techniques** - project-specific methods

### Why Method ID Matters

- Different content types may require different fingerprinting approaches
- Allows the system to support multiple hashing algorithms simultaneously
- Enables verification that fingerprint was generated correctly
- Future-proofs the system for new fingerprinting techniques

## External ID - How the Creator of the Claim is Proven

### What is an External ID?

- A 16-bit identifier that specifies which authentication method is used to prove ownership of content
- Determines what type of cryptographic signature or proof is required
- Links the claim to external authentication systems

### External ID Examples

- **RSA-2048** - RSA digital signatures with 2048-bit keys
- **ECDSA** - Elliptic Curve Digital Signature Algorithm
- **HMAC** - Hash-based Message Authentication Code
- **Custom schemes** - Project-specific authentication methods

### External ID Components

- **Signature (externalSig)**: Cryptographic proof of ownership
- **Public Key (pubKey)**: For signature verification (empty for HMAC)
- **Authentication Process**: How to verify the claim is legitimate

## How Claims Work Together

### Claim Creation Process

- Choose appropriate **Method ID** for your content type
- Generate fingerprint using the specified method
- Choose appropriate **External ID** for your authentication method
- Create cryptographic signature proving you control the content
- Submit claim with all required components

### Claim Uniqueness

- Each claim is identified by: `keccak256(fingerprint + methodId + externalId)`
- Same content can have multiple claims with different methods or external IDs
- Prevents duplicate claims for identical combinations
- Ensures each unique claim can only be made once

### Verification Process

- **Fingerprint Verification**: Recreate fingerprint using specified method ID
- **Ownership Verification**: Verify signature using specified external ID
- **Timestamp Verification**: Confirm when claim was registered
- **Metadata Access**: View additional information about the content

## Making Claims

### Simple Claims (claimById)

- Basic claim without external signature
- Uses Method ID to specify fingerprinting algorithm
- Suitable for public content registration

### Authenticated Claims (claimByIdwithExternalSig)

- Includes cryptographic signature proving ownership
- Requires both Method ID and External ID
- Provides stronger proof of content control
- Suitable for valuable or sensitive content

### Batch Claims

- Register multiple claims in single transaction
- All claims must use same Method ID and External ID
- More gas-efficient for bulk operations
- Either all claims succeed or all fail together
