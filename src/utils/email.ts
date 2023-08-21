// import nodemailer, { Transporter } from "nodemailer";

// interface EmailOptions {
//   email: string;
//   subject: string;
//   message: string;
// }

// export const sendEmail = async (options: EmailOptions) => {
//   // 1) Create a transporter
//   const transporter: Transporter = nodemailer.createTransport({
//     host: process.env.EMAIL_HOST,
//     port: Number(process.env.EMAIL_PORT),
//     secure: process.env.EMAIL_SECURE === "true",
//     auth: {
//       user: process.env.EMAIL_USERNAME,
//       pass: process.env.EMAIL_PASSWORD,
//     },
//   });

//   // 2) Define the email options
//   const mailOptions = {
//     from: `Nweke Estate <${process.env.EMAIL_FROM}>`,
//     to: options.email,
//     subject: options.subject,
//     text: options.message,
//   };

//   // 3) Send the actual message
//   await transporter.sendMail(mailOptions);
// };

import { htmlToText } from "html-to-text";
import nodemailer, { Transporter } from "nodemailer";
import { google } from "googleapis";
import pug from "pug";
import dotenv from "dotenv";

dotenv.config();

const oAuth2Client = new google.auth.OAuth2(
  process.env.OAUTH_CLIENT_ID!,
  process.env.OAUTH_CLIENT_SECRETE!,
  process.env.OAUTH_REDIRECT_URL!
);
oAuth2Client.setCredentials({
  refresh_token: process.env.OAUTH_REFRESH_TOKEN!,
});

interface User {
  email: string;
  name: string;
  username: string;
}

export default class Email {
  private to: string;
  private name: string;
  private username: string;
  private url: string;
  private from: string;

  constructor(user: User, url: string) {
    this.to = user.email;
    this.name = user.name;
    this.username = user.username;
    this.url = url;
    this.from = `Nweke Estate <${
      process.env.NODE_ENV === "production"
        ? process.env.EMAIL_FROM
        : process.env.SENDINBLUE_EMAIL_FROM
    }>`;
  }

  private async accessToken(): Promise<string> {
    const accessTokenObject = await oAuth2Client.getAccessToken();

    if (accessTokenObject && accessTokenObject.token) {
      return accessTokenObject.token;
    } else {
      throw new Error("Access token not available.");
    }
  }

  private async newTransport(): Promise<Transporter | undefined> {
    if (process.env.NODE_ENV === "production") {
      return nodemailer.createTransport({
        service: "gmail",
        auth: {
          type: "OAuth2",
          user: process.env.MAIL_USER,
          clientId: process.env.OAUTH_CLIENT_ID!,
          clientSecret: process.env.OAUTH_CLIENT_SECRETE!,
          refreshToken: process.env.OAUTH_REFRESH_TOKEN!,
          accessToken: await this.accessToken(),
        },
      });
    }
  }

  public async send(template: string, subject: string): Promise<void> {
    const html = pug.renderFile(
      `${__dirname}/../views/emails/${template}.pug`,
      {
        name: this.name,
        username: this.username,
        url: this.url,
        subject,
      }
    );

    const mailOptions = {
      from: this.from,
      to: this.to,
      subject,
      html,
      text: htmlToText(html),
    };

    const transporter = await this.newTransport();
    if (transporter) {
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.log(error.stack);
          throw new Error("Error sending mail", error);
        } else {
          console.log(`Email sent successfully: ${info.response}`);
        }
      });
    }
  }

  public async sendWelcomeMail(): Promise<void> {
    await this.send(
      "Welcome",
      "Welcome to the PostiT! Everything is social!"
    );
  }

  public async sendPasswordReset_ForgetLink(): Promise<void> {
    await this.send(
      "Forgot Email",
      "Your password reset token. (Valid for only 10 minutes)"
    );
  }
}
