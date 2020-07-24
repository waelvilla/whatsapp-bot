const fs = require('fs')
const {Builder, By, Key, until} = require('selenium-webdriver');
 
const sleep = async (time) => {
  return new Promise((resolve)=>{
    setTimeout(() => {
      resolve('done')
    }, time);
  })
}

async function getPhones(){
  return new Promise((resolve, reject)=> {
    fs.readFile('./phones.json', (err, data) => {
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
    await sleep(5000)
    // _1U1xa
    await (await driver.findElement(By.className('_1U1xa'))).click()
    // await driver.findElement(By.className('_2FVVk _2UL8j')).sendKeys(message, Key.RETURN);
  } catch(e){
    console.log('not logged in');
    await sleep(5000)
    await (await driver.findElement(By.className('_1U1xa'))).click()
      // await driver.findElement(By.className('_2FVVk _2UL8j')).sendKeys(message, Key.RETURN);
    }
  } catch(e){
    console.log('failed to send message');
  }
}

(async function run() {
  let driver = await new Builder().forBrowser('chrome').build();
  try {
    const phones = await getPhones();

  let i=1
    for(const user of phones){
      const {phone, message} = user
      console.log(`run ${i}: ${phone}`);
      try{
      await sendMessage({driver, phone, message})
      } catch(e){
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
