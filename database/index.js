const mongoose = require("mongoose");
const MongoMemoryServer = require("mongodb-memory-server");
const config = require("../config/index");

module.exports = async () => {
  mongoose.Promise = global.Promise;

  if (process.env.NODE_ENV === 'development') {
    const mongoServer = new MongoMemoryServer.MongoMemoryServer();
    config.database.uri = await mongoServer.getConnectionString();
  }

  if (!config.database.uri) {
  	console.warn("DATABASE_URI environment variable not set.\nPlease set DATABASE_URI environment variable to run flashcards-for-developers");
  	process.exit();
  }

  mongoose.connect(
    config.database.uri,
    { useNewUrlParser: true },
  );

  const database = mongoose.connection;

  database.on("error", console.error.bind(console, "MongoDB connection error"));

  return database;
};
