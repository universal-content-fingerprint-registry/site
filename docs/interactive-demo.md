---
sidebar_position: 3
---

# Interactive Demo

This interactive demo shows how the Universal Content Fingerprinting Registry is an open-source framework to establish verifiable authorship and authenticity of digital content using cryptographic fingerprints and a free place of record (registry) utilizing blockchain technology.

_Note: This demo showcases text content, but the framework is applicable to all types of content, such as audio, video, images, etc._

## Live Demo

import DemoLoader from '@site/src/components/DemoLoader';

<DemoLoader />

## Demo Features

- **Hash Content**: Generate SHA-256 hashes for text content using pre-registered method ID 0
- **Create Claims**: Submit content fingerprints to the registry
- **Verify Claims**: Check existing claims and associated data
- **Method Status**: View the pre-registered SHA-256 method details

## Network Details

The demo uses Stability Protocol's Global Trust Network, which allows free transactions. The `GeneralizedClaimRegistry` contract is deployed at:

**Contract Address**: `0xEff0AFc2C6E289846F7939c4d6291c4E5E75E030`
