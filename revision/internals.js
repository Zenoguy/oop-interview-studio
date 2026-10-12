window.REVISION_CHAPTERS=Object.assign(window.REVISION_CHAPTERS||{}, {
  "vtable": {
    "concept": "Virtual dispatch enables a call to an overridden method without knowing the receiver's concrete type at compile time. C++ implementations commonly use vtable pointers in polymorphic objects; Java virtual calls are resolved by JVM method-dispatch machinery that may use implementation-specific method tables and inline caches. The Java language does not mandate a literal C++-style vtable layout.",
    "mechanics": [
      "Distinguish compile-time overload resolution from runtime receiver-method selection.",
      "In C++, declare a virtual method to enable polymorphic overriding; ensure a polymorphic base destructor is virtual when deleting through a base pointer.",
      "Recognize that ABI/object layout and number of vptrs can vary with multiple inheritance.",
      "In JIT-managed runtimes, devirtualization, inline caches, and class-hierarchy analysis can optimize dynamic calls."
    ],
    "worked": "Base* p = new Derived; p->draw() selects Derived::draw if draw is virtual. Without virtual, a base-qualified static call may result. In Java, Shape s = new Circle(); s.area() normally invokes Circle.area(), but the JVM is free to optimize the common call target.",
    "tradeoff": "Dynamic dispatch adds indirection and restricts some optimizations, but is often not a measurable bottleneck. Avoid claiming exact object size or vtable layout without specifying compiler, target, and ABI. Explain contract behavior before discussing implementation mechanics.",
    "drills": [
      "Is a Java vtable a language guarantee?",
      "Why might a polymorphic C++ base need a virtual destructor?"
    ]
  },
  "mro": {
    "concept": "Python's Method Resolution Order is the linear order in which classes are searched for attributes and methods. Modern Python uses C3 linearization to preserve local base ordering, monotonicity, and consistency across diamond-shaped hierarchies. super() means 'continue at the next entry in this MRO,' not necessarily 'call my direct parent.'",
    "mechanics": [
      "Inspect Class.__mro__ to see the final lookup order.",
      "Respect the base-class order: class D(B,C) prioritizes B before C within a consistent hierarchy.",
      "Make cooperative methods accept compatible signatures and call super() once when appropriate.",
      "Beware inconsistent base ordering: Python rejects some hierarchies because no valid C3 linearization exists."
    ],
    "worked": "A defines save(), B(A) and C(A) each override save() and call super(). D(B,C) follows D→B→C→A→object. Calling super() in B can reach C, not A directly. This makes mixin chains powerful but requires all participants to cooperate.",
    "tradeoff": "Don't treat super() as a fixed parent reference. For independent features with complex initialization, explicit composition may be easier to understand than a long cooperative MRO. Attribute lookup also uses descriptors; MRO alone is not the full descriptor protocol.",
    "drills": [
      "What does D.__mro__ show?",
      "Why does super() in B sometimes invoke C?"
    ]
  },
  "metaclass": {
    "concept": "In Python, classes are runtime objects normally created by the metaclass type. __new__ allocates or constructs an object; __init__ initializes an already-created one. A metaclass can customize class creation, while an instance's __new__ and __init__ customize individual object construction.",
    "mechanics": [
      "Class statement execution builds a namespace, then invokes the metaclass to create the class object.",
      "For ordinary instances, type.__call__ coordinates __new__ followed by __init__ when the returned instance has the appropriate type.",
      "Use __new__ for immutable object construction or controlling returned objects; use __init__ for ordinary state initialization.",
      "Consider __init_subclass__, descriptors, decorators, or explicit registries before metaclasses."
    ],
    "worked": "A RegistryMeta can record every concrete handler class at class-definition time. Often a simpler BaseHandler.__init_subclass__ hook does the same job with less magic. For an immutable tuple subclass, __new__ may normalize its values before creation because __init__ cannot change the tuple's content.",
    "tradeoff": "Metaclasses are powerful but introduce implicit behavior and difficult debugging. They are appropriate for frameworks with deliberate class-creation contracts, not routine application business logic.",
    "drills": [
      "What is the difference between __new__ and __init__?",
      "When can __init_subclass__ replace a metaclass?"
    ]
  },
  "copy": {
    "concept": "A shallow copy creates a new outer container or object while retaining references to nested objects; a deep copy recursively duplicates reachable state according to language-specific rules. Copies raise questions of object identity, shared resources, cycles, immutability, and ownership—not simply how much memory is duplicated.",
    "mechanics": [
      "Draw an object graph and mark which nodes a copy operation duplicates.",
      "For shallow copies, expect mutations to shared nested mutable nodes to be visible from both copies.",
      "For deep copies, use a memo/visited map to preserve graph sharing and terminate cycles.",
      "Do not blindly duplicate file handles, database connections, locks, or external identities."
    ],
    "worked": "A User has profile: {address:{city:'Kolkata'}}. A shallow copy makes a new outer User/profile reference arrangement but may share the address object. Changing copied.address.city can affect the original. A correctly deep-copied address avoids that aliasing.",
    "tradeoff": "Immutable nested values can safely be shared, and a deep copy may be prohibitively expensive. Python copy.deepcopy and Java cloning libraries have different extension hooks. Ask what kind of independence the caller actually needs.",
    "drills": [
      "Why does shallow copying nested lists surprise developers?",
      "What should a deep-copy implementation do when it sees a cycle?"
    ]
  },
  "cloning": {
    "concept": "Cloning is an explicit object-duplication operation whose semantics must be defined: same identity or a new identity, shared immutable fields or duplicated mutable fields, and whether invariants are revalidated. Java's Object.clone mechanism is historically awkward because it can bypass constructors and defaults to field-by-field copying.",
    "mechanics": [
      "Define the intended contract: snapshot, template copy, forked entity, or new independent aggregate.",
      "Choose a copy constructor, factory, serialization transform, or explicit clone method.",
      "Keep unique identifiers and ownership-sensitive dependencies deliberate rather than copying all fields mechanically.",
      "Test nested mutation, cyclic graphs, final fields, and domain invariants in the result."
    ],
    "worked": "Cloning a DraftOrder may copy its line items but must generate a new order ID and clear prior payment state. A naive clone retaining the payment transaction ID could later cause a duplicate-charge or reconciliation error.",
    "tradeoff": "In Java, prefer clear copy constructors or static factories over Cloneable for most domain types. For immutable values, no deep cloning is needed. A 'copy' of an entity may actually be a domain operation with business rules.",
    "drills": [
      "Why can a naive clone duplicate a domain identity?",
      "What is a safer alternative to Object.clone in Java?"
    ]
  },
  "gc": {
    "concept": "Garbage collection identifies objects that are no longer reachable and reclaims their memory; OOP neither requires GC nor specifies one collector. Common approaches include tracing mark/sweep or compacting collection, generational strategies, and reference counting. Memory safety, resource cleanup, and latency are separate topics.",
    "mechanics": [
      "Tracing collectors start from roots (stacks, globals, runtime references) and mark reachable objects.",
      "Generational collectors exploit the empirical observation that many objects die young, but collection details vary by runtime.",
      "Pure reference counting reclaims when counts hit zero but cannot collect cycles without another mechanism.",
      "Pauses, barriers, allocation rate, and heap sizing influence throughput and latency; measure with runtime tooling."
    ],
    "worked": "A cache stores references to 100,000 user sessions indefinitely. Even if the sessions are no longer used elsewhere, the cache remains a root-reachable owner, so GC cannot reclaim them. Add bounded eviction and observe heap profiles rather than blaming the collector.",
    "tradeoff": "Do not claim 'GC prevents leaks.' It prevents some manual deallocation errors but cannot infer semantic lifetimes. Java uses tracing collectors; CPython typically combines reference counting with cycle detection. Deterministic resource release still requires explicit patterns.",
    "drills": [
      "Why does reference counting alone fail on cycles?",
      "Can a Java application leak memory even with GC?"
    ]
  },
  "memory-leaks": {
    "concept": "A memory leak is retained storage that is no longer useful but remains reachable or unreleased. A resource leak is failure to close handles, connections, sockets, subscriptions, or threads. Circular references are not universally leaks: tracing GCs can reclaim unreachable cycles; reference-count-only systems need cycle handling.",
    "mechanics": [
      "Look for long-lived roots: static maps, event listeners, thread-locals, closures, caches, and pending tasks.",
      "Compare heap snapshots and retained sizes; identify what retains the objects, not only which class allocates them.",
      "Use bounded caches, unsubscribe on teardown, remove thread-local values, and close resources deterministically.",
      "Reproduce under load and verify steady-state memory/handle counts stabilize after cleanup."
    ],
    "worked": "A UI subscribes to EventBus each time a screen mounts but never unregisters. The bus holds listener closures that capture the screen, retaining hundreds of abandoned screens. Unsubscribe in a lifecycle cleanup method and verify retained listeners return to baseline.",
    "tradeoff": "Do not equate every cycle with a leak or every high heap watermark with runaway retention. Modern allocators retain reserved memory; inspect live objects and handles. Leaks often cross object ownership boundaries.",
    "drills": [
      "How can an event listener leak a whole UI screen?",
      "Why is a cycle collectable under tracing GC but problematic for plain ref-counting?"
    ]
  },
  "immutability": {
    "concept": "An immutable object has no externally observable change after construction. Deep immutability must account for nested references, not merely final fields. Immutable values simplify reasoning, thread sharing, caching, and equality-based keys because consumers cannot alter previously observed state.",
    "mechanics": [
      "Make state private and initialize it completely during construction.",
      "Avoid mutator methods; return new values when changes are required.",
      "Defensively copy or use deeply immutable nested collections; return immutable views carefully.",
      "Preserve equals/hashCode semantics and safe publication, particularly when using immutable objects as map keys."
    ],
    "worked": "Money(100, 'INR') plus Money(25, 'INR') returns Money(125, 'INR') rather than modifying an operand. If Money stores a mutable CurrencyDetails reference, that object must also be immutable or copied to maintain the promise.",
    "tradeoff": "Immutable models may allocate more temporary values; structural sharing and persistent data structures can mitigate this. Mutable local builders are often fine. Choose immutability for values and shared configuration, while stateful entities still need controlled transitions.",
    "drills": [
      "Why doesn't Java final guarantee deep immutability?",
      "Why is immutability helpful for hash-map keys and concurrency?"
    ]
  },
  "di-ioc": {
    "concept": "Dependency Injection supplies an object with its collaborators from outside rather than requiring it to construct them. Inversion of Control is the broader principle of moving control of setup or execution to a surrounding framework or composition root. A dependency injection container automates wiring but is not required.",
    "mechanics": [
      "List external collaborators and define contracts only where they express useful boundaries.",
      "Prefer constructor injection for required dependencies and optional setters only for truly optional features.",
      "Centralize wiring in a composition root; scope singleton, request, and transient instances intentionally.",
      "Avoid service-locator calls in business methods, which hide dependencies and make tests harder to set up."
    ],
    "worked": "OrderService(PaymentGateway, OrderRepository, Clock) uses injected dependencies. Production wiring supplies the real gateway/database/system clock; tests supply a fake gateway, in-memory repository, and fixed clock. The service remains ignorant of framework annotations.",
    "tradeoff": "A DI container simplifies large dependency graphs but adds indirection and lifecycle complexity. Manual constructor injection is sufficient for many static applications. Do not confuse having annotations with correct dependency boundaries.",
    "drills": [
      "What is the composition root?",
      "Why is a service locator often harder to test than constructor injection?"
    ]
  }
});
