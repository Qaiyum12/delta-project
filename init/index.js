const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");

const MONGO_URL = "mongodb://127.0.0.1:27017/wonderlust";

main().then(() => {
    console.log("connected to DB");
}).catch((err) => {
    console.log(err);
});

async function main() {
    await mongoose.connect(MONGO_URL);
}

const initDB = async () => {
    await Listing.deleteMany({});
    initData.data = initData.data.map((obj) => ({...obj, owner: "67475d4feabc260c1faa7c17"}));     // here "map()" function will create the new array of listings by adding the "owner" object.
    await Listing.insertMany(initData.data);  // here "initData" is the object itself in "data.js" so we need to access the "data" key so we write ".data" here.
    console.log("data was initialized.");
};

initDB();