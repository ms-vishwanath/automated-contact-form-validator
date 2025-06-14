import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import logger from "./logger";
import morgan from "morgan";
import nodemailer from "nodemailer";
const port = process.env.PORT || 4000;
const app = express();
app.use(express.json());
app.use(cors({ origin: "*" }));
import cron from "node-cron";
import { transporter } from "./functions/transporter";
const morganFormat = ":method :url :status :response-time ms";
app.use(
  morgan(morganFormat, {
    stream: {
      write: (message: string) => {
        const logObject = {
          method: message.split(" ")[0],
          url: message.split(" ")[1],
          status: message.split(" ")[2],
          responseTime: message.split(" ")[3],
        };
        logger.info(JSON.stringify(logObject));
      },
    },
  })
);

const startWorker = async () => {
  const urlEncodedData = new URLSearchParams();
  urlEncodedData.append("email", "thameem@guidanz.com");
  urlEncodedData.append("firstName", "Thameem");
  urlEncodedData.append("downloadSkedlerV5", "Yes");
  urlEncodedData.append("os", "Ubuntu");
  urlEncodedData.append("recentActivities", "Proceed to Download");
  urlEncodedData.append("proceedToDownload", "true");
  urlEncodedData.append("googleClickId", "No");
  urlEncodedData.append("utmTerm", "null");
  urlEncodedData.append("utmCampaign", "No");
  urlEncodedData.append("utmMedium", "No");
  urlEncodedData.append("verificationCode", "665035");

  try {
    const response = await fetch(
      "https://api.skedler.com/v1/hubspot/skedler/contacts",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
          "x-api-key": "B88FD4C379DEEDCAC1E69CCADCD84",
        },
        body: urlEncodedData.toString(),
      }
    );

    const data = await response.json();
    console.log("Success:", data);

    if (data.status === "error") {
      await sendErrorEmail(JSON.stringify(data));
    }
  } catch (error) {
    console.error("Error during API request:", error);
    await sendErrorEmail(error.toString());
  }
};

app.listen(port, async () => {
  console.log(`Server listening at http://localhost:${port}`);
});

const sendErrorEmail = async (error: string) => {
  try {
    await transporter.sendMail({
      from: process.env.SMTP_EMAIL,
      to: process.env.ALERT_RECIEVER_EMAIL,
      subject: "API Error Alert",
      text: `DOWNLOAD PAGE NOT WORKING DUE TO ERROR => : ${error}`,
    });
    console.log("Error email sent successfully");
  } catch (emailError) {
    console.error("Failed to send error email:", emailError);
  }
};

// cron.schedule('0 0 * * *', async () => {
//   await startWorker();
// });

app.get("/api/cron", async (req, res) => {
  await startWorker();
});
