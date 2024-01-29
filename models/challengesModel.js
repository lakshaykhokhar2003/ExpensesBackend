const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const opts = {
    toJSON: {virtuals: true}, timestamps: {
        createdAt: true, updatedAt: false
    }
};
const ChallengeSchema = new Schema({
    title: String, description: String, deadline: Date, status: {
        type: String, enum: ['Active', 'Completed', 'Failed'], default: 'Active'
    }, group: {
        type: Schema.Types.ObjectId, ref: 'Groups'
    }
}, opts);

const Challenges = mongoose.model("Challenges", ChallengeSchema);
module.exports = Challenges;