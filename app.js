require("dotenv").config();
require("./config/database").connect();
var cors = require('cors')
const express = require("express");
const bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');
const app = express();
app.use(cors());
app.use(express.json());

// Logic goes here
// importing user context
const User = require("./model/User");
// car Model
const Car = require("./model/Car");

// CREATE car
app.post("/create-car", (req, res, next) => {
  try {
    const { name, brand, user_id } = req.body;
    if (!(name && brand && user_id)) {

      res.status(400).send("All Field is Required")
    } else {

      Car.create(req.body, (error, data) => {


        if (error) {
          return next(error);
        } else {
          console.log(data);
          res.json(data);
        }
      });
    }
    /// create car  ///


  } catch (err) {

    console.log(err);

  }

})

////  Read all car//

app.get('/getallcars', async (req, res) => {

  Car.find((error, data) => {
    if (error) {
      return next(error);
    } else {
      res.json(data);
    }
  });


})

/// get by id
// car
app
  .route("/getcarby")
  // Get Single car 
  .get((req, res) => {
    try {

      const { id } = req.query
      if (!(id)) {
        res.status(400).send("Car id Field is requird ")
      }
      else {
        Car.findById(
          id, (error, data) => {
            if (error) {
              return next(error);
            } else {
              res.json({ status: '200', message: 'Sucess', data: data });
            }
          });

      }
    } catch (err) {
      console.log(err);


    }

  })

//// get car specific  user //
app
  .route("/getUserCarByid")
  // Get Single car 
  .get((req, res) => {
    try {

      const { id } = req.query
      if (!(id)) {
        res.status(400).send("User Id Required ")
      }
      else {
        Car.find(
          { user_id: id }, (error, data) => {
            if (error) {
              return next(error);
            } else {
              res.json({ status: '200', message: 'Sucess', data: data });
            }
          });

      }
    } catch (err) {
      console.log(err);


    }

  })



/// update car ///
app.route("/update-car").put((req, res, next) => {
  console.log(req.body)
  try {
    const { id } = req.query
    if (!(id)) {
      res.status(400).send("Car id Field is requird ")
    } else {

      Car.findByIdAndUpdate(
        id,
        {
          $set: req.body,
        },
        (error, data) => {
          if (error) {
            return next(error);
            console.log(error);
          } else {
            res.json({ status: '200', message: 'Updated Successfully', data: data });
            console.log("Car updated successfully !");
          }
        }
      );
    }


  } catch (err) {

    console.log(err);

  }





});

/// delete car by id//

app.route("/delete-car").delete((req, res, next) => {
  console.log(req.body)
  try {
    const { id } = req.query
    if (!(id)) {
      res.status(400).send("Car id Field is requird ")
    } else {

      Car.findByIdAndDelete(
        id,
        async (error, data) => {
          if (error) {
            return next(error);
            console.log(error);
          } else {
            res.json({ status: '200', message: 'Successfully removed', data: data });
            console.log("Car deleted successfully !");
          }
        }
      );
    }


  } catch (err) {
    console.log(err);
  }
});

// Register

app.post("/register", async (req, res) => {

  // Our register logic starts here
  try {
    // Get user input
    const { first_name, last_name, email, password } = req.body;

    // Validate user input
    if (!(email && password && first_name && last_name)) {
      res.status(400).send("All input is required");
    }

    // check if user already exist
    // Validate if user exist in our database
    const oldUser = await User.findOne({ email });

    if (oldUser) {
      return res.status(409).send("User Already Exist. Please Login");
    }

    //Encrypt user password
    encryptedPassword = await bcrypt.hash(password, 10);

    // Create user in our database
    const user = await User.create({
      first_name,
      last_name,
      email: email.toLowerCase(), // sanitize: convert email to lowercase
      password: encryptedPassword,
    });

    // Create token
    const token = jwt.sign(
      { user_id: user._id, email },
      process.env.TOKEN_KEY,
      {
        expiresIn: "2h",
      }
    );
    // save user token
    user.token = token;

    // return new user
    res.status(201).json(user);
  } catch (err) {
    console.log(err);
  }
  // Our register logic ends here
});

// Login
app.post("/login", async (req, res) => {

  // Our login logic starts here
  try {
    // Get user input
    const { email, password } = req.body;

    // Validate user input
    if (!(email && password)) {
      res.status(400).send("All input is required");
    }
    // Validate if user exist in our database
    const user = await User.findOne({ email });

    if (user && (await bcrypt.compare(password, user.password))) {
      // Create token
      const token = jwt.sign(
        { user_id: user._id, email },
        process.env.TOKEN_KEY,
        {
          expiresIn: "2h",
        }
      );

      // save user token
      user.token = token;

      // user
      res.status(200).json(user);
    }
    res.status(400).send("Invalid Credentials");
  } catch (err) {
    console.log(err);
  }
  // Our register logic ends here
});


module.exports = app;