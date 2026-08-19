# Project: Payment Processing System (TypeScript)
 
## Goal
Earlier we did the **Notification System** and **Game Character** examples — both involved "behaviors" (sending, moving). This project takes a slightly different angle: here you'll learn that composition isn't just for "mixing multiple behaviors" — it's also used for **swapping different implementations of the same thing** (like Stripe vs PayPal vs Cash). This is also called the **Strategy Pattern** — a very common real-world use case of composition.
 
As a bonus, you'll learn a second concept too: **composition within composition** (nested composition) — when an object itself is made up of several smaller composed objects.
 
---
 
## Part 1: First try it with Inheritance (the wrong approach, to feel the problem)
 
1. Create a base class `PaymentMethod` with:
   - A `pay(amount: number): void` method (prints to console)
2. Extend it to create:
   - `CreditCardPayment`
   - `PayPalPayment`
3. Now this requirement comes in: **"We need a 'CashOnDelivery' payment that first says 'confirm', then pays, similar to how CreditCard does it, but also has an extra 'verify delivery address' step."**
   Try to fit this into the inheritance model. You'll find that:
   - Either you have to extend `CreditCardPayment` (which is semantically odd — CashOnDelivery "IS-A" CreditCard doesn't make sense)
   - Or you end up duplicating code
   Just spend 5-10 minutes trying this, then note down your observation — finding a perfect solution isn't the point, just feel the friction.
---
 
## Part 2: Rebuild with Composition (Strategy Pattern)
 
### Step 1 — Create an interface
```
interface PaymentStrategy {
  pay(amount: number): void;
}
```
 
### Step 2 — Create concrete strategies
- `CreditCardStrategy` — prints: `"💳 Paid ₹<amount> via Credit Card"`
- `PayPalStrategy` — prints: `"🅿️ Paid ₹<amount> via PayPal"`
- `UpiStrategy` — prints: `"📲 Paid ₹<amount> via UPI"` (bonus, India-relevant!)
### Step 3 — Create an `Order` class that **composes** the strategy
```
class Order {
  constructor(
    private items: string[],
    private totalAmount: number,
    private paymentStrategy: PaymentStrategy   // 👈 composition happens here
  ) {}
 
  checkout(): void {
    // print items, total amount
    // then call this.paymentStrategy.pay(this.totalAmount)
  }
}
```
 
### Step 4 — Test it
- Create an order using `CreditCardStrategy`
- Using the same `Order` class, create an order using `PayPalStrategy`
- Notice — there's **no if/else anywhere** in the `Order` class checking payment type. That's the benefit of composition.
---
 
## Part 3: Runtime Strategy Switching
 
1. Add a method in `Order`:
```
changePaymentMethod(newStrategy: PaymentStrategy): void
```
 
2. Simulate a scenario:
   - User initially selected CreditCard
   - Before checkout, they changed their mind and selected UPI
   - Call `changePaymentMethod()` to switch the strategy, then call `checkout()`
   Notice how easy this is — same `Order` object, just swapped the payment strategy.
---
 
## Part 4 (Bonus — Nested Composition, slightly tougher)
 
Now a new concept: a **Discount System**, which itself uses composition.
 
1. Create an interface:
```
interface DiscountStrategy {
  applyDiscount(amount: number): number;   // return the new amount after applying discount
}
```
 
2. Implementations:
   - `NoDiscount` — returns the same amount
   - `FlatDiscount` (takes a flat amount in constructor, e.g. ₹100 off)
   - `PercentageDiscount` (takes a percentage in constructor, e.g. 10% off)
3. Add another composed field in `Order`: `discountStrategy: DiscountStrategy`
4. In `checkout()`, apply the discount first, then call `paymentStrategy.pay()` on the final amount.
5. Test: Create an order that composes `PercentageDiscount(10)` and `UpiStrategy` together.
**What you'll see:** The `Order` object is now composing **two independent behaviors** (payment + discount), and neither is aware of the other — loosely coupled. This is exactly how real production code looks.
 
---
 
## When you submit, tell me:
 
1. The complete code (Part 1, 2, 3, 4)
2. Exactly what problem you ran into in Part 1 when trying to fit CashOnDelivery in
3. In one line: how does the Strategy Pattern relate to plain composition (your own observation)
4. If you have time: think about how the design would change if you also needed to compose some validation logic inside `PaymentStrategy` (like a `FraudCheckStrategy`) — no need to write code, just think it through
---
 
## Tip
If you get stuck anywhere, ask yourself:
> "Can I break this behavior into a small, independent class whose name feels like an interface?"
 
If yes, that's your composition piece.
 
Good luck! 🚀
 
