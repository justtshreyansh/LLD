# Practice Tasks — Interfaces vs Abstract Classes (TypeScript)
 
Graded tasks from easy to hard. Solve them yourself first, then get your code reviewed.
 
---
 
## 🟢 Level 1: Abstract Class Basics
 
Build a `Shape` abstract class with:
- `color: string` field (set via constructor)
- a concrete method `describe()` that prints `"This is a {color} shape"`
- an abstract method `area(): number`
Then create `Circle` and `Rectangle` classes extending `Shape`, each implementing `area()`.
Test by calling `describe()` and `area()` on both.
 
*(Practices: state + concrete method + abstract method combo)*
 
---
 
## 🟢 Level 2: Interface Basics
 
Create two interfaces — `Drivable` (`drive()`) and `Chargeable` (`charge()`).
Build an `ElectricCar` class implementing both.
 
Then think: if you also need a `Car` (petrol) that implements only `Drivable`, not `Chargeable` —
would this have been as clean with abstract classes? Write 1–2 lines of reasoning.
 
---
 
## 🟡 Level 3: Same Method, Different Interfaces (No Conflict Case)
 
Create two interfaces — `Printable` (`print(): void`) and `Loggable` (`print(): void` — same signature!).
Build a `Report` class implementing both with a single `print()` method.
 
Verify it compiles with no error, and explain **why**, in your own words (2–3 lines).
 
---
 
## 🟡 Level 4: Conflict Case (Structural Mismatch)
 
Create two interfaces:
 
```typescript
interface A {
  getValue(): string;
}
interface B {
  getValue(): number;
}
```
 
Try `interface C extends A, B {}`. Copy the error and explain, in your own words, why
TypeScript throws it (think structural typing).
 
Then try the same with `class C implements A, B {}` — is the error message the same or different?
 
---
 
## 🟡 Level 5: Abstract Class + Interface Combo (Real-World Pattern)
 
Build a payment system:
- `Payable` interface with `pay(amount: number): void`
- `Employee` abstract class with a `name: string` field, a constructor, a concrete method
  `showDetails()` that prints the name, and implements `Payable` — but leave `pay()` abstract
- `Manager` and `Intern` classes extending `Employee`, each implementing `pay()` differently
  (Manager = fixed salary, Intern = hourly rate calculation)
---
 
## 🔴 Level 6: Mixins (Multiple Inheritance with Actual Code)
 
Create three mixins:
- `CanFly` — `fly()` prints `"Flying..."`
- `CanSwim` — `swim()` prints `"Swimming..."`
- `CanWalk` — `walk()` prints `"Walking..."`
Build a base class `Animal` (with `name` field). Then build a `Duck` class combining all three
mixins: `CanWalk(CanSwim(CanFly(Animal)))`.
 
Test: `duck.fly()`, `duck.swim()`, `duck.walk()` should all work.
 
---
 
## 🔴 Level 7: Mixin Conflict (Real Diamond Problem in Practice)
 
Create two mixins with the **same method name** but **different code**:
 
```typescript
function MixinA<TBase extends Constructor>(Base: TBase) {
  return class extends Base {
    move() { console.log("Moving via A"); }
  };
}
 
function MixinB<TBase extends Constructor>(Base: TBase) {
  return class extends Base {
    move() { console.log("Moving via B"); }
  };
}
```
 
Build `class Combined extends MixinB(MixinA(Base)) {}`.
 
Predict (write it down) what `combined.move()` will print, then run it to verify.
Now **swap the order** (`MixinA(MixinB(Base))`) — does the output change? Explain why,
in terms of the prototype chain.
 
---
 
## 🔴 Level 8: Design Challenge (Bringing It All Together)
 
Design a small **Notification System**:
- `Notifiable` interface — `send(message: string): void`
- `Loggable` interface — `log(message: string): void`
- Abstract class `BaseNotifier` — a concrete method that adds a timestamp to the message,
  and an abstract `send()`
- `EmailNotifier` and `SMSNotifier` — extend `BaseNotifier` and implement `Notifiable` + `Loggable`
Write one line each justifying why you used an abstract class here and why interfaces separately.
 
---