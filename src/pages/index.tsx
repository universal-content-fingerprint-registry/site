import type { ReactNode } from "react";
import clsx from "clsx";
import Link from "@docusaurus/Link";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import Layout from "@theme/Layout";
import Heading from "@theme/Heading";

import styles from "./index.module.css";

function HomepageHeader() {
  return (
    <header className={clsx("hero hero--primary", styles.heroBanner)}>
      <div className="container">
        <Heading as="h1" className={clsx("hero__title", styles.heroTitle)}>
          Universal Content Fingerprinting Registry (UCFR)
        </Heading>
        <p className={clsx("hero__subtitle", styles.heroSubtitle)}>
          A comprehensive, privacy‑first way for creators to establish
          verifiable authorship with cryptographic fingerprints and an on‑chain
          registry, while transparently declaring AI involvement.
        </p>
        <div className={styles.buttons}>
          <Link
            className="button button--secondary button--lg"
            to="/docs/intro"
          >
            Read the docs
          </Link>
          <Link className="button button--secondary button--lg" to="#learn">
            Learn more
          </Link>
        </div>
      </div>
    </header>
  );
}

function WhyUCFR() {
  return (
    <section id="about" className={clsx("container", styles.twoCol)}>
      <div>
        <Heading as="h2">Why UCFR?</Heading>
        <ul className={styles.bullets}>
          <li>
            <strong>Simplified model:</strong> Three core structs — Claim,
            ExternalID, Method.
          </li>
          <li>
            <strong>Neutral core:</strong> No policy thresholds on‑chain;
            applications apply their own logic.
          </li>
          <li>
            <strong>Future‑proof:</strong> Methods are islands; new methods add
            new IDs without migrations.
          </li>
          <li>
            <strong>Open‑source first:</strong> Built on widely available,
            community‑verified methods; vendor‑neutral.
          </li>
          <li>
            <strong>Composable:</strong> Works with C2PA and W3C VCs; on‑chain
            metadata uses canonical JSON (RFC 8785).
          </li>
        </ul>
      </div>
      <div>
        <Heading as="h2">Who is involved?</Heading>
        <div className={styles.logoGrid}>
          <div className={styles.logoPlaceholder}>NIST</div>
          <div className={styles.logoPlaceholder}>ISO</div>
          <div className={styles.logoPlaceholder}>OpenAI</div>
          <div className={styles.logoPlaceholder}>Meta</div>
          <div className={styles.logoPlaceholder}>Google</div>
          <div className={styles.logoPlaceholder}>Microsoft</div>
          <div className={styles.logoPlaceholder}>OpenCV</div>
          <div className={styles.logoPlaceholder}>Shazam</div>
        </div>
        <p className={styles.small}>
          Logos shown for context; UCFR is a neutral public good and not
          affiliated with these organizations.
        </p>
      </div>
    </section>
  );
}

function DataStructures() {
  return (
    <section id="data" className={clsx("container", styles.threeCol)}>
      <div className={styles.card}>
        <Heading as="h3">Claim</Heading>
        <ul className={styles.bullets}>
          <li>fingerprint: bytes</li>
          <li>methodId: uint16</li>
          <li>externalId: uint16 (optional)</li>
          <li>externalSig / pubKey: bytes (optional)</li>
          <li>metadata / extURI: string (optional)</li>
          <li>owner, timestamp</li>
        </ul>
        <p className={styles.small}>
          Keyed by digest of (fingerprint, methodId, extId). Immutable once
          written.
        </p>
      </div>
      <div className={styles.card}>
        <Heading as="h3">ExternalID</Heading>
        <ul className={styles.bullets}>
          <li>extId: uint16</li>
          <li>specURI: string</li>
          <li>sigSizeHint: uint32 (0 = variable)</li>
          <li>isSymmetric: bool</li>
          <li>active: bool</li>
        </ul>
        <p className={styles.small}>
          Signature/MAC schemes (e.g., RSA‑PSS, ECDSA, Ed25519, HMAC).
        </p>
      </div>
      <div className={styles.card}>
        <Heading as="h3">Method</Heading>
        <ul className={styles.bullets}>
          <li>methodId: uint16</li>
          <li>name: string</li>
          <li>specURI: string</li>
          <li>fpSizeBytes: uint32</li>
          <li>active: bool</li>
        </ul>
        <p className={styles.small}>
          Hashing algorithms (e.g., SHA‑256, BLAKE3, PDQ).
        </p>
      </div>
    </section>
  );
}

