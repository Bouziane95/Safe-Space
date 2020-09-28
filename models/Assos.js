const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const AssosSchema = new Schema({
  name: String,
  address: String,
  tel: String,
  mail: String,
  description: String,
  link: String,
  image: String,
});

const Asso = mongoose.model("Asso", AssosSchema);

module.exports = Asso;
