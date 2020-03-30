var itemModel = require(__base__schemas + 'items');

let createFilterStatus = async(currentStatus = 'all') => {
    var statusFilter = [{
            name: 'all',
            count: null,
            link: '/all',
            class: 'default'
        },
        {
            name: 'active',
            count: null,
            link: '/active',
            class: 'default'
        },
        {
            name: 'inactive',
            count: null,
            link: '/inactive',
            class: 'default'
        }
    ];


    //count item from database
    //     statusFilter.map(async(value, index) => {
    //         if (value.name == currentStatus) {
    //             statusFilter[index].class = 'success';
    //         }
    //         let condition = {};
    //         if (value.name === 'active' || value.name === 'inactive') {
    //             condition = { status: statusFilter[index].name }
    //         }
    //         console.log(value.name)
    //         await itemModel.count(condition, function(err, data) {
    //             statusFilter[index].count = data;
    //         });
    //         console.log(statusFilter[index].count)
    //     });
    //     return statusFilter;
    // }


    for (let index = 0; index < statusFilter.length; index++) {
        let value = statusFilter[index];
        if (value.name == currentStatus) {
            statusFilter[index].class = 'success';
        }
        let condition = {};
        if (value.name === 'active' || value.name === 'inactive') {
            condition = { status: statusFilter[index].name }
        }
        await itemModel.count(condition, function(err, data) {
            statusFilter[index].count = data;
        });
    }
    return statusFilter;
}

module.exports = {
    createFilterStatus: createFilterStatus
}