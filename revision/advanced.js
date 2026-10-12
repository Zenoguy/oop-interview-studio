window.REVISION_CHAPTERS=Object.assign(window.REVISION_CHAPTERS||{}, {
  "thread-safety": {
    "concept": "Thread safety means shared object behavior remains correct under permitted concurrent execution. Consider atomicity, visibility, ordering, and invariants; synchronized individual getters and setters do not automatically make a compound operation safe.",
    "mechanics": [
      "Define the precise contract and invariants involved in thread safety before choosing implementation details.",
      "Trace one successful interaction through the responsible objects, noting where state is changed and who owns it.",
      "Analyze an edge case such as invalid input, concurrent execution, partial failure, or inappropriate inheritance.",
      "Use tests or measurements to validate the claimed property, and distinguish language rules from implementation choices."
    ],
    "worked": "A stock service checks available units then decrements them. With two concurrent buyers, separate synchronized methods can both see enough stock. Combine check-and-reserve under one lock or an atomic database update, and test concurrent reservations.",
    "tradeoff": "Choose confinement, immutability, locks, atomics, or transactions based on shared state. Locks impose contention and deadlock risks; document ownership, lock order, and interruption policy.",
    "drills": [
      "Explain thread safety in 90 seconds with one concrete scenario.",
      "What common assumption about this topic would fail in a production system?"
    ]
  },
  "multithreading": {
    "concept": "OOP makes shared mutable state easy to express through references, but threads may interleave methods arbitrarily. Reason about happens-before, safe publication, invariants, and which objects are thread-confined versus shared.",
    "mechanics": [
      "Define the precise contract and invariants involved in multithreading before choosing implementation details.",
      "Trace one successful interaction through the responsible objects, noting where state is changed and who owns it.",
      "Analyze an edge case such as invalid input, concurrent execution, partial failure, or inappropriate inheritance.",
      "Use tests or measurements to validate the claimed property, and distinguish language rules from implementation choices."
    ],
    "worked": "A mutable ArrayList is passed to several worker threads. Concurrent add and iteration can corrupt assumptions or trigger exceptions. Choose a concurrent data structure or protect the complete compound operation, not just each method.",
    "tradeoff": "A thread-safe collection does not make a multi-step business operation atomic. Avoid holding a lock while calling unknown callbacks or slow network services.",
    "drills": [
      "Explain multithreading in 90 seconds with one concrete scenario.",
      "What common assumption about this topic would fail in a production system?"
    ]
  },
  "singleton-thread": {
    "concept": "Concurrent initialization must create and safely publish the intended instance once per scope. In Java, an enum singleton or holder idiom is simpler than manual double-checked locking; the latter requires volatile and careful construction.",
    "mechanics": [
      "Define the precise contract and invariants involved in singleton thread before choosing implementation details.",
      "Trace one successful interaction through the responsible objects, noting where state is changed and who owns it.",
      "Analyze an edge case such as invalid input, concurrent execution, partial failure, or inappropriate inheritance.",
      "Use tests or measurements to validate the claimed property, and distinguish language rules from implementation choices."
    ],
    "worked": "Two threads call getInstance() simultaneously. Without adequate synchronization, both could initialize the object or one could observe improperly published state. A static holder defers initialization using JVM class initialization guarantees.",
    "tradeoff": "Thread-safe instance creation says nothing about whether its mutable methods are thread-safe. Per-process uniqueness also does not imply one instance across service replicas.",
    "drills": [
      "Explain singleton thread in 90 seconds with one concrete scenario.",
      "What common assumption about this topic would fail in a production system?"
    ]
  },
  "microservices-conc": {
    "concept": "Concurrency in microservices crosses processes and databases: a local lock protects one replica, not the deployment. Production invariants require shared transactional constraints, idempotency, durable messages, and reconciliation.",
    "mechanics": [
      "Define the precise contract and invariants involved in microservices conc before choosing implementation details.",
      "Trace one successful interaction through the responsible objects, noting where state is changed and who owns it.",
      "Analyze an edge case such as invalid input, concurrent execution, partial failure, or inappropriate inheritance.",
      "Use tests or measurements to validate the claimed property, and distinguish language rules from implementation choices."
    ],
    "worked": "Two API replicas reserve the last ticket. Both local mutexes succeed because they are separate processes. Use one database row with conditional update/version check or another shared authority so only one reservation wins.",
    "tradeoff": "Distributed locks have lease/expiry/fencing subtleties. Prefer database constraints when the invariant lives in the database; use sagas and compensations for non-atomic external calls.",
    "drills": [
      "Explain microservices conc in 90 seconds with one concrete scenario.",
      "What common assumption about this topic would fail in a production system?"
    ]
  },
  "debug-story": {
    "concept": "A strong debugging story explains the symptom, hypothesis, reproduction, object responsibilities, root cause, fix, and regression prevention. Pick an actual project event; do not invent incidents to sound experienced.",
    "mechanics": [
      "Define the precise contract and invariants involved in debug story before choosing implementation details.",
      "Trace one successful interaction through the responsible objects, noting where state is changed and who owns it.",
      "Analyze an edge case such as invalid input, concurrent execution, partial failure, or inappropriate inheritance.",
      "Use tests or measurements to validate the claimed property, and distinguish language rules from implementation choices."
    ],
    "worked": "An Order object was shared between requests through a singleton cache. Under load, one user's discount appeared on another's checkout. Reproduce with parallel tests, trace shared reference ownership, remove the inappropriate shared mutable cache, and add a concurrency regression test.",
    "tradeoff": "Quantify before and after if measured; be explicit about what you personally investigated. The interviewer values methodical evidence more than the size of the bug.",
    "drills": [
      "Explain debug story in 90 seconds with one concrete scenario.",
      "What common assumption about this topic would fail in a production system?"
    ]
  },
  "monolith-story": {
    "concept": "Moving a monolith to services is a domain and operational migration, not converting every OOP class into a separate HTTP service. Identify bounded contexts, data ownership, and a safe incremental extraction path.",
    "mechanics": [
      "Define the precise contract and invariants involved in monolith story before choosing implementation details.",
      "Trace one successful interaction through the responsible objects, noting where state is changed and who owns it.",
      "Analyze an edge case such as invalid input, concurrent execution, partial failure, or inappropriate inheritance.",
      "Use tests or measurements to validate the claimed property, and distinguish language rules from implementation choices."
    ],
    "worked": "A monolith combines catalog, checkout, billing, and fulfillment. Start with domain boundaries; extract one low-coupling capability via a strangler route, preserve API contracts, add observability, and move data ownership carefully. Avoid dual writes without an outbox or reconciliation.",
    "tradeoff": "A modular monolith is often preferable until boundaries and operational needs are proven. Network hops, distributed transactions, eventual consistency, and deployment overhead are real costs.",
    "drills": [
      "Explain monolith story in 90 seconds with one concrete scenario.",
      "What common assumption about this topic would fail in a production system?"
    ]
  },
  "evolution-story": {
    "concept": "Describe a concrete change in design judgment: perhaps starting with inheritance everywhere, then learning to model stable contracts and choose composition only for independently varying capabilities. Ground it in an actual decision.",
    "mechanics": [
      "Define the precise contract and invariants involved in evolution story before choosing implementation details.",
      "Trace one successful interaction through the responsible objects, noting where state is changed and who owns it.",
      "Analyze an edge case such as invalid input, concurrent execution, partial failure, or inappropriate inheritance.",
      "Use tests or measurements to validate the claimed property, and distinguish language rules from implementation choices."
    ],
    "worked": "Early code modeled each payment method as a CheckoutService subclass. Later, separating PaymentGateway from CheckoutService made provider tests faster and failure handling clearer. Explain the trade-off and the conditions where the earlier design would still suffice.",
    "tradeoff": "Avoid generic claims that one principle solves everything. Show how testing, production incidents, reviewer feedback, or measurements changed your approach.",
    "drills": [
      "Explain evolution story in 90 seconds with one concrete scenario.",
      "What common assumption about this topic would fail in a production system?"
    ]
  },
  "performance-story": {
    "concept": "Performance optimization begins with measurements and a hypothesis, not replacing virtual calls by instinct. Distinguish CPU, allocation, I/O, lock contention, cache misses, and database queries before changing architecture.",
    "mechanics": [
      "Define the precise contract and invariants involved in performance story before choosing implementation details.",
      "Trace one successful interaction through the responsible objects, noting where state is changed and who owns it.",
      "Analyze an edge case such as invalid input, concurrent execution, partial failure, or inappropriate inheritance.",
      "Use tests or measurements to validate the claimed property, and distinguish language rules from implementation choices."
    ],
    "worked": "Profiling finds repeated creation of JSON serializers in a hot endpoint. Reusing thread-safe immutable metadata reduces allocations; benchmark under representative concurrency and compare p50/p95 latency and memory. Check for new shared-state contention.",
    "tradeoff": "State the baseline, technique, workload, measured outcome, and rollback risks. Excessive object pooling or caching can increase memory retention and complicate correctness.",
    "drills": [
      "Explain performance story in 90 seconds with one concrete scenario.",
      "What common assumption about this topic would fail in a production system?"
    ]
  },
  "mentor-story": {
    "concept": "Mentoring on OOP involves teaching why a boundary exists, reviewing behavior and trade-offs, and allowing juniors to develop judgment through safe experiments. Prefer small worked examples and testable criteria over style decrees.",
    "mechanics": [
      "Define the precise contract and invariants involved in mentor story before choosing implementation details.",
      "Trace one successful interaction through the responsible objects, noting where state is changed and who owns it.",
      "Analyze an edge case such as invalid input, concurrent execution, partial failure, or inappropriate inheritance.",
      "Use tests or measurements to validate the claimed property, and distinguish language rules from implementation choices."
    ],
    "worked": "A junior adds setters to every domain class. Pair on one Order invariant, show a test that demonstrates illegal state, and replace setStatus with meaningful transitions. Ask them to explain the new design and review it together.",
    "tradeoff": "Avoid claiming senior leadership you have not had. A classmate pairing, PR review, or code walkthrough is a legitimate concrete example if accurately described.",
    "drills": [
      "Explain mentor story in 90 seconds with one concrete scenario.",
      "What common assumption about this topic would fail in a production system?"
    ]
  },
  "inheritance-story": {
    "concept": "A convincing inheritance story identifies a genuine shared contract, what duplication was removed, and how subtype tests ensured the refactor did not weaken behavior. Explain why delegation was not the better alternative.",
    "mechanics": [
      "Define the precise contract and invariants involved in inheritance story before choosing implementation details.",
      "Trace one successful interaction through the responsible objects, noting where state is changed and who owns it.",
      "Analyze an edge case such as invalid input, concurrent execution, partial failure, or inappropriate inheritance.",
      "Use tests or measurements to validate the claimed property, and distinguish language rules from implementation choices."
    ],
    "worked": "Several parser implementations share file-opening, error-reporting, and cleanup semantics. A stable AbstractImporter holds the template flow and specialized parsers provide parseRecords. Shared contract tests ensure all versions close resources on failure.",
    "tradeoff": "Do not use inheritance solely to remove a handful of duplicate lines. Highlight why subclasses remain substitutable and how protected extension points stay narrow.",
    "drills": [
      "Explain inheritance story in 90 seconds with one concrete scenario.",
      "What common assumption about this topic would fail in a production system?"
    ]
  },
  "disagreement-story": {
    "concept": "Design disagreements are best resolved by clarifying requirements, listing alternative trade-offs, testing assumptions, and agreeing on a measurable decision. The goal is sound architecture, not winning an argument.",
    "mechanics": [
      "Define the precise contract and invariants involved in disagreement story before choosing implementation details.",
      "Trace one successful interaction through the responsible objects, noting where state is changed and who owns it.",
      "Analyze an edge case such as invalid input, concurrent execution, partial failure, or inappropriate inheritance.",
      "Use tests or measurements to validate the claimed property, and distinguish language rules from implementation choices."
    ],
    "worked": "One teammate prefers a deep class hierarchy; another prefers strategies. Compare expected variation axes and maintenance costs, prototype a small vertical slice, run tests, and record the choice in a short ADR. Revisit if requirements change.",
    "tradeoff": "Give the other proposal a fair account and describe your own change of mind when evidence supports it. Don't invent interpersonal conflict or claim consensus without evidence.",
    "drills": [
      "Explain disagreement story in 90 seconds with one concrete scenario.",
      "What common assumption about this topic would fail in a production system?"
    ]
  },
  "no-oop": {
    "concept": "Yes, applications can be written procedurally, functionally, declaratively, or as combinations of paradigms. OOP is one approach to organizing state and behavior; it is not required for a running program.",
    "mechanics": [
      "Define the precise contract and invariants involved in no oop before choosing implementation details.",
      "Trace one successful interaction through the responsible objects, noting where state is changed and who owns it.",
      "Analyze an edge case such as invalid input, concurrent execution, partial failure, or inappropriate inheritance.",
      "Use tests or measurements to validate the claimed property, and distinguish language rules from implementation choices."
    ],
    "worked": "A batch ETL script can read records, transform them with pure functions, and write results with a procedural main function. No class hierarchy is needed. Larger apps often mix functional transformations with stateful service objects.",
    "tradeoff": "Choose a style that makes change and invariants easy to understand. OOP can introduce unnecessary indirection for mathematical pipelines and small scripts.",
    "drills": [
      "Explain no oop in 90 seconds with one concrete scenario.",
      "What common assumption about this topic would fail in a production system?"
    ]
  },
  "class-struct": {
    "concept": "Class versus struct semantics are language-specific. C++ struct and class differ primarily in default member/base visibility; both support methods and inheritance. Java records/classes and C structs are different constructs, not directly interchangeable.",
    "mechanics": [
      "Define the precise contract and invariants involved in class struct before choosing implementation details.",
      "Trace one successful interaction through the responsible objects, noting where state is changed and who owns it.",
      "Analyze an edge case such as invalid input, concurrent execution, partial failure, or inappropriate inheritance.",
      "Use tests or measurements to validate the claimed property, and distinguish language rules from implementation choices."
    ],
    "worked": "In C++, struct Point{int x;int y;}; defaults to public, while class Point defaults to private. Both can be allocated on stack or heap depending on usage. In C, struct is a record of fields without C++ member-function semantics.",
    "tradeoff": "Don't claim structs always live on the stack or classes always on the heap. Explain which language, type system, and allocation model you mean.",
    "drills": [
      "Explain class struct in 90 seconds with one concrete scenario.",
      "What common assumption about this topic would fail in a production system?"
    ]
  },
  "class-memory": {
    "concept": "A class definition is not an instance, but the statement 'a class takes zero bytes' is misleading. Instance fields, headers, alignment, static storage, method code, and runtime type metadata contribute in different ways depending on language and implementation.",
    "mechanics": [
      "Define the precise contract and invariants involved in class memory before choosing implementation details.",
      "Trace one successful interaction through the responsible objects, noting where state is changed and who owns it.",
      "Analyze an edge case such as invalid input, concurrent execution, partial failure, or inappropriate inheritance.",
      "Use tests or measurements to validate the claimed property, and distinguish language rules from implementation choices."
    ],
    "worked": "In Java, each object generally has a header and fields with layout/alignment overhead; a Class mirror and VM metadata also exist. In C++, sizeof(T) includes instance representation and padding, while static fields and compiled methods are stored separately.",
    "tradeoff": "Do not guess object size from field widths alone. State JVM, compressed-oops setting, compiler ABI, alignment, and inheritance before discussing exact numbers.",
    "drills": [
      "Explain class memory in 90 seconds with one concrete scenario.",
      "What common assumption about this topic would fail in a production system?"
    ]
  },
  "operator-overload": {
    "concept": "Operator overloading maps familiar syntax to type-specific operations, but support varies. C++ allows many overloaded operators with restrictions; Python uses special methods; Java generally does not let users overload operators except built-in string concatenation behavior.",
    "mechanics": [
      "Define the precise contract and invariants involved in operator overload before choosing implementation details.",
      "Trace one successful interaction through the responsible objects, noting where state is changed and who owns it.",
      "Analyze an edge case such as invalid input, concurrent execution, partial failure, or inappropriate inheritance.",
      "Use tests or measurements to validate the claimed property, and distinguish language rules from implementation choices."
    ],
    "worked": "In C++, Money operator+(Money,Money) should enforce currency compatibility and ideally avoid surprising mutation. Some operators such as ::, . and ?: cannot be overloaded. Python __add__ can implement + for user classes.",
    "tradeoff": "Only overload when semantics remain unsurprising and preserve conventional expectations. Avoid disguising network calls or expensive side effects as simple arithmetic.",
    "drills": [
      "Explain operator overload in 90 seconds with one concrete scenario.",
      "What common assumption about this topic would fail in a production system?"
    ]
  },
  "constructor-chaining": {
    "concept": "Constructor chaining delegates initialization to another constructor, reducing duplicate validation and ensuring all construction paths establish the same invariants. Java uses this(...) within a class and super(...) for superclass construction.",
    "mechanics": [
      "Define the precise contract and invariants involved in constructor chaining before choosing implementation details.",
      "Trace one successful interaction through the responsible objects, noting where state is changed and who owns it.",
      "Analyze an edge case such as invalid input, concurrent execution, partial failure, or inappropriate inheritance.",
      "Use tests or measurements to validate the claimed property, and distinguish language rules from implementation choices."
    ],
    "worked": "A User(id) constructor delegates to User(id, DEFAULT_ROLE), which validates both fields. A derived Admin calls the base constructor for shared identity state. Keep the canonical initialization logic in one place.",
    "tradeoff": "Constructor calls have language-specific ordering rules. Avoid virtual/overridable calls before subclass state is initialized.",
    "drills": [
      "Explain constructor chaining in 90 seconds with one concrete scenario.",
      "What common assumption about this topic would fail in a production system?"
    ]
  },
  "equality": {
    "concept": "Identity answers whether two references point to the same object; logical equality answers whether their values satisfy a chosen equivalence relation. Java == on references compares identity and equals compares logical equality if overridden; Python is tests identity and == invokes equality behavior.",
    "mechanics": [
      "Define the precise contract and invariants involved in equality before choosing implementation details.",
      "Trace one successful interaction through the responsible objects, noting where state is changed and who owns it.",
      "Analyze an edge case such as invalid input, concurrent execution, partial failure, or inappropriate inheritance.",
      "Use tests or measurements to validate the claimed property, and distinguish language rules from implementation choices."
    ],
    "worked": "Two distinct String objects can be equal by content but not identical by reference. Override Java equals and hashCode consistently: if a.equals(b), their hash codes must match. In Python immutable tuples can compare equal without being the same object.",
    "tradeoff": "Mutable fields used in hashes are dangerous if they change while keys are in a hash collection. Float NaN, inheritance, and null handling can complicate equality contracts.",
    "drills": [
      "Explain equality in 90 seconds with one concrete scenario.",
      "What common assumption about this topic would fail in a production system?"
    ]
  },
  "replace-switch": {
    "concept": "Polymorphism can replace a growing conditional when each alternative implements substantial, independently evolving behavior. It is not automatically better than a clear, exhaustive switch over a fixed set of states.",
    "mechanics": [
      "Define the precise contract and invariants involved in replace switch before choosing implementation details.",
      "Trace one successful interaction through the responsible objects, noting where state is changed and who owns it.",
      "Analyze an edge case such as invalid input, concurrent execution, partial failure, or inappropriate inheritance.",
      "Use tests or measurements to validate the claimed property, and distinguish language rules from implementation choices."
    ],
    "worked": "A payment dispatcher with ten providers and provider-specific validation might use PaymentGateway implementations. A traffic-light enum with three stable states could use an explicit switch and compiler exhaustiveness checking.",
    "tradeoff": "Balance extensibility against discoverability and indirection. A strategy registry can still have selection logic; removing every conditional is neither possible nor a goal.",
    "drills": [
      "Explain replace switch in 90 seconds with one concrete scenario.",
      "What common assumption about this topic would fail in a production system?"
    ]
  },
  "getter-leak": {
    "concept": "A getter can expose mutable internals, allowing callers to violate invariants without invoking validated methods. Returning a reference to a collection or mutable nested object is often equivalent to granting write access.",
    "mechanics": [
      "Define the precise contract and invariants involved in getter leak before choosing implementation details.",
      "Trace one successful interaction through the responsible objects, noting where state is changed and who owns it.",
      "Analyze an edge case such as invalid input, concurrent execution, partial failure, or inappropriate inheritance.",
      "Use tests or measurements to validate the claimed property, and distinguish language rules from implementation choices."
    ],
    "worked": "Order.getLines() returns the internal mutable list. Callers remove a line while the order total stays cached, creating inconsistency. Return an immutable snapshot and supply addLine/removeLine methods that recalculate invariants.",
    "tradeoff": "An unmodifiable view prevents direct list mutations but may still reflect later internal changes and expose mutable elements. Evaluate deep versus shallow protection.",
    "drills": [
      "Explain getter leak in 90 seconds with one concrete scenario.",
      "What common assumption about this topic would fail in a production system?"
    ]
  },
  "modern-composition": {
    "concept": "Modern application frameworks often use composition and interfaces because services require replaceable dependencies, isolated tests, flexible configuration, and shallow contracts. This does not make inheritance obsolete; it makes independently varying capabilities easier to manage.",
    "mechanics": [
      "Define the precise contract and invariants involved in modern composition before choosing implementation details.",
      "Trace one successful interaction through the responsible objects, noting where state is changed and who owns it.",
      "Analyze an edge case such as invalid input, concurrent execution, partial failure, or inappropriate inheritance.",
      "Use tests or measurements to validate the claimed property, and distinguish language rules from implementation choices."
    ],
    "worked": "A web handler receives a Repository, Clock, and EmailSender rather than subclassing a giant BaseHandler with database, logging, authentication, and notification behavior built in. Tests supply fakes for the dependencies.",
    "tradeoff": "Composition can produce configuration sprawl and wrapper chains. Maintain a clean composition root and reserve inheritance for stable extension protocols.",
    "drills": [
      "Explain modern composition in 90 seconds with one concrete scenario.",
      "What common assumption about this topic would fail in a production system?"
    ]
  },
  "oop-limits": {
    "concept": "OOP helps model objects with identity and controlled state but can create deep hierarchies, indirection, allocation overhead, hidden mutable state, and awkward fits for streaming or data-parallel tasks. Performance is workload-dependent, not inherently inferior in every case.",
    "mechanics": [
      "Define the precise contract and invariants involved in oop limits before choosing implementation details.",
      "Trace one successful interaction through the responsible objects, noting where state is changed and who owns it.",
      "Analyze an edge case such as invalid input, concurrent execution, partial failure, or inappropriate inheritance.",
      "Use tests or measurements to validate the claimed property, and distinguish language rules from implementation choices."
    ],
    "worked": "A numerical transform over millions of elements may work better with flat arrays and pure functions than one heap object per sample. A financial Order entity, by contrast, benefits from explicit identity and constrained transitions.",
    "tradeoff": "Use a hybrid approach: immutable data models, functional transforms, imperative orchestration, and objects where lifecycle and invariants justify them. Profile before blaming OOP for runtime costs.",
    "drills": [
      "Explain oop limits in 90 seconds with one concrete scenario.",
      "What common assumption about this topic would fail in a production system?"
    ]
  },
  "class-diagram": {
    "concept": "A UML class diagram shows static types and relationships: class names, attributes, methods, visibility, multiplicity, and inheritance/composition edges. It does not capture temporal interactions or transactional guarantees by itself.",
    "mechanics": [
      "Define the precise contract and invariants involved in class diagram before choosing implementation details.",
      "Trace one successful interaction through the responsible objects, noting where state is changed and who owns it.",
      "Analyze an edge case such as invalid input, concurrent execution, partial failure, or inappropriate inheritance.",
      "Use tests or measurements to validate the claimed property, and distinguish language rules from implementation choices."
    ],
    "worked": "Draw Order with -items: List<OrderLine>, +addLine(), and a composition line with a filled diamond at Order. Connect CheckoutService to PaymentGateway by a dependency; label 1 and 0..* where helpful.",
    "tradeoff": "Sketch only entities and relationships relevant to requirements; a huge UML graph is often less useful than a focused model plus a sequence diagram.",
    "drills": [
      "Explain class diagram in 90 seconds with one concrete scenario.",
      "What common assumption about this topic would fail in a production system?"
    ]
  },
  "uml-relationships": {
    "concept": "UML edges express distinct semantics: plain association is a solid line, aggregation has a hollow diamond, composition a filled diamond, generalization an open triangle, and dependency a dashed arrow. Multiplicity and navigability add precision.",
    "mechanics": [
      "Define the precise contract and invariants involved in uml relationships before choosing implementation details.",
      "Trace one successful interaction through the responsible objects, noting where state is changed and who owns it.",
      "Analyze an edge case such as invalid input, concurrent execution, partial failure, or inappropriate inheritance.",
      "Use tests or measurements to validate the claimed property, and distinguish language rules from implementation choices."
    ],
    "worked": "An Order ◆— OrderLine implies strong part ownership; a Teacher—Course line is association; CsvExporter▷Exporter expresses inheritance/generalization. An application service depending on PaymentGateway can be drawn as a dashed dependency.",
    "tradeoff": "Do not confuse a field declaration with composition. Make lifecycle rules explicit; choose ordinary association when aggregation's extra meaning is unclear.",
    "drills": [
      "Explain uml relationships in 90 seconds with one concrete scenario.",
      "What common assumption about this topic would fail in a production system?"
    ]
  },
  "sequence": {
    "concept": "Sequence diagrams show interactions ordered through time, including object lifelines, messages, replies, conditional branches (alt), loops, and parallel paths. They complement class diagrams by exposing failure handling and cross-boundary orchestration.",
    "mechanics": [
      "Define the precise contract and invariants involved in sequence before choosing implementation details.",
      "Trace one successful interaction through the responsible objects, noting where state is changed and who owns it.",
      "Analyze an edge case such as invalid input, concurrent execution, partial failure, or inappropriate inheritance.",
      "Use tests or measurements to validate the claimed property, and distinguish language rules from implementation choices."
    ],
    "worked": "For checkout draw Client→CheckoutService→OrderRepository→PaymentGateway. Add alt for payment success, timeout, and failure; show idempotency lookups and compensating releases. This often reveals missing decisions hidden in a class diagram.",
    "tradeoff": "Sequence diagrams are scenarios, not exhaustive proofs. Keep participants relevant, label synchronous/asynchronous calls clearly, and document transaction boundaries.",
    "drills": [
      "Explain sequence in 90 seconds with one concrete scenario.",
      "What common assumption about this topic would fail in a production system?"
    ]
  },
  "identify-objects": {
    "concept": "To identify objects in OOD, start with required workflows and domain nouns, then test which nouns have durable identity, lifecycle, state, or behavior. Many nouns are attributes, values, external systems, or operations rather than classes.",
    "mechanics": [
      "Define the precise contract and invariants involved in identify objects before choosing implementation details.",
      "Trace one successful interaction through the responsible objects, noting where state is changed and who owns it.",
      "Analyze an edge case such as invalid input, concurrent execution, partial failure, or inappropriate inheritance.",
      "Use tests or measurements to validate the claimed property, and distinguish language rules from implementation choices."
    ],
    "worked": "For an online checkout extract Cart, Order, LineItem, PaymentAttempt, InventoryReservation, and Customer. 'Price' may be an immutable Money value; 'discounting' may be a PricingPolicy behavior; 'checkout' may be an application service.",
    "tradeoff": "Avoid turning every noun into a class or every verb into a subclass. Validate the model with two or three end-to-end scenarios, especially cancellation and concurrent access.",
    "drills": [
      "Explain identify objects in 90 seconds with one concrete scenario.",
      "What common assumption about this topic would fail in a production system?"
    ]
  }
});
