const mongoose  = require('mongoose');

let Schema = mongoose.Schema;

let InfoSchema = new Schema({
    title: String,
    Text: String,
    Color: String,
    Date: String
});

let Info = mongoose.model("Info", InfoSchema);

module.exports = Info;