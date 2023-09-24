const express = require("express");
const app = express();
const PORT = 3000; // You can choose any port you like

app.get("/", (req, res) => {
  res.send("ok");
});

app.get("/test", (req, res) => {
  res.status(200).json({ status: 200, message: "ok" });
});

app.get("/time", (req, res) => {
  const currentTime = new Date().toTimeString();
  res.status(200).json({ status: 200, message: currentTime });
});

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
