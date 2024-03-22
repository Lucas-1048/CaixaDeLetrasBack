import mongoose from 'mongoose';

interface IFollow {
    follower: mongoose.Types.ObjectId;
    following: mongoose.Types.ObjectId;
}

const FollowSchema = new mongoose.Schema({
    follower: { type: mongoose.Types.ObjectId, ref: 'User', required: true },
    following: { type: mongoose.Types.ObjectId, ref: 'User', required: true },
});

export const Follow = mongoose.model<IFollow>('Follow', FollowSchema);
