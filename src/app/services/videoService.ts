'use server';

import dbConnect from '../lib/mongodb';
import { Video, IVideo } from '@/app/models/Video';

// Utility to sanitize Mongoose docs to plain objects
function cleanVideo(doc: any): IVideo {
  return {
    videoId: doc.videoId,
    title: doc.title,
    score: doc.score,
    searchString: doc.searchString,
    calculatedAt: doc.calculatedAt?.toISOString?.(), // safe to pass to client
  };
}

export async function getVideoScore(videoId: string, searchString: string): Promise<IVideo | null> {
  try {
    await dbConnect();
    const result = await Video.findOne({ videoId, searchString }).lean(); // important
    return result ? cleanVideo(result) : null;
  } catch (error) {
    console.error('Error getting video score:', error);
    throw error;
  }
}

export async function saveVideoScore(videoData: IVideo): Promise<IVideo> {
  try {
    await dbConnect();
    const { videoId, searchString, score } = videoData;
    const updateData = { score, updatedAt: new Date() };

    const updated = await Video.findOneAndUpdate(
      { videoId, searchString },
      updateData,
      { new: true, upsert: true }
    ).lean(); // important here too

    return cleanVideo(updated);
  } catch (error) {
    console.error('Error saving video score:', error);
    throw error;
  }
}

export async function getVideosBySearchString(searchString: string): Promise<IVideo[]> {
  try {
    await dbConnect();
    const results = await Video.find({ searchString }).sort({ updatedAt: -1 }).lean(); // ✅ lean removes Mongoose internals
    return results.map(cleanVideo); // clean each document
  } catch (error) {
    console.error('Error getting videos by search string:', error);
    throw error;
  }
}
