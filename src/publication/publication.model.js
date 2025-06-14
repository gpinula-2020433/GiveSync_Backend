import { Schema, model } from "mongoose"

const publicationSchema = Schema(
    {
        title:{
            type: String,
            required:[true, 'Title is required'],
            maxLength: [15, `Can't be overcome 15 characters`]
        },
        content:{
            type: String,
            required:[true, 'Content is required'],
            maxLength: [100, `Can't be overcome 100 characters`]
        },
        imagePublication:{
            type: String
        },
        date:{
            type: Date,
            default: Date.now
        },
        institutionId: {
            type: Schema.Types.ObjectId,
            ref: 'Institution',
            required: [true, 'Institution is required'],
        }
    },
    {
        versionKey: false,
        timestamps: true
    }
)

export default model ('Publication', publicationSchema)