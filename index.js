const express = require("express");
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const dotenv = require("dotenv");

const app = express();
dotenv.config();

const port = process.env.PORT || 3000;

const username = process.env.MONGODB_USERNAME;
const password = process.env.MONGODB_PASSWORD;

// MongoDB setup


mongoose.connect(`mongodb+srv://revanthjr:${password}@cluster0.k3e4s6s.mongodb.net/registrationFormDB`,
  {
    useNewUrlParser: true,
    UseUnifiedTopology: true,
  }
);

// schema
const registrationSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
});

const Registration = mongoose.model('Registration', registrationSchema);
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Routes
app.get("/", (req, res) => {
  res.sendFile(__dirname + '/pages/index.html');
});

app.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await Registration.findOne({ email: email });
    //existing user check
    if (!existingUser) {
      const registrationData = new Registration({
        name, email, password
      });
      await registrationData.save();
      res.redirect("/success");
    }
    else {
      console.log("User Already exist");
      res.redirect("error-user-already-exists");
    }

  }
  catch (error) {
    console.log(error);
    res.redirect("error");
  }

});

app.get("/success", (req, res) => {
  res.sendFile(__dirname + "/pages/success.html");
})

app.get("/error", (req, res) => {
  res.sendFile(__dirname + "/pages/error.html");
})

app.get("/error-user-already-exists", (req, res) => {
  res.sendFile(__dirname + "/pages/error-user-already-exists.html");
})



// Start server
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
