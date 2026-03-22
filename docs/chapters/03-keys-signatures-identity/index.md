---
title: Keys, Signatures, and Identity
description: Public-private key pairs, digital signatures, authentication, authorization, identity verification, and privacy in trust technologies.
generated_by: claude skill chapter-content-generator
date: 2026-03-22 11:06:27
version: 0.05
---
# Keys, Signatures, and Identity

## Summary

This chapter explores how asymmetric cryptography enables digital identity through public-private key pairs, digital signatures, and identity verification. Students will understand the mechanics of key pair generation, how digital signatures provide proof of authorship, and how authentication and authorization control access to systems and resources. The chapter also introduces privacy as a foundational concern for trust technologies.

## Concepts Covered

This chapter covers the following 8 concepts from the learning graph:

1. Public Key
2. Private Key
3. Key Pair Generation
4. Digital Signature
5. Authentication
6. Authorization
7. Identity Verification
8. Privacy

## Prerequisites

This chapter builds on concepts from:

- [Chapter 1: Trust and Digital Networks](../01-trust-and-digital-networks/index.md)
- [Chapter 2: Cryptographic Foundations](../02-cryptographic-foundations/index.md)

---

!!! mascot-welcome "Rex Says: Trust, but Verify!"
    <img src="../../img/mascot/welcome.png" class="mascot-admonition-img" alt="Rex welcomes you">
    Welcome back, fellow analysts! We've examined hash functions and encryption —
    the raw materials of digital trust. Now we'll see how they combine to answer
    the most important question in any networked transaction: "Who are you, and
    can you prove it?" Trust, but verify!

## Learning Objectives

After completing this chapter, you will be able to:

- Explain the relationship between public keys and private keys in asymmetric cryptography
- Describe the key pair generation process and why key security matters
- Explain how digital signatures provide authentication, integrity, and non-repudiation simultaneously
- Distinguish between authentication and authorization
- Describe methods of identity verification in digital systems
- Analyze the tension between privacy and transparency in trust architectures

## Public Keys and Private Keys

In Chapter 2, we introduced asymmetric encryption as a system that uses two mathematically related keys. Now we examine each key's role in detail.

A **public key** is the half of a key pair that can be freely distributed. It serves two purposes: others use it to encrypt messages that only the key owner can read, and others use it to verify digital signatures that the key owner has created. The public key is analogous to a mailbox address — anyone can send mail to it, but only the owner can open the box.

A **private key** is the half that must be kept strictly secret. It is used to decrypt messages encrypted with the corresponding public key and to create digital signatures. The security of the entire system depends on the private key remaining confidential. If an attacker obtains your private key, they can impersonate you, read your encrypted messages, and forge your digital signature.

The mathematical relationship between the two keys is constructed so that:

- Computing the public key from the private key is trivial
- Computing the private key from the public key is computationally infeasible
- Data encrypted with one key can only be decrypted with the other

This one-way relationship is typically based on mathematical problems that are easy to perform in one direction but extremely difficult to reverse, such as the factoring of large prime numbers (RSA) or elliptic curve discrete logarithms (ECDSA — the algorithm used by Bitcoin and Ethereum).

| Operation | Key Used | Purpose |
|-----------|----------|---------|
| Encrypt a message | Recipient's public key | Confidentiality — only recipient can read it |
| Decrypt a message | Recipient's private key | Access the original plaintext |
| Create a signature | Signer's private key | Prove authorship and integrity |
| Verify a signature | Signer's public key | Confirm the signature is authentic |

## Key Pair Generation

**Key pair generation** is the process of creating a mathematically linked public-private key pair. The security of every subsequent operation — encryption, signing, verification — depends on this generation process being performed correctly.

The generation process typically involves:

1. **Random number generation** — a cryptographically secure random number generator produces the initial seed
2. **Mathematical computation** — the algorithm (RSA, ECDSA, EdDSA) uses the random seed to compute the private key and derive the corresponding public key
3. **Key storage** — the private key is stored securely (ideally in a hardware security module or encrypted keystore), while the public key is published or shared

!!! mascot-warning "Bias Alert"
    <img src="../../img/mascot/warning.png" class="mascot-admonition-img" alt="Rex warns you">
    The most common key compromise comes not from mathematical weakness but from
    operational failure — weak random number generators, private keys stored in
    plaintext, keys shared via email, or backup copies left on unsecured systems.
    When evaluating trust architectures, always ask: "How are the keys managed?"
    The math is usually fine. The humans are the vulnerability.

Key length directly affects security. Longer keys provide more security but require more computation. Current recommendations from NIST (2024) suggest:

- **RSA**: minimum 2048 bits, 3072+ bits recommended
- **ECDSA**: minimum 256 bits (equivalent to RSA 3072)
- **EdDSA**: 256 bits (Ed25519, increasingly preferred for new systems)

## Digital Signatures: Proof of Authorship

A **digital signature** is the cryptographic equivalent of a handwritten signature — but significantly more secure. It provides three guarantees simultaneously:

- **Authentication** — the signature proves who created it (only the private key holder could have produced it)
- **Integrity** — the signature proves the signed data hasn't been modified (any change invalidates the signature)
- **Non-repudiation** — the signer cannot later deny having signed (the signature is mathematically bound to their private key)

The digital signature process works in two steps:

**Signing:**

1. The signer hashes the document using a cryptographic hash function (e.g., SHA-256), producing a fixed-size digest
2. The signer encrypts the digest with their private key, producing the digital signature
3. The signature is attached to or sent alongside the original document

**Verification:**

1. The verifier hashes the received document using the same hash function
2. The verifier decrypts the signature using the signer's public key, recovering the original digest
3. If the two digests match, the signature is valid — the document is authentic and unaltered

!!! mascot-thinking "Key Insight"
    <img src="../../img/mascot/thinking.png" class="mascot-admonition-img" alt="Rex is thinking">
    Notice that digital signatures combine two primitives from Chapter 2: hashing
    (for integrity) and asymmetric encryption (for authentication). This combination
    is more powerful than either alone. It's also the mechanism that both certificate
    authorities and blockchain transactions use to bind actions to identities. The
    difference between CA-based and blockchain-based trust isn't in the signature
    mechanism — it's in who vouches for the public key's owner.

#### Diagram: Digital Signature Process

<details markdown="1">
<summary>Interactive Digital Signature Signing and Verification</summary>
Type: MicroSim
**sim-id:** digital-signature-process<br/>
**Library:** p5.js<br/>
**Status:** Specified

**Learning objective:** Apply (L3) — Demonstrate the step-by-step process of creating and verifying a digital signature, showing how hashing and asymmetric encryption combine to provide authentication, integrity, and non-repudiation.

**Description:** A two-panel interactive simulation. The left panel shows the "Signing" process: a text input field for a message, a visual representation of the private key, and an animated flow showing the message being hashed, then the hash being encrypted with the private key to produce the signature. The right panel shows "Verification": the received message and signature are processed — the message is re-hashed, the signature is decrypted with the public key, and the two digests are compared. Students can modify the message text and see the signature change. A "Tamper" button modifies the message after signing, causing verification to fail (red X). Hash values are shown as truncated hex strings.

**Canvas:** Responsive width, 500px height. Background: aliceblue.

**Controls:**

- Text input for message content
- "Sign" button to create signature
- "Verify" button to check signature
- "Tamper" button to modify message after signing
- "Reset" button

**Visual elements:**

- Two-panel layout (Sign | Verify)
- Animated arrows showing data flow
- Key icons (lock for private, unlock for public)
- Hash values displayed as truncated hex
- Green checkmark for valid verification, red X for failed
- Step numbers (1, 2, 3) labeling each stage

Implementation: p5.js with text input, animation sequences, simplified hash display
</details>

## Authentication and Authorization

While often mentioned together, **authentication** and **authorization** are distinct concepts that serve different purposes in trust architectures.

**Authentication** answers the question: "Who are you?" It is the process of verifying that a user, device, or system is who or what it claims to be. Common authentication methods include:

- **Something you know** — passwords, PINs, security questions
- **Something you have** — hardware tokens, smart cards, mobile devices
- **Something you are** — biometrics (fingerprint, face, iris)
- **Something you can prove** — digital signatures using a private key

**Authorization** answers the question: "What are you allowed to do?" It is the process of determining what resources and operations an authenticated entity is permitted to access. Authorization typically follows authentication — you must first prove who you are before the system can determine what you're allowed to do.

