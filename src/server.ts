import "dotenv/config";
import mongoose from "mongoose";
import type { ConnectOptions } from "mongoose";
import app from "./middlewares/app.middlewares";

process.on("uncaughtException", (err) => {
  console.log(err.name, err.message, err.stack);
  console.log("Uncaught Exception!. Shouting down...");
  process.exit(1);
});

const port = process.env.PORT || 5000;

//Database Connection
const DB = `${process.env.DATABASE}`;
const options: ConnectOptions = {
  retryWrites: true,
  w: "majority",
};
mongoose.set("strictQuery", false);
mongoose
  .connect(DB, options)
  .then(() => {
    console.log("DB connected successfully!");
  })
  .catch((error) => {
    console.log("Not connected to the database!!", error.stack);
  });

//Server Connection
const server = app.listen(port, () => {
  console.log(`Server listening on port: ${port}`);
});

process.on("unhandledRejection", (err: Error) => {
  console.log(err.name, err.message);
  console.log("Unhandled Rejection!. Shouting down...");
  server.close(() => {
    process.exit(1);
  });
});
