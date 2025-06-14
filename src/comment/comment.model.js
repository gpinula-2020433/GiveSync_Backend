import { Schema, model } from "mongoose";

const commentSchema = Schema(
    {
        content:{
            type: String,
            maxLength: [500,`NO puede superar los 500 caracteres` ],
            required: [true, 'El contenido es requerido'],
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
    },
    {
        versionKey: false,
        timestamps: true
    }
)
export default model ('Comment', commentSchema)
//contenido imagen usuario publicacion fecha
