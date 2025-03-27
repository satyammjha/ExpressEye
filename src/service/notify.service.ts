import nodemailer from "nodemailer";

export const sendEmail = async (
  senderEmail: string,
  senderPassword: string,
  recipientEmail: string,
  subject: string,
  text: string,
  html?: string  
) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: senderEmail,
        pass: senderPassword,
      },
    });

    const mailOptions = {
      from: senderEmail,
      to: recipientEmail,
      subject,
      text,  
      html,  
    };

    await transporter.sendMail(mailOptions);
    console.log("[EMAIL SENT] Alert email sent successfully.");
  } catch (error) {
    console.error("[EMAIL ERROR] Failed to send email:", error);
  }
};