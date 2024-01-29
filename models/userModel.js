const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const opts = {toJSON: {virtuals: true}}

const UserSchema = new Schema({
    name: String, coins: Number, joinedGroups: [{
        type: Schema.Types.ObjectId, ref: 'Groups'
    }]
}, opts);

const Users = mongoose.model("Users", UserSchema);
module.exports = Users;