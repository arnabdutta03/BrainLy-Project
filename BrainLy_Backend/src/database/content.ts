import { Schema, model } from "mongoose";

const ContentSchema = new Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    link: { type: String, required: true },
    tags: [{ type: Schema.Types.ObjectId, ref: "Tags" }],
    type: [{
        type: String, enum: [
            "Video", "Article", "Website", "Social Media", "Documentation", "Code",
            "Design", "Course", "Book", "Research", "News", "Audio", "File", "Other"
        ],
        default: "Website"
    }],

    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },

}, {
    timestamps: true,
});

const Content = model("Content", ContentSchema);

export default Content;