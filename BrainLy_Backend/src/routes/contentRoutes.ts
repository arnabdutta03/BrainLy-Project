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
        const UserObj = req.UserObj

        let { title, links, tags }: { title: string; links: string; tags?: string[]; } = req.body;

        if (!links.includes('https://')) {
            links = 'https://' + links
        }

        tags = tags ?? []


        if (tags) {
            tags = await saveTags(tags);
        }

        const contentInput = {
            title,
            links,
            tags
        }

        const result = ContentSchema.parse(contentInput)

        const contentData = await Content.create({
            title: contentInput.title,
            link: contentInput.links,
            tags: contentInput.tags,
            userId: UserObj.id,
        })

        if (!contentData)
            return res.status(500).json({ success: false, message: "Internal Server Error" })

        return res.status(200).json({ success: true, message: 'Content stored successfully' })
    } catch (error) {
        console.log('Content Error: ' + error)
        next(error)
    }
});


// Get Content of perticular User
ContentRouter.get('/api/v1/content', authCheck, async (req: CustomRequest, res: Response, next: NextFunction) => {
    try {
        const UserObj = req.UserObj

        const getData = await Content.find({ userId: UserObj.id }).select("_id title link tags").populate("tags", "tag").select("tag");

        if (getData.length === 0)
            return res.status(404).json({ success: false, message: "No content found" });

        const formatted = getData.map(data => ({
            ...data.toObject(),
            tags: data.tags.map((tags: any) => tags.tag)
        }));

        return res.status(200).json({ success: false, formatted })

    } catch (error) {
        console.log('Get Content: ', error);
        next(error)
    }
});


// Delete Content of perticular User
ContentRouter.delete('/api/v1/content/:id', authCheck, async (req: CustomRequest, res: Response, next: NextFunction) => {
    try {
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