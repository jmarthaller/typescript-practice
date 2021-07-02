import nodemailer from "nodemailer";

export async function sendEmail(to: string, html: string) {

  let transporter = nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    secure: false,
    auth: {
      user: 'fdbdkyc3qqiytosv@ethereal.email',
      pass: 'S7ykk3ebQZcPSKBJTN', 
    },
  });

  let info = await transporter.sendMail({
    from: '"Jacob Marthaller Portfolio Site" <jacob@jacob.com>',
    to: to, 
    subject: "Thanks for checking out Jacob Marthaller's Potfolio Site!",
    html, 
  });

  console.log("Message sent: %s", info.messageId);
  console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
}
