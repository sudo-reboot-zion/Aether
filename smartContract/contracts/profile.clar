;; Aether User Profile Contract
;; Handles saved properties and travel preferences on-chain

;; ============================================
;; CONSTANTS
;; ============================================
(define-constant ERR-NOT-AUTHORIZED (err u400))
(define-constant ERR-ALREADY-EXISTS (err u401))
(define-constant ERR-NOT-FOUND (err u402))

;; ============================================
;; DATA MAPS
;; ============================================

;; Map of user -> list of favorite property IDs
(define-map saved-properties
    principal
    (list 100 uint)
)

;; Map of user -> travel signatures (vibes & amenities)
(define-map user-preferences
    principal
    {
        vibes: (list 10 uint),
        amenities: (list 10 uint),
        updated-at: uint
    }
)

;; ============================================
;; PUBLIC FUNCTIONS
;; ============================================

;; Save a property to favorites
(define-public (save-property (property-id uint))
    (let (
            (current-saved (default-to (list) (map-get? saved-properties tx-sender)))
        )
        ;; Check if already saved (optional, but good for UX)
        ;; For simplicity in Clarity lists, we'll just prepend if not full
        (asserts! (< (len current-saved) u100) ERR-NOT-AUTHORIZED)
        
        ;; Prepend the new property ID to the list
        (ok (map-set saved-properties tx-sender 
            (unwrap-panic (as-max-len? (append current-saved property-id) u100))
        ))
    )
)

;; Remove a property from favorites
;; Note: Removing from a list in Clarity requires manual filtering or replacement
;; For demo, we'll implement a clean 'set-saved-properties' for more flexibility 
;; or just focus on saving for now.

;; Set travel preferences
(define-public (set-preferences (vibes (list 10 uint)) (amenities (list 10 uint)))
    (begin
        (ok (map-set user-preferences tx-sender {
            vibes: vibes,
            amenities: amenities,
            updated-at: stacks-block-height
        }))
    )
)

;; ============================================
;; READ-ONLY FUNCTIONS
;; ============================================

;; Get saved properties for a user
(define-read-only (get-saved-properties (user principal))
    (default-to (list) (map-get? saved-properties user))
)

;; Get user preferences
(define-read-only (get-user-preferences (user principal))
    (map-get? user-preferences user)
)
