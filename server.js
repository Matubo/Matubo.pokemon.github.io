const express = require("express");
const path = require("path");

const app = express();
const port = 3001;
const clientPath = path.join(__dirname, "docs"); //(!корневая папка,имя вложенных)
app.use(express.static(clientPath));
app.get("/", (req, res) => {
  res.send(clientPath);
});


app.listen(port, () => {
  console.log(`work on ${port}`);
});
