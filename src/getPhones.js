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
              let phone = obj['phone'].replace(/\D/g,'');
              if (phone[0] == '5') {
                phone = '966'+ phone
              }
              return phone
            }
          })
            resolve(phones);
        }).on('error', (err) => {
            reject(err)
        });
    })
  }


module.exports = getPhonesCSV