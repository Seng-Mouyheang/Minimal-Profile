const express = require('express');
const path = require('path');
const { engine } = require('express-handlebars');
require('dotenv').config();

const app = express();
// eslint-disable-next-line no-undef
const PORT = process.env.PORT || 3000;

app.engine('hbs', engine({
    defaultLayout: 'main',
    extname: 'hbs',
    // eslint-disable-next-line no-undef
    partialsDir: path.join(__dirname, 'views', 'partials'),
}));

app.set('view engine', 'hbs');
// eslint-disable-next-line no-undef
app.set('views', path.join(__dirname, 'views'));

// eslint-disable-next-line no-undef
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.render('index', {pageTitle: 'Home'});
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});