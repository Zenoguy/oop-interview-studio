window.REVISION_CHAPTERS=Object.assign(window.REVISION_CHAPTERS||{}, {
  "singleton": {
    "concept": "Singleton restricts construction to one instance per defined scope and provides an access mechanism. In practice the difficult part is defining 'one': per JVM, per class loader, per application container, or per distributed deployment are different guarantees. A singleton is also a global dependency when accessed statically.",
    "mechanics": [
      "Hide or control construction and decide when the instance is initialized.",
      "For Java, prefer an enum singleton for a strict simple JVM singleton, or a static holder for lazy initialization.",
      "If using double-checked locking, the instance reference must be volatile for correct visibility and publication.",
      "Test initialization failure, serialization/reflection edge cases, and the fact that it does not imply a globally unique instance across machines."
    ],
    "worked": "A ProcessConfig is initialized once and read by many components. If it is immutable, a singleton can work. But a global mutable SessionRegistry causes cross-test interference and races; an application-scoped registry injected through constructors offers clearer ownership and easier tests.",
    "tradeoff": "Use it sparingly for process-wide stateless or immutable infrastructure with a clear lifecycle. Avoid it for user state, replaceable external services, and objects whose tests need independent instances. Singleton is not automatically thread-safe.",
    "drills": [
      "Why does double-checked locking use volatile in Java?",
      "Can a JVM singleton guarantee exactly one instance across Kubernetes replicas?"
    ]
  },
  "factory": {
    "concept": "Factory Method is a GoF creational pattern in which a base creator declares a construction hook that subclasses can implement to choose a concrete product. A simple factory is a separate, commonly used conditional construction function; it is useful but not the same structural pattern.",
    "mechanics": [
      "Specify a Product contract independent of construction details.",
      "Have Creator run shared workflow and call createProduct() at the variation point.",
      "ConcreteCreator subclasses create the appropriate ConcreteProduct.",
      "Compare with a standalone simple factory if subclassing the creator adds no value."
    ],
    "worked": "A DocumentExporter.run() handles authentication, formatting, and cleanup but calls createWriter(). CsvExporter creates CsvWriter; PdfExporter creates PdfWriter. The rest of the workflow uses Writer rather than concrete constructors.",
    "tradeoff": "Use Factory Method when subclasses need to choose one family member during a stable shared process. Prefer a simple function or dependency injection when creation is trivial. Avoid large creator hierarchies when constructors could be passed directly.",
    "drills": [
      "How does Factory Method differ from a simple factory?",
      "What changes when the product's construction requires new dependencies?"
    ]
  },
  "abstract-factory": {
    "concept": "Abstract Factory creates families of related products intended to work together. Its value is maintaining consistency across several related components without exposing concrete classes to the client. Unlike Factory Method, it primarily exposes multiple creation operations through a factory interface.",
    "mechanics": [
      "Identify product families such as WindowsButton/WindowsDialog and MacButton/MacDialog.",
      "Define interfaces for each product role and a factory that creates the family.",
      "Implement one concrete factory per family; inject the chosen factory into consumers.",
      "Ensure compatible products come from the same factory, then test a family as an integrated set."
    ],
    "worked": "A cross-platform UI receives WidgetFactory with createButton() and createDialog(). WindowsFactory returns Windows widgets, while MacFactory returns Mac widgets. The screen-building code remains unchanged and cannot accidentally mix platforms if it uses one factory.",
    "tradeoff": "Choose Abstract Factory when families are cohesive and must vary together. Adding a new product role modifies the factory interface and every concrete factory, so it is not ideal when the product dimensions are unstable.",
    "drills": [
      "Why does adding a new kind of product hurt Abstract Factory?",
      "When is a single Factory Method simpler?"
    ]
  },
  "builder": {
    "concept": "Builder separates the steps of constructing a complex object from its final representation. It makes optional parameters clear, supports validation, and can produce immutable results. In languages with named/default arguments, builders remain useful mostly when construction has many dependent settings or staged rules.",
    "mechanics": [
      "Keep required fields explicit in the builder constructor or first stage.",
      "Provide clearly named methods for optional choices; return the builder to support chaining.",
      "Validate cross-field invariants in build() and produce a defensive, immutable object.",
      "Decide whether the builder is reusable, single-use, or thread-confined, and document it."
    ],
    "worked": "HttpRequest.builder(url).method(POST).timeout(3s).header('Accept','application/json').build() checks that url exists and disallows incompatible combinations. The resulting HttpRequest copies header data so later builder mutation cannot change a submitted request.",
    "tradeoff": "For two simple parameters, a constructor is clearer. Avoid builders that allow invalid partially specified states to leak into callers. Builder is not automatically better than named parameters, records, or factories.",
    "drills": [
      "How can a builder help an immutable value object?",
      "Where should validation occur when fields depend on each other?"
    ]
  },
  "strategy": {
    "concept": "Strategy encapsulates interchangeable algorithms behind a shared interface. The client selects or receives a strategy and delegates behavior, rather than carrying conditionals for each variant. The choice is generally external to the strategy object's own internal state.",
    "mechanics": [
      "Locate an algorithmic variation such as pricing, sorting, rate limits, or shipping policy.",
      "Define a narrow strategy contract with well-defined input and output.",
      "Pass an implementation into the context at construction or selection time.",
      "Use contract tests to guarantee common expectations and variant tests for distinct behavior."
    ],
    "worked": "CheckoutService uses PricingStrategy. StudentPricing and LoyaltyPricing implement price(cart) differently. The caller chooses an appropriate policy based on eligibility. Checkout never asks 'if student ... else if loyalty ...' while executing the calculation.",
    "tradeoff": "Great for independently varying algorithms, but unnecessary for one short conditional with fixed alternatives. Compared with State, Strategy is usually chosen from outside; State transitions itself based on events and current state.",
    "drills": [
      "What is the difference between Strategy and State?",
      "When would creating a class for every price rule be excessive?"
    ]
  },
  "observer": {
    "concept": "Observer establishes one-to-many notification when an observable event occurs. Implementations can be synchronous in-process callbacks or asynchronous message-driven subscribers, but these have very different delivery, ordering, and failure guarantees. It reduces direct knowledge of consumers.",
    "mechanics": [
      "Specify the event and what its payload promises; prefer immutable event data.",
      "Define subscription and unsubscription to avoid duplicate observers and leaks.",
      "Decide if callbacks run synchronously or through a queue; handle exceptions and slow listeners.",
      "For distributed pub/sub, document at-least-once delivery, retries, ordering, and idempotency explicitly."
    ],
    "worked": "An OrderPaid event triggers invoice generation and loyalty updates. In-process listeners may run during the request; a durable message broker can decouple processing but needs delivery guarantees and deduplication. The checkout transaction must not silently claim success before its durable event is recorded.",
    "tradeoff": "Observer helps decoupling but complicates debugging and event ordering. A simple direct call is often better when the receiver is mandatory and synchronous. Avoid confusing this pattern with a guarantee of exactly-once delivery.",
    "drills": [
      "What happens when one observer throws an exception?",
      "How does an event broker change delivery semantics?"
    ]
  },
  "decorator": {
    "concept": "Decorator wraps an object behind the same interface to add behavior transparently. Multiple wrappers can be stacked, so the base feature remains reusable and the combination order becomes significant. Unlike a subclass explosion, decorators compose optional capabilities dynamically.",
    "mechanics": [
      "Define the component interface (e.g., read(), write(), send()).",
      "Make the decorator implement that interface and hold another component of the same interface.",
      "Delegate the core operation while adding behavior before or after it.",
      "Test wrapper ordering, exceptions, resource ownership, and whether method contracts remain intact."
    ],
    "worked": "A BufferedInputStream wraps an InputStream, reducing underlying reads; an additional monitoring decorator counts bytes. The client still uses InputStream, but wrapper placement changes what is measured (logical read calls versus underlying reads).",
    "tradeoff": "Useful for optional cross-cutting features, logging, caching, buffering, and compression. Avoid deep stacks of invisible wrappers when behavior or debugging becomes confusing. A Proxy may share the shape but controls access or lifetime rather than primarily adding features.",
    "drills": [
      "Why can decorator order change behavior?",
      "What distinguishes Decorator from Proxy?"
    ]
  },
  "adapter": {
    "concept": "Adapter translates one interface to another so an existing component can be reused by clients that expect a different contract. It is especially useful around external APIs, old code, and infrastructure boundaries. The adapter owns translation of types, errors, and sometimes units.",
    "mechanics": [
      "Define the client-facing target interface in the application's language.",
      "Wrap or compose the adaptee with a concrete adapter.",
      "Translate inputs, results, and exception semantics; do not leak vendor-specific types.",
      "Write contract tests for boundary behavior, especially when one API is async, retryable, or has different units."
    ],
    "worked": "The app expects PaymentGateway.charge(Money, requestId), but a provider SDK exposes createPayment(amountInCents, metadata). StripeAdapter converts Money safely, passes an idempotency key, and normalizes provider errors into domain outcomes.",
    "tradeoff": "An adapter should not hide genuinely different semantics behind a misleading signature. If one provider settles later, an immediate-success interface is wrong. Prefer refining the domain contract over pretending that every API is interchangeable.",
    "drills": [
      "Why is wrapping a vendor SDK in an adapter useful for testing?",
      "What should happen when the provider uses a different money unit?"
    ]
  },
  "proxy": {
    "concept": "Proxy controls access to another object while exposing the same or a compatible interface. Typical roles include authorization, lazy initialization, caching, remote access, and access monitoring. The proxy often decides whether and when the underlying object is invoked.",
    "mechanics": [
      "Define a subject interface used by callers.",
      "Keep a reference to the real subject or a way to create/connect to it.",
      "Intercept calls for access checks, caching, remote transport, or lazy load.",
      "Preserve documented behavior, especially exceptions, identity, concurrency, and expiration semantics."
    ],
    "worked": "ImageProxy loads the large source file only when render() is first called. Alternatively, an AuthorizationProxy checks the user role before forwarding getReport(). A RemoteProxy forwards calls across the network and must expose failure and latency realities.",
    "tradeoff": "Decorator emphasizes adding composable behavior; Proxy emphasizes mediating access. The class structure can look identical, so interviewers expect intent and semantics, not just a diagram.",
    "drills": [
      "How is a remote proxy different from a local decorator?",
      "What thread-safety issue could a lazy-loading proxy have?"
    ]
  },
  "template-method": {
    "concept": "Template Method defines the skeleton of an algorithm in a base class and allows subclasses to customize selected steps. It uses inheritance and usually relies on a final or otherwise fixed orchestration method so subclasses cannot bypass required invariants.",
    "mechanics": [
      "Write the invariant high-level flow such as validate→transform→persist→notify.",
      "Keep that orchestration in one base-class method.",
      "Expose limited abstract or overridable hooks for steps that truly vary.",
      "Use hooks carefully; document ordering, error handling, and whether super must be called."
    ],
    "worked": "AbstractDataImporter.importData() opens input, validates, parses, records errors, and closes resources. CsvImporter overrides parseRecords(); JsonImporter overrides the same step. The base method enforces resource cleanup regardless of format.",
    "tradeoff": "Choose it for a stable process with related subclasses. Strategy or higher-order composition is often better when behavior varies at runtime or multiple steps need independent changes. Excessive protected hooks can make hierarchy reasoning fragile.",
    "drills": [
      "Why should orchestration often be final?",
      "When is Strategy easier to extend than Template Method?"
    ]
  },
  "chain": {
    "concept": "Chain of Responsibility passes a request through a sequence of handlers. Each handler may handle, reject, transform, or forward the request. The pattern separates middleware stages from their final consumer, but ordering and termination rules are part of the contract.",
    "mechanics": [
      "Define a handler interface and a representation for the request/context.",
      "Compose an ordered list or linked chain of handlers.",
      "State which handlers can short-circuit and whether one or multiple handlers may act.",
      "Ensure exceptions, cancellation, resource cleanup, and tracing propagate correctly."
    ],
    "worked": "An HTTP pipeline runs correlation-ID middleware, authentication, authorization, rate limiting, and the final route handler. Authentication may reject early; tracing should still record the failure. Moving auth after expensive work would waste resources or leak data.",
    "tradeoff": "Excellent for pipelines with independently configurable stages. Avoid chains with implicit ordering or hidden fallthrough, especially when security checks could accidentally be bypassed.",
    "drills": [
      "What happens if a handler forgets to call next?",
      "How do you ensure authentication cannot be bypassed by handler order?"
    ]
  },
  "command": {
    "concept": "Command wraps a request as an object that can be stored, queued, logged, retried, or reversed. The command carries operation parameters and invokes a receiver or handler. Undo is not automatic; it requires a meaningful compensating action or state snapshot.",
    "mechanics": [
      "Define a command with execute() or handler dispatch and explicit input data.",
      "Separate command creation from the component that performs the operation.",
      "If implementing undo, store the information needed to reverse it; handle irreversibility and conflicts.",
      "For queued commands, design idempotency keys, retries, serialization, and failure handling."
    ],
    "worked": "A text editor represents InsertText(position, text) as a command. Undo removes precisely the inserted span if the document version still matches. A billing command cannot simply 'undo' a settled card charge; it may issue a separate refund command with audit history.",
    "tradeoff": "Useful for history, delayed execution, or durable jobs. Overkill for trivial direct method calls. Don't conflate undo with rolling back a database transaction; one may involve external side effects.",
    "drills": [
      "What data must an undoable command retain?",
      "Why must queued commands be idempotent or deduplicated?"
    ]
  },
  "state": {
    "concept": "State models an object's behavior as a function of its current state and incoming event. State-specific objects or an explicit transition table decide permitted operations and transitions. Unlike Strategy, the active state usually changes due to events in the object's lifecycle.",
    "mechanics": [
      "List legitimate states and events before writing classes.",
      "Write a transition table that includes forbidden transitions and failure conditions.",
      "Encapsulate each state's behavior or use a clear state machine implementation.",
      "Persist and synchronize transitions when multiple threads or replicas can act on the same entity."
    ],
    "worked": "An order progresses CREATED→PAID→SHIPPED→DELIVERED, with CANCELLED allowed in selected states. pay() cannot run from DELIVERED. If two processes ship the same order, use a version check or conditional update to enforce one transition.",
    "tradeoff": "A state pattern is useful for complex state-specific behavior. A small enum and switch can be clearer for a few fixed states, especially if exhaustive compiler checks are available. Avoid accidentally permitting state transitions outside the owner.",
    "drills": [
      "How is a State pattern different from Strategy?",
      "How would you prevent a double transition from two workers?"
    ]
  },
  "memento": {
    "concept": "Memento captures an object's internal state for later restoration without exposing its representation to outside callers. The Originator creates/restores snapshots; a Caretaker stores history but should not reach into the internals. Snapshot depth and memory usage are central design concerns.",
    "mechanics": [
      "Choose which state must be captured for meaningful restore.",
      "Create an immutable snapshot value with ownership of nested mutable data.",
      "Store snapshots in a bounded history or incremental log.",
      "Restore through the originator while validating compatibility with current object versions."
    ],
    "worked": "A drawing editor records CanvasMemento containing the positions and styles of shapes. Undo restores a previous snapshot. If the snapshot shares mutable shape lists with the live canvas, changing the canvas can corrupt old history; deep immutability or copy-on-write is needed.",
    "tradeoff": "Snapshots are simple for small state but expensive for large graphs. Command history, diffs, or event sourcing may be more efficient and auditable. Memento is not a substitute for durable transactional backups.",
    "drills": [
      "Why must a memento avoid mutable aliasing?",
      "When would a command history beat full snapshots?"
    ]
  },
  "flyweight": {
    "concept": "Flyweight reduces memory usage by sharing immutable, frequently repeated intrinsic state while supplying varying extrinsic state separately. It is a performance optimization for huge populations of similar objects, not a general rule that everything should be cached or interned.",
    "mechanics": [
      "Measure memory and find repeated immutable data across many objects.",
      "Split intrinsic shared data from extrinsic per-instance context.",
      "Store flyweights in a cache keyed by intrinsic identity.",
      "Make shared flyweight state immutable or safely synchronized and consider cache lifecycle."
    ],
    "worked": "A text editor may display millions of character glyphs. Font/glyph metrics can be shared while each character's position and formatting context remain separate. A forest renderer shares TreeType textures, passing each tree's location during rendering.",
    "tradeoff": "Flyweight trades memory for indirection and management overhead. Shared mutable state risks cross-object corruption. Use profiling to prove meaningful savings; for small collections, normal object allocation is easier.",
    "drills": [
      "Which information belongs inside vs outside a flyweight?",
      "What bug results if shared intrinsic state becomes mutable?"
    ]
  },
  "facade": {
    "concept": "Facade offers a simple, cohesive entry point to a complex subsystem. It does not necessarily hide every subsystem API; advanced clients may still access lower-level parts. The objective is to reduce coordination burden and stabilize common workflows.",
    "mechanics": [
      "Identify a repeated multi-step workflow that callers currently assemble themselves.",
      "Define a high-level API expressing caller intent instead of raw subsystem operations.",
      "Delegate to internal components with clear ordering, errors, and transaction boundaries.",
      "Keep the facade narrow; do not turn it into a catch-all God Object."
    ],
    "worked": "TravelBookingFacade.bookTrip() orchestrates search, inventory reservation, payment authorization, and confirmation. The caller sees one operation, but the facade must account for failures and compensation when reservation succeeds but payment fails.",
    "tradeoff": "Facade simplifies use; Adapter changes an interface; Proxy controls access. A facade may become overly coupled to many services if it absorbs all business logic. Expose important failure semantics rather than disguising partial success.",
    "drills": [
      "How does Facade differ from Adapter?",
      "Where should compensation for partial booking failure live?"
    ]
  }
});
