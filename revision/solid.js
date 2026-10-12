window.REVISION_CHAPTERS=Object.assign(window.REVISION_CHAPTERS||{}, {
  "srp": {
    "concept": "The Single Responsibility Principle means a module should have one coherent reason to change, usually one actor or policy owner. It does not mean each class may contain only one method. The real goal is to stop unrelated changes—pricing policy and invoice rendering, for example—from interfering with each other.",
    "mechanics": [
      "Identify who requests changes to the code: finance, product, security, operations, or another stakeholder.",
      "Group methods that enforce one cohesive set of invariants and change together.",
      "Separate independently evolving tasks such as persistence, validation, formatting, and transport when the boundaries are real.",
      "Use tests to verify that changing a renderer does not require modifying business calculations."
    ],
    "worked": "InvoiceProcessor both computes tax and generates PDFs. Tax rules change according to finance while PDF styling changes according to design. Split InvoiceCalculator from InvoiceRenderer and let an application service coordinate them. The result is fewer accidental regressions when one policy changes.",
    "tradeoff": "Do not split every function into another class. Cohesion is more important than class count. A small object with validation, state transitions, and derived totals may have many methods but still one responsibility: maintaining the invoice invariant.",
    "drills": [
      "Is a class with ten methods necessarily violating SRP?",
      "Who are the independent actors changing an InvoiceProcessor?"
    ]
  },
  "ocp": {
    "concept": "The Open/Closed Principle asks that stable, tested code be extensible for anticipated variation without repeatedly editing its core decision logic. It is not a ban on editing existing code. Identify a genuine extension axis and put its policy behind a deliberate interface, strategy, or plugin boundary.",
    "mechanics": [
      "Find a switch or conditional that repeatedly grows for each new business variant.",
      "Extract the varying behavior into implementations with a shared contract.",
      "Keep the invariant orchestration stable and configure new implementations at the boundary.",
      "Test existing implementations with shared contract tests and new implementations with variant-specific cases."
    ],
    "worked": "A shipping calculator has branches for CourierA, CourierB, and CourierC. Replace the growing branch with ShippingRateProvider and implementations for each courier. Register the chosen provider by configuration; the checkout path need not change for CourierD.",
    "tradeoff": "Do not abstract speculative variations. A switch over three fixed enum states may be simpler, safer, and more exhaustive than plugins. OCP concerns places that demonstrably change, not every line of application code.",
    "drills": [
      "When is a switch a better choice than new classes?",
      "How do you extend pricing without modifying CheckoutService?"
    ]
  },
  "lsp": {
    "concept": "Liskov Substitution means callers relying on a base contract should continue to work when given a subtype. Behavioral subtyping includes preconditions, postconditions, invariants, observable effects, and failure semantics. Signature compatibility alone is insufficient.",
    "mechanics": [
      "Write the base class promise from the caller's point of view.",
      "A subtype must not strengthen input preconditions or weaken output guarantees.",
      "The subtype should preserve invariants and not introduce surprising exceptions for supported base operations.",
      "Run the same contract tests against every subtype and inspect counterexamples."
    ],
    "worked": "A Rectangle exposes setWidth and setHeight independently. A Square override that forces equal sides means setWidth(4); setHeight(6) no longer yields width 4, height 6. A caller expecting Rectangle's contract breaks. Use immutable Shape variants with area() instead.",
    "tradeoff": "Not every real-world 'is-a' translates to a behavioral subtype. Model capabilities as interfaces and constraints explicitly. LSP is especially important when making previously concrete code extensible through inheritance or mocks.",
    "drills": [
      "What are stronger preconditions and weaker postconditions?",
      "Why is returning an empty value instead of fulfilling a base method contract sometimes a violation?"
    ]
  },
  "isp": {
    "concept": "Interface Segregation means consumers should not depend on methods they do not need. Large interfaces force implementations to provide irrelevant methods, tightly couple clients, and make mocks bulky. Design contracts around cohesive client capabilities.",
    "mechanics": [
      "List which methods each consumer actually calls.",
      "Split a broad interface into role-specific contracts with names that explain the capability.",
      "Compose multiple interfaces when one implementation legitimately supports several capabilities.",
      "Keep client code typed against the smallest interface required for its job."
    ],
    "worked": "A Device interface contains print(), scan(), fax(), and staple(). A basic printer must throw UnsupportedOperationException for unsupported operations. Replace it with Printer, Scanner, FaxMachine, and Stapler capabilities. A multifunction machine can implement several, and a print-only consumer depends on Printer.",
    "tradeoff": "Too many microscopic interfaces make navigation and wiring harder. Split along stable usage boundaries, not one-method-per-interface dogma. The failure signal is clients and implementations coupled to irrelevant operations.",
    "drills": [
      "Why are UnsupportedOperationException stubs a design smell?",
      "Can one concrete class implement several small interfaces?"
    ]
  },
  "dip": {
    "concept": "Dependency Inversion says high-level policy modules should not depend directly on low-level implementation details; both should depend on abstractions owned by the relevant boundary. This is separate from dependency injection, which is one technique used to supply an implementation.",
    "mechanics": [
      "Identify the high-level business flow and its volatile external services (database, email provider, API).",
      "Define a contract in or near the domain/application boundary, shaped by what the policy needs.",
      "Pass implementations through constructors, factories, or composition roots.",
      "Write core tests against a fake or in-memory implementation and integration tests for adapters."
    ],
    "worked": "OrderService directly constructs MySqlOrderRepository and VendorEmailClient. Instead it receives OrderRepository and NotificationSender. The application's composition root creates JDBCOrderRepository and SESNotificationSender. Business logic now remains usable under a different database or in tests.",
    "tradeoff": "Do not put a 'generic repository abstraction' over every query without understanding the domain. Dependencies on stable standard library types and values are fine. Adding interfaces does not automatically achieve DIP if they mirror every vendor-specific method.",
    "drills": [
      "How does DIP differ from DI?",
      "Where should the OrderRepository interface live and why?"
    ]
  },
  "refactor-coupling": {
    "concept": "Tight coupling occurs when a policy knows too much about concrete dependencies, shared mutable state, object construction, or internal fields. A safe refactor starts by protecting current behavior, then moving one responsibility and dependency boundary at a time. SOLID is a diagnosis framework, not a code transformation recipe.",
    "mechanics": [
      "Map direct constructor calls, global singletons, oversized interfaces, and bidirectional dependencies.",
      "Add characterization tests around the existing observable behavior and failure cases.",
      "Extract a contract at the volatile boundary, move construction to a composition root, and inject dependencies.",
      "Separate unrelated responsibilities only where they change independently; profile or load-test to ensure no new bottlenecks."
    ],
    "worked": "An OrderController validates cart state, talks to SQL, charges payments, and emails invoices. First lock behavior with tests; move transaction and payment policy to CheckoutService; extract PaymentGateway and OrderRepository; keep controller HTTP-only. Release incrementally so rollback is possible.",
    "tradeoff": "Refactoring must be justified by concrete maintenance risks. Excessive indirection can be worse than explicit code. Avoid a sweeping rewrite that simultaneously changes external behavior, public API, and service architecture.",
    "drills": [
      "What tests would you add before extracting a payment dependency?",
      "Why does dependency injection not automatically fix an oversized class?"
    ]
  }
});
