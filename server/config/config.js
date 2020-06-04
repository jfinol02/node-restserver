process.env.PORT = process.env.PORT || 3000;
process.env.NODE_ENV = process.env.NODE_ENV || 'dev'

let urlDB;

if (process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://localhost:27017/cafe';
} else {
    urlDB = "mongodb+srv://jfinol02:YDjhTHFYkzC265ao@onesolution-pkwyg.mongodb.net/<dbname>?retryWrites=true&w=majority";
}

process.env.URLDATABASE = urlDB;