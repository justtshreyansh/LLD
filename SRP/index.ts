class Marksheet {
  studentName: string;
  marks: number[];

  constructor(studentName: string, marks: number[]) {
    this.studentName = studentName;
    this.marks = marks;
  }

  

 
}

class PercentageCalculator{
    calculatePercentage(marksheet : Marksheet ):number{
        return marksheet.marks.reduce((a,b)=>a+b,0) / marksheet.marks.length;
    }
}

class PrintMarkSheet{
    constructor(private percentageCalculator : PercentageCalculator){};
    printMarkSheetStudent(marksheet: Marksheet) : void{
        console.log(`${marksheet.studentName} : ${this.percentageCalculator.calculatePercentage(marksheet)}%`);
    }
}

class SaveToFile{
    saveToFile(marksheet:Marksheet):void{
        console.log(`saving this data to a.txt file`);
    }
}



interface Item {
  name: string;
  price: number;
}

class OrderManager {
  items: Item[] = [];

  
}

class Cart{
    constructor(private orderMananger:OrderManager){};
    addItem(item : Item){
        this.orderMananger.items.push(item);
    }

    calculateTotal():number{
        return this.orderMananger.items.reduce((sum,i)=>sum+i.price,0);
        
    }
}

class SendConfirmationEmail {
    constructor(private orderMananger:OrderManager){};
     sendConfirmationEmail(customerEmail:string):void{
        console.log("Sending confirmation email through email for amount ");
     }
}

class GenerateInvoicePDF{
    constructor(private orderMananger:OrderManager){};
    generateInvoicePDF():void{
        console.log(  `generating invoice pdf for ${this.orderMananger.items}`);
    }
}

class User{
    name:string;
    email:string;
    password:string;
    constructor(name:string,email:string,password:string){
        this.name = name;
        this.email = email;
        this.password = password;
    }

}
class UserController {
    constructor(private userValidator:UserValidator,private passwordHasher:PasswordHasher,private userRepo:UserRepository,private emailSender:EmailSender,private logger:Logger){};
    registerUser(user:User): void {

    // validates input (checks email format, password length)
    this.userValidator.validateUser(user);
    // hashes the password
    this.passwordHasher.hashPassword(user);
    // saves user to database
    this.userRepo.saveUser(user);
    // sends a welcome email
    this.emailSender.sendEmail(user);
    // logs the registration event to a log file
    this.logger.logFile(user);
  }
}

class UserValidator{
    
    validateUser(user:User):void{
        console.log(`Checking the validation of the ${user.email} and ${user.password}`);
    }
}

class PasswordHasher{
    
    hashPassword(user:User):string{
        return user.password+="hashedPassword";
    }
}

class UserRepository{
     
    saveUser(user:User):void{
        console.log(`saving the ${user.name}  ${user.email} and ${user.password} in mysql db`);
    }
}

class EmailSender{
    
    sendEmail(user:User):void{
        console.log( `Mail sending to ${user.email}`);
    }
}

class Logger{
    
    logFile(user:User):void{
        console.log(`Logging the ${user.name} in a log file`);
    }
}