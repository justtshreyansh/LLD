# 🅿️ Parking Lot System — OOD Practice Project

A classic Object-Oriented Design (OOD) interview question, solved step by step from first principles. This README documents the completed design, the reasoning behind each decision, and the core OOD principles it demonstrates.

---

## 🎯 Problem Statement

* Model `ParkingLot`, `ParkingSpot` (abstract, subclasses: `Compact`, `Large`, `Handicapped`), and `Vehicle` (`Car`, `Truck`, `Motorcycle`).
* `ParkingLot` uses composition — it holds a collection of `ParkingSpot`, not inheritance.
* Implement `park(vehicle)` and `leave(vehicle)` with correct spot-matching rules (a Motorcycle can use any spot, a Truck only Large).
* **Bonus:** a pricing strategy per spot type using an injected interface (Strategy Pattern).

---

## 🧠 First Principles: How to Approach Any OOD Problem

Before writing any code, ask these 4 questions:

1. **What are the nouns?** → These become your classes (`Vehicle`, `ParkingSpot`, `ParkingLot`)
2. **What are the behaviors/actions of each noun?** → These become methods (`park()`, `leave()`)
3. **What's the relationship between the nouns?** → IS-A (inheritance) or HAS-A (composition)?
4. **What is likely to change in the future?** → Hide it behind an interface/strategy (here: pricing)

The problem statement gives away two hints: *"composition, not inheritance"* for `ParkingLot`, and *"injected interface"* for pricing — this is a direct setup for the **Strategy Pattern**.

---

## 🪜 Milestone 1 — Vehicle Hierarchy

**Concept:** `Car`, `Truck`, `Motorcycle` are each a `Vehicle` (IS-A relationship) — inheritance is the right tool here.

### Design Decisions Made
- Used an **abstract class** (not just an interface) for `Vehicle`, because `licensePlate` and its constructor logic were identical across all subclasses. An abstract class lets you share concrete code while still enforcing an abstract contract (`getType()`).
- Kept `VehicleType` limited to actual vehicle categories only: `CAR`, `TRUCK`, `MOTORCYCLE`. Initially, "size" concepts (`COMPACT`, `LARGE`) were mistakenly mixed into this enum — but *size* is a property of a **spot**, not a vehicle, so they were kept separate.

### Key Lesson
Interface vs. Abstract Class — use an interface for a pure contract with no shared code; use an abstract class when subclasses share implementation (fields, constructors, concrete methods) alongside an enforced contract.

```typescript
enum VehicleType {
    CAR, TRUCK, MOTORCYCLE
}

abstract class Vehicle {
    licensePlate: string;
    constructor(licensePlate: string) {
        this.licensePlate = licensePlate;
    }
    abstract getType(): VehicleType;
}

class Car extends Vehicle {
    getType(): VehicleType { return VehicleType.CAR; }
}

class Truck extends Vehicle {
    getType(): VehicleType { return VehicleType.TRUCK; }
}

class Motorcycle extends Vehicle {
    getType(): VehicleType { return VehicleType.MOTORCYCLE; }
}
```

---

## 🪜 Milestone 2 — ParkingSpot Hierarchy

**Concept:** `CompactSpot`, `LargeSpot`, `HandicappedSpot` are each a `ParkingSpot` — inheritance again.

### Matching Rules Implemented

| Vehicle | CompactSpot | LargeSpot | HandicappedSpot |
|---|---|---|---|
| Motorcycle | ✅ | ✅ | ✅ |
| Car | ✅ | ✅ | ❌ |
| Truck | ❌ | ✅ | ❌ |

### Key Design Decision
`canFitVehicle(vehicle: Vehicle)` takes a full `Vehicle` object (not just a `VehicleType`). This keeps matching logic flexible — if a future rule needs more than just type (e.g. weight, length), only `ParkingSpot`'s internal logic changes; callers stay untouched.

Each subclass implements its own matching rule — this is **polymorphism replacing an if-else chain**. `ParkingLot` never needs to know "which vehicle fits which spot"; each spot decides for itself (Single Responsibility Principle).

```typescript
abstract class ParkingSpot {
    spotId: string;
    isOccupied: boolean;
    parkedVehicle: Vehicle | null;
    pricingStrategy: PricingStrategy;

    constructor(spotId: string, pricingStrategy: PricingStrategy) {
        this.spotId = spotId;
        this.isOccupied = false;
        this.parkedVehicle = null;
        this.pricingStrategy = pricingStrategy;
    }

    getPrice(duration: number): number {
        return this.pricingStrategy.calculatePrice(duration);
    }

    abstract canFitVehicle(vehicle: Vehicle): boolean;
}

class CompactSpot extends ParkingSpot {
    canFitVehicle(vehicle: Vehicle): boolean {
        return vehicle.getType() !== VehicleType.TRUCK;
    }
}

class LargeSpot extends ParkingSpot {
    canFitVehicle(vehicle: Vehicle): boolean {
        return true;
    }
}

class HandiCappedSpot extends ParkingSpot {
    canFitVehicle(vehicle: Vehicle): boolean {
        return vehicle.getType() === VehicleType.MOTORCYCLE;
    }
}
```

---

## 🪜 Milestone 3 — ParkingLot (Composition)

**Concept:** `ParkingLot` is not a `ParkingSpot` and not a `Vehicle` — it **has** spots. This is a HAS-A relationship, so composition is used, not inheritance.

### Implementation Notes
- `ParkingLot` holds a `ParkingSpot[]` as a member field.
- `park(vehicle)` scans the array for the first spot that is both unoccupied **and** returns `true` from `canFitVehicle(vehicle)`. It marks that spot occupied, stores a reference to the parked vehicle, and returns the spot (or `null` if none found).
- `leave(vehicle)` scans for the spot whose `parkedVehicle` matches the given vehicle (by object reference), frees it, and returns `true`/`false` to indicate success.
- Each `ParkingSpot` tracks its own `parkedVehicle` (rather than `ParkingLot` maintaining a separate map) — this keeps the responsibility of "who's parked here" cohesively inside the spot itself.

```typescript
class ParkingLot {
    private spots: ParkingSpot[];

    constructor(spots: ParkingSpot[]) {
        this.spots = spots;
    }

    park(vehicle: Vehicle): ParkingSpot | null {
        for (let i = 0; i < this.spots.length; i++) {
            if (!this.spots[i].isOccupied && this.spots[i].canFitVehicle(vehicle)) {
                this.spots[i].isOccupied = true;
                this.spots[i].parkedVehicle = vehicle;
                return this.spots[i];
            }
        }
        return null;
    }

    leave(vehicle: Vehicle): boolean {
        for (let i = 0; i < this.spots.length; i++) {
            const spot = this.spots[i];
            if (spot.parkedVehicle === vehicle) {
                spot.isOccupied = false;
                spot.parkedVehicle = null;
                return true;
            }
        }
        return false;
    }
}
```

---

## 🪜 Milestone 4 — Pricing Strategy (Bonus)

**Concept:** Pricing logic can change independently of spot behavior (peak hours, discounts, promotions). Hiding it behind an interface, injected via the constructor, is the **Strategy Pattern**.

```typescript
interface PricingStrategy {
    calculatePrice(duration: number): number;
}

class CompactPricingStrategy implements PricingStrategy {
    private ratePerHour = 20;
    calculatePrice(duration: number): number {
        return this.ratePerHour * duration;
    }
}

class LargePricingStrategy implements PricingStrategy {
    private ratePerHour = 10;
    calculatePrice(duration: number): number {
        return this.ratePerHour * duration;
    }
}

class HandicappedPricingStrategy implements PricingStrategy {
    private ratePerHour = 5;
    calculatePrice(duration: number): number {
        return this.ratePerHour * duration;
    }
}
```

`duration` is kept as a simple `number` (hours) rather than a string — parsing string durations (`"2 hours"`) would add unnecessary complexity for no benefit. In a more realistic system, this could be replaced with a proper `Duration` value object or computed from two `Date` timestamps (entry/exit time).

Each `PricingStrategy` is injected into its `ParkingSpot` via the constructor:

```typescript
const spot1 = new CompactSpot("C1", new CompactPricingStrategy());
const spot2 = new LargeSpot("L1", new LargePricingStrategy());
```

`ParkingSpot` never hardcodes pricing logic — it only knows "ask my strategy for the price." This satisfies the **Open/Closed Principle**: pricing behavior can change without modifying `ParkingSpot` or `ParkingLot`.

---

## ✅ Extensibility Test — Adding a Charging Spot

To validate the design, a new spot type (`ChargingSpot`, for electric vehicles) and a new pricing strategy (`ElectricVehiclePricingStrategy`) were added **without modifying any existing class**:

```typescript
class ChargingSpot extends ParkingSpot {
    canFitVehicle(vehicle: Vehicle): boolean {
        return vehicle.getType() === VehicleType.CAR;
    }
}

class ElectricVehiclePricingStrategy implements PricingStrategy {
    private ratePerHour = 15;
    calculatePrice(duration: number): number {
        return this.ratePerHour * duration;
    }
}
```

`Vehicle`, `ParkingSpot`, `ParkingLot`, and every existing spot/pricing class were left untouched. This confirms the design is genuinely **open for extension, closed for modification**.

### Known Limitation (identified, not yet fixed)
`ChargingSpot.canFitVehicle()` currently checks `vehicle.getType() === VehicleType.CAR`, which allows *any* car (petrol or electric) to use a charging spot — not just EVs. `VehicleType` currently has no concept of "electric vs. petrol." A proper fix would add an independent property (e.g. `isElectric: boolean` on `Vehicle`) rather than overloading `VehicleType`, since "being electric" is orthogonal to vehicle type — the same reasoning that kept "size" and "type" separate in Milestone 1.

---

## 📋 Final Architecture Summary

```
Vehicle (inheritance: Car, Truck, Motorcycle)
ParkingSpot (inheritance: Compact, Large, Handicapped, Charging)
        │ (composition)
        ▼
ParkingLot ──has──> List<ParkingSpot>
        │ (dependency injection)
        ▼
PricingStrategy (interface, injected per spot instance)
```

| Principle | Where it's applied |
|---|---|
| Inheritance (IS-A) | `Vehicle` → Car/Truck/Motorcycle; `ParkingSpot` → Compact/Large/Handicapped/Charging |
| Composition (HAS-A) | `ParkingLot` → holds a list of `ParkingSpot` |
| Polymorphism | `canFitVehicle()` — each subclass decides its own rule, no if-else chains |
| Dependency Injection | `PricingStrategy` is injected via constructor, not hardcoded |
| Strategy Pattern | Pricing algorithm is swappable without touching `ParkingSpot`/`ParkingLot` |
| Open/Closed Principle | Proven by adding `ChargingSpot` with zero changes to existing code |

---

## 🚀 Possible Next Steps

- Add unit tests (e.g. with Jest) covering matching rules, full-lot edge cases, and pricing calculations
- Replace `duration: number` with a real `Duration` value object or entry/exit `Date` timestamps
- Fix the `ChargingSpot`/EV limitation noted above
- Wrap the system in a small REST API or CLI to practice a full end-to-end application