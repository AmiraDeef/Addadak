'use strict';

const Joi = require('joi');
const {
  BILL_GENERATED, LOW_BALANCE, HIGH_CONSUMPTION, TIER_WARNING, BILL_PROJECTION, PAYMENT_REMINDER, WELCOME,
  AUTOPAY_DISABLED, AUTOPAY_SUCCESS, PAYMENT_FAILED, NO_PAYMENT_METHOD,
} = require('../../shared/constants/notificationType');
const { SMART_METER, SMART_CARD, BILL } = require('../../shared/constants/meterType');

// Custom Joi validation for MongoDB ObjectId
const objectId = Joi.string().regex(/^[0-9a-fA-F]{24}$/).message('Invalid ObjectId');

const createNotificationSchema = Joi.object({
  userId: objectId.required(),
  nationalID: Joi.string().length(14).required(),
  email: Joi.string().email().required(),
  type: Joi.string()
    .valid(
      BILL_GENERATED,
      LOW_BALANCE,
      HIGH_CONSUMPTION,
      TIER_WARNING,
      BILL_PROJECTION,
      PAYMENT_REMINDER,
      WELCOME,
      AUTOPAY_DISABLED,
      AUTOPAY_SUCCESS,
      PAYMENT_FAILED,
      NO_PAYMENT_METHOD
    )
    .required(),
  title: Joi.string().required(),
  message: Joi.string().required(),
  data: Joi.object().optional(),
  meterNumber: Joi.string().optional(),
  meterType: Joi.string().valid(SMART_METER, SMART_CARD, BILL).optional(),
  utility: Joi.string().valid('Electricity', 'Water', 'Gas').optional(),
  scheduledFor: Joi.date().iso().greater('now').optional(),
});

const processAutoPaySchema = Joi.object({
  userId: objectId.required(),
  nationalID: Joi.string().length(14).required(),
  email: Joi.string().email().required(),
  meterNumber: Joi.string().required(),
  meterType: Joi.string().valid(SMART_METER, SMART_CARD, BILL).optional(),
  utility: Joi.string().valid('Electricity', 'Water', 'Gas').optional(),
  userName: Joi.string().optional(),
  data: Joi.object().optional(),
});

const notifyByAddressSchema = Joi.object({
  address: Joi.string().trim().min(1).optional(),
  location: Joi.string().trim().min(1).optional(),
  type: Joi.string()
    .valid(
      BILL_GENERATED,
      LOW_BALANCE,
      HIGH_CONSUMPTION,
      TIER_WARNING,
      BILL_PROJECTION,
      PAYMENT_REMINDER,
      WELCOME,
      AUTOPAY_DISABLED,
      AUTOPAY_SUCCESS,
      PAYMENT_FAILED,
      NO_PAYMENT_METHOD
    )
    .required(),
  title: Joi.string().trim().min(1).required(),
  message: Joi.string().trim().min(1).required(),
  data: Joi.object().optional().default({}),
  utility: Joi.string().valid('Electricity', 'Water', 'Gas').optional(),
  meterType: Joi.string().valid(SMART_METER, SMART_CARD, BILL).optional(),
  scheduledFor: Joi.date().iso().greater('now').optional(),
}).or('address', 'location');

const getNotificationsSchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(20),
});

const notificationIdSchema = Joi.object({
  id: objectId.required(),
});

module.exports = {
  createNotificationSchema,
  processAutoPaySchema,
  notifyByAddressSchema,
  getNotificationsSchema,
  notificationIdSchema,
};

