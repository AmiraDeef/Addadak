'use strict';

const fs = require('fs').promises;
const path = require('path');
const { sendMail } = require('./transporter');
const {
  BILL_GENERATED, LOW_BALANCE, HIGH_CONSUMPTION, TIER_WARNING, BILL_PROJECTION, PAYMENT_REMINDER, WELCOME,
} = require('../../shared/constants/notificationType');

class EmailService {
  /**
   * Main entry point to send an email for a notification
   * @param {Object} notification - The notification document from MongoDB
   */
  async sendNotificationEmail(notification) {
    const { email, type, data } = notification;

    const subject = this.getSubjectByType(type);
    const html = await this.renderTemplate(type, data);

    return sendMail({
      to: email,
      subject,
      html,
    });
  }

  /**
   * Maps notification type to email subject (Arabic)
   */
  getSubjectByType(type) {
    const subjects = {
      [BILL_GENERATED]: 'فاتورتك جاهزة — Addadak',
      [LOW_BALANCE]: '⚠️ رصيدك منخفض — Addadak',
      [HIGH_CONSUMPTION]: '📈 تنبيه استهلاك عالي — Addadak',
      [TIER_WARNING]: '⚡ اقتربت من الشريحة التالية — Addadak',
      [BILL_PROJECTION]: '💰 توقع فاتورتك القادمة — Addadak',
      [PAYMENT_REMINDER]: '🔔 تذكير بموعد الدفع — Addadak',
      [WELCOME]: 'مرحباً بك في Addadak! 🎉',
    };

    return subjects[type] || 'إشعار جديد من Addadak';
  }

  /**
   * Reads HTML template and replaces {{placeholders}} with actual values
   */
  async renderTemplate(type, data = {}) {
    // Determine template filename based on type
    const templateFileName = this.getTemplateFileName(type);
    const templatePath = path.join(__dirname, '../../shared/templates', templateFileName);

    try {
      let html = await fs.readFile(templatePath, 'utf-8');

      // Default placeholders if data is missing
      const values = {
        userName: data.userName || 'عميلنا العزيز',
        meterNumber: data.meterNumber || 'غير محدد',
        billingMonth: data.billingMonth || '',
        consumption: data.consumption || '0',
        billAmount: data.billAmount || '0.00',
        tier: data.tier || '-',
        balance: data.balance || '0.00',
        date: data.date || new Date().toLocaleDateString('ar-EG'),
        ...data, // Allow any other custom data to override
      };

      // Replace all {{key}} with values[key]
      Object.keys(values).forEach((key) => {
        const regex = new RegExp(`{{${key}}}`, 'g');
        html = html.replace(regex, values[key]);
      });

      return html;
    } catch (error) {
      console.error(`[EmailService] Failed to load template ${templateFileName}:`, error.message);
      // Fallback simple HTML
      return `<div dir="rtl"><h2>إشعار من عدادك</h2><p>يرجى مراجعة التطبيق لمعرفة التفاصيل.</p></div>`;
    }
  }

  /**
   * Maps notification type to HTML template file name
   */
  getTemplateFileName(type) {
    const files = {
      [BILL_GENERATED]: 'billGenerated.html',
      [LOW_BALANCE]: 'lowBalance.html',
      [HIGH_CONSUMPTION]: 'highConsumption.html',
      [TIER_WARNING]: 'tierWarning.html',
      [BILL_PROJECTION]: 'billProjection.html',
      [PAYMENT_REMINDER]: 'paymentReminder.html',
      [WELCOME]: 'welcome.html',
    };

    return files[type] || 'welcome.html';
  }
}

module.exports = new EmailService();