function Components() {
  return (
    <section id="how" className={clsx("container", styles.threeCol)}>
      <div className={styles.card}>
        <Heading as="h3">Desktop Application</Heading>
        <p>
          Real‑time folder monitoring, automatic hash generation and signing,
          metadata with AI declarations, and a simple UI that hides blockchain
          complexity.
        </p>
      </div>
      <div className={styles.card}>
        <Heading as="h3">GeneralizedClaimRegistry</Heading>
        <p>
          On‑chain registry for cryptographic claims with multiple hashing
          methods, optional external signatures/MACs, immutable storage, and
          batch submission.
        </p>
      </div>
      <div className={styles.card}>
        <Heading as="h3">Blockchain Infrastructure</Heading>
        <p>
          Built on the Stability network with ZKT support for streamlined
          transactions and public, immutable verification.
        </p>
      </div>
    </section>
  );
}

function Workflow() {
  return (
    <div>
      <Heading as="h2">Workflow</Heading>
      <div className={styles.card}>
        <ol className={styles.bullets}>
          <li>Configure defaults and select folders to monitor.</li>
          <li>
            App detects new files and computes fingerprints (SHA‑256 by
            default).
          </li>
          <li>Checks the registry for existing claims.</li>
          <li>New files are signed and submitted on‑chain.</li>
          <li>Existing claims are compared; mismatches prompt review.</li>
          <li>
            Visual status keeps track of verification and submission state.
          </li>
        </ol>
      </div>
    </div>
  );
}

function WhatMakesDifferent() {
  return (
    <div id="learn">
      <Heading as="h2">What makes UCFR different?</Heading>
      <div className={styles.card}>
        <ul className={styles.bullets}>
          <li>
            <strong>Hijack‑resistant:</strong> Perceptual hashes can't claim
            ownership; only exact digests can.
          </li>
          <li>
            <strong>Simple and stable:</strong> Compact on‑chain core; simple to
            integrate.
          </li>
          <li>
            <strong>Interoperable:</strong> Designed to snap into C2PA, VC 2.0,
            and common fingerprint libraries.
          </li>
        </ul>
      </div>
    </div>
  );
}

function MethodExamples() {
  return (
    <section id="compatibility" className="container">
      <Heading as="h2">Method examples by media type</Heading>
      <div className={styles.twoCol}>
        <div className={styles.card}>
          <Heading as="h3">Image</Heading>
          <ul className={styles.bullets}>
            <li>
              PDQ, pHash, aHash, dHash, OpenCV BlockMeanHash, ColorMomentHash
            </li>
          </ul>
          <Heading as="h3">Audio</Heading>
          <ul className={styles.bullets}>
            <li>Chromaprint/AcoustID, Shazam‑style, audfprint</li>
          </ul>
          <Heading as="h3">Video</Heading>
          <ul className={styles.bullets}>
            <li>TMK+PDQF, vPDQ, OpenCV frame hashes</li>
          </ul>
        </div>
        <div className={styles.card}>
          <Heading as="h3">File/Generic</Heading>
          <ul className={styles.bullets}>
            <li>SHA‑256, SHA3‑256, BLAKE3</li>
          </ul>
          <Heading as="h3">Text</Heading>
          <ul className={styles.bullets}>
            <li>MinHash, SimHash, Winnowing</li>
          </ul>
          <Heading as="h3">Device/Camera</Heading>
          <ul className={styles.bullets}>
            <li>PRNU, Noiseprint</li>
          </ul>
        </div>
      </div>
      <p className={styles.small}>
        These are open‑source friendly examples; UCFR remains extensible without
        migrations (island model).
      </p>
    </section>
  );
}

function SecurityPrivacy() {
  return (
    <section id="security" className={clsx("container", styles.twoCol)}>
      <div>
        <Heading as="h2">Security & Privacy</Heading>
        <ul className={styles.bullets}>
          <li>
            <strong>Local key storage:</strong> Private keys are generated,
            encrypted, and stored locally. They never leave your device.
          </li>
          <li>
            <strong>Transparent AI declarations:</strong> Per‑file metadata can
            declare AI involvement for downstream transparency.
          </li>
          <li>
            <strong>Decentralized verification:</strong> Anyone can verify
            claims on‑chain without trusting a central authority.
          </li>
          <li>
            <strong>Optional crash reporting:</strong> Privacy‑preserving
            diagnostics with no keys or sensitive contents.
          </li>
        </ul>
      </div>
      <div className={styles.card}>
        <Heading as="h3">Immutable by design</Heading>
        <p>
          Claims are append‑only and cannot be altered or deleted, providing
          durable provenance records.
        </p>
      </div>
    </section>
  );
}

export default function Home(): ReactNode {
  const { siteConfig } = useDocusaurusContext();
  return (
    <Layout
      title={`UCFR — ${siteConfig.title}`}
      description="A comprehensive, privacy‑first way for creators to establish verifiable authorship with cryptographic fingerprints and an on‑chain registry, while transparently declaring AI involvement."
    >
      <HomepageHeader />
      <main>
        <WhyUCFR />
        <DataStructures />
        <Components />
        <section className={clsx("container", styles.twoCol)}>
          <Workflow />
          <WhatMakesDifferent />
        </section>
        <MethodExamples />
        <SecurityPrivacy />
      </main>
    </Layout>
  );
}
