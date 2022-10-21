const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const { DateTime } = require("luxon");

const MessageSchema = new Schema({
  title: { type: String, required: true, maxLength: 100 },
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  content: { type: String, required: true, maxLength: 500 },
  timestamp: { type: Date, default: Date.now, required: true },
});

MessageSchema.virtual("date").get(function() {
  return DateTime.fromJSDate(this.timestamp).toFormat("yyyy-MM-dd");
})

module.exports = mongoose.model("Message", MessageSchema);
