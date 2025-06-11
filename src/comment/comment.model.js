import { Schema, model } from "mongoose";

const commentSchema = Schema(
    {
        content:{
            type: String,
            maxLength: [500,`Can't be overcome 500, characters` ],
            required: [true, 'Content is required'],
        },
        commentImage:{
            type: String,
        },
        userId:{
            type: Schema.Types.ObjectId,
            ref: 'User'
        },
        publicationId:{
            type: Schema.Types.ObjectId,
            ref:'Publication'
        },
        fecha: {
            type: Date,
            default: Date.now
        }
    }
)
export default model ('Comment', commentSchema)
//contenido imagen usuario publicacion fecha