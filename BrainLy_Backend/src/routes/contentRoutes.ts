import express, { type Request, type Response, type NextFunction } from 'express';
import { Types } from "mongoose";

import User from '../database/user.js';

import Content from '../database/content.js';
import Tag from '../database/tags.js';
import authCheck from '../middleware/authCheck.js';
import { ContentSchema } from '../config/zod.js'


const ContentRouter = express.Router();

interface CustomRequest extends Request {
    UserObj?: any
}


// Save the Tags in the Tag DB
const saveTags = async (tags: string[]) => {
    return Promise.all(            // use this if you are using async inside a map Fn
        tags.map(async (tag) => {

            const lowerCaseTag = tag.toLowerCase().trim().replaceAll('-', ' ');

            let isTag = await Tag.findOne({ tag: lowerCaseTag })

            if (!isTag)
                isTag = await Tag.create({ tag: lowerCaseTag })

            if (!isTag)
                return 'null'

            return isTag._id.toString()
        })
    )
}

// Create Content
ContentRouter.post('/api/v1/content', authCheck, async (req: CustomRequest, res: Response, next: NextFunction) => {

    try {
        if (!req.UserObj)
            return res.status(401).json({ success: false, message: "Unauthorized" });

        let { title, description, link, tags = [] } :  { title:string; description:string; link:string; tags: string[]; }  = req.body;

        if (!link.startsWith("http://") && !link.startsWith("https://")) {
            link = `https://${link}`;
        }

        tags = await saveTags(tags);

        const validatedData = ContentSchema.parse({
            title,
            description,
            link,
            tags,
        });

        await Content.create({
            ...validatedData,
            userId: req.UserObj.id,
        });

        return res.status(201).json({
            success: true,
            message: "Content stored successfully",
        });
    } catch (error) {
        console.error("Content Error:", error);
        return next(error);
    }
});



// Get Content of perticular User
ContentRouter.get('/api/v1/content', authCheck, async (req: CustomRequest, res: Response, next: NextFunction) => {
    try {

        if (!req.UserObj)
            return res.status(401).json({ success: false, message: "Unauthorized" });

        const UserObj = req.UserObj


        const contents = await Content.find({ userId: UserObj.id }).select("_id title description link tags createdAt").populate("tags", "tag").lean();

        if (contents.length === 0)
            return res.status(200).json({ success: true, message: [] });

        const formattedContents = contents.map(content => ({
            ...content,
            tags: content.tags.map((tag: any) => tag.tag),
        }));

        console.log(formattedContents);

        return res.status(200).json({ success: true, contents: formattedContents })

    } catch (error) {
        console.log('Get Content: ', error);
        next(error)
    }
});


// Delete Content of perticular User
ContentRouter.delete('/api/v1/content/:id', authCheck, async (req: CustomRequest, res: Response, next: NextFunction) => {
    try {

        if (!req.UserObj)
            return res.status(401).json({ success: false, message: "Unauthorized" });

        const UserObj = req.UserObj;

        const contentId = req.params;

        const isPresent = await Content.findOne({ _id: contentId.id, userId: UserObj.id })

        if (isPresent === null)
            return res.status(404).json({ success: false, message: "No content found" });

        const isDeleted = await Content.findByIdAndDelete({ _id: contentId.id })

        if (!isDeleted)
            return res.status(500).json({ success: false, message: "Internal Server Error" });


        return res.status(200).json({ success: true, message: 'Successfully deleted the Content' })

    } catch (error) {
        console.log('Del Content: ', error);
        next(error)
    }
});


// Update Content of perticular User
ContentRouter.patch('/api/v1/content/update', authCheck, async (req: CustomRequest, res: Response, next: NextFunction) => {
    try {

        if (!req.UserObj)
            return res.status(401).json({ success: false, message: "Unauthorized" });
        const UserObj = req.UserObj;

        let { id, title, links, tags }: { id?: string; title?: string; links?: string; tags?: string[]; } = req.body;

        if (tags) {
            tags = await saveTags(tags);
        }

        const updatedContent = await Content.findOneAndUpdate({
            _id: id,
            userId: UserObj.id
        }, {
            title,
            links,
            tags,
        }, {
            returnDocument: 'after',
            runValidators: true,
        });

        if (!updatedContent)
            return res.status(404).json({ success: false, message: "No content found", });


        return res.status(200).json({ success: true, message: 'Successfully Updated the Content' })

    } catch (error) {
        console.log('Del Content: ', error);
        next(error)
    }
});




export default ContentRouter;