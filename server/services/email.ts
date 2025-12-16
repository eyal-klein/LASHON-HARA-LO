/**
 * Email Service - Mock SendGrid Implementation
 */

interface EmailOptions {
  to: string | string[];
  subject: string;
  html: string;
  text?: string;
  from?: string;
  replyTo?: string;
}

interface EmailResult {
  success: boolean;
  messageId?: string;
  error?: string;
}

const MOCK_MODE = true;
const FROM_EMAIL = "info@lashonhara.org.il";
const FROM_NAME = "לשון הרע לא מדבר אליי";

export async function sendEmail(options: EmailOptions): Promise<EmailResult> {
  if (MOCK_MODE) {
    console.log("📧 [MOCK EMAIL SENT]");
    console.log("To:", options.to);
    console.log("Subject:", options.subject);
    console.log("---");

    return {
      success: true,
      messageId: `mock-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    };
  }

  return {
    success: true,
    messageId: `real-${Date.now()}`,
  };
}

export async function sendCommitmentConfirmation(
  email: string,
  name: string
): Promise<EmailResult> {
  const html = `<h1>תודה ${name}!</h1><p>ההתחייבות שלך התקבלה בהצלחה.</p>`;
  
  return sendEmail({
    to: email,
    subject: "תודה על ההתחייבות - לשון הרע לא מדבר אליי",
    html,
    text: `שלום ${name}, תודה שהתחייבת לא לדבר לשון הרע!`,
  });
}

export async function sendContactNotification(
  name: string,
  email: string,
  phone: string,
  subject: string,
  message: string
): Promise<EmailResult> {
  const html = `<h2>הודעה חדשה</h2><p>שם: ${name}</p><p>אימייל: ${email}</p><p>טלפון: ${phone}</p><p>נושא: ${subject}</p><p>הודעה: ${message}</p>`;

  return sendEmail({
    to: "admin@lashonhara.org.il",
    subject: `יצירת קשר חדשה: ${subject}`,
    html,
    replyTo: email,
  });
}

export async function sendDonationReceipt(
  email: string,
  name: string,
  amount: number,
  currency: string
): Promise<EmailResult> {
  const html = `<h1>תודה על תרומתך!</h1><p>שלום ${name},</p><p>תרומתך בסך ${amount} ${currency} התקבלה בהצלחה.</p>`;

  return sendEmail({
    to: email,
    subject: "קבלה על תרומה - לשון הרע לא מדבר אליי",
    html,
  });
}

export async function sendOrderConfirmation(
  email: string,
  orderNumber: string,
  total: number
): Promise<EmailResult> {
  const html = `<h1>הזמנה התקבלה!</h1><p>מספר הזמנה: ${orderNumber}</p><p>סכום: ${total} ש"ח</p>`;

  return sendEmail({
    to: email,
    subject: `אישור הזמנה ${orderNumber}`,
    html,
  });
}
