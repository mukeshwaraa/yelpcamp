const mongoose = require('mongoose');
const cities = require('./cities');
const { places, descriptors } = require('./seedHelpers');
const mongoDB = 'mongodb://127.0.0.1/yelp-camp';
mongoose.connect(mongoDB, { useNewUrlParser: true });
//Get the default connection
const db = mongoose.connection;
//Bind connection to error event (to get notification of connection errors)
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => { console.log("database connected") });
const Campground = require('../models/campgrounds');


const sample = array => array[Math.floor(Math.random() * array.length)];
const id = "6504520c2a8f125910a9d75a";

const seedDB = async () => {
    await Campground.deleteMany({});
    for (let i = 0; i < 50; i++) {
        const random1000 = Math.floor(Math.random() * 1000);
        const camp = new Campground({
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            name: `${sample(descriptors)} ${sample(places)}`,
            image: 'https://source.unsplash.com/collection/483251',
            price: 5,
            description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Cum nemo, voluptates debitis tempora ut maxime. Odio inventore in vero et dignissimos. Consequuntur quidem beatae eaque dolor maiores atque reiciendis labore ?Inventore est totam obcaecati, non ea rerum illo asperiores? Animi dolor cumque aut quis eos et accusamus est, debitis beatae iusto expedita, quibusdam nam consectetur deserunt perferendis tenetur eveniet hic. Quas inventore impedit deleniti enim porro? At mollitia odio cupiditate dolorem officiis commodi minima pariatur harum, earum vel voluptatum nisi dicta ex.Quo, esse! Alias fuga nam eum labore culpa.",
            author: id
        })
        await camp.save();
    }
}

seedDB().then(() => {
    mongoose.connection.close();
})