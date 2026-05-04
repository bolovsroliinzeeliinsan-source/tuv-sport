import axios from "axios";

export default async function handler(req, res) {

  if (req.method !== "POST") {
    return res.status(405).send("Method not allowed");
  }

  try {

    const body = req.body || {};
    const amount = body.amount || 0;

    console.log("🔥 AMOUNT:", amount);

    const tokenResponse = await axios.post(
      "https://merchant.qpay.mn/v2/auth/token",
      {},
      {
        auth: {
          username: "TUVSPORT",
          password: "48zFv0rt"
        }
      }
    );

    console.log("🔥 TOKEN OK");

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

    console.log("🔥 INVOICE OK");

    res.status(200).json({
      qr: invoice.data.qr_image,
      invoice_id: invoice.data.invoice_id
    });

  } catch (err) {
    console.log("🔥 FULL ERROR:", err.response?.data || err.message);

    res.status(500).json({
      error: err.response?.data || err.message
    });
  }
}