const express = require("express");
const app = express();
const PORT = 3000; // You can choose any port you like

app.get("/", (req, res) => {
  res.send("ok");
});

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
