const express = require("express");
const bodyParser = require("body-parser");
const req = require("express/lib/request");
const fs = require("fs");
const { parse } = require("csv-parse");
const nodemailer = require("nodemailer");

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

const holidays = [
  {
    id: "1",
    title: "Just a title",
    description: "Just a description",
  },
  {
    id: "2",
    title: "Just another title",
    description: "Just another description",
  },
];

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PATCH, DELETE, OPTIONS"
  );
  next();
});

app.post("/api/holidays", (req, res, next) => {
  holidays.push(req.body);
  console.log(req.body);
  res.status(201).json({
    msg: "Holiday added successfully",
  });
});

app.get("/api/holidays", (req, res, next) => {
  res.status(200).json({
    msg: "Holidays fetched",
    holidays,
  });
});

app.get("/api/holidays/:hid", (req, res, next) => {
  const holiday = holidays.find((f) => f.id === req.params.hid);
  if (holiday) {
    res.status(200).send({
      msg: "Found holiday",
      holiday,
    });
  } else {
    res.status(200).send({
      msg: "No holiday found",
    });
  }
});

app.get("/api/country-data", (req, res, next) => {
  let dataRows = [];
  fs.createReadStream("./assets/average-latitude-longitude-countries.csv")
    .pipe(parse({ delimiter: ",", from_line: 2 }))
    .on("data", function (row) {
      dataRows.push({
        code: row[0],
        countryName: row[1],
        latitude: +row[2],
        longitude: +row[3],
      });
    })
    .on("end", () => {
      res.status(200).send(dataRows);
    });
});

app.post("/api/send-email", (req, res, next) => {

  let transporter = nodemailer.createTransport({
    service: "", // "gmail"
    host: "", // "smtp.gmail.com"
    port: 0, // 587 (gmail)
    secure: false, // true for 465, false for other ports
    auth: {
      user: "", // email@address.com
      pass: "", // enterYourPasswordHere
    },
  });

  transporter.sendMail({
    from: "", // sender address
    to: "", // list of receivers
    subject: "Hello ✔", // Subject line
    text: "Hello world?", // plain text body
    html: "<b>Hello world?</b>", // html body
  }).then(resp => {
    res.status(201).json({
      msg: "info.messageId",
    });
  }).catch(err => {
    console.log(err);
    res.status(400).json({
      msg: "An error occured."
    });
  });  
});

module.exports = app;
