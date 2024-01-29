const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const opts = {toJSON: {virtuals: true}}

const GroupsSchema = new Schema({
    name: String, description: String, image: {
        src: String, alt: String
    }, challenge: [{
        type: Schema.Types.ObjectId, ref: 'Challenges'
    }], author: {
        type: Schema.Types.ObjectId, ref: 'Users', default: "65b132272bfc1c28f51f2d54"
    }
}, {timestamps: true}, opts);

const Groups = mongoose.model("Groups", GroupsSchema);
module.exports = Groups;