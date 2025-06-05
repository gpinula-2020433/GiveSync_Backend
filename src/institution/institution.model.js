import { Schema, model } from "mongoose";

const institutionSchema = Schema(
    {
        name:{
            type: String,
            required: [true, 'Name is required'],
            maxLength: [100, `Can't be overcome 100 characters`]
        },
        type:{
            type: String,
            uppercase: true,
            enum: ['EATERS', 'ORPHANAGE', 'ACYL'],
        },
        description:{
            type: String,
            required: [true, 'Description is required'],
            maxLength: [100, `Can't be overcome 100 characters`]
        },
        imageInstitution:{
            type: String
        },
        state:{
            type: Boolean,
            defaultValue: false
        },
        RegistrationDate:{
            type: Date,
            default:Date.now
        },
        userId:{
            type: Schema.Types.ObjectId,
            ref: 'User'
        }
    }
)

export default model ('Institution', institutionSchema)