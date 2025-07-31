import { describe, it, expect, beforeEach } from "vitest"

const mockContract = {
  admin: "ST000000000000000000002AMW42H", // Genesis admin
  identityRegistry: new Map(),

  isAdmin(caller: string) {
    return caller === this.admin
  },

  bindIdentity(caller: string, identityHash: string, issuedBy: string, recoveryGuardians: string[]) {
    if (this.identityRegistry.has(caller)) {
      return { error: 101 } // ERR-ALREADY-BOUND
    }
    this.identityRegistry.set(caller, {
      identityHash,
      issuedBy,
      issuedAt: 1000, // mocked block height
      recoveryGuardians,
      isRevoked: false,
    })
    return { value: true }
  },

  isIdentityBound(user: string) {
    return this.identityRegistry.has(user)
  },

  getIdentityHash(user: string) {
    const record = this.identityRegistry.get(user)
    return record ? { value: record.identityHash } : { error: 102 } // ERR-NOT-BOUND
  },

  revokeIdentity(caller: string, user: string) {
    if (!this.isAdmin(caller)) return { error: 100 } // ERR-NOT-AUTHORIZED
    const data = this.identityRegistry.get(user)
    if (!data) return { error: 102 }
    this.identityRegistry.set(user, { ...data, isRevoked: true })
    return { value: true }
  },

  recoverIdentity(caller: string, lost: string, newPrincipal: string) {
    const lostData = this.identityRegistry.get(lost)
    if (!lostData) return { error: 102 }
    if (this.identityRegistry.has(newPrincipal)) return { error: 104 }
    if (!lostData.recoveryGuardians.includes(caller)) return { error: 103 }
    this.identityRegistry.set(newPrincipal, { ...lostData })
    this.identityRegistry.delete(lost)
    return { value: true }
  },

  transferAdmin(caller: string, newAdmin: string) {
    if (!this.isAdmin(caller)) return { error: 105 }
    this.admin = newAdmin
    return { value: true }
  },
}

describe("Identity Binding Contract", () => {
  beforeEach(() => {
    mockContract.admin = "ST000000000000000000002AMW42H"
    mockContract.identityRegistry = new Map()
  })

  it("should allow a user to bind an identity", () => {
    const res = mockContract.bindIdentity("STUSER1", "0xabc123", "STPROVIDER1", ["STGUARD1"])
    expect(res).toEqual({ value: true })
  })

  it("should prevent double binding", () => {
    mockContract.bindIdentity("STUSER1", "0xabc123", "STPROVIDER1", ["STGUARD1"])
    const res = mockContract.bindIdentity("STUSER1", "0xabc123", "STPROVIDER1", ["STGUARD1"])
    expect(res).toEqual({ error: 101 })
  })

  it("should allow a guardian to recover an identity", () => {
    mockContract.bindIdentity("STUSER1", "0xabc123", "STPROVIDER1", ["STGUARD1"])
    const res = mockContract.recoverIdentity("STGUARD1", "STUSER1", "STNEWUSER")
    expect(res).toEqual({ value: true })
    expect(mockContract.identityRegistry.has("STUSER1")).toBe(false)
    expect(mockContract.identityRegistry.has("STNEWUSER")).toBe(true)
  })

  it("should prevent unauthorized identity recovery", () => {
    mockContract.bindIdentity("STUSER1", "0xabc123", "STPROVIDER1", ["STGUARD1"])
    const res = mockContract.recoverIdentity("STFAKE", "STUSER1", "STNEWUSER")
    expect(res).toEqual({ error: 103 })
  })

  it("should allow admin to revoke an identity", () => {
    mockContract.bindIdentity("STUSER1", "0xabc123", "STPROVIDER1", ["STGUARD1"])
    const res = mockContract.revokeIdentity("ST000000000000000000002AMW42H", "STUSER1")
    expect(res).toEqual({ value: true })
  })

  it("should transfer admin rights", () => {
    const res = mockContract.transferAdmin("ST000000000000000000002AMW42H", "STNEWADMIN")
    expect(res).toEqual({ value: true })
    expect(mockContract.admin).toBe("STNEWADMIN")
  })
})
