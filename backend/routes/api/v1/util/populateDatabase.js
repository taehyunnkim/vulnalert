import express from 'express';
import JSONStream from 'JSONStream';
import fs from 'fs';

var router = express.Router();

router.get('/batch-insert', function(req, res, next) {
    const batchSize = 50000;
    let batch = [];
    let count = 0;

    const stream = fs.createReadStream("/Users/eric/Documents/final-project-vulnerability-alerter/backend/assets/package-names.json")
    .pipe(JSONStream.parse('*'));

    stream.on('data', (data) => {
        batch.push({ name: data});
        if (batch.length === batchSize) {
          stream.pause();
          req.models.Library.insertMany(batch, (err, result) => {
            if (err) throw err;
            count += batchSize;
            console.log(`Inserted ${count} documents`);
            batch = [];
            stream.resume();
          });
        }
    });
  
    stream.on('end', () => {
    if (batch.length > 0) {
        req.models.Library.insertMany(batch, (err, result) => {
            if (err) throw err;
            count += batch.length;
            console.log(`Inserted ${count} documents`);
        });
        }
    });
});