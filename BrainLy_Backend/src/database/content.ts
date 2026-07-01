import { Schema, model } from "mongoose";

const ContentSchema = new Schema({
    title: { type: String, required: true },
    link: { type: String, required: true },
    tags: [{ type: Schema.Types.ObjectId, ref: "Tags" }],

    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },

}, {
    timestamps: true,
});

const Content = model("Content", ContentSchema);

export default Content;