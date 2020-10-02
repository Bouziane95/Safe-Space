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
  image: {
    type: String,
    default: "https://s3.amazonaws.com/37assets/svn/765-default-avatar.png",
  },
  events: [{type:Schema.Types.ObjectId, ref:"MapEvent"}]
});

const Asso = mongoose.model("Asso", AssosSchema);

module.exports = Asso;
