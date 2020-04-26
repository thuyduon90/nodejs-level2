module.exports = paginationObject = {
    numberItemPerPage: 4,
    currentPage: 3,
    totalItem: null,
    currentBeginPoint: 1,
    detai: [{
            name: 'Begin',
            present: function() {
                return (paginationObject.currentPage < 2) ? false : true
            },
            active: function() {
                return (paginationObject.currentPage < 2) ? false : true
            }
        },
        {
            name: '<',
            active: function() {
                return (paginationObject.currentPage < 2) ? false : true
            }
        },
        {
            quantity: 3,
            active: function() {
                return true;
            }
        },
        {
            name: '>',
            active: function() {
                return (paginationObject.currentPage >= Math.ceil(paginationObject.totalItem / paginationObject.numberItemPerPage)) ? false : true
            }
        },
        {
            name: 'End',
            present: function() {
                return (paginationObject.currentPage >= Math.ceil(paginationObject.totalItem / paginationObject.numberItemPerPage)) ? false : true
            },
            active: function() {
                return (paginationObject.currentPage >= Math.ceil(paginationObject.totalItem / paginationObject.numberItemPerPage)) ? false : true
            }
        }
    ]
}