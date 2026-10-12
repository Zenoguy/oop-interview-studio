window.REVISION_CHAPTERS=Object.assign(window.REVISION_CHAPTERS||{}, {
  "inheritance-types": {
    "concept": "Inheritance shapes describe how classes relate across a hierarchy, not necessarily which syntax every language permits. Single inheritance means one base class; multilevel chains bases; hierarchical inheritance has siblings; multiple inheritance takes several parents; hybrid combines structures. Each added relationship increases the number of contracts that must remain valid.",
    "mechanics": [
      "Sketch A→B for single and A→B→C for multilevel inheritance.",
      "Sketch A→B and A→C for hierarchical; note that both B and C inherit the base contract.",
      "For multiple inheritance draw D→B and D→C. Ask what happens if B and C share an ancestor.",
      "Explain language limits: Java supports a single superclass but multiple interfaces; Python/C++ support multiple class bases."
    ],
    "worked": "Build a catalog: Product is a base class, PhysicalProduct and DigitalProduct are siblings, and DownloadableSoftware extends DigitalProduct. Before turning shipping into a Product method, notice that it does not apply to downloadable items. Model Shippable as a separate capability instead.",
    "tradeoff": "Inheritance diagrams are descriptive, not design instructions. Excessive branching creates inherited assumptions and difficult migrations. Most business hierarchies benefit from composition, capabilities, or a sealed sum of variants rather than every conceivable inheritance shape.",
    "drills": [
      "How do single, multilevel, hierarchical, and hybrid inheritance differ?",
      "Which forms can Java classes express directly?"
    ]
  },
  "diamond": {
    "concept": "The diamond arises when one derived class inherits two paths to a common ancestor. The key questions are whether there is one or more ancestor subobjects and which overridden implementation wins. Different languages intentionally choose different resolution mechanisms.",
    "mechanics": [
      "Draw A at the top, B and C inheriting A, and D inheriting both B and C.",
      "In ordinary C++ multiple inheritance, D may contain two A subobjects; use virtual inheritance to share the common base.",
      "In Python, C3 linearization produces a consistent MRO; cooperative super() calls the next method in that MRO.",
      "Java forbids extending two classes; conflicting default interface methods require the class to resolve ambiguity explicitly."
    ],
    "worked": "A defines speak(). B and C override it. D extends B,C in Python; D's lookup follows the computed MRO, not naive depth-first traversal. In Java, if I1 and I2 declare conflicting default speak(), D implements both and must provide its own override.",
    "tradeoff": "Do not claim that interfaces completely eliminate diamond conflicts or that virtual inheritance erases every ambiguity. Document the dispatch rules and consider delegation when inherited state and behavior would be difficult to reason about.",
    "drills": [
      "What is duplicated in a nonvirtual C++ diamond?",
      "How does Python's super() interact with MRO?"
    ]
  },
  "association": {
    "concept": "Association represents knowledge or interaction between otherwise independent objects. It does not imply lifetime ownership, nor does it require storing a field; a method parameter, identifier, or lookup can express an association. Multiplicity matters for both code and data modeling.",
    "mechanics": [
      "Identify the two participants and their responsibilities without assuming one owns the other.",
      "Specify cardinality (one-to-one, one-to-many, or many-to-many) and navigability.",
      "Decide whether association is represented by an object reference, repository lookup, or stable identifier.",
      "Specify how stale or deleted referenced objects are handled and whether the relationship itself has attributes."
    ],
    "worked": "A Teacher teaches several Courses and a Course can have many Teachers. A Join/Assignment entity can hold semester, section, and role. Neither object is destroyed when the other disappears, so this is not composition.",
    "tradeoff": "Avoid diagramming every temporary parameter as an association. Model relationships that matter to invariants and workflows. In distributed systems, reference by identifier may avoid coupling lifetimes and deployments.",
    "drills": [
      "Does association imply that deleting one object destroys the other?",
      "When would a many-to-many association deserve its own entity?"
    ]
  },
  "aggregation": {
    "concept": "Aggregation is a weak whole–part relationship: a whole groups parts whose identity and lifecycle are independent. UML uses a hollow diamond at the whole end. In implementation it often looks identical to an association and is frequently unnecessary for communicating a design.",
    "mechanics": [
      "Identify the whole (Team) and members (Player) and ask whether a member can exist without the whole.",
      "Check whether a member can be transferred to another whole without losing identity.",
      "Use a hollow diamond in UML only if the whole–part grouping adds clarity.",
      "Do not use collection fields as automatic evidence of aggregation; ownership semantics are the differentiator."
    ],
    "worked": "A Department holds Employees, but an employee continues to exist after reassignment or department deletion. The department groups employees, yet does not own their lifetime. Deleting the department should not cascade-delete employee records.",
    "tradeoff": "Many UML practitioners prefer a simple association unless a team has a precise reason to distinguish shared aggregation. An empty diamond adds little value if the lifecycle semantics are not documented.",
    "drills": [
      "Why is Team–Player often aggregation rather than composition?",
      "How is aggregation distinct from ordinary association in code?"
    ]
  },
  "composition": {
    "concept": "Composition is a strong whole–part relationship: the whole owns the parts in the domain model and controls their lifecycle. It communicates invariants and aggregate boundaries, not just a nested field. In UML, the black diamond is at the owner end.",
    "mechanics": [
      "Identify an owning root and the parts that make sense only as elements of that root.",
      "Guard mutations through methods on the owner, preserving aggregate-level invariants.",
      "Decide how persistence handles cascading create/delete and orphan removal.",
      "Do not allow components to silently attach to multiple owners if the model requires exclusive ownership."
    ],
    "worked": "An Invoice owns InvoiceLine values. A line has meaning only in that invoice and its total contributes to the invoice's amount. addLine(productId, quantity, unitPrice) validates quantity and computes totals; invoice deletion removes those lines.",
    "tradeoff": "Composition in UML is semantic ownership; Java garbage collection does not automatically delete referenced objects when an owner is collected, and an ORM cascade is an implementation decision. A shared Address reference might be association, not composition.",
    "drills": [
      "Where is the black diamond drawn?",
      "Why does a field of type List<Item> not by itself prove composition?"
    ]
  },
  "composition-over-inheritance": {
    "concept": "Composition builds behavior by combining objects with focused roles instead of constructing large inheritance trees. Delegation lets the owner select or replace a collaborator independently. This is often more resilient to change because the owner depends on a contract rather than parent-class internals.",
    "mechanics": [
      "Identify the variable capability (tax calculation, shipping estimate, notification transport).",
      "Extract a small interface for that behavior and implement it in separate collaborators.",
      "Inject a collaborator through a constructor or explicit configuration rather than hard-coding new ConcreteType().",
      "Keep lifecycle and responsibility boundaries clear so composition does not produce a chain of pointless wrappers."
    ],
    "worked": "Instead of PremiumExpressOrder extending ExpressOrder extending Order, give Order a PricingPolicy and ShippingPolicy. Compose PremiumPricing with ExpressShipping when needed. Future combinations do not require creating one subclass for every possible pair.",
    "tradeoff": "Inheritance remains useful for a genuine, stable 'is-a' contract and some framework extension models. Composition can introduce indirection or configuration complexity; a tiny fixed variation may not justify it. Ask which dimension of change is independently variable.",
    "drills": [
      "What is the subclass explosion problem?",
      "How does strategy injection help testing?"
    ]
  },
  "deep-hierarchies": {
    "concept": "A deep inheritance chain makes behavior depend on many ancestors. A child may inherit preconditions, mutable protected fields, hooks, and overrides that are not obvious in its own file. This is the fragile base-class problem: changing a parent for one use case can inadvertently break descendants.",
    "mechanics": [
      "Map all superclass methods that can call subclass overrides; hidden dynamic dispatch is a common surprise.",
      "Identify duplicate overrides and inherited mutable state.",
      "Flatten the hierarchy around stable capabilities or use delegation for cross-cutting behavior.",
      "Protect changes with contract tests that run against every subtype, not only the base class."
    ],
    "worked": "A framework has Widget→FocusableWidget→ScrollableWidget→EditableWidget→RichEditor. A new focus change in Widget calls an overridable method before EditableWidget is initialized, causing a crash. Separating FocusBehavior and ScrollBehavior can reduce the hidden dependency chain.",
    "tradeoff": "Shallow hierarchy is not a rule that every class must have exactly one ancestor. Removing inheritance blindly may duplicate contracts and produce many forwarding methods. Prefer clarity and stable invariants over a numerical depth target.",
    "drills": [
      "What is the fragile base-class problem?",
      "How do contract tests expose a broken subtype?"
    ]
  },
  "abstract-interface": {
    "concept": "In Java, an interface specifies a capability contract and may contain default/static methods, while an abstract class can hold shared state, constructors, and protected implementation. A concrete Java class can extend only one class but implement multiple interfaces. Language versions and conventions matter.",
    "mechanics": [
      "Use interfaces for capabilities consumed by multiple unrelated implementers, such as Clock, Repository, or PaymentGateway.",
      "Use an abstract class when closely related subclasses truly share initialization, invariants, and maintained implementation.",
      "Avoid adding unrelated defaults to interfaces, since they can create compatibility and ambiguity concerns.",
      "Prefer composition if a reusable implementation is not part of a genuine subtype contract."
    ],
    "worked": "EmailSender and SmsSender can both implement Sender; neither should inherit shared fields from an ArtificialSenderBase merely to satisfy an API. A parser framework could provide AbstractParser with a canonical algorithm and protected parseToken hook when implementation sharing is essential.",
    "tradeoff": "An interface is not guaranteed to be stateless or purely abstract in modern Java; default methods exist. Conversely, an abstract class is not always superior for code sharing because single inheritance constrains future extension.",
    "drills": [
      "Can a Java interface contain implemented methods?",
      "When would an abstract superclass be better than a pure interface?"
    ]
  },
  "mixins-traits": {
    "concept": "Mixins and traits package reusable behavior that can be combined without committing to a deep traditional class hierarchy. Their exact semantics vary: Python mixin classes participate in MRO, and language-level traits in other languages may define explicit method/associated-type contracts. This is not the same as simply supporting multiple base classes.",
    "mechanics": [
      "Isolate an orthogonal feature such as timestamping, serialization, or audit logging.",
      "Keep required host APIs narrow and document how the mixin obtains its collaborators.",
      "For Python mixins, use cooperative super() consistently and inspect the resulting MRO.",
      "Resolve conflicting implementations explicitly; multiple providers of a method should not silently create ambiguous contracts."
    ],
    "worked": "A Python TimestampMixin adds created_at behavior to several model types while an AuditMixin records changes. Both may coexist, but any shared method names and super() usage must be designed for composition. An alternative is a separate AuditService injected into the object.",
    "tradeoff": "Mixins can spread hidden dependencies and obscure object initialization. They help with genuinely orthogonal reusable features; prefer explicit delegation when a mixin would require many undocumented attributes or lifecycle hooks.",
    "drills": [
      "Why must Python mixins cooperate with MRO?",
      "What is a warning sign that a mixin should become a collaborator?"
    ]
  },
  "multiple-lang": {
    "concept": "Multiple inheritance is supported differently across Java, C++, and Python. Compare both syntax and behavior: whether multiple stateful superclasses are permitted, how conflicts are resolved, and what dispatch ordering guarantees exist.",
    "mechanics": [
      "Java permits one class superclass and multiple implemented interfaces; unrelated default methods can conflict.",
      "C++ permits multiple base classes; pointer adjustments and virtual inheritance influence layout and diamond behavior.",
      "Python permits multiple bases and uses C3 method resolution for consistent lookup ordering.",
      "Design APIs around contracts and object ownership, then pick language-supported mechanisms rather than copying a foreign language's rule."
    ],
    "worked": "Suppose both Printable and Serializable expose format(). A Java class implementing conflicting default format methods must supply a disambiguating override. In Python, a similarly shaped hierarchy follows __mro__; in C++, qualified calls or explicit overrides can resolve ambiguity.",
    "tradeoff": "'Multiple inheritance is always bad' is too simplistic, but stateful multiple inheritance has substantial complexity. Java interfaces avoid multiple inherited instance fields yet still require handling default-method conflicts. Know the language and codebase policy.",
    "drills": [
      "Does Java allow inheriting implementations from multiple interfaces?",
      "How does C++ virtual inheritance relate to the diamond?"
    ]
  }
});
