const bcryptjs = require('bcryptjs');

class User {
    constructor(user) {
        let salt = bcryptjs.genSaltSync(10);
        this.id = user.id;
        this.name = user.name;
        this.surname = user.surname;
        this.email = user.email;
        this.password = bcryptjs.hashSync(user.password, salt);
        this.lastVisit =  user.date;
        this.image = user.image;
        this.link = '';
        this.history23task = [];
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
                finance.spends = financesData.spends;
                if (financesData.history23task) user.history23task.push(financesData.history23task);
                result(null, User.changeUserForFE(user))
            }  
        }
    }
    
    static update(id, personalData, file, result) {           
        for (const user of users) {
            if (+id === user.id) {
                let salt = bcryptjs.genSaltSync(10);
                user.name = personalData.name;
                user.surname = personalData.surname;
                user.email = personalData.email;
                if(personalData.password) user.password = bcryptjs.hashSync(personalData.password, salt);
                if (file)  {
                    user.image = file.path;
                    user.link = personalData.link;
                } else if (personalData.link) {
                    user.image = '';
                    user.link = personalData.link;
                }
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
                user.lastVisit = lastUseDay;           
                if (d.setHours(0, 0, 0, 0) !== lastUseDay) {
                    let countAddDays = (d.setHours(0, 0, 0, 0) - lastUseDay) / 86400000;
                    for (let i = 1; i <= countAddDays; i++ ){
                        let nextDate = new Date(lastUseDay + 86400000 * i)
                        user.finances.push(JSON.parse(JSON.stringify(user.finances[user.finances.length - 1])));
                        let newFinance = user.finances[user.finances.length - 1];
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
                result(null, { history: user.finances, history23task: user.history23task})
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

users.push(new User({date: today.setHours(-24,0,0,0), image: '',
    id:1, name: 'Petro', surname: 'Petrenko', email: 'petro@petro.gmail.com', password: 'Petro$123',
    income: 2000, saves: [['',1000], ['',1000], ['saveNew', 1000]],
    spends: [['',500], ['',500], ['',500], ['',500], ['spendNew', 500]]
}));

users.push(new User ({date: today.setHours(-9200,0,0,0), image: 'src\\app\\components\\uploads\\6.jpg',
    id: 2, name: 'Ivan', surname: 'Ivanenko', email: 'ivan@ivan.gmail.com', password: 'Ivan$123',
    income: 0,  saves: [['', 1000], ['', 1000]],
    spends: [['', 400], ['',400], ['',0], ['',0]]
}));
users[1].history23task.push(
{ date: +new Date(2020, 8, 10, 18, 30, 00), sum: 2800, year: 2020, month: 08, act: 'income', from: '', to: 'income' },
{ date: +new Date(2020, 8, 10, 18 ,45, 00), sum: 1400, year: 2020, month: 08, act: 'save', from: 'income', to: 'CASH'},
{ date: +new Date(2020, 8, 10, 19, 00, 00), sum: 1400, year: 2020, month: 08, act: 'save', from: 'income', to: 'BANK'},
{date: +new Date(2020, 8, 25, 20, 00, 00), sum: 400, year: 2020, month: 08, act: 'spend', from: 'CASH', to: 'FOOD' },
{date: +new Date(2020, 8, 25, 20, 05, 00), sum: 400, year: 2020, month: 08, act: 'spend', from: 'BANK', to: 'UTILITIES' },
{ date: +new Date(2021, 7, 2, 15, 30, 00), sum: 1000, year: 2021, month: 07, act: 'income', from: '', to: 'income' },
{ date: +new Date(2021, 7, 2, 15 ,45, 00), sum: 500, year: 2021, month: 07, act: 'save', from: 'income', to: 'CASH'},
{ date: +new Date(2021, 7, 2, 16, 00, 00), sum: 500, year: 2021, month: 07, act: 'save', from: 'income', to: 'BANK'},
{date: +new Date(2021, 7, 27, 16, 45, 00), sum: 250, year: 2021, month: 07, act: 'spend', from: 'BANK', to: 'UTILITIES' },
{date: +new Date(2021, 7, 27, 16, 50, 00), sum: 250, year: 2021, month: 07, act: 'spend', from: 'BANK', to: 'STUDY' },
{date: +new Date(2021, 7, 27, 16, 55, 00), sum: 250, year: 2021, month: 07, act: 'spend', from: 'CASH', to: 'FOOD' },
{date: +new Date(2021, 7, 27, 17, 00, 00), sum: 250, year: 2021, month: 07, act: 'spend', from: 'CASH', to: 'TRANSPORT'},
{ date: +new Date(2021, 8, 2, 15, 30, 00), sum: 2500, year: 2021, month: 08, act: 'income', from: '', to: 'income' },
{ date: +new Date(2021, 8, 2, 15 ,45, 00), sum: 600, year: 2021, month: 08, act: 'save', from: 'income', to: 'CASH'},
{ date: +new Date(2021, 8, 2, 16, 00, 00), sum: 1400, year: 2021, month: 08, act: 'save', from: 'income', to: 'BANK'},
{date: +new Date(2021, 8, 27, 16, 45, 00), sum: 400, year: 2021, month: 08, act: 'spend', from: 'BANK', to: 'UTILITIES' },
{date: +new Date(2021, 8, 27, 16, 50, 00), sum: 800, year: 2021, month: 08, act: 'spend', from: 'BANK', to: 'STUDY' },
{date: +new Date(2021, 8, 27, 16, 55, 00), sum: 200, year: 2021, month: 08, act: 'spend', from: 'CASH', to: 'FOOD' },
{date: +new Date(2021, 8, 27, 17, 00, 00), sum: 100, year: 2021, month: 08, act: 'spend', from: 'CASH', to: 'TRANSPORT'}
)
users[1].finances.push({
    date: +new Date(2021, 6, 2, 16, 00, 00), income: 1000, balance: 2000, expenses: 0,
    saves: [{ name: "CASH", icon: "fa fa-money", sum: 1000, active: false },
    { name: "BANK", icon: "fa fa-bank", sum: 1000, active: false }],
    spends: [{ name: "FOOD", icon: "fa fa-coffee", sum: 0 },
    { name: "UTILITIES", icon: "fa fa-home", sum: 0 },
    { name: "TRANSPORT", icon: "fa fa-bus", sum: 0 },
    { name: "STUDY", icon: "fa fa-graduation-cap", sum: 0 }]
}, {
    date: +new Date(2021, 7, 2, 16, 00, 00), income: 1000, balance: 3000, expenses: 0,
    saves: [{ name: "CASH", icon: "fa fa-money", sum: 1000, active: false },
    { name: "BANK", icon: "fa fa-bank", sum: 1000, active: false }],
    spends: [{ name: "FOOD", icon: "fa fa-coffee", sum: 0 },
    { name: "UTILITIES", icon: "fa fa-home", sum: 0 },
    { name: "TRANSPORT", icon: "fa fa-bus", sum: 0 },
    { name: "STUDY", icon: "fa fa-graduation-cap", sum: 0 }]
}, {
    date: +new Date(2021, 7, 27, 17, 00, 00), income: 1000, balance: 2000, expenses: 1000,
    saves: [{ name: "CASH", icon: "fa fa-money", sum: 500, active: false },
    { name: "BANK", icon: "fa fa-bank", sum: 500, active: false }],
    spends: [{ name: "FOOD", icon: "fa fa-coffee", sum: 250 },
    { name: "UTILITIES", icon: "fa fa-home", sum: 250 },
    { name: "TRANSPORT", icon: "fa fa-bus", sum: 250 },
    { name: "STUDY", icon: "fa fa-graduation-cap", sum: 250 }]
}, {
    date: +new Date(2021, 8, 27, 17, 00, 00), income: 1500, balance: 3000, expenses: 1500,
    saves: [{ name: "CASH", icon: "fa fa-money", sum: 800, active: false },
    { name: "BANK", icon: "fa fa-bank", sum: 700, active: false }],
    spends: [{ name: "FOOD", icon: "fa fa-coffee", sum: 200 },
    { name: "UTILITIES", icon: "fa fa-home", sum: 400 },
    { name: "TRANSPORT", icon: "fa fa-bus", sum: 100 },
    { name: "STUDY", icon: "fa fa-graduation-cap", sum: 800 }]
})
module.exports = { users: users, user: User };
