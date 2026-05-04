export default async function handler(req, res) {

  if (req.method !== "POST") {
    return res.status(405).send("Method not allowed");
  }

  console.log("🔥 CALLBACK IRLEE:", req.body);

  const { invoice_id, payment_status } = req.body;

  if (payment_status === "PAID") {
    console.log("✅ Төлбөр амжилттай:", invoice_id);

    // 👉 Энд DB update хийж болно
  }

  res.status(200).end();
}