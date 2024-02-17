const mongoose = require('mongoose');

const db = mongoose.connection;

main().catch(err => console.log(err));

async function main() {
  await mongoose.connect(process.env.MONGO_URI);

  console.log("My db is working");
  
}
module.exports = db;