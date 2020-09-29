const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const AssosSchema = new Schema({
  name: String,
  address: String,
  tel: String,
  email: String,
  description: String,
  link: String,
  password: String,
  image: String,
});

const Asso = mongoose.model("Asso", AssosSchema);

module.exports = Asso;
