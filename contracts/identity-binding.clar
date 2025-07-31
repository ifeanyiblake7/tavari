;; Tavari Identity Binding Contract
;; Securely binds off-chain verified identity metadata to Clarity principals

(define-data-var admin principal tx-sender)

(define-map identity-registry principal
  {
    identity-hash: (buff 32),
    issued-by: principal,
    issued-at: uint,
    recovery-guardians: (list 3 principal),
    is-revoked: bool
  }
)

;; Error codes
(define-constant ERR-NOT-AUTHORIZED u100)
(define-constant ERR-ALREADY-BOUND u101)
(define-constant ERR-NOT-BOUND u102)
(define-constant ERR-NOT-GUARDIAN u103)
(define-constant ERR-ALREADY-RECOVERED u104)
(define-constant ERR-NOT-ADMIN u105)

;; Internal helper to check admin
(define-private (is-admin)
  (is-eq tx-sender (var-get admin))
)

;; Public: Bind identity to current principal
(define-public (bind-identity
  (identity-hash (buff 32))
  (issued-by principal)
  (recovery-guardians (list 3 principal))
)
  (begin
    (asserts! (is-none (map-get? identity-registry tx-sender)) (err ERR-ALREADY-BOUND))
    (map-set identity-registry tx-sender
      {
        identity-hash: identity-hash,
        issued-by: issued-by,
        issued-at: block-height,
        recovery-guardians: recovery-guardians,
        is-revoked: false
      }
    )
    (ok true)
  )
)

;; Public: Check if an identity is bound
(define-read-only (is-identity-bound (user principal))
  (is-some (map-get? identity-registry user))
)

;; Public: Read identity hash
(define-read-only (get-identity-hash (user principal))
  (match (map-get? identity-registry user)
    identity-data
    (ok (get identity-hash identity-data))
    (err ERR-NOT-BOUND)
  )
)

;; Public: Admin can revoke a binding
(define-public (revoke-identity (user principal))
  (begin
    (asserts! (is-admin) (err ERR-NOT-AUTHORIZED))
    (match (map-get? identity-registry user)
      identity-data
      (map-set identity-registry user
        (merge identity-data { is-revoked: true })
      )
      (ok true)
      (err ERR-NOT-BOUND)
    )
  )
)

;; Public: Identity recovery by guardian
(define-public (recover-identity (lost principal) (new principal))
  (begin
    (match (map-get? identity-registry lost)
      identity-data
      (begin
        (asserts! (is-none (map-get? identity-registry new)) (err ERR-ALREADY-RECOVERED))
        (asserts!
          (contains tx-sender (get recovery-guardians identity-data))
          (err ERR-NOT-GUARDIAN)
        )
        (map-set identity-registry new identity-data)
        (map-delete identity-registry lost)
        (ok true)
      )
      (err ERR-NOT-BOUND)
    )
  )
)

;; Public: Admin transfer
(define-public (transfer-admin (new-admin principal))
  (begin
    (asserts! (is-admin) (err ERR-NOT-ADMIN))
    (var-set admin new-admin)
    (ok true)
  )
)