!!! example "Bank Analogy"
    When you insert your bank card and enter your PIN at an ATM, you are performing authentication — proving you are the account holder. The ATM then checks your account balance and withdrawal limits — that is authorization, determining what transactions you are permitted to perform. Authentication without authorization is useless (you proved your identity but can't do anything), and authorization without authentication is dangerous (anyone could perform privileged operations).

In blockchain systems, authentication typically occurs through digital signatures — every transaction is signed with the sender's private key, proving they authorized it. Authorization rules vary by platform: in Bitcoin, authorization is simple (you can spend any output your key controls), while in Ethereum, smart contracts can enforce complex authorization logic.

## Identity Verification

**Identity verification** is the process of confirming that a public key actually belongs to the entity it claims to represent. This is the critical bridge between cryptographic identity (a key pair) and real-world identity (a person, organization, or device).

The fundamental challenge is this: anyone can generate a key pair and claim to be anyone else. Without a trusted mechanism for linking public keys to real-world identities, digital signatures prove only that the holder of a specific private key signed something — not that the holder is who they claim to be.

Two fundamentally different approaches to identity verification drive the architectural divide at the heart of this course:

| Approach | Mechanism | Examples | Trust Assumption |
|----------|-----------|---------|-----------------|
| **Centralized** | A trusted authority verifies identity and issues a certificate binding the public key to the identity | Certificate authorities, government ID systems | Trust the authority |
| **Decentralized** | Identity is self-asserted or established through network consensus and reputation | Blockchain addresses, web of trust, DIDs | Trust the protocol and community |

Chapter 4 examines the centralized approach in depth (certificate authorities and PKI). Chapters 5-10 cover blockchain's decentralized approach. Chapter 18 introduces emerging hybrid models (verifiable credentials, decentralized identifiers) that attempt to combine the strengths of both.

!!! mascot-thinking "Key Insight"
    <img src="../../img/mascot/thinking.png" class="mascot-admonition-img" alt="Rex is thinking">
    Identity verification is where the rubber meets the road for trust technologies.
    The cryptographic primitives — hashing, encryption, signatures — are well-established
    and mathematically sound. The hard problem is always: "How do I know this public
    key belongs to the entity I think it does?" Every trust architecture's value
    proposition ultimately depends on how it answers this question.

## Privacy: The Tension in Trust

**Privacy** is the right and ability of individuals to control what information about them is collected, stored, and shared. Privacy introduces a fundamental tension in trust architectures: trust often requires transparency (proving who you are and what you did), while privacy requires the opposite (concealing personal information).

This tension manifests differently across trust architectures:

- **Certificate authority systems** concentrate identity information at the CA, creating a privacy risk if the CA is compromised or compelled to disclose records by authorities
- **Public blockchains** record all transactions permanently and publicly, creating a pseudonymous (not anonymous) record that can often be linked to real-world identities through analysis
- **Private blockchains** restrict visibility to authorized participants but still create permanent records within the consortium

Privacy considerations are becoming increasingly important due to regulations like the EU's General Data Protection Regulation (GDPR), which includes a "right to be forgotten" — a requirement that is fundamentally incompatible with blockchain's immutable, append-only design. This conflict is examined in detail in Chapter 18.

!!! mascot-tip "Rex's Tip"
    <img src="../../img/mascot/tip.png" class="mascot-admonition-img" alt="Rex shares a tip">
    When evaluating trust architectures, always ask: "What privacy does this system
    provide, and what privacy does it sacrifice?" A system that provides perfect
    transparency and zero privacy may be legally unusable in regulated industries.
    Cost and performance aren't the only tradeoffs — privacy is often the deal-breaker.

## Key Takeaways

- **Public keys** are shared freely for encryption and signature verification; **private keys** must be kept secret for decryption and signing
- **Key pair generation** depends on strong randomness and secure storage — operational failures cause more compromises than mathematical weaknesses
- **Digital signatures** combine hashing and asymmetric encryption to provide authentication, integrity, and non-repudiation simultaneously
- **Authentication** verifies identity ("who are you?"); **authorization** determines permissions ("what can you do?")
- **Identity verification** — linking public keys to real-world identities — is the core differentiator between centralized (CA-based) and decentralized (blockchain-based) trust architectures
- **Privacy** creates a fundamental tension with trust: transparency enables verification but exposes personal information, with significant regulatory implications

!!! mascot-celebration "Excellent Analytical Work!"
    <img src="../../img/mascot/celebration.png" class="mascot-admonition-img" alt="Rex celebrates">
    You now understand how cryptographic primitives combine to create digital identity.
    The key insight to carry forward: the math behind signatures is solid and well-proven.
    The real challenge — and the real architectural debate — is about identity verification:
    who vouches for the public key, and what does that trust cost? Next, we examine the
    centralized answer: certificate authorities and PKI. Outstanding work, fellow analyst!
