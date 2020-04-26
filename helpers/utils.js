let createFilterStatus = async(currentStatus = 'all', schemaType) => {
    var itemModel = require(__base__schemas + schemaType);
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