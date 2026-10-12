window.REVISION_CHAPTERS=Object.assign(window.REVISION_CHAPTERS||{}, {
  "parking": {
    "concept": "A parking system assigns compatible slots, prevents duplicate occupancy, issues tickets, and calculates prices. Begin with vehicle sizes, entry/exit lanes, reservations, payment, and multi-floor scope. Distinguish a teaching-level in-memory model from a multi-gate production deployment.",
    "mechanics": [
      "Define Vehicle, Spot, Floor, Ticket, RatePolicy, and AllocationService with clear ownership.",
      "A Spot transitions AVAILABLE→HELD→OCCUPIED→AVAILABLE; the ticket binds a vehicle to exactly one occupied spot.",
      "Allocate under a transaction or per-spot atomic compare-and-set, not a separate availability check.",
      "Price from entry/exit timestamps using an injected Clock."
    ],
    "worked": "At Gate A and Gate B, two drivers request the last large spot simultaneously. Both read available=true, then both create tickets. Fix by atomically reserving the slot or using a unique active-occupancy database constraint, then issuing the ticket. Roll back reservation on ticket/payment failures.",
    "tradeoff": "Clarify whether spot allocation guarantees nearest-fit or merely any compatible slot; optimization can follow correctness. Avoid making every Vehicle subclass implement payment logic. Explain how to recover abandoned holds and distinguish ticket issuance from actual physical entry.",
    "drills": [
      "Which domain invariants must parking preserve when two clients act concurrently?",
      "Describe the failure or partial-success path and the data needed for recovery."
    ]
  },
  "library": {
    "concept": "A library has bibliographic titles and physical/digital copies, members, loans, holds, fines, and return rules. The crucial modeling distinction is Book (shared catalog information) versus BookCopy (one borrowable item with barcode and availability).",
    "mechanics": [
      "Model CatalogEntry, Copy, Member, Loan, Hold, LendingPolicy, and FinePolicy.",
      "Define copy lifecycle AVAILABLE→ON_LOAN→AVAILABLE/LOST and loan lifecycle ACTIVE→RETURNED/OVERDUE.",
      "Store due date and renewals on the loan, not on the title; use transactions when lending a copy."
    ],
    "worked": "Member A and Member B both request the last available copy. A checkout transaction conditionally changes the copy state and creates a loan. B must receive unavailable instead of another active loan for the same barcode. Hold queues and reservation expiry require explicit fairness policy.",
    "tradeoff": "Ask about reference-only books, e-books, renewal limits, and branch transfers. A fine is often derived from loan dates and policy; avoid storing independently mutable totals without reconciliation. A title's availability is computed from copies, not a single boolean.",
    "drills": [
      "Which domain invariants must library preserve when two clients act concurrently?",
      "Describe the failure or partial-success path and the data needed for recovery."
    ]
  },
  "ecommerce": {
    "concept": "Checkout coordinates a cart, inventory, discounts, payment authorization, order creation, and fulfillment. These systems must distinguish domain state from unreliable external calls and prevent duplicate purchases when users retry.",
    "mechanics": [
      "Use Cart, Order, OrderLine, Money, InventoryReservation, PaymentAttempt, CheckoutService, and PaymentGateway.",
      "Make prices immutable snapshots on OrderLine and associate idempotency keys with payment attempts.",
      "Define CREATED→AWAITING_PAYMENT→PAID→FULFILLED or FAILED/CANCELLED transitions and persistent unique constraints."
    ],
    "worked": "The payment provider charges successfully but the HTTP response times out. A blind retry with a fresh request ID double-charges. Persist the checkout idempotency key, query/reconcile the provider's payment ID, and resume the original order transition. Stock reservations need expiry and compensation on failure.",
    "tradeoff": "Ask who owns tax calculation, whether inventory is reserved before or after authorization, and what 'success' means. The payment API may be eventually consistent. Do not promise an atomic transaction spanning your database and an external card network.",
    "drills": [
      "Which domain invariants must ecommerce preserve when two clients act concurrently?",
      "Describe the failure or partial-success path and the data needed for recovery."
    ]
  },
  "vending": {
    "concept": "Vending machines are finite-state devices combining inventory, money acceptance, selection, dispensing, and refunds. Model invalid transitions explicitly before choosing classes.",
    "mechanics": [
      "Objects include Machine, Slot, Product, PaymentSession, CoinAcceptor, Dispenser, and Inventory.",
      "States might be IDLE, COLLECTING, READY, DISPENSING, OUT_OF_SERVICE.",
      "Insert money, choose an item, validate stock and credit, atomically mark dispensing, and confirm completion before committing the sale."
    ],
    "worked": "The mechanism jams after charging the customer. A naive design removes inventory and declares success. Record a pending dispense attempt; refund or mark for service according to hardware confirmation. Coin return/change logic must represent available denominations, not merely arithmetic amount.",
    "tradeoff": "Interviewers may add card payments, multiple simultaneous selections, and jam recovery. Avoid unbounded subclasses for every price or product. Keep hardware control behind interfaces, and ensure power loss does not erase pending transactions.",
    "drills": [
      "Which domain invariants must vending preserve when two clients act concurrently?",
      "Describe the failure or partial-success path and the data needed for recovery."
    ]
  },
  "atm": {
    "concept": "An ATM coordinates authenticated sessions, account operations, cash dispensing, and durable bank-ledger updates. The ATM is a client of a banking backend, not itself the source of truth for account balances.",
    "mechanics": [
      "Separate CardSession, ATMController, BankingGateway, CashDispenser, CashCassette, Withdrawal, and ReceiptPrinter.",
      "Track authentication, authorization, dispensing, and reconciliation as separate states.",
      "Enforce daily withdrawal limits and available cash; use backend transaction IDs and device outcome reporting."
    ],
    "worked": "The bank debits an account but the cash dispenser jams. Record an auditable transaction and reconcile/reverse with the bank according to banking protocol; do not simply declare a successful withdrawal. Cash counts must reflect physical dispensing confirmation.",
    "tradeoff": "Clarify offline behavior, PIN retry limits, partial dispense, deposits, and audit requirements. Never keep PINs in ordinary logs or assume a local mutex makes an inter-bank transaction atomic.",
    "drills": [
      "Which domain invariants must atm preserve when two clients act concurrently?",
      "Describe the failure or partial-success path and the data needed for recovery."
    ]
  },
  "url": {
    "concept": "A URL shortener maps a short unique key to a destination and supports redirects, expiration, custom aliases, analytics, and abuse prevention. The key interview split is core object model versus distributed scaling.",
    "mechanics": [
      "Define Link(id, key, target, owner, expiry, status), KeyGenerator, LinkRepository, and RedirectService.",
      "Enforce uniqueness at the database layer; decide between random keys and deterministic ID encoding.",
      "Validate destinations and optional TTL, then redirect with appropriate HTTP status and caching policy."
    ],
    "worked": "Two users both request the custom alias /sale. Both application threads pass 'exists?' before either writes. Only a unique constraint and conflict handling guarantee one winner. Cached redirects should respect expiry and destination edits; otherwise stale destinations persist.",
    "tradeoff": "Ask whether target edits are allowed, 301 versus 302 semantics, analytics accuracy, and forbidden destinations. Avoid treating cache hits as the authoritative source for alias ownership; account for key exhaustion and abusive redirects.",
    "drills": [
      "Which domain invariants must url preserve when two clients act concurrently?",
      "Describe the failure or partial-success path and the data needed for recovery."
    ]
  },
  "chess": {
    "concept": "A turn-based game models board state, legal actions, alternating players, and termination. For chess, legal movement is not identical to legal moves because the king must remain safe and special rules affect state.",
    "mechanics": [
      "Define Game, Player, Board, Position, Piece, Move, RulesEngine, and GameHistory.",
      "Generate candidate moves, then filter by rules including check, castling, en passant, and promotion.",
      "Apply moves atomically, switch turns, detect checkmate/stalemate and optional repetition/draw conditions."
    ],
    "worked": "A pinned rook may move like a rook geometrically but moving it would expose the king. The RulesEngine must validate resulting positions before accepting the move. Keep Move history for replay and potential undo, including captured pieces and castling rights.",
    "tradeoff": "Clarify whether the exercise is simplified chess or full FIDE rules; do not fake full chess coverage in a short interview. Avoid dozens of piece subclasses unless they simplify movement behavior. Separate game state from UI/network transport.",
    "drills": [
      "Which domain invariants must chess preserve when two clients act concurrently?",
      "Describe the failure or partial-success path and the data needed for recovery."
    ]
  },
  "restaurant": {
    "concept": "Restaurant software manages menus, tables, orders, kitchen preparation, payments, and fulfillment. The important entity distinctions are MenuItem versus OrderLine snapshots and order state versus kitchen ticket state.",
    "mechanics": [
      "Model Restaurant, Table, Reservation, MenuItem, Order, OrderLine, KitchenTicket, Payment, and PricingPolicy.",
      "Keep menu prices time-versioned or snapshot them on order lines.",
      "An order can be PLACED→PREPARING→READY→SERVED→PAID; cancellations and partial fulfillment need rules."
    ],
    "worked": "A server modifies an order while the kitchen is cooking. Mutating the original line silently loses the history of what was prepared. Record revisions or ticket-level changes; reject or route modifications according to preparation state. On payment timeout, deduplicate retries.",
    "tradeoff": "Ask about split bills, table transfers, simultaneous waiters, kitchen stations, and out-of-stock items. Avoid tying an Order's lifetime to a Table: takeaway and delivery orders may not reference tables at all.",
    "drills": [
      "Which domain invariants must restaurant preserve when two clients act concurrently?",
      "Describe the failure or partial-success path and the data needed for recovery."
    ]
  },
  "notification": {
    "concept": "A notification service accepts domain messages and delivers them through email, SMS, push, or webhook with routing, templates, preferences, and retry policies. Separate 'accepted for processing' from 'delivered'.",
    "mechanics": [
      "Define Notification, Recipient, TemplateRenderer, ChannelSender, RoutingPolicy, DeliveryAttempt, and NotificationDispatcher.",
      "Persist the notification with an idempotency key, choose allowed channels, queue attempts, and store per-channel status.",
      "Workers retry transient failures with backoff and deduplication."
    ],
    "worked": "An SMS provider times out after accepting the send. Retrying may duplicate the SMS; use a stable provider idempotency key where supported, otherwise record uncertainty and choose a documented delivery policy. Unsubscribe and user preferences must be evaluated at the right point.",
    "tradeoff": "Ask about ordering, rate limits, DLQs, GDPR/consent, templates, and fallback channels. An Observer may emit events, a Strategy may choose a sender, and an Adapter may wrap providers; patterns have different roles.",
    "drills": [
      "Which domain invariants must notification preserve when two clients act concurrently?",
      "Describe the failure or partial-success path and the data needed for recovery."
    ]
  },
  "devices": {
    "concept": "Device hierarchies are a trap when concrete products support overlapping capabilities rather than a single clean subtype tree. Phones, tablets, watches, and printers share some operations but not all.",
    "mechanics": [
      "Model capabilities such as Camera, GPS, CellularNetwork, AudioOutput, and BatteryPowered with focused interfaces.",
      "Compose components into Device types; a Smartphone may support Camera and GPS, while a Desktop may support neither.",
      "Keep shared true invariants in small base types if needed."
    ],
    "worked": "A base Device declares makeCall() because phones need it, then a Printer subclass throws unsupported. Split CallCapable from general Device. Clients asking for calls depend on CallCapable rather than checking concrete types.",
    "tradeoff": "Ask about attachable peripherals, capabilities changing at runtime, and power states. Favor interfaces and composition over an inheritance taxonomy designed purely around product marketing categories.",
    "drills": [
      "Which domain invariants must devices preserve when two clients act concurrently?",
      "Describe the failure or partial-success path and the data needed for recovery."
    ]
  }
});
