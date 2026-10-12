window.REVISION_CHAPTERS=Object.assign(window.REVISION_CHAPTERS||{}, {
  "encapsulation": {
    "concept": "Encapsulation is the practice of placing state and the operations that control it behind a boundary. The important result is that every observable state transition preserves the object's invariants: a bank balance cannot become negative through an unsupported operation, and a cart cannot contain a negative quantity. Visibility keywords help enforce the boundary, but do not create a useful API on their own.",
    "mechanics": [
      "Identify invariants before writing getters and setters: balance >= 0, quantity > 0, status changes only through permitted transitions.",
      "Expose intention-revealing operations such as reserveStock, cancelOrder, and withdraw; validate preconditions inside those operations.",
      "Keep collections and mutable value objects private. Return immutable views, defensive copies, or purpose-built read models where needed.",
      "Consider concurrency: checking a condition and updating the field may need one lock or transaction, not two separately synchronized methods."
    ],
    "worked": "Suppose Order exposes setStatus(String). Any caller can skip PAYMENT_PENDING and jump directly to SHIPPED. Replace this with pay(paymentId), dispatch(trackingId), and cancel(reason). Each operation checks the current state, records the transition, and rejects illegal transitions. Tests assert the invariant after every operation.",
    "tradeoff": "Avoid ceremonial getters/setters for every field; they often just turn private fields into a public mutable API. A data-transfer object is allowed to expose its data when it is genuinely a passive transport type. Encapsulation is about protecting behavior and rules, not making all fields private at any cost.",
    "drills": [
      "Why can getItems() violate encapsulation even if items is private?",
      "How would you prevent two concurrent withdrawals from violating the balance invariant?"
    ]
  },
  "abstraction": {
    "concept": "Abstraction describes the behavior a caller may rely on while omitting unnecessary implementation detail. An interface, abstract base class, module API, or function boundary can all provide abstraction. Good abstractions reflect stable domain capabilities rather than incidental implementation details or the naming of a particular vendor.",
    "mechanics": [
      "Identify the client capability: charge a payment, publish an event, or load a profile.",
      "Define inputs, outputs, error semantics, and operational guarantees, including retries and idempotency when relevant.",
      "Keep vendor-specific types and configuration behind an adapter so clients do not depend on the implementation.",
      "Test the contract against at least one real implementation and one fake; overly vague abstractions are hard to use correctly."
    ],
    "worked": "Checkout depends on PaymentProcessor. The Stripe implementation translates the request into Stripe-specific calls; a fake implementation returns predefined outcomes during tests. Checkout need not change if the payment vendor changes, provided the processor contract still defines what success, timeout, and duplicate request mean.",
    "tradeoff": "Do not create an interface for every class. Introduce one when there is a meaningful contract, a test seam, or a likely implementation boundary. Also distinguish abstraction from encapsulation: the former hides implementation complexity; the latter controls state and preserves invariants.",
    "drills": [
      "What makes an abstraction stable rather than simply another layer?",
      "How would an abstraction expose retryable vs permanent payment errors?"
    ]
  },
  "inheritance": {
    "concept": "Inheritance establishes a subtype relationship in which a derived class receives members and participates in a parent's contract. The decisive question is whether a derived instance can stand in for a base instance without surprising callers. Reuse is a side effect, not the main justification.",
    "mechanics": [
      "List the base type's observable promises, including behavior, exceptions, and invariants.",
      "Check that every derived type preserves those promises and does not demand stronger preconditions.",
      "Prefer narrow extension points; do not expose protected mutable internals that subclasses can corrupt.",
      "Use delegation to reuse implementation when the subtype relationship is false or change frequently affects several hierarchy branches."
    ],
    "worked": "If Bird.fly() is a required base behavior, Penguin extends Bird but cannot fulfill the contract. Better model Bird with common bird behavior and Flying with a separate capability. FlyingBird can implement Flying, while Penguin does not have to fake fly() or throw UnsupportedOperationException.",
    "tradeoff": "Inheritance can be appropriate for framework extension hooks, stable domain subtypes, and sealed hierarchies with well-defined invariants. It is a poor fit for optional capabilities, rapidly changing variation, or sharing a few helper methods. Watch for the fragile base-class problem: superclass changes can affect subclasses invisibly.",
    "drills": [
      "Why is Square extending a mutable Rectangle frequently a Liskov violation?",
      "When would a sealed hierarchy be preferable to a strategy interface?"
    ]
  },
  "polymorphism": {
    "concept": "Polymorphism lets one call site operate on values of different types through a shared contract. Subtype polymorphism uses overriding and dynamic dispatch, parametric polymorphism uses generics, and ad-hoc polymorphism includes overloading. The central benefit is isolating variation behind a shared behavior.",
    "mechanics": [
      "Define the operation that stays conceptually constant, such as calculateFare or serialize.",
      "Provide concrete implementations that each honor the same input/output and error contract.",
      "Let the caller invoke the contract without knowing which concrete type it received.",
      "Distinguish dispatch kinds: a Java overridden instance method dispatches by runtime receiver type; an overloaded method is selected using compile-time types."
    ],
    "worked": "A report service accepts Exporter and calls exporter.export(report). CsvExporter, PdfExporter, and JsonExporter implement different formats without adding another conditional to the report service. New formats can be added without changing the consumer, though the composition root must still choose an implementation.",
    "tradeoff": "Polymorphism trades conditional branches for indirection and types. It shines when implementations grow independently or require testing separately. One local conditional over two fixed cases can be clearer; do not create a class hierarchy solely to eliminate a short switch.",
    "drills": [
      "Can overloaded methods alone provide runtime polymorphism in Java?",
      "How would you add a format without modifying ExportService?"
    ]
  },
  "class-object": {
    "concept": "A class usually specifies fields, constructors, methods, and shared metadata; an object is an instantiated value with its own identity and state. Languages differ: Java classes and class objects exist at runtime, C++ object layout depends on type and ABI, and Python classes themselves are objects.",
    "mechanics": [
      "Separate type-level features (static methods, constants, class metadata) from each instance's own fields.",
      "Distinguish identity from equality: two user instances may represent equal data yet be distinct objects.",
      "Understand lifecycle: allocating an object, initializing it, using it, and allowing it to be reclaimed or explicitly destroyed.",
      "Do not infer storage location from the words class or object: stack/heap and representation are language- and allocation-dependent."
    ],
    "worked": "Two Cart objects both have a List<Item> field. Mutating cartA should not change cartB unless their lists intentionally reference the same object. A static List<Item> mistakenly shared across carts violates this separation. Java's Cart.class metadata exists even before an instance is constructed.",
    "tradeoff": "The blueprint analogy helps beginners but is incomplete for prototype-based languages and runtime reflection. The common claim that a class occupies zero memory should be qualified: a class definition is not an instance, but class metadata, statics, and method code occupy storage.",
    "drills": [
      "What is shared by every instance and what is allocated per instance?",
      "Can two distinct objects be equal but not identical?"
    ]
  },
  "access": {
    "concept": "Access control defines which parts of a program can depend on a member. Java public is broadly accessible, private is limited to the enclosing top-level context/nest, package-private is available within the package, and protected allows package access plus specified subclass access across packages. C++ and Python differ substantially.",
    "mechanics": [
      "Begin with private implementation details and intentionally widen visibility only for a collaborator's legitimate need.",
      "Expose a small public API that expresses supported operations rather than internal representation.",
      "Use package-private or internal/module visibility to enable collaboration without committing to a global API.",
      "Use protected carefully: subclasses inherit coupling to implementation details, and Java protected access rules depend on package and receiver type."
    ],
    "worked": "An InventoryService has a private Map of stock. A public reserve(sku, amount) method enforces availability and updates atomically. A package-private calculator can support collaborating classes and tests without revealing the Map to customers of the package.",
    "tradeoff": "Visibility is not a security boundary against hostile code, reflection, or unsafe access. It is chiefly an API design and maintenance tool. Default Java visibility is package-private; Java has no 'default' access keyword for members.",
    "drills": [
      "Does protected in Java mean accessible only to subclasses?",
      "When is package-private a better choice than public?"
    ]
  },
  "static-dynamic": {
    "concept": "Static or compile-time polymorphism selects an operation using information known by the compiler. Dynamic or runtime polymorphism selects an overridden implementation based on an object's actual type. These ideas explain overload resolution, virtual methods, and why a base-typed reference can call subclass behavior.",
    "mechanics": [
      "For overloading, list candidate signatures and resolve which is applicable using the declared argument types and language rules.",
      "For overriding, determine the actual receiver object at runtime and select its most-specific override.",
      "Remember Java static methods are hidden rather than overridden, and fields are resolved by the reference's declared type.",
      "Understand overload-versus-override interaction: overload selection occurs before runtime method dispatch."
    ],
    "worked": "Given void show(Object) and void show(String), calling show(null) chooses String because it is more specific. Given Animal a = new Dog(); a.speak() dispatches to Dog.speak(), but a.staticInfo() refers to Animal's static method. The declared type and runtime type influence different stages.",
    "tradeoff": "Compile-time dispatch permits more predictable call resolution and often easier optimization; runtime dispatch enables substitutable behavior. Modern JITs may devirtualize common dynamic calls, so 'virtual always slow' is not a reliable performance rule.",
    "drills": [
      "Why can changing a variable's declared type change overload selection?",
      "Why does a Java static method not participate in overriding?"
    ]
  },
  "overload-override": {
    "concept": "Overloading declares multiple methods with one name but different parameter lists. Overriding replaces an inherited, overridable instance method with compatible behavior. An override must respect access, return-type, exception, and behavioral compatibility rules; an overload does not participate in runtime override dispatch.",
    "mechanics": [
      "In Java, parameter count/types/order distinguish overloads; return type alone does not.",
      "An override generally preserves the parameter signature, may narrow the return type covariantly, and cannot reduce visibility.",
      "An overriding Java method cannot broaden checked exceptions beyond what the overridden method permits.",
      "Use @Override to catch accidental overloads caused by a slightly different parameter type."
    ],
    "worked": "A base class defines process(Number). A subclass defines process(Integer) and assumes it overrode the method. It did not: it added an overload. Calls through a base reference still choose process(Number). Use @Override and the correct signature when dynamic specialization is intended.",
    "tradeoff": "Overloads are helpful for convenience but create ambiguous calls (notably null and varargs) and can behave unexpectedly under inheritance. Prefer distinct names when overloads encode materially different operations; favor overriding only for genuine subtypes.",
    "drills": [
      "Can you overload solely by changing a method's return type in Java?",
      "Why is @Override useful even if the compiler accepts the class without it?"
    ]
  },
  "this-super": {
    "concept": "In instance code, this refers to the current receiver. In Java, super accesses overridden/inherited members and invokes a superclass constructor; this(...) invokes another constructor in the same class. The language restricts where constructor invocations may occur, and initialization order affects the safety of subclass behavior.",
    "mechanics": [
      "Use this.field to disambiguate a field from a constructor parameter of the same name.",
      "Use this(...) to centralize validation or defaults instead of duplicating constructor logic.",
      "Use super(...) to initialize required base state; Java automatically calls an accessible no-arg superclass constructor when no explicit call is made in the classic case.",
      "Avoid calling overridable methods from constructors: subclass state might not yet be initialized."
    ],
    "worked": "A User(id, role) constructor delegates defaults from User(id) using this(id, 'viewer'). The canonical constructor validates id. A subclass AdminUser calls super(id, 'admin') before initializing its own fields. Calling an overridable loadPermissions() from User's constructor would be risky.",
    "tradeoff": "Remember this is not available from Java static contexts. Python uses self and super() with different mechanisms; C++ this is a pointer. Interview answers should name the target language and not transfer Java constructor rules unchanged.",
    "drills": [
      "What goes wrong if a base constructor invokes an overridden method?",
      "When should constructor overloads delegate through this(...)?"
    ]
  },
  "static-instance": {
    "concept": "Instance members represent state or behavior tied to a specific receiver. Static members belong to a type-level context and are shared or called without a receiver. This distinction matters for memory semantics, test isolation, dependency injection, and concurrency.",
    "mechanics": [
      "Place per-user fields, such as balance and cart items, on the instance.",
      "Use static final for true constants, but recognize that final does not make a referenced mutable object immutable.",
      "Reserve static mutable state for carefully managed shared resources; document synchronization and lifecycle.",
      "Prefer injected dependencies over hidden static globals when you need different implementations across tests or environments."
    ],
    "worked": "A DiscountCalculator can be stateless and expose a static pure helper, but CheckoutService should normally receive a PricingPolicy instance. If a global static pricingPolicy is replaced mid-test or by another thread, behavior becomes non-deterministic.",
    "tradeoff": "Static does not necessarily mean stored in the same place in all languages; the conceptual distinction is ownership and binding. Static functions can be an excellent fit for pure utilities. Avoid assuming static state is inherently thread-safe.",
    "drills": [
      "Why is static List<Item> an alarming field in a shopping cart?",
      "When is a static utility method preferable to an injected service?"
    ]
  },
  "constructors": {
    "concept": "Constructors establish the initial valid state of an instance. In Java, the compiler synthesizes a no-argument default constructor only when you declare none. Parameterized constructors enforce required input; a Java copy constructor is a user-defined convention, while constructor chaining shares the validation path.",
    "mechanics": [
      "Define invariants such as nonempty identifiers and valid monetary values before object creation.",
      "Choose required constructor parameters rather than allowing impossible half-initialized objects.",
      "Delegate overloads toward one canonical validation path with this(...).",
      "If copying, decide whether nested mutable state should be shared, shallow-copied, or deep-copied; document ownership."
    ],
    "worked": "Money(amount, currency) checks currency and numeric validity. Money(amount) delegates to Money(amount, 'INR') if a default is appropriate. Money(Money other) copies immutable scalar fields safely. For Cart, copying only the List reference would accidentally share mutable items.",
    "tradeoff": "Too many positional constructor parameters hurt readability; a builder or named factory can help. A constructor should generally avoid network calls or other unpredictable side effects, since failures and test setup become harder to control.",
    "drills": [
      "When does Java generate a default constructor?",
      "What decisions must a copy constructor make about nested mutable objects?"
    ]
  },
  "lifecycle": {
    "concept": "Memory reclamation and resource cleanup are not the same task. Garbage collectors reclaim unreachable memory, whereas operating-system resources such as sockets, files, and locks should be released deterministically. C++ destructors run at scope exit or explicit object destruction; Python __del__ and Java finalization have different and weaker guarantees.",
    "mechanics": [
      "Java: make owned closeable resources implement AutoCloseable and use try-with-resources.",
      "Python: use with and context managers for deterministic exits; do not rely on __del__.",
      "C++: represent ownership via RAII, destructors, unique_ptr, and proper move/copy semantics.",
      "Think through both normal flow and exceptional flow, including partial initialization and nested resources."
    ],
    "worked": "A report-export method opens a file, writes rows, then may throw while formatting a row. try-with-resources still closes the file. In C++, a stack-owned ofstream closes when the scope unwinds. Java finalize() is deprecated for removal and should not be part of correctness.",
    "tradeoff": "A destructor is not universally the mirror of a constructor across languages. GC can release memory without timely closing files. Resource ownership should be explicit, especially in services with long lifetimes and many open connections.",
    "drills": [
      "Why is 'we have GC' not an answer to file descriptor leaks?",
      "How does RAII behave when an exception interrupts an operation?"
    ]
  },
  "final-sealed-const": {
    "concept": "These keywords restrict different dimensions of change. Java final on a variable prevents reassignment; final on a method prevents overriding; final on a class prevents subclassing. Java sealed types explicitly limit permitted subclasses. C++ const prevents mutation through a particular access path, with subtleties involving mutable members and pointers.",
    "mechanics": [
      "Use final references in Java to prevent rebinding, not as a guarantee of deep immutability.",
      "Use sealed hierarchies for a closed family of variants, and consider exhaustiveness checks where supported.",
      "Use final classes/methods for explicit contract boundaries and to restrict unsupported extension.",
      "In C++, distinguish const T*, T* const, and const member functions; they constrain different things."
    ],
    "worked": "A final List<String> names cannot point to a different list, but names.add('x') may still mutate it. A sealed PaymentResult permits Success and Failure, making the domain state space explicit. A const std::vector<int>& does not permit modification through that reference.",
    "tradeoff": "Do not overuse final/sealed to block all extensibility by default. Decide whether a type is intentionally open for extension or intentionally closed for safety; sealed can improve modeling but adds change coordination for new variants.",
    "drills": [
      "Does final List make the list immutable?",
      "When does sealed outperform a public abstract superclass?"
    ]
  }
});
