const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(express.static('public'));
const PORT = process.env.PORT || 3000;
 
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');
 
app.get('/', (req, res) => {
    res.redirect('/slike');
});
 
app.get('/slike', (req, res) => {
    const folderPath = path.join(__dirname, 'public', 'images', 'Portfolio_slike');
    const files = fs.readdirSync(folderPath);
 
    const images = files
        .filter(file => file.endsWith('.svg') || file.endsWith('.png'))
        .map((file, index) => ({
            url: `/images/Portfolio_slike/${file}`,
            id: `img${index + 1}`,
            title: file
        }));
 
    res.render('slike', { images });
});
 
app.listen(PORT, () => {
    console.log(`Server pokrenut na http://localhost:${PORT}`);
});