import express from 'express';
import fs from 'fs';
import path from 'path';

const app = express();
const port = 3000;

app.get('/levels/:union/:chapter', (req, res) => {
    const { union, chapter } = req.params;
    const jsonPath = path.join(__dirname, 'src/level/level_data', `${union}-${chapter}.json`);
    const markdownPath = path.join(__dirname, 'src/level/level_data', `${union}-${chapter}.md`);

    fs.readFile(jsonPath, 'utf8', (jsonErr, jsonData) => {
        if (jsonErr) {
            return res.status(404).send('JSON file not found');
        }
        fs.readFile(markdownPath, 'utf8', (mdErr, markdownData) => {
            if (mdErr) {
                return res.status(404).send('Markdown file not found');
            }
            try {
                const levelData = JSON.parse(jsonData);
                levelData.description = markdownData;
                res.json(levelData);
            } catch (parseErr) {
                res.status(500).send('Error parsing JSON data');
            }
        });
    });
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});