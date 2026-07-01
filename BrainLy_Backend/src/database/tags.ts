import { Schema, model } from "mongoose";

const TagSchema = new Schema({
  tag: { type: String, unique: true}
});

const Tag = model("Tags", TagSchema);

export default Tag;