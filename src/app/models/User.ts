'use server';

import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  _id: string;
  email: string;
  name?: string;
  createdAt: Date;
}

const UserSchema: Schema = new Schema(
  {
    email: { type: String, required: true, unique: true },
    name: { type: String },
    watchlist: [
      {
        videoId: String,
        title: String,
        watchedAt: Date
      }
    ]
  },
  {
    timestamps: true // Adds createdAt and updatedAt automatically
  },
  
);

// Prevent model overwrite error in dev (Hot Reload safe)
export const User = mongoose.models?.User || mongoose.model<IUser>('User', UserSchema);
