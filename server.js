const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

// 🔑 QPay мэдээлэл
const USERNAME = "TUVSPORT";
const PASSWORD = "48zFv0rt";

let ACCESS_TOKEN = null;

// ✔ TOKEN авах API
app.get("/get-token", async (req, res) => {
  try {

    const response = await axios.post(
      "https://merchant.qpay.mn/v2/auth/token",
      {},
      {
        auth: {
          username: USERNAME,
          password: PASSWORD
        }
      }
    );

    res.json({
      token: response.data.access_token
    });

  } catch (err) {
    console.log(err.response?.data || err.message);
    res.status(500).send("Token алдаа");
  }
});

app.listen(3000, () => {
  console.log("🚀 Server ажиллаж байна http://localhost:3000");
});
const INVOICE_CODE = "TUVSPORT_INVOICE";

// 🧾 Invoice үүсгэх API
app.post("/create-invoice", async (req, res) => {
  try {

    const { amount } = req.body;  // 🔥 ЭНЭ ЧУХАЛ

    const tokenResponse = await axios.post(
      "https://merchant.qpay.mn/v2/auth/token",
      {},
      {
        auth: {
          username: USERNAME,
          password: PASSWORD
        }
      }
    );

    const token = tokenResponse.data.access_token;

    const invoice = await axios.post(
      "https://merchant.qpay.mn/v2/invoice",
      {
        invoice_code: INVOICE_CODE,
        sender_invoice_no: Date.now().toString(),
        invoice_receiver_code: "terminal",
        invoice_description: "Заал захиалга",
        amount: amount,   // ✔ ОДОО АЖИЛЛАНА
        callback_url: "https://YOUR_NGROK_URL.ngrok.io/qpay-callback"
      },
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    res.json({
      qr: invoice.data.qr_image,
      invoice_id: invoice.data.invoice_id
    });

  } catch (err) {
    console.log(err.response?.data || err.message);
    res.status(500).send("Invoice алдаа");
  }
});