import { Schema, model, Types } from "mongoose"

const donationSchema = new Schema(
  {
    amount: {
      type: Number,
      required: [true, 'Amount is required'],
      min: [1, 'Amount must be at least 1'],
      max: [1000000, 'Amount cannot exceed 1,000,000']
    },
    date: {
      type: Date,
      default: Date.now
    },
    institution: {
      type: Schema.Types.ObjectId,
      ref: 'Institution',
      required: [true, 'Institution is required'],
      validate: {
        validator: (value) => Types.ObjectId.isValid(value),
        message: 'Invalid Institution ID format'
      }
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User is required'],
      validate: {
        validator: (value) => Types.ObjectId.isValid(value),
        message: 'Invalid User ID format'
      }
    }
  },
  {
    versionKey: false,
    timestamps: true
  }
)

export default model('Donation', donationSchema)
