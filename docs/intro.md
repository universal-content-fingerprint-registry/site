---
sidebar_position: 1
---

# Introduction

Welcome to the Universal Content Fingerprinting Registry (UCFR) documentation. The UCFR provides a decentralized system for creators to establish verifiable authorship and authenticity of digital content using cryptographic fingerprints and blockchain technology.

## Motivation

In the digital age, establishing authentic ownership and timestamping of content is increasingly challenging. Traditional methods rely on centralized authorities that can be compromised, censored, or become unavailable. The UCFR addresses these challenges by providing:

- **Immutable Records**: Claims cannot be altered once created, providing permanent proof on the blockchain
- **Decentralized Verification**: No single point of failure or control, ensuring censorship-resistant records
- **Cryptographic Integrity**: Content verification through cryptographic fingerprints without revealing the actual content
- **Global Accessibility**: Open system accessible to anyone, anywhere, without intermediaries
- **Flexible Authentication**: Support for multiple cryptographic methods and optional external signatures

Whether you're a researcher timestamping academic work, an artist protecting creative content, or a business establishing document authenticity, the UCFR provides the foundation for trustworthy content verification.

## Core Concepts

### Claims
A **claim** is an immutable record that associates a digital fingerprint with metadata, ownership information, and optional cryptographic signatures. Claims provide verifiable proof of when and by whom they were made.

### Fingerprints
**Fingerprints** are cryptographic hashes (like SHA-256) that serve as unique identifiers for digital content. They verify integrity and authenticity without revealing the content itself.

### Methods
**Methods** define the cryptographic algorithms used to generate fingerprints (e.g., SHA-256, MD5, SHA-512). Each method has a unique ID and specifies the expected fingerprint size.

### External IDs
**External IDs** represent additional verification mechanisms like digital signatures (RSA, ECDSA) or message authentication codes (HMAC), providing extra authenticity beyond basic fingerprints.

### Contract Architecture
The `GeneralizedClaimRegistry` smart contract provides:
- **Method Registration**: Define cryptographic hash functions
- **External ID Management**: Configure signature schemes  
- **Claim Creation**: Record fingerprints with metadata
- **Batch Operations**: Efficient multi-claim processing
- **Admin Controls**: Governance with optional permanent locking

## Getting Started

### 1. Deploy Contract
Deploy the `GeneralizedClaimRegistry.sol` smart contract to your preferred blockchain network.

### 2. Register Methods
As admin, register the cryptographic methods you'll use:
```solidity
registerMethod(1, "SHA-256", "https://tools.ietf.org/html/rfc6234", 32);
```

### 3. Create Claims
Users can create claims for their content:
```solidity
claimById(1, 0, contentHash, "My Document", "https://example.com/doc");
```

### 4. Retrieve Claims
Anyone can verify existing claims:
```solidity
Claim memory claim = getClaimById(1, contentHash);
```

### Use Cases
- **Document Timestamping**: Create immutable timestamps for any document
- **Signed Content Verification**: Combine content hashes with external signatures
- **Batch Content Registration**: Efficiently register multiple pieces of content
- **Integrity Verification**: Verify content hasn't been tampered with

### Next Steps
1. **Read the detailed usage guide**: See the complete API documentation
2. **Explore the contract**: Review the smart contract implementation
3. **Deploy and test**: Start with a local deployment to understand contract behavior

The UCFR provides a powerful foundation for building content verification systems, timestamping services, and authenticity tracking applications on the blockchain.
