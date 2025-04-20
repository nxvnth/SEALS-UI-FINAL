'use server';
import mongoose, { Schema, Document } from 'mongoose';
import { ISODateString } from 'next-auth';

export interface IVideo {
  _id?: string;  // Make _id optional if not always provided by the client
  videoId: string;
  title: string;
  score: number;
  searchString: string;
  calculatedAt?: ISODateString;  // Make calculatedAt optional if set by default or on the server
}

const VideoSchema: Schema = new Schema({
  videoId: { type: String, required: true, index: true },
  title: { type: String, required: true },
  score: { type: Number, required: true },
  searchString: { type: String, required: true }
}, { timestamps: true });
// Create a compound index on videoId and searchString
VideoSchema.index({ videoId: 1, searchString: 1 }, { unique: true });

// Use mongoose.models to check if the model exists already to prevent overwriting
export const Video = mongoose.models?.Video || mongoose.model<IVideo>('Video', VideoSchema);
