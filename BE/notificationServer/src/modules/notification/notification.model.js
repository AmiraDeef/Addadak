'use strict';

const mongoose = require('mongoose');
const {
  PENDING, QUEUED, PROCESSING, SENT, FAILED, PERMANENTLY_FAILED,
} = require('../../shared/constants/notificationStatus');
const {
  BILL_GENERATED, LOW_BALANCE, HIGH_CONSUMPTION, TIER_WARNING, BILL_PROJECTION, PAYMENT_REMINDER, WELCOME,
} = require('../../shared/constants/notificationType');
const { SMART_METER, SMART_CARD, BILL } = require('../../shared/constants/meterType');

const notificationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      // No 'ref' because User model is in AuthServer
    },
    nationalID: {
      type: String,
      required: true,
      minlength: 14,
      maxlength: 14,
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    type: {
      type: String,
      required: true,
      enum: [
        BILL_GENERATED,
        LOW_BALANCE,
        HIGH_CONSUMPTION,
        TIER_WARNING,
        BILL_PROJECTION,
        PAYMENT_REMINDER,
        WELCOME,
      ],
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    message: {
      type: String,
      required: true,
    },
    data: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
    meterNumber: {
      type: String,
      trim: true,
    },
    meterType: {
      type: String,
      enum: [SMART_METER, SMART_CARD, BILL],
    },
    utility: {
      type: String,
      enum: ['Electricity', 'Water', 'Gas'],
    },
    status: {
      type: String,
      required: true,
      enum: [PENDING, QUEUED, PROCESSING, SENT, FAILED, PERMANENTLY_FAILED],
      default: PENDING,
    },
    attemptCount: {
      type: Number,
      default: 0,
    },
    lastAttemptAt: {
      type: Date,
    },
    sentAt: {
      type: Date,
    },
    failedReason: {
      type: String,
    },
    scheduledFor: {
      type: Date,
    },
    isRead: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for fast querying
notificationSchema.index({ userId: 1, createdAt: -1 }); // Get user notifications sorted
notificationSchema.index({ status: 1 }); // Find pending/failed
notificationSchema.index({ scheduledFor: 1 }); // For delayed

const Notification = mongoose.model('Notification', notificationSchema);

module.exports = Notification;
