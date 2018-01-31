const mongoose  = require('mongoose');

let Schema = mongoose.Schema;

let ChatSchema = new Schema({
    Sender: String,
    Message: String,
    Sollution: String
});

let Chat = mongoose.model("chat", ChatSchema);

module.exports = Chat;