const fs = require('fs')
const csv = require('csv-parser');
const {Builder, By, Key, until} = require('selenium-webdriver');
 
const sleep = async (time) => {
  return new Promise((resolve)=>{
    setTimeout(() => {
      resolve('done')
    }, time);
  })
}

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
            return obj['phone'].replace(',','')
          }
        })
          resolve(phones);
      }).on('error', (err) => {
          reject(err)
      });
  })
}

async function getCookies() {
  return new Promise((resolve, reject)=> {
    fs.readFile('./cookies.json', (err, data) => {
      if(err){
        console.log('err', err);
        reject(err)
        return;
      }
      const parsed = JSON.parse(data)
      resolve(parsed)
    })
  })
}
async function getMessage(){
  return new Promise((resolve, reject)=> {
    fs.readFile('./message.txt', 'utf8', (err, data) => {
      if(err){
        console.log('err', err);
        reject(err)
        return;
      }
      // const parsed = JSON.parse(data)
      resolve(data)
    })
  })}

async function copy(driver) {

}
async function paste(driver) {
  await driver.findElement(By.className('_2FVVk _2UL8j')).sendKeys(Key.chord(Key.CONTROL, 'v'));
}

async function loadCookies(driver){
    const cookies = await getCookies();
    for(var cookie of cookies){
      await driver.manage().addCookie(cookie)
    }
}

async function saveCookies(cookies){
  fs.writeFile('./cookies.json', JSON.stringify(cookies), (err, res)=>{
    if(err){
      console.log('err', err);
    }
    console.log('cookies saved');
  });
}

async function sendImageMessage({driver, phone, message}){
  const encoded = encodeURIComponent(message)
  const url = `https://api.whatsapp.com/send?phone=${phone}&text=${encoded}`;
  await driver.get(url);
  await driver.wait(until.elementIsVisible(driver.findElement(By.id('action-button'))))
  await (await driver.findElement(By.id('action-button'))).click()
  await sleep(2000)
  await (await driver.findElement(By.partialLinkText('use WhatsApp Web'))).click()
  console.log('starting 5');
  try{ 
    try{
    await sleep(6000)
    console.log('pasting image');
    await sleep(1000)
    await paste(driver)
    console.log('clicking send image');
    await (await driver.findElement(By.className('_3y5oW _3qMYG'))).click() //click send image
  } catch(e){
    console.log('not logged in');
    await sleep(5000)
    console.log('clicking send image');
    await (await driver.findElement(By.className('_3y5oW _3qMYG'))).click() //click send image
    }
  } catch(e){
    console.log('failed to send image to ', phone);
  }
}

async function sendMessage({driver, phone, message}){
  const encoded = encodeURIComponent(message)
  const url = `https://api.whatsapp.com/send?phone=${phone}&text=${encoded}`;
  await driver.get(url);
  await driver.wait(until.elementIsVisible(driver.findElement(By.id('action-button'))))
  await (await driver.findElement(By.id('action-button'))).click()
  await sleep(2000)
  await (await driver.findElement(By.partialLinkText('use WhatsApp Web'))).click()
  console.log('starting 5');
  // await driver.wait(until.elementLocated(driver.findElement(By.className('NVQmc'))))
  try{ 
    try{
    await sleep(6000)
    await driver.wait(until.elementIsVisible(driver.findElement(By.className('_1U1xa'))))
    await (await driver.findElement(By.className('_1U1xa'))).click() //click send text
    await sleep(500)
    // await driver.findElement(By.className('_2FVVk _2UL8j')).sendKeys(message, Key.RETURN); //clicks "Enter" to send text
  } catch(e){
    console.log('not logged in');
    await driver.wait(until.elementLocated(driver.findElement(By.className('_1U1xa'))))
    await sleep(5000)
    driver.get('about:blank');
    await driver.switchTo().alert().accept();
    // await (await driver.findElement(By.className('_1U1xa'))).click() //click send text
      // await driver.findElement(By.className('_2FVVk _2UL8j')).sendKeys(message, Key.RETURN); //clicks "Enter" to send text
    }
  } catch(e){
    console.log('failed to send message to', phone);
  }
}

(async function run() {
  let driver = await new Builder().forBrowser('chrome').build();
  try {
    const phones = await getPhonesCSV();
    const message = await getMessage()
    // const message = ''
    // await driver.actions().keyDown(Key.CONTROL).sendKeys('a').perform();
    let i=1 
    for(const phone of phones){
      console.log(`run ${i}: ${phone}`);
      let message = await getMessage()
      try{
      await sendMessage({driver, phone, message})
      } catch(e){
        console.log(e);
        console.log('failed to send to ', phone);
      }
      i++
      await sleep(1000)
    }
    await sleep(5000)
    console.log('done');
  } finally {
    await driver.quit();
  }
})();
