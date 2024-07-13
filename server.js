const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const port = 3000;

app.use(express.json());
app.use(express.static('public'));

app.get('/emisores.json', (req, res) => {
    fs.readFile(path.join(__dirname, 'public', 'emisores.json'), 'utf8', (err, data) => {
        if (err) {
            res.status(500).send('Error reading emisores.json');
        } else {
            res.send(data);
        }
    });
});

app.post('/saveEmisores', (req, res) => {
    const emisores = JSON.stringify(req.body, null, 2);
    fs.writeFile(path.join(__dirname, 'public', 'emisores.json'), emisores, (err) => {
        if (err) {
            res.status(500).send({ success: false, message: 'Error saving emisores.json' });
        } else {
            res.send({ success: true, message: 'Data saved successfully' });
        }
    });
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
