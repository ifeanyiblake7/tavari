# Tavari – Decentralized Health Data Ownership & Access Protocol

A blockchain-based platform for managing, storing, and sharing health data through smart contracts, enabling secure, interoperable, and patient-controlled data access.

---

## Overview

Tavari is a modular system of smart contracts designed to tokenize health data rights, manage decentralized storage links, and enforce privacy-preserving access control.

This system consists of ten main smart contracts that coordinate various components of a secure and user-sovereign health data ecosystem:

1. **Data Registry Contract** – Registers encrypted health data records
2. **Access Control Contract** – Manages fine-grained user permissions
3. **Identity Binding Contract** – Links verified off-chain identities to on-chain users
4. **Provider Authorization Contract** – Grants/revokes data access to clinics and providers
5. **Consent Ledger Contract** – Stores immutable consent history
6. **Record Index Contract** – Facilitates fast search and retrieval of data metadata
7. **Audit Trail Contract** – Logs access events for transparency and traceability
8. **Storage Pointer Contract** – Maps data records to decentralized file locations (e.g., IPFS, Arweave)
9. **Data Monetization Contract** – Enables opt-in data sharing for research incentives
10. **Emergency Override Contract** – Allows authorized override in critical care scenarios

---

## Features

- Patient-owned data model
- Decentralized storage with off-chain file references
- Fully permissioned access control system
- GDPR and HIPAA-aligned consent tracking
- Verifiable access history and auditability
- Research data monetization with tokenized rewards
- Emergency override with multi-party validation
- Clarity-based logic with predictable execution

---

## Smart Contracts

### Data Registry Contract
- Register new health records (hashes + metadata)
- Assign data ownership
- Store reference to off-chain location

### Access Control Contract
- Grant/revoke granular access per provider/user
- Define scopes (read-only, read/write, emergency)
- Permission expiry support

### Identity Binding Contract
- Link real-world identity proofs to blockchain addresses
- DID and zk-proof integration support
- Identity recovery via multi-sig

### Provider Authorization Contract
- Authorize licensed health providers to access data
- License verification module
- Expiration and renewal mechanics

### Consent Ledger Contract
- Log patient consents per data category
- Immutable event stream
- Consent revocation history

### Record Index Contract
- Maintain an indexed directory of record metadata
- Enable efficient querying and filtering
- Pagination and access-scoped indexing

### Audit Trail Contract
- Immutable logging of all read/write access events
- Timestamped and user-attributed
- Publicly verifiable trail

### Storage Pointer Contract
- IPFS/Filecoin/Arweave-compatible URIs
- Decentralized storage resolution system
- Health record linking per user

### Data Monetization Contract
- Opt-in marketplace participation
- Token-based compensation for research usage
- Privacy-preserving data aggregation

### Emergency Override Contract
- Multi-sig override mechanism
- Valid for defined emergency scenarios
- Logged and time-bound by policy

---

## Installation

1. Install Clarinet CLI  
2. Clone this repository  
3. Run tests: `npm test`  
4. Deploy contracts: `clarinet deploy`

---

## Usage

Each smart contract is deployed independently and interacts via cross-contract calls to form a cohesive health data management system. Refer to individual contract modules for interface specs and deployment examples.

---

## Testing

Tests are written using Clarinet's native testing framework. Run all tests with:

```bash
npm test
```

## License

MIT License