const bcryptjs = require('bcryptjs');

class User {
    constructor(user) {
        let salt = bcryptjs.genSaltSync(10);
        this.id = user.id;
        this.name = user.name;
        this.surname = user.surname;
        this.email = user.email;
        this.password = bcryptjs.hashSync(user.password, salt);
        this.finances = [
            {
                date: user.date,
                income: user.income,
                saves: [
                  { name: 'CASH', icon: 'fa fa-money', sum: user.saves[0][1], active: false },
                    { name: 'BANK', icon: 'fa fa-bank', sum: user.saves[1][1], active: false }
                ],
                balance: user.income,
                spends: [
                    { name: 'FOOD', icon: 'fa fa-coffee', sum: user.spends[0][1] },
                    { name: 'UTILITIES', icon: 'fa fa-home', sum: user.spends[1][1] },
                    { name: 'TRANSPORT', icon: 'fa fa-bus', sum: user.spends[2][1] },
                    { name: 'STUDY', icon: 'fa fa-graduation-cap', sum: user.spends[3][1]},    
                ],
                expenses: 0,    
            }
        ]
        for (let i = 2; i < user.saves.length;i++) {
           this.finances[0].saves[i] = { name: `${user.saves[i][0]}`, icon: '', sum: user.saves[i][1], active: false };   
        };
        for (let i = 0; i < user.saves.length; i++){
            this.finances[0].balance += user.saves[i][1];
        }
        
        for (let i = 4; i < user.spends.length;i++) {
           this.finances[0].spends[i] = { name:  `${user.spends[i][0]}`, icon: '', sum: user.spends[i][1]};   
        }
        for (let i = 0; i < user.spends.length; i++){
            this.finances[0].expenses += user.spends[i][1];
        }
    }

    static patch(id, financesData, result) {
        for (const user of users) {
            if (+id === user.id) {
                let finance = user.finances[user.finances.length-1]
                finance.income = financesData.income;
                finance.balance = financesData.income;
                for (const save of financesData.saves) {
                    finance.balance += save.sum;
                }
                finance.saves = financesData.saves
                finance.expenses = 0;
                for (const spend of financesData.spends) {
                    finance.expenses += spend.sum;
                }
                finance.spends = financesData.spends
                result(null, User.changeUserForFE(user))
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
                let d = new Date();
                let lastUseDay = user.finances[user.finances.length - 1].date;
                if (d.setHours(0, 0, 0, 0) !== lastUseDay) {
                    let countAddDays = (d.setHours(0, 0, 0, 0) - lastUseDay) / 86400000;
                    for (let i = 1; i <= countAddDays; i++ ){
                        let nextDate = new Date(lastUseDay + 86400000 * i)
                        user.finances.push(Object.assign({}, user.finances[user.finances.length - 1]));
                        let newFinance = user.finances[user.finances.length - 1]
                        newFinance.date = nextDate.setHours(0, 0, 0, 0);
                        if (nextDate.getDate() === 1) {
                            newFinance.expenses = 0;
                            for (let j = 0; j < newFinance.spends.length; j++){
                                newFinance.spends[j].sum = 0;
                            }      
                        }
                    }
                }
                return user;
            }
        }    
    }
    static changeUserForFE(user) {
        let userFE = Object.assign({}, user, user.finances[user.finances.length - 1]);
        delete userFE.finances;
        return userFE;
    }
    static getHistory(id, result) {
        for (const user of users) {
            if (+id === user.id) {
                result(null, user.finances)
            }
        }
    }
    static getStatistic(id, result) {
        for (const user of users) {
            if (+id === user.id) {
                 let costs = user.finances.map((el) => {
                    let el2 = {...el}
                    delete el2.income;
                    delete el2.balance;
                    delete el2.saves;
                    return el2;
                });
                result(null, costs)  
            }
        }
    }
}

let users = [];
let today = new Date()

users.push(new User({date: today.setHours(-24,0,0,0),
    id:1, name: 'Petro', surname: 'Petrenko', email: 'petro@petro.gmail.com', password: 'petro',
    income: 2000, saves: [['',1000], ['',1000], ['saveNew', 1000]],
    spends: [['',500], ['',500], ['',500], ['',500], ['spendNew', 500]]
}));

users.push(new User ({date: today.setHours(-48,0,0,0),
    id: 2, name: 'Ivan', surname: 'Ivanenko', email: 'ivan@ivan.gmail.com', password: 'ivan',
    income: 1000,  saves: [['', 500], ['', 500]],
    spends: [['', 250], ['',250], ['',250], ['',250]]
}));

module.exports = { users: users, user: User };
