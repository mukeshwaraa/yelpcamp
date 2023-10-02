const axios = require('axios')
const getAddress = async function(location){
    const a = Object.values(location);
    const adds = a.join(',')
    // console.log(adds)
    try{
        const coordinates = await axios.get(`https://api.geoapify.com/v1/geocode/search?text=${adds}&format=json&limit=1&apiKey=${process.env.geoapify_key}`)
        const coo = {lat:coordinates.data.results[0].lat,long:coordinates.data.results[0].lon}
        return coo;
    }catch(e){
        console.log('error occured at getaddress');
        console.log(e)
    }
}

module.exports = getAddress