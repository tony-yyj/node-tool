var moment = require('moment'); // require


const arr = [
    {
        "epoch_id": 1,
        "epoch_start_date": 1708905600000,
        "epoch_end_date": 1712114338361
    },
    {
        "epoch_id": 2,
        "epoch_start_date": 1712114438361,
        "epoch_end_date": 171211458361
    },
]

arr[0].epoch_start_date = moment().add(30, 'seconds').valueOf();
arr[0].epoch_end_date = arr[1].epoch_start_date = moment().add(1, 'minutes').valueOf();
arr[1].epoch_end_date = moment().add(3, 'minutes').valueOf();

console.log(JSON.stringify(arr));
