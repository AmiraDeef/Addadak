'use strict';

const mongoose = require('mongoose');

const metricSchema = new mongoose.Schema(
  {
    nationalID: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    utility: {
      type: String,
      enum: ['Electricity', 'Water', 'Gas'],
      trim: true,
    },
    meterNumber: {
      type: String,
      trim: true,
    },
    meterType: {
      type: String,
      enum: ['Smart Meter', 'Smart Card', 'Bill'],
      default: 'Smart Card',
    },
    address: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    billingMonth: {
      type: String,
      index: true,
    },
    reading: {
      type: Number,
    },
    readingDate: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
    collection: 'metrics',
  }
);

const Metrics = mongoose.models.metrics || mongoose.models.Metrics || mongoose.model('metrics', metricSchema);

module.exports = Metrics;
