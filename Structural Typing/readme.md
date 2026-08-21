# Structural Typing — Practice Tasks
 
Each task below has a code snippet. For each one, figure out:
 
1. Will this **compile, or throw an error**?
2. If it errors, **why** (one line reason).
Answer in the form: `Task 1: ✅ Compiles, because...` or `Task 1: ❌ Errors, because...`
 
---
 
## Task 1 — Basic shape match
 
```ts
interface Point {
  x: number;
  y: number;
}
 
const p = { x: 10, y: 20, z: 30 };
const point: Point = p;
```
 
---
 
## Task 2 — Fresh literal
 
```ts
interface Point {
  x: number;
  y: number;
}
 
const point: Point = { x: 10, y: 20, z: 30 };
```
 
---
 
## Task 3 — Alias mix-up
 
```ts
type Kilometers = number;
type Miles = number;
 
function driveKm(dist: Kilometers) {
  console.log(dist);
}
 
const tripInMiles: Miles = 26;
 
driveKm(tripInMiles);
```
 
---
 
## Task 4 — Class comparison
 
```ts
class Wallet {
  private balance = 0;
  constructor(public owner: string) {}
}
 
class Bag {
  private balance = 0;
  constructor(public owner: string) {}
}
 
const w: Wallet = new Bag("Riya");
```
 
---
 
## Task 5 — Empty type
 
```ts
type Anything = {};
 
function process(input: Anything) {
  console.log(input);
}
 
process(null);
```
 
---
 
## Task 6 — Mix it up
 
```ts
interface Shape {
  sides: number;
}
 
class Polygon {
  constructor(public sides: number, private id: number) {}
}
 
const s: Shape = new Polygon(5, 1);
```
 
This one's a bit tricky — note that `Shape` is an interface (no private field), while `Polygon` is a class (has a private field). Think about whether the private-field nominal exception applies only to **class-to-class** comparisons, or to **interface-to-class** comparisons too.
 
---
 
When ready, send your answers task by task and they'll be checked.
 