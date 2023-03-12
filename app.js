const express = require("express");
const bodyParser = require("body-parser");
const https = require("https");
const mailchimp = require("@mailchimp/mailchimp_marketing");

const app = express();

mailchimp.setConfig({
  apiKey: "1197505514b21ab63224d11c6247e4d8-us21",
  server: "us21"
});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/", function (req, res) {
  res.sendFile(__dirname + "/signup.html");
})


app.post("/", function (req, res) {

  const fName = req.body.fname;
  const lName = req.body.lname;
  const email = req.body.email;


  const listId = "3815628c16";

  const subscribingUser = {
    firstName: fName,
    lastName: lName,
    email: email
  };

  async function run() {
    const response = await mailchimp.lists.addListMember(listId, {
      email_address: subscribingUser.email,
      status: "subscribed",
      merge_fields: {
        FNAME: subscribingUser.firstName,
        LNAME: subscribingUser.lastName
      }
    });


    console.log(response);


    if (response.status == "subscribed") {
      res.sendFile(__dirname + "/success.html");
    }
    else {
      res.sendFile(__dirname + "/failure.html");
    }
  }

  run();

});

app.post("/failure", function (req, res) {
  res.redirect("/");
});



app.listen(process.env.PORT || 3000, function () {
  console.log("Server running on port 3000.");
});