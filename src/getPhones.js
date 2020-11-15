const fs = require('fs')
const csv = require('csv-parser');

async function getPhonesCSV(){
    return new Promise((resolve, reject) => {
        const data = []
        fs.createReadStream('phones.csv')
        .pipe(csv({separator: '\t'}))
        .on('data', (row) => {
            data.push(row)
        })
        .on('end', () => {
          const phones = data.map((obj) => {
            if(obj['phone']){
              return obj['phone'].replace(/\D/g,'');
            }
          })
            resolve(phones);
        }).on('error', (err) => {
            reject(err)
        });
    })
  }


module.exports = getPhonesCSV