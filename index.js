// code away!
require("dotenv").config();
const server = require("./server.js");

const port = process.env.PORT || 4000;
server.listen(port, () => {
  console.log("**********The mystery unfolds on port 4k**********");
});
