// const bcrypt = require("bcryptjs");
// const chalk = require("chalk");

// module.exports = {
//   login: async (req, res) => {
//     console.log(chalk.red("hit login", req.body));
//     const db = req.app.get("db").auth;
//     const { email, password } = req.body;

//     let user = await db.check_user(email);
//     user = user[0];
//     if (!user) {
//       return res.status(400).send("email not found");
//     }

//     const authenticated = bcrypt.compareSync(password, user.user_password);
//     if (authenticated) {
//       delete user.user_password;
//       req.session.user = user;
//       res.status(200).send(req.session.user);
//     } else {
//       res.status(400).send("Incorrect email or password");
//     }
//   },

//   register: async (req, res) => {
//     console.log(chalk.red("hit register", req.body));
//     const db = req.app.get("db").auth;
//     const { email, password } = req.body;

//     let user = await db.check_user(email);
//     user = user[0];
//     if (user) {
//       return res.status(400).send("User already exists");
//     }

//     const salt = bcrypt.genSaltSync(10);
//     const hash = bcrypt.hashSync(password, salt);

//     try {
//       let newUser = await db.register_user({ email, hash });
//       newUser = newUser[0];
//       req.session.user = newUser;
//       res.status(201).send(req.session.user);
//     } catch (err) {
//       return res.sendStatus(500);
//     }
//   },

//   logout: (req, res) => {
//     console.log(chalk.red("hit logout"));
//     if (req.session) req.session.destroy();
//     return res.sendStatus(200);
//   }
// };

const bcrypt = require("bcryptjs");
const chalk = require("chalk");

module.exports = {
  login: async (req, res) => {
    console.log(chalk.red("hit login", req.body));
    const db = req.app.get("db").auth;
    const { email, password } = req.body;

    let user = await db.check_user(email);
    user = user[0];
    if (!user) {
      return res.status(400).send("Email not found");
    }

    const authenticated = bcrypt.compareSync(password, user.user_password);
    if (authenticated) {
      delete user.user_password;
      req.session.user = user;
      return res.status(202).send(req.session.user);
    } else {
      return res.status(400).send("Incorrect email or password");
    }
  },
  register: async (req, res) => {
    console.log(chalk.red("hit register", req.body));
    const db = req.app.get("db").auth;
    const { email, password } = req.body;

    let user = await db.check_user(email);
    user = user[0];
    if (user) {
      return res.status(400).send("User already exists");
    }

    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(password, salt);

    try {
      let newUser = await db.register_user({ hash, email });
      newUser = newUser[0];
      req.session.user = newUser;
      return res.status(201).send(req.session.user);
    } catch (err) {
      return res.sendStatus(500);
    }
  },
  logout: (req, res) => {
    console.log(chalk.red("hit logout"));
    if (req.session) req.session.destroy();
    return res.sendStatus(200);
  }
};
