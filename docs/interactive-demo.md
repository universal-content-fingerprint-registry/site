---
sidebar_position: 3
---

# Interactive Demo

This interactive demo shows how to use WAGMI and Viem to interact with the Universal Content Fingerprinting Registry smart contract deployed on Stability Protocol's Zero Gas Token network. The demo uses a deterministic wallet that's always the same for consistency.

## Live Demo

import DemoLoader from '@site/src/components/DemoLoader';

<DemoLoader />

## Demo Features

- **Deterministic Wallet**: Uses the same demo wallet every time for consistency
- **Hash Content**: Generate SHA-256 hashes for text content using pre-registered method ID 0
- **Create Claims**: Submit content fingerprints to the smart contract
- **Verify Claims**: Check existing claims and their creator
- **Method Status**: View the pre-registered SHA-256 method details

## Code Examples

The demo implements the patterns shown in the [Hashing Guide](how-to-use/hashing.md) and [Smart Contract Guide](how-to-use/smart-contract.md) using modern React hooks and WAGMI.

## Try It Yourself

1. **Enter some text content** in the demo above to generate a SHA-256 fingerprint
2. **View the generated hash** - using the pre-registered SHA-256 method (ID: 0)
3. **Create a claim** to register your content on the blockchain using the demo wallet
4. **Verify the claim** by entering a fingerprint to check the creator
5. **Experiment** with different content to see how fingerprints change

The demo wallet is automatically connected and funded for testing purposes. The SHA-256 method is pre-registered and ready to use.

## Network Details

The demo uses Stability Protocol's Global Trust Network, which allows free transactions for testing purposes. The smart contract is deployed at:

**Contract Address**: `0xEff0AFc2C6E289846F7939c4d6291c4E5E75E030`
