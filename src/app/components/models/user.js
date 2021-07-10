const bcryptjs = require('bcryptjs');

class User {
    constructor(user) {
        let salt = bcryptjs.genSaltSync(10);
        this.id = user.id;
        this.name = user.name;
        this.surname = user.surname;
        this.email = user.email;
        this.password = bcryptjs.hashSync(user.password, salt);
        this.income = user.income;
        this.saves = [
            { name: 'CASH', icon: 'fa fa-money', sum: user.saves[0][1], active: false },
            { name: 'BANK', icon: 'fa fa-bank', sum: user.saves[1][1], active: false }
        ];
        for (let i = 2; i < user.saves.length;i++) {
           this.saves[i] = { name: `${user.saves[i][0]}`, icon: '', sum: user.saves[i][1], active: false };   
        };
        this.balance = user.income;
        for (let i = 0; i < user.saves.length; i++){
            this.balance += user.saves[i][1];
        }
        this.spends = [];
        this.spends[0] = { name: 'FOOD', icon: 'fa fa-coffee', sum: user.spends[0][1]};
        this.spends[1] = { name: 'UTILITIES', icon: 'fa fa-home', sum: user.spends[1][1]};
        this.spends[2] = { name: 'TRANSPORT', icon: 'fa fa-bus', sum: user.spends[2][1]};
        this.spends[3] = { name: 'STUDY', icon: 'fa fa-graduation-cap', sum: user.spends[3][1]};
          for (let i = 4; i < user.spends.length;i++) {
           this.spends[i] = { name:  `${user.spends[i][0]}`, icon: '', sum: user.spends[i][1]};   
        }
        this.expenses = 0;
        for (let i = 0; i < user.spends.length; i++){
            this.expenses += user.spends[i][1];
        }
    }
    static patch(id, financesData, result) {
        for (const user of users) {
            if (+id === user.id) {
                user.income = financesData.income;
                user.balance = financesData.income;
                for (const save of financesData.saves) {
                    user.balance += save.sum;
                }
                user.saves = financesData.saves
                user.expenses = 0;
                for (const spend of financesData.spends) {
                    user.expenses += spend.sum;
                }
                user.spends = financesData.spends
                result(null, user)
            }  
        }
    }
    static getById(id, result) {
        for (const user of users) {
            if (+id === user.id) {
                result(null, user);
            }
        }
    };
    static checkEmail(trySignInUser) {
        for (const user of users) {
            if (trySignInUser.email === user.email) {
                return user;
            }
        }    
    }
}
let users = [];

users.push(new User({
    id:1, name: 'Petro', surname: 'Petrenko', email: 'petro@petro.gmail.com', password: 'petro',
    income: 2000, saves: [['',1000], ['',1000], ['saveNew', 1000]],
    spends: [['',500], ['',500], ['',500], ['',500], ['spendNew', 500]]
}));

users.push(new User ({
    id: 2, name: 'Ivan', surname: 'Ivanenko', email: 'ivan@ivan.gmail.com', password: 'ivan',
    income: 1000,  saves: [['', 500], ['', 500]],
    spends: [['', 250], ['',250], ['',250], ['',250]]
}));

module.exports = { users: users, user: User };

