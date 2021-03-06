const mongoose = require('mongoose')
const cities = require('./cities')
const {places,descriptors} = require('./seedHelpers')
const Campground = require('../models/campground')
require("dotenv").config();
const uri = process.env.MONGODB_URI;

mongoose.connect(uri,{
    useNewUrlParser:true,
    useCreateIndex:true,
    useUnifiedTopology:true
});

const db = mongoose.connection;
db.on("error",console.error.bind(console,"connection error"));
db.once("open",()=>{
    console.log("Database Connected");
});

const sample = array => array[Math.floor(Math.random()*array.length)]

const seedDB = async ()=>{
    await Campground.deleteMany({});
    for(let i = 0; i < 180; i++){
        const random1000 = Math.floor(Math.random()*1000);
        const price = Math.floor(Math.random()*20)+10;
        const camp = new Campground({
            author:'605219910ff8ce54b816213c',
            location:`${cities[random1000].city},${cities[random1000].state}`,
            title:`${sample(descriptors)} ${sample(places)}`,
            images:[
                {
                  
                  url: 'https://res.cloudinary.com/diyscwbit/image/upload/v1616073543/Camping-Grounds/behhnatqgsz8ipxuagsw.jpg',
                  filename: 'Camping-Grounds/behhnatqgsz8ipxuagsw'
                },
                {
                
                    url: 'https://res.cloudinary.com/diyscwbit/image/upload/v1616073542/Camping-Grounds/kt6dn8qzkrjofaklmfdg.jpg',
                    filename: 'Camping-Grounds/kt6dn8qzkrjofaklmfdg'
                  }
              ],
            description:'Lorem ipsum dolor sit amet consectetur, adipisicing elit. Soluta atque earum blanditiis, similique odit nobis magni? Quia adipisci voluptatum, eum incidunt quae consequuntur. Quo tenetur totam beatae laborum aliquid. Illum.',
            price,
            geometry:{
                type:"Point",
                coordinates:[
                    cities[random1000].longitude,
                    cities[random1000].latitude
                ]
            }
        })
        await camp.save();
    }
    //const c = new Campground({title:'purple field'});
    //await c.save();
}


seedDB().then(()=>{
    mongoose.connection.close();
});