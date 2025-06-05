import { Schema, model } from "mongoose"

const donationSchema = new Schema(
  {
    amount: {
      type: Number,
      required: [true, 'Donation amount is required']
    },
    date: {
        type: Date,
        default: Date.now
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    institution: {
        type: Schema.Types.ObjectId,
        ref: 'Institution'
    }
  }
)

export default model("Donation", donationSchema)
