const express = require("express");
const { body } = require("express-validator");
const https = require("https");
const fs = require("fs");
const sql = require("./utils");

const app = express();
const router = express.Router();

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.header("Access-Control-Allow-Headers", "*");
  next();
});

app.use(express.json());

router.post(
  "/identify",
  [body("email"), body("phoneNumber")],
  async (req, res) => {
    let retData;
    let email = req.body.email;
    let num = req.body.phoneNumber;

    if (email === null && num === null) {
      retData = "Both fields cannot be null";
    } else {
      let x = await sql.selectData(num, email);
      if (x.id === null) {
        await sql.insertContactData(num, email, null, "primary");
        let y = await sql.selectSpecData(num, email);
        retData = {
          contact: {
            primaryContatctId: y[0].id,
            emails: [email],
            phoneNumbers: [num],
            secondaryContactIds: [],
          },
        };
      } else {
        await sql.updateContactData(num, email, x.id);
        let yEmail = await sql.checkEmail(email);
        let yNum = await sql.checkNum(num);
        if (yEmail.length === 0 || yNum.length === 0) {
          await sql.insertContactData(num, email, x.id, "secondary");
        }

        let z = await sql.selectData(num, email);
        retData = {
          contact: {
            primaryContatctId: z.id,
            emails: z.emails,
            phoneNumbers: z.nums,
            secondaryContactIds: z.ids,
          },
        };
      }
    }
    // await sequelize.close()
    res.status(200).send(retData);
  }
);

app.use("/", router);

// const port = 3001;
// app.listen(port, () => {
//   console.log(`API server listening on port ${port}`);
// });

let options = {
  key: fs.readFileSync("/home/opc/ssl_files/privkey.pem"), // Replace with your SSL private key file path
  cert: fs.readFileSync("/home/opc/ssl_files/fullchain.pem"), // Replace with your SSL certificate file path
};

const server = https.createServer(options, app);

const port = 3001;
server.listen(port, () => {
  console.log(`API server listening on port ${port} with HTTPS`);
});
