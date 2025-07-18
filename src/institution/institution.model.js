import { Schema, model } from "mongoose";
import { type } from "os";

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
            enum: ['EATERS', 'ORPHANAGE', 'ACYL']
        },
        description:{
            type: String,
            required: [true, 'Description is required'],
            maxLength: [1000, `Can't be overcome 1000 characters`]
        },
        address:{
            type: String,
            required: [true, 'Address is required'],
            maxLength: [250, `Can't be overcome 250 characters`]
        },
        phone:{
            type: String,
            required: [true, 'Phone is required'],
            minLength:[8, 'Phone must be 8 numbers'],
            maxLength: [15, `Can't be overcome 15 characters`]
        },
        imageInstitution:[{
            type: String
        }],
        state:{
            type: String,
            uppercase: true,
            enum: ['REFUSED', 'ACCEPTED', 'EARRING'],
            default: 'EARRING'
        },
        userId:{
            type: Schema.Types.ObjectId,
            ref: 'User'
        }
    },
    {
        versionKey: false,
        timestamps: true
    }
)

export default model ('Institution', institutionSchema)