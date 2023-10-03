const mongoose = require('mongoose');
const cities = require('./cities');
const cities1 = require('./cities1')
const { places, descriptors } = require('./seedHelpers');
const mongoDB = 'mongodb://127.0.0.1/yelp-camp';
mongoose.connect(mongoDB, { useNewUrlParser: true });
//Get the default connection
const db = mongoose.connection;
//Bind connection to error event (to get notification of connection errors)
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => { console.log("database connected") });
const Campground = require('../models/campgrounds');
const Map = require('../models/map');
const { json } = require('express');


const sample = array => array[Math.floor(Math.random() * array.length)];
// atlasd down
const id = "651c3d65d492081654fff490";
// const id = "651a9b940d1698d7692d72e0";
const im =  [
  {
    path: 'https://res.cloudinary.com/ds9co9eif/image/upload/v1695806054/YelpCamp/joykc6lyjcs6bztqlhfe.avif',
    filename: 'YelpCamp/joykc6lyjcs6bztqlhfe',
  },
  {
    path: 'https://res.cloudinary.com/ds9co9eif/image/upload/v1695806054/YelpCamp/vwcuclzcjogd46zgjbiw.avif',
    filename: 'YelpCamp/vwcuclzcjogd46zgjbiw',
  },
  {
    path: 'https://res.cloudinary.com/ds9co9eif/image/upload/v1695806054/YelpCamp/gcfmpa6aolidhuaey2dw.jpg',
    filename: 'YelpCamp/gcfmpa6aolidhuaey2dw',
  },
  {
    path: 'https://res.cloudinary.com/ds9co9eif/image/upload/v1695806054/YelpCamp/idjhmovuw9rbmkmjedvg.avif',
    filename: 'YelpCamp/idjhmovuw9rbmkmjedvg',
  }


  ]

const seedDB = async () => {
    await Campground.deleteMany({});
    for (let i = 0; i < 150; i++) {
        const prpicker =  function(max,min){return Math.floor(Math.random() * (max - min + 1) + min)}
        const random1000 = Math.floor(Math.random() * 150);
        const loc = {city:cities1[random1000].city,state:cities1[random1000].state,country:cities1[random1000].country,
        lat:cities1[random1000].lat,long:cities1[random1000].lng}
        const camp = new Campground({
            location: loc,
            name: `${sample(descriptors)} ${sample(places)}`,
            images: im,
            price: prpicker(10000,2000),
            description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Cum nemo, voluptates debitis tempora ut maxime. Odio inventore in vero et dignissimos. Consequuntur quidem beatae eaque dolor maiores atque reiciendis labore ?Inventore est totam obcaecati, non ea rerum illo asperiores? Animi dolor cumque aut quis eos et accusamus est, debitis beatae iusto expedita, quibusdam nam consectetur deserunt perferendis tenetur eveniet hic. Quas inventore impedit deleniti enim porro? At mollitia odio cupiditate dolorem officiis commodi minima pariatur harum, earum vel voluptatum nisi dicta ex.Quo, esse! Alias fuga nam eum labore culpa.",
            author: id,
            average : 0
        })
        await camp.save();
    }
}

seedDB().then(() => {
    mongoose.connection.close();
})