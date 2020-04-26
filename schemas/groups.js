var mongoose = require('mongoose');
const databaseInfo = require(__base__config + 'database');

var schema = new mongoose.Schema({
    name: String,
    status: String,
    order: Number,
    content: String,
    group_acp: String,
    created: {
        user_id: Number,
        user_name: String,
        time: Date
    },
    modified: {
        user_id: Number,
        user_name: String,
        time: Date
    }
});

module.exports = mongoose.model(databaseInfo.colectionName.groups, schema);