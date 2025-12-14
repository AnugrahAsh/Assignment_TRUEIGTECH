import mongoose from 'mongoose';

const PostSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    imageUrl: {
        type: String,
        required: [true, 'Please provide an image URL'],
    },
    caption: {
        type: String,
        maxlength: [200, 'Caption cannot be more than 200 characters'],
    },
    likes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    }],
    comments: [{
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        text: {
            type: String,
            required: true,
        },
        createdAt: {
            type: Date,
            default: Date.now,
        },
    }],
}, { timestamps: true });

export default mongoose.models.Post || mongoose.model('Post', PostSchema);
