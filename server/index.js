require("dotenv").config();
const express = require("express"),
  massive = require("massive"),
  session = require("express-session"),
  authCtrl = require("./controllers/authController"),
  checkUser = require("./middleware/checkUser"),
  { SERVER_PORT, CONNECTION_STRING, SESSION_SECRET } = process.env;

const app = express();

app.use(express.json());

app.use(
  session({
    resave: false,
    saveUninitialized: true,
    rejectUnauthorized: false,
    cookie: { maxAge: 1000 * 60 * 60 * 24 * 7 },

    secret: SESSION_SECRET
  })
);

massive({
  connectionString: CONNECTION_STRING,
  ssl: {
    rejectUnauthorized: false
  }
}).then(db => {
  app.set("db", db);
  console.log("database connected");

  app.listen(SERVER_PORT, () =>
    console.log(`<---server running on port ${SERVER_PORT}--->`)
  );
});

//auth endpoints
app.post(`/api/login`, checkUser, authCtrl.login);
app.post(`/api/register`, authCtrl.register);
app.post(`/api/logout`, authCtrl.logout);
app.get(`/api/check`, checkUser);

// // product end
// app.get(`/api/products`);

// // cart end
// app.post(`/api/carts`);
// app.get(`/api/carts`);
