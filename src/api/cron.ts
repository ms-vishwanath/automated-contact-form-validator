import { transporter } from "../functions/transporter";

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
export default async function handler(req, res) {
  res.status(200).end("Hello Cron!");

  const urlEncodedData = new URLSearchParams();
  urlEncodedData.append("email", "demo@email.com");
  urlEncodedData.append("firstName", "demo_guy");
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
      "contact_form_url",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
          "x-api-key": "",
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
}
