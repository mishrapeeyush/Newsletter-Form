const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");
const { status } = require("express/lib/response");

const app = express();

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

// respond with "hello world" when a GET request is made to the homepage
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/signup.html");
});

app.post("/", function (req, res) {
  const firstName = req.body.fname;
  const lastName = req.body.lname;
  const email = req.body.email;

  const data = {
    members: [
      {
        email_address: email,
        status: "subscribed",
        merge_fields: {
          FNAME: firstName,
          LNAME: lastName,
        },
      },
    ],
  };

  const jsonData = JSON.stringify(data);

  const url = "https://us21.api.mailchimp.com/3.0/lists/911996a39f";

  const options = {
    method: "POST",
    auth: "peeyush:abfcbbe5d9364b7ec0b0ea093fcb3938-us21",
  };

  const request = https.request(url, options, function (response) {
    if (response.statusCode === 200) {
      res.sendFile(__dirname + "/success.html");
    } else {
      res.sendFile(__dirname + "/failure.html");
    }
    response.on("data", function (data) {
      console.log(JSON.parse(data));
    }); 
  });

  request.write(jsonData);
  request.end();
});

app.post("/failure",function(req,res){
res.redirect("/");
});

app.listen(process.env.PORT||3000, () => {
  console.log("Server is running on port 3000");
});
