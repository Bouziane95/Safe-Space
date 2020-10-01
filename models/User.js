const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const userSchema = new Schema({
  pseudo: String,
  email: String,
  password: String,
  events: [{type: Schema.Types.ObjectId, ref: "MapEvent"}],

});

const User = mongoose.model("User", userSchema);

module.exports = User;