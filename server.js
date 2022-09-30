const app = require("./app");
const mongoose = require("mongoose");

// process.on("uncaughtException", (err) => {
//   console.log(err.name, err);
//   console.log("Unacaught expecton!server is closing...");

//   server.close(() => {
//     server.exit(1);
//   });
// });

const DB = process.env.Database.replace(
  "<password>",
  process.env.Database_password
);

mongoose.connect(DB).then(() => {
  console.log("Database connected successfully!");
});

const port = process.env.PORT;
const server = app.listen(port, () => {
  console.log(`your server is running at port ${port}`);
});

process.on("unhandledRejection", (err) => {
  console.log(err.name, err);
  console.log("Unhandled rejection!💥💥 server is closing...");

  server.close(() => {
    process.exit(1);
  });
});
