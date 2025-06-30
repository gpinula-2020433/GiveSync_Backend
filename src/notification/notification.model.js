import { Schema, model } from "mongoose";

const notificationSchema = Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    fromUserId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      default: null
    },
    message: {
      type: String,
      required: [true, 'Message is required'],
      maxLength: [250, `Can't be overcome 250 characters`]
    },
    type: {
      type: String,
      uppercase: true,
      enum: [
        'DONATION',
        'PUBLICATION',
        'COMMENT',
        'INSTITUTION',
        'SYSTEM'
      ],
      required: true
    },
    referenceId: {
      type: Schema.Types.ObjectId,
      default: null
    },
    isRead: {
      type: Boolean,
      default: false
    }
  },
  {
    versionKey: false,
    timestamps: true
  }
)

export default model('Notification', notificationSchema)