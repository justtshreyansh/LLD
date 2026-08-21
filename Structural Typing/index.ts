// ===== Task 1 — Basic shape match =====
interface PointA {
  x: number;
  y: number;
}

const p1 = { x: 10, y: 20, z: 30 };
const pointA: PointA = p1;

// ✅ Works — PointA only requires x and y, both present in p1.
// Extra property z is fine because p1 went through a variable, not a fresh literal.


// ===== Task 2 — Fresh literal (excess property check) =====
interface PointB {
  x: number;
  y: number;
}

const pointB: PointB = { x: 10, y: 20, z: 30 };
// ❌ Error — fresh object literal with an extra property (z) trips the
// excess property check. TS assumes it might be a typo.


// ===== Task 3 — Alias mix-up =====
type Kilometers = number;
type Miles = number;

function driveKm(dist: Kilometers) {
  console.log(dist);
}

const tripInMiles: Miles = 26;

driveKm(tripInMiles);
// ✅ Works (but logically wrong!) — Kilometers and Miles are both just
// `number` under the hood. Type aliases are nicknames, not new types.


// ===== Task 4 — Class comparison (private field) =====
class Wallet {
  private balance = 0;
  constructor(public owner: string) {}
}

class Bag {
  private balance = 0;
  constructor(public owner: string) {}
}

const w: Wallet = new Bag("Riya");
// ❌ Error — both classes declare their own `private balance`. Private
// members are tied to their declaration site, not their shape. This is
// the one place TS behaves nominally instead of structurally.


// ===== Task 5 — Empty type =====
type Anything = {};

function process(input: Anything) {
  console.log(input);
}

process(null);
// ❌ Error (with strictNullChecks, which is default/recommended) —
// every other value has *some* shape (even zero properties), so it
// satisfies `{}`. null/undefined have no shape at all, so they're
// excluded from this check entirely.


// ===== Task 6 — Interface vs class (private field, no conflict) =====
interface Shape {
  sides: number;
}

class Polygon {
  constructor(public sides: number, private id: number) {}
}

const s: Shape = new Polygon(5, 1);
// ✅ Works — Shape has no private member of its own, so Polygon's
// private `id` is irrelevant. The "private field wall" from Task 4
// only applies when BOTH sides declare a private member that must match.