const mongoose = require("mongoose");
const sampleListings = require("./data");
const Listing = require("../models/listing").default;
async function main() {
    await mongoose.connect("mongodb+srv://krishradadiya19_db_user:mils%402109@cluster0.xbvmrom.mongodb.net/");
}

main().then(() => {
    console.log("Connected to MongoDB");
}).catch((err) => {
    console.log(err);
})

const init = async () => {
    await Listing.insertMany(sampleListings);
    console.log("Data inserted");
}
init();