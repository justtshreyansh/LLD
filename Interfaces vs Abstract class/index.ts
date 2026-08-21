// ============================================
// LEVEL 1: Abstract Class Basics
// ============================================

abstract class Shape {
    color: string;
    constructor(color: string) {
        this.color = color;
    }

    describe(): void {
        console.log(`This is a ${this.color} shape`);
    }

    abstract area(): void;
}

class Circle extends Shape {
    area(): void {
        console.log("Cirlce area");
    }
}

class Rectangle extends Shape {
    area(): void {
        console.log("Rectangle Area");
    }
}

const a = new Circle("red");
a.describe();
a.area();

const b = new Rectangle("blue");
b.area();
b.describe();


// ============================================
// LEVEL 2: Interface Basics
// ============================================

interface DriveAble {
    drive(): void;
}

interface ChargeAble {
    charge(): void;
}

class ElectricCar implements DriveAble, ChargeAble {
    drive(): void {
        console.log("Driving");
    }

    charge(): void {
        console.log("Charging");
    }
}

class PetrolCar implements DriveAble {
    drive(): void {
        console.log("Petrol car driving");
    }
}

const c = new ElectricCar();
c.drive();
c.charge();

const d = new PetrolCar();
d.drive();


// ============================================
// LEVEL 3: Same Method, Different Interfaces
// ============================================

interface PrintAble {
    print(): void;
}

interface Loggable {
    print(): void;
}

class Report implements PrintAble, Loggable {
    print(): void {
        console.log("Printing here since the interfaces is only signature we can do anything in our classes how we gonna implement that");
    }
}

const e = new Report();
e.print();


// ============================================
// LEVEL 4: Conflict Case (Structural Mismatch)
// ============================================

interface A {
    getValue(): string;
}

interface B {
    getValue(): number;
}

// interface C extends A, B {
//     getValue(): string {
//         return 5;
//     }
// }
// Error: Interface 'C' incorrectly extends interface 'B'.
//   The types returned by 'getValue()' are incompatible between these types.
//     Type 'string' is not assignable to type 'number'.(2430)

// class C implements A, B {
//     getValue(): string {
//         return "5";
//     }
// }
// Error: Class 'C' incorrectly implements interface 'B'.
//   The types returned by 'getValue()' are incompatible between these types.
//     Type 'string' is not assignable to type 'number'.(2420)


// ============================================
// LEVEL 5: Abstract Class + Interface Combo
// ============================================

interface Payable {
    pay(amount: number): void;
}

abstract class Employee implements Payable {
    name: string;
    constructor(name: string) {
        this.name = name;
    }

    showDetails(): void {
        console.log(`Name of the employee ${this.name}`);
    }

    abstract pay(amount: number): void;
}

class Manager extends Employee {
    pay(amount: number): void {
        console.log(`Paying fixed salary ${amount}`);
    }
}

class Intern extends Employee {
    hourlyRate: number;
    constructor(name: string, hourlyRate: number) {
        super(name);
        this.hourlyRate = hourlyRate;
    }
    pay(hoursWorked: number): void {
        console.log(`Pay for working ${hoursWorked} hours at the rate of ${this.hourlyRate}. Total Earning is  : ${this.hourlyRate * hoursWorked}`);
    }
}

const intern = new Intern("Shreyansh", 50);
intern.pay(9);
intern.showDetails();

const manager = new Manager("Sachin");
manager.pay(2000);
manager.showDetails();


// ============================================
// LEVEL 8: Notification System
// ============================================

interface Notifiable {
    send(message: string): void;
}

interface LoggableNotifier {
    log(message: string): void;
}

abstract class BaseNotifier {
    abstract send(message: string): void;

    addTimeStamp(message:string): string {
        return `[${Date.now()} : ${message}]`;
    }
}

class SMSNotifier extends BaseNotifier implements Notifiable, LoggableNotifier {
    send(message: string): void {
        const finalMessage = this.addTimeStamp(message);
        console.log(`Sending SMS ${finalMessage}`);
    }

    log(message: string): void {
        const finalMessage = this.addTimeStamp(message);
        console.log(`Logging SMS ${finalMessage}`);
    }
}

class EmailNotifier extends BaseNotifier implements Notifiable, LoggableNotifier {
    send(message: string): void {
        const finalMessage = this.addTimeStamp(message);
        console.log(`Sending Email ${finalMessage}`);
    }

    log(message: string): void {
        const finalMessage = this.addTimeStamp(message);
        console.log(`Logging Email ${finalMessage}`);
    }
}

const sms = new SMSNotifier();
sms.send("Hello");
sms.log("Hello");

const email = new EmailNotifier();
sms.send("HEllo");
sms.log("Hello");