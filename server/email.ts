/**
 * Email notification system
 * 
 * This module provides email sending functionality using the Manus notification API.
 * For now, we use the owner notification system. In production, you should integrate
 * with a proper email service like SendGrid, Mailgun, or AWS SES.
 */

import { notifyOwner } from "./_core/notification";

interface EmailTemplate {
  subject: string;
  html: string;
  text: string;
}

/**
 * Send email notification
 * Currently uses owner notification as a placeholder
 * TODO: Integrate with proper email service
 */
export async function sendEmail(to: string, template: EmailTemplate): Promise<boolean> {
  // For now, notify owner with email details
  // In production, replace with actual email service
  return await notifyOwner({
    title: `Email to ${to}: ${template.subject}`,
    content: template.text,
  });
}

/**
 * Order confirmation email template
 */
export function orderConfirmationEmail(data: {
  customerName: string;
  orderNumber: string;
  orderDate: string;
  items: Array<{ name: string; quantity: number; price: number }>;
  total: number;
  shippingAddress?: string;
}): EmailTemplate {
  const itemsHtml = data.items
    .map(
      (item) => `
        <tr>
          <td style="padding: 8px; border-bottom: 1px solid #eee;">${item.name}</td>
          <td style="padding: 8px; border-bottom: 1px solid #eee; text-align: center;">${item.quantity}</td>
          <td style="padding: 8px; border-bottom: 1px solid #eee; text-align: left;">₪${item.price.toFixed(2)}</td>
        </tr>
      `
    )
    .join("");

  const itemsText = data.items
    .map((item) => `${item.name} x${item.quantity} - ₪${item.price.toFixed(2)}`)
    .join("\n");

  const html = `
    <!DOCTYPE html>
    <html dir="rtl" lang="he">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>אישור הזמנה</title>
    </head>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
        <h1 style="margin: 0; font-size: 28px;">תודה על ההזמנה!</h1>
        <p style="margin: 10px 0 0 0; font-size: 16px;">הזמנתך התקבלה בהצלחה</p>
      </div>
      
      <div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px;">
        <div style="background: white; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
          <h2 style="color: #667eea; margin-top: 0;">שלום ${data.customerName},</h2>
          <p>קיבלנו את הזמנתך ואנחנו עובדים על זה! הנה פרטי ההזמנה שלך:</p>
          
          <div style="background: #f0f0f0; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <p style="margin: 5px 0;"><strong>מספר הזמנה:</strong> ${data.orderNumber}</p>
            <p style="margin: 5px 0;"><strong>תאריך:</strong> ${data.orderDate}</p>
          </div>
          
          <h3 style="color: #667eea;">פריטים בהזמנה:</h3>
          <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
            <thead>
              <tr style="background: #667eea; color: white;">
                <th style="padding: 10px; text-align: right;">פריט</th>
                <th style="padding: 10px; text-align: center;">כמות</th>
                <th style="padding: 10px; text-align: left;">מחיר</th>
              </tr>
            </thead>
            <tbody>
              ${itemsHtml}
            </tbody>
            <tfoot>
              <tr style="background: #f0f0f0; font-weight: bold;">
                <td colspan="2" style="padding: 10px; text-align: right;">סה"כ:</td>
                <td style="padding: 10px; text-align: left;">₪${data.total.toFixed(2)}</td>
              </tr>
            </tfoot>
          </table>
          
          ${
            data.shippingAddress
              ? `
            <h3 style="color: #667eea;">כתובת משלוח:</h3>
            <p style="background: #f0f0f0; padding: 15px; border-radius: 5px;">${data.shippingAddress}</p>
          `
              : ""
          }
          
          <p style="margin-top: 30px;">נעדכן אותך ברגע שההזמנה תישלח.</p>
        </div>
        
        <div style="text-align: center; color: #666; font-size: 14px;">
          <p>שאלות? צור קשר בכתובת: <a href="mailto:info@lashonhara.co.il" style="color: #667eea;">info@lashonhara.co.il</a></p>
          <p style="margin-top: 20px;">תודה שבחרת בנו!</p>
          <p><strong>לשון הרע לא מדבר אליי</strong></p>
        </div>
      </div>
    </body>
    </html>
  `;

  const text = `
שלום ${data.customerName},

תודה על ההזמנה!

פרטי הזמנה:
מספר הזמנה: ${data.orderNumber}
תאריך: ${data.orderDate}

פריטים בהזמנה:
${itemsText}

סה"כ: ₪${data.total.toFixed(2)}

${data.shippingAddress ? `כתובת משלוח:\n${data.shippingAddress}` : ""}

נעדכן אותך ברגע שההזמנה תישלח.

שאלות? צור קשר: info@lashonhara.co.il

תודה,
לשון הרע לא מדבר אליי
  `.trim();

  return {
    subject: `אישור הזמנה #${data.orderNumber}`,
    html,
    text,
  };
}

/**
 * Order status update email template
 */
export function orderStatusUpdateEmail(data: {
  customerName: string;
  orderNumber: string;
  status: string;
  statusMessage: string;
  trackingNumber?: string;
}): EmailTemplate {
  const statusColors: Record<string, string> = {
    processing: "#f59e0b",
    shipped: "#3b82f6",
    delivered: "#10b981",
    cancelled: "#ef4444",
  };

  const statusColor = statusColors[data.status] || "#667eea";

  const html = `
    <!DOCTYPE html>
    <html dir="rtl" lang="he">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>עדכון הזמנה</title>
    </head>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background: ${statusColor}; color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
        <h1 style="margin: 0; font-size: 28px;">עדכון הזמנה</h1>
        <p style="margin: 10px 0 0 0; font-size: 16px;">הזמנה #${data.orderNumber}</p>
      </div>
      
      <div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px;">
        <div style="background: white; padding: 20px; border-radius: 8px;">
          <h2 style="color: ${statusColor}; margin-top: 0;">שלום ${data.customerName},</h2>
          <p style="font-size: 18px; font-weight: bold; color: ${statusColor};">${data.statusMessage}</p>
          
          ${
            data.trackingNumber
              ? `
            <div style="background: #f0f0f0; padding: 15px; border-radius: 5px; margin: 20px 0;">
              <p style="margin: 5px 0;"><strong>מספר מעקב:</strong> ${data.trackingNumber}</p>
            </div>
          `
              : ""
          }
          
          <p style="margin-top: 20px;">תוכל לעקוב אחר ההזמנה שלך בכל עת באזור האישי.</p>
        </div>
        
        <div style="text-align: center; color: #666; font-size: 14px; margin-top: 30px;">
          <p>שאלות? צור קשר: <a href="mailto:info@lashonhara.co.il" style="color: ${statusColor};">info@lashonhara.co.il</a></p>
          <p><strong>לשון הרע לא מדבר אליי</strong></p>
        </div>
      </div>
    </body>
    </html>
  `;

  const text = `
שלום ${data.customerName},

עדכון הזמנה #${data.orderNumber}

${data.statusMessage}

${data.trackingNumber ? `מספר מעקב: ${data.trackingNumber}` : ""}

תוכל לעקוב אחר ההזמנה שלך בכל עת באזור האישי.

שאלות? צור קשר: info@lashonhara.co.il

תודה,
לשון הרע לא מדבר אליי
  `.trim();

  return {
    subject: `עדכון הזמנה #${data.orderNumber}`,
    html,
    text,
  };
}

/**
 * Contact form submission notification (to admin)
 */
export function contactFormNotificationEmail(data: {
  name: string;
  email: string;
  phone?: string;
  message: string;
  priority: string;
}): EmailTemplate {
  const priorityColors: Record<string, string> = {
    low: "#10b981",
    normal: "#3b82f6",
    high: "#f59e0b",
    urgent: "#ef4444",
  };

  const priorityColor = priorityColors[data.priority] || "#3b82f6";

  const html = `
    <!DOCTYPE html>
    <html dir="rtl" lang="he">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>הודעת צור קשר חדשה</title>
    </head>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background: ${priorityColor}; color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
        <h1 style="margin: 0; font-size: 28px;">הודעת צור קשר חדשה</h1>
        <p style="margin: 10px 0 0 0; font-size: 16px;">דחיפות: ${data.priority}</p>
      </div>
      
      <div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px;">
        <div style="background: white; padding: 20px; border-radius: 8px;">
          <h2 style="color: ${priorityColor}; margin-top: 0;">פרטי השולח:</h2>
          <div style="background: #f0f0f0; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <p style="margin: 5px 0;"><strong>שם:</strong> ${data.name}</p>
            <p style="margin: 5px 0;"><strong>אימייל:</strong> ${data.email}</p>
            ${data.phone ? `<p style="margin: 5px 0;"><strong>טלפון:</strong> ${data.phone}</p>` : ""}
          </div>
          
          <h3 style="color: ${priorityColor};">ההודעה:</h3>
          <div style="background: #f9f9f9; padding: 15px; border-radius: 5px; border-right: 4px solid ${priorityColor};">
            <p style="white-space: pre-wrap; margin: 0;">${data.message}</p>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;

  const text = `
הודעת צור קשר חדשה
דחיפות: ${data.priority}

פרטי השולח:
שם: ${data.name}
אימייל: ${data.email}
${data.phone ? `טלפון: ${data.phone}` : ""}

ההודעה:
${data.message}
  `.trim();

  return {
    subject: `הודעת צור קשר חדשה מ-${data.name}`,
    html,
    text,
  };
}

/**
 * Partnership request notification (to admin)
 */
export function partnershipNotificationEmail(data: {
  name: string;
  email: string;
  phone?: string;
  organization?: string;
  type: string;
  message: string;
}): EmailTemplate {
  const html = `
    <!DOCTYPE html>
    <html dir="rtl" lang="he">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>בקשת שותפות חדשה</title>
    </head>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
        <h1 style="margin: 0; font-size: 28px;">בקשת שותפות חדשה</h1>
        <p style="margin: 10px 0 0 0; font-size: 16px;">סוג: ${data.type}</p>
      </div>
      
      <div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px;">
        <div style="background: white; padding: 20px; border-radius: 8px;">
          <h2 style="color: #667eea; margin-top: 0;">פרטי המבקש:</h2>
          <div style="background: #f0f0f0; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <p style="margin: 5px 0;"><strong>שם:</strong> ${data.name}</p>
            <p style="margin: 5px 0;"><strong>אימייל:</strong> ${data.email}</p>
            ${data.phone ? `<p style="margin: 5px 0;"><strong>טלפון:</strong> ${data.phone}</p>` : ""}
            ${data.organization ? `<p style="margin: 5px 0;"><strong>ארגון:</strong> ${data.organization}</p>` : ""}
          </div>
          
          <h3 style="color: #667eea;">פרטי הבקשה:</h3>
          <div style="background: #f9f9f9; padding: 15px; border-radius: 5px; border-right: 4px solid #667eea;">
            <p style="white-space: pre-wrap; margin: 0;">${data.message}</p>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;

  const text = `
בקשת שותפות חדשה
סוג: ${data.type}

פרטי המבקש:
שם: ${data.name}
אימייל: ${data.email}
${data.phone ? `טלפון: ${data.phone}` : ""}
${data.organization ? `ארגון: ${data.organization}` : ""}

פרטי הבקשה:
${data.message}
  `.trim();

  return {
    subject: `בקשת שותפות חדשה - ${data.type}`,
    html,
    text,
  };
}
