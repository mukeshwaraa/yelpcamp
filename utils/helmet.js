const scriptSrcUrls = [
    "https://apis.mappls.com/",
    "https://stackpath.bootstrapcdn.com/",
    "https://apis.mappls.com/advancedmaps/api",
    "https://kit.fontawesome.com/",
    "https://cdnjs.cloudflare.com/",
    "https://cdn.jsdelivr.net",
];
const styleSrcUrls = [
    "https://apis.mappls.com/",
    "https://apis.mappls.com/advancedmaps/api/4c6f6b50-3142-4e8d-84e8-bca1af005d35/map_sdk",
    "https://kit-free.fontawesome.com/",
    "https://stackpath.bootstrapcdn.com/",
    "https://fonts.googleapis.com/",
    "https://use.fontawesome.com/",
    "https://cdn.jsdelivr.net",
];
const connectSrcUrls = [
    "https://mt1.mapmyindia.com/",
     "https://mt2.mapmyindia.com/",
    "https://mt4.mapmyindia.com/",
    "https://mt5.mapmyindia.com/",
      "https://mt3.mapmyindia.com",
    "https://www.mappls.com/apis/",
    "https://apis.mapmyindia.com/",
    "https://apis.mappls.com/",
    "https://apis.mappls.com/",
    "https://apis.mappls.com/",
     "https://api.mapbox.com/",
    "https://a.tiles.mapbox.com/",
    "https://b.tiles.mapbox.com/",
    "https://events.mapbox.com/",
    "https://api.geoapify.com/"
];
const fontSrcUrls = [];
const contentPolicy = {
        directives: {
            defaultSrc: [],
            connectSrc: ["'self'", ...connectSrcUrls],
            scriptSrc: ["'unsafe-inline'", "'self'","'unsafe-eval'", ...scriptSrcUrls],
            styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
            workerSrc: ["'self'", "blob:"],
            objectSrc: [],
            imgSrc: [
                "'self'",
                "blob:",
                "data:",
                "https://apis.mappls.com/map_v3/1.png",
                "https://apis.mappls.com/",
                "https://res.cloudinary.com/ds9co9eif/",
                "https://images.unsplash.com/",
                "https://cdn.mapmyindia.com/mappls_web/logos/",
                "https://apis.mappls.com/"],
            fontSrc: ["'self'", ...fontSrcUrls],
        },
    }

    module.exports = contentPolicy