
import type { NextApiRequest, NextApiResponse } from "next";
import  Prisma from '@/lib/prisma';
import getUser from "@/lib/getuser";
import { list } from '@vercel/blob';
export  default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
    let id = req.query.id as string;
    let article = await Prisma.article.findUnique({
        where: {
            id: id,
        },
        include: {
            author: {
                select: {
                    id: true,
                }
            },
        }
    });
    if(article){
            let blobs = await list({
                prefix: `articles/${article.id}`,
                mode: 'expanded',
            });
            let file = blobs.blobs[0];
            res.status(200).json({...article, ...{file: file } });
    }
    else {
        res.status(404).json({ message: "Article not found" });
    }
}
