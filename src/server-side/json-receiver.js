// Import the necessary modules
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

// Create an Express application
const app = express();

// Use the JSON body parser middleware
app.use(bodyParser.json());
app.use(cors());

// Define a POST route that will receive the JSON stream
app.post('/receive-json', (req, res) => {
    console.log(req.body); // This will log the received JSON stream to the console
    

    // Get the name from the JSON stream
    const name = req.body.rulesetFile.name;

    // Check if the directory exists, if not, create it
    const dir = './rulesets';
    if (!fs.existsSync(dir)){
        fs.mkdirSync(dir);
    }

    // Write the JSON stream to a file
    const filePath = path.join(dir, `${name}.json`);
    fs.writeFile(filePath, JSON.stringify(req.body, null, 2), (err) => {
        err = "yes";
        if (err) {
            console.error(err);
            res.status(500).json({message: `Error writing file ${filePath}`});
        } else {
            res.status(200).json({message: `JSON received and written to file ${filePath}`});
        }
    });
});

// Start the server
const port = 3000;
app.listen(port, () => console.log(`Server is listening on port ${port}`));
