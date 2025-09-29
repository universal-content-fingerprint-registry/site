---
sidebar_position: 1
---

# Introduction

Welcome to the Universal Content Fingerprinting Registry (UCFR) documentation. The UCFR provides an open-source framework for creators to establish verifiable authorship and authenticity of digital content using cryptographic fingerprints, signatures, and a free place of record (registry) utilizing blockchain technology.

## Motivation

In the digital age, establishing authentic ownership and time stamping of content is increasingly challenging. Traditional methods rely on centralized authorities that can be compromised, censored, or become unavailable. The UCFR addresses these challenges by providing:

- **Immutable Records**: A record cannot be altered once created, providing permanent proof on the blockchain
- **Decentralized Verification**: No single point of failure or control, ensuring censorship-resistant records
- **Cryptographic Integrity**: Content verification through cryptographic fingerprints
- **Global Accessibility**: Open system accessible to anyone, anywhere, without intermediaries
- **Flexible Authentication**: Support for multiple cryptographic methods and optional external signatures

Whether you're a researcher time stamping academic work, an artist protecting creative content, or a business establishing document authenticity or protection from AI, the UCFR provides the foundation for trustworthy content verification.

## Core Concepts

### Claims

A claim is an immutable record that associates a digital fingerprint with metadata, ownership information, and optional cryptographic signatures. Claims provide verifiable proof of when and by whom they were made.

### Fingerprints

Fingerprints are cryptographic hashes (like SHA-256) that serve as unique identifiers for digital content. They may verify integrity and authenticity without revealing the content itself.

### Methods

Methods define the cryptographic algorithms used to generate fingerprints (e.g., SHA-256, MD5, SHA-512). Each method has a unique ID and specifies the expected fingerprint size.

### External IDs

External IDs represent additional verification mechanisms like digital signatures (RSA, ECDSA) or message authentication codes (HMAC), providing external authenticity beyond basic fingerprints.

## Framework Architecture

The GeneralizedClaimRegistry provides:

- **Method Registration**: Define cryptographic hash functions
- **External ID Management**: Configure signature schemes
- **Claim Creation**: Record fingerprints with metadata
- **Batch Operations**: Efficient multi-claim processing
- **Admin Controls**: Method ID and External ID deprecation

## Getting Started

1. **Register Methods**

Register the cryptographic methods you'll use if not yet created (by admin):

```solidity
registerMethod(1, "SHA-256", "https://tools.ietf.org/html/rfc6234", 32);
```

2. **Create Claims**

Users can create claims for their content:

```solidity
// using struct-based claim
claim({
  methodId: 0,
  externalId: 0,
  fingerprint: contentHash,
  externalSig: "0x",
  pubKey: "0x",
  metadata: "My Document",
  extURI: "https://example.com/doc",
});
```

3. **Retrieve Claims**

Anyone can verify existing claims:

```solidity
getClaimById(1, contentHash);
```

## Use Cases

- **Document Time stamping**: Create immutable timestamps for any document
- **Signed Content Verification**: Combine content hashes with external signatures
- **Batch Content Registration**: Efficiently register multiple pieces of content
- **Integrity Verification**: Verify content hasn't been tampered with

## Next Steps

1. **Read the detailed usage guide**: See the complete API documentation
2. **Explore live deployments**: Review registered Methods and External ID’s.
3. **Test**: Start with our interactive demo to understand framework behavior

The UCFR provides a powerful foundation for building content verification systems, timestamp services, and authenticity tracking applications.
