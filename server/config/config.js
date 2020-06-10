process.env.PORT = process.env.PORT || 3000;
process.env.NODE_ENV = process.env.NODE_ENV || 'dev'

let urlDB;

if (process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://localhost:27017/cafe';
} else {
    urlDB = process.env.MONGO_URI;
}

//Url de conexión
process.env.URLDATABASE = urlDB;

//Vencimiento de token
process.env.CADUCIDAD_TOKEN = process.env.CADUCIDAD_TOKEN_RPOD || '4h';

//SEED de autenticación
process.env.SEED = process.env.SEED || 'sdff*d}d+d{f435ewfw';

//Client ID de google 
process.env.GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || '56523024150-4euspdt6r3uhhujna20f3drv3p30f91v.apps.googleusercontent.com';