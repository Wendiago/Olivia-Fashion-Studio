const transporter = require("../configs/configNodemailer");

const nodeMailer = {
  sendMail: async (content) => {
    try {
      const info = await transporter.sendMail({
        from: '"Olivia Fashion Studio" <phungngoctqk@gmail.com>',
        to: content.email,
        subject: content.subject,
        html: content.html,
      });

      console.log("Email sent: %s", info.messageId);
    } catch (error) {
      console.error("Error sending email:", error);
      throw error; // Re-throw the error to handle it in the calling function
    }
  },
};

module.exports = nodeMailer;
