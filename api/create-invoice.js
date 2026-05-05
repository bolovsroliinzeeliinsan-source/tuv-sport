const axios = require("axios");

module.exports = async function handler(req, res) {

  if (req.method !== "POST") {
    return res.status(405).send("Method not allowed");
  }

  try {

    const body = typeof req.body === "string"
      ? JSON.parse(req.body)
      : req.body || {};

    const amount = Number(body.amount || 0);

    if (!amount || amount <= 0) {
      return res.status(400).json({ error: "Invalid amount" });
    }

    const tokenResponse = await axios.post(
      "https://merchant.qpay.mn/v2/auth/token",
      {},
      {
        auth: {
          username: process.env.QPAY_USER,
          password: process.env.QPAY_PASS
        }
      }
    );

    const token = tokenResponse.data.access_token;

    const invoice = await axios.post(
      "https://merchant.qpay.mn/v2/invoice",
      {
        invoice_code: "TUVSPORT_INVOICE",
        sender_invoice_no: Date.now().toString(),
        invoice_receiver_code: "terminal",
        invoice_description: "Заал захиалга",
        amount: amount,
        callback_url: "https://tuv-sport.vercel.app/api/qpay-callback"
      },
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    res.status(200).json({
      qr: invoice.data.qr_image,
      invoice_id: invoice.data.invoice_id
    });

  } catch (err) {
    console.log("🔥 ERROR:", err.response?.data || err.message);

    res.status(500).json({
      error: err.response?.data || err.message
    });
  }
};