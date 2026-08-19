interface paymentStrategy{
    pay(amount:number) : void;
}

interface DiscountStrategy { 
    applyDiscount(amount:number):number;
}

class CreditCardStrategy implements paymentStrategy{
    pay(amount:number):void{ 
        console.log(`Paying ${amount} through CreditCard`);
    }
}


class PayPalStrategy implements paymentStrategy{
    pay(amount:number):void{
        console.log(`Paying ${amount} through PayPalStrategy`);
    }
}

class UPIStrategy implements paymentStrategy{
    pay(amount:number):void{
        console.log(`Paying ${amount} through UPI`);
    }
}

class NoDiscount implements DiscountStrategy{
    applyDiscount(amount :number):number{
        return amount;
    }
}

class FlatDiscount implements DiscountStrategy{
    private flatDiscount: number;
    constructor(flatDiscount:number){
        this.flatDiscount = flatDiscount;
    }
    applyDiscount(amount: number):number{
        return amount - this.flatDiscount;
    }
}

class PercentageDiscount implements DiscountStrategy{
    private percentageDiscount : number;

    constructor(percentageDiscount: number){
        this.percentageDiscount = percentageDiscount;
    }

    applyDiscount(amount:number):number{
        return amount  - amount  * this.percentageDiscount / 100;
    }
}
class Order { 
    private items : string[];
    private totalAmount : number;
    private paymentStrategy: paymentStrategy;
    private discountStrategy : DiscountStrategy

    constructor(items:string [],totalAmount:number,paymentStrategy:paymentStrategy,discountStrategy:DiscountStrategy){
        this.items = items;
        this.totalAmount = totalAmount;
        this.paymentStrategy = paymentStrategy;
        this.discountStrategy = discountStrategy;
    }

    checkout():void{
        for(const item of  this.items){
            console.log(`${item} `)
        }
        this.totalAmount = this.discountStrategy.applyDiscount(this.totalAmount);
        console.log(`Total Amount  : ${this.totalAmount}`);

        this.paymentStrategy.pay(this.totalAmount);
    }

    changePaymentMethod( newStrategy : paymentStrategy):void {
        this.paymentStrategy = newStrategy;
    }
}

const order = new Order(["banana","oats"],1000,new CreditCardStrategy(),new NoDiscount());
order.checkout();

const order2 = new Order(["banana","oats"],1000,new PayPalStrategy(),new FlatDiscount(100));
order2.changePaymentMethod(new UPIStrategy());
order2.checkout();

const order3 = new Order(["banana","oats"],1000,new PayPalStrategy(),new PercentageDiscount(12));
order3.checkout();
