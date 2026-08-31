enum  VehicleType  {
    CAR,TRUCK,MOTORCYCLE
}
abstract class Vehicle{
    licensePlate: string;
    constructor(licensePlate:string){
        this.licensePlate = licensePlate;
    }

    abstract getType(): VehicleType;
}


class Car extends Vehicle{
    

    getType(): VehicleType{
        return VehicleType.CAR;
    }

}

class Truck extends Vehicle{
    
    getType(): VehicleType {
        return VehicleType.TRUCK;
    }
}

class Motorcycle extends Vehicle{
    
    getType(): VehicleType {
        return VehicleType.MOTORCYCLE;
    }
}

abstract class ParkingSpot{
    spotId: string;
    isOccupied : boolean;
    parkedVehicle: Vehicle | null; 
    pricingStrategy: PricingStrategy
    constructor(spotId:string,pricingStrategy:PricingStrategy){
        this.spotId =spotId;
        this.isOccupied = false;
        this.parkedVehicle = null;
        this.pricingStrategy = pricingStrategy;
    }

    getPrice(duration:number):number{
        return this.pricingStrategy.calculatePrice(duration);
    }
    abstract canFitVehicle(vehicle: Vehicle):boolean;

}

class CompactSpot extends ParkingSpot{
    canFitVehicle(vehicle: Vehicle): boolean {
        return vehicle.getType() !== VehicleType.TRUCK;
    }
}
class LargeSpot extends ParkingSpot{
    canFitVehicle(vehicle: Vehicle): boolean {
        return true;
    }
}
class HandiCappedSpot extends ParkingSpot{
    canFitVehicle(vehicle: Vehicle): boolean {
        return vehicle.getType()===VehicleType.MOTORCYCLE;
    }
}

class ChargingSpot extends ParkingSpot{
    canFitVehicle(vehicle: Vehicle): boolean {
        return vehicle.getType() === VehicleType.CAR;
    }
}

class ParkingLot{
    private spots : ParkingSpot[];
    constructor(spots:ParkingSpot[]){
        this.spots = spots;
    }

    park(vehicle:Vehicle): ParkingSpot | null {
        for(let i=0;i<this.spots.length;i++){
            if(!this.spots[i].isOccupied && this.spots[i].canFitVehicle(vehicle)){
                this.spots[i].isOccupied = true;
                this.spots[i].parkedVehicle = vehicle;
                return this.spots[i];
            }
        }

        return null;

    }

    leave(vehicle:Vehicle) : boolean{
        for(let i=0;i<this.spots.length;i++){
            const spot = this.spots[i];
            if(spot.parkedVehicle===vehicle){
                spot.isOccupied = false;
                spot.parkedVehicle = null;
                return true;
            }
        }
        return false;
    }

}

interface PricingStrategy{
    calculatePrice(duration : number):number;
}

class CompactPricingStrategy implements PricingStrategy{
    private ratePerHour  = 20;
    calculatePrice(duration: number): number {
        return this.ratePerHour * duration;
    }
}

class LargePricingStrategy implements PricingStrategy{
    private ratePerHour  = 10;
    calculatePrice(duration: number): number {
        return this.ratePerHour * duration;
    }
}

class HandicappedPricingStrategy implements PricingStrategy{
    private ratePerHour  = 5;
    calculatePrice(duration: number): number {
        return this.ratePerHour * duration;
    }
}

class ElectricVehiclePricingStrategy implements PricingStrategy{
    private ratePerHour  = 15;
    calculatePrice(duration: number): number {
        return this.ratePerHour * duration;
    }   

}

const lot = new ParkingLot([
    new CompactSpot("C1", new CompactPricingStrategy()),
    new LargeSpot("L1", new LargePricingStrategy()),
    new HandiCappedSpot("H1", new HandicappedPricingStrategy())
]);

const myCar = new Car("KA-01-1234");
const spot = lot.park(myCar);
console.log(spot?.spotId);   // "C1" expected

const myTruck = new Truck("KA-02-5678");
const truckSpot = lot.park(myTruck);
console.log(truckSpot?.spotId);   // "L1" expected

lot.leave(myCar);
console.log(lot.park(new Car("KA-03-9999"))?.spotId);   // "C1" wapas mil jayega

// Pricing test:
console.log(spot?.getPrice(3));   // 3 hours * 20/hr = 60 expected
