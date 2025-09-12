# Universal Content Fingerprinting Registry (UCFR) Documentation

A comprehensive, privacy-first way for creators to establish verifiable authorship with cryptographic fingerprints and an on-chain registry, while transparently declaring AI involvement.

## About UCFR

UCFR is a system that provides:

- **Simplified model**: Three core structs — Claim, ExternalID, Method
- **Neutral core**: No policy thresholds on-chain; applications apply their own logic
- **Future-proof**: Methods are islands; new methods add new IDs without migrations
- **Open-source first**: Built on widely available, community-verified methods; vendor-neutral
- **Composable**: Works with C2PA and W3C VCs; on-chain metadata uses canonical JSON (RFC 8785)

### Key Features

- **Hijack-resistant**: Perceptual hashes can't claim ownership; only exact digests can
- **Simple and stable**: Compact on-chain core; simple to integrate
- **Interoperable**: Designed to snap into C2PA, VC 2.0, and common fingerprint libraries
- **Privacy-first**: Local key storage with transparent AI declarations

## Development

### Installation

```bash
npm install
```

### Local Development

```bash
npm start
```

This command starts a local development server and opens up a browser window. Most changes are reflected live without having to restart the server.

### Build

```bash
npm run build
```

This command generates static content into the `build` directory and can be served using any static contents hosting service.

### Type Checking

```bash
npm run typecheck
```

### Serve Built Site

```bash
npm run serve
```
