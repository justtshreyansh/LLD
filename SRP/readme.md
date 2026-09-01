# SRP Practice Tasks (TypeScript)

Below is some "bad code" that violates the Single Responsibility Principle. Your job is to fix it (split the classes) so that each class has **only one reason to change**.

Once your solution is ready, send it to me — I'll check it and tell you whether it's right or wrong (and why).

---

## Task 1 (Warm-up) — `Marksheet` class

```ts
class Marksheet {
  studentName: string;
  marks: number[];

  constructor(studentName: string, marks: number[]) {
    this.studentName = studentName;
    this.marks = marks;
  }

  calculatePercentage(): number {
    // calculates percentage from marks
    return this.marks.reduce((a, b) => a + b, 0) / this.marks.length;
  }

  printMarksheet(): void {
    // prints formatted marksheet to console
    console.log(`${this.studentName}: ${this.calculatePercentage()}%`);
  }

  saveToFile(): void {
    // saves marksheet data to a .txt file
  }
}
```

**Question:** How many responsibilities is this class handling? Which ones? Split it into classes/modules that each follow SRP.

---

## Task 2 (A bit tricky) — `OrderManager` class

```ts
interface Item {
  name: string;
  price: number;
}

class OrderManager {
  items: Item[] = [];

  addItem(item: Item): void {
    this.items.push(item);
  }

  calculateTotal(): number {
    // sums up price of all items, applies discount
    return this.items.reduce((sum, i) => sum + i.price, 0);
  }

  sendConfirmationEmail(customerEmail: string): void {
    // connects to SMTP/email service and sends email
  }

  generateInvoicePDF(): void {
    // creates a PDF invoice
  }
}
```

**Question:** Is it correct to keep `addItem` and `calculateTotal` in the same class, or should they also be separated? Give your reasoning, then design the class(es)/module(s).

---

## Task 3 (Real-world twist) — `UserController`

```ts
class UserController {
  registerUser(name: string, email: string, password: string): void {
    // validates input (checks email format, password length)
    // hashes the password
    // saves user to database
    // sends a welcome email
    // logs the registration event to a log file
  }
}
```

**Question:** How many "reasons to change" are hidden in this single method? Identify each responsibility and create separate classes/modules for them. Bonus: think about what the final, clean version of `UserController` will look like when it uses all these classes as dependencies (constructor injection or simple imports).

---

## How to submit your answer

For each task:
1. State how many responsibilities exist and what they are (in plain words)
2. Write the refactored TS code (classes/interfaces)
3. In one line, state each new class's "reason to change"

Once you send it, I'll check all three points.