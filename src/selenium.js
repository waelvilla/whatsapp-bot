const fs = require('fs')
const { Builder, By, Key, until, } = require('selenium-webdriver');
const getPhones = require('./getPhones')

const sleep = async (time) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve('done')
    }, time);
  })
}

async function getMessage() {
  return new Promise((resolve, reject) => {
    fs.readFile('./message.txt', 'utf8', (err, data) => {
      if (err) {
        console.log('err', err);
        reject(err)
        return;
      }
      // const parsed = JSON.parse(data)
      resolve(data)
    })
  })
}

async function paste(driver) {
  await driver.findElement(By.className('_2FVVk _2UL8j')).sendKeys(Key.chord(Key.CONTROL, 'v'));
}

async function sendImageMessage({ driver, phone, message }) {
  const encoded = encodeURIComponent(message)
  const url = `https://api.whatsapp.com/send?phone=${phone}&text=${encoded}`;
  await driver.get(url);
  await driver.wait(until.elementIsVisible(driver.findElement(By.id('action-button'))))
  await (await driver.findElement(By.id('action-button'))).click()
  await sleep(2000)
  await (await driver.findElement(By.partialLinkText('use WhatsApp Web'))).click()
  console.log('starting 5');
  try {
    try {
      await sleep(6000)
      console.log('pasting image');
      await sleep(1000)
      await paste(driver)
      console.log('clicking send image');
      await (await driver.findElement(By.className('_3y5oW _3qMYG'))).click() //click send image
    } catch (e) {
      console.log('not logged in');
      await sleep(5000)
      console.log('clicking send image');
      await (await driver.findElement(By.className('_3y5oW _3qMYG'))).click() //click send image
    }
  } catch (e) {
    console.log('failed to send image to ', phone);
  }
}

async function sendMessage({ driver, phone, message }) {
  const encoded = encodeURIComponent(message)
  const url = `https://api.whatsapp.com/send?phone=${phone}&text=${encoded}`;
  await driver.get(url);
  try {
    await driver.switchTo().alert().accept();
  } catch (e) { }
  await driver.wait(until.elementIsVisible(driver.findElement(By.id('action-button'))))
  await (await driver.findElement(By.id('action-button'))).click()
  await sleep(2000)
  await (await driver.findElement(By.partialLinkText('use WhatsApp Web'))).click()
  // await driver.wait(until.elementLocated(driver.findElement(By.className('NVQmc'))))
  try {
    let sendButtonLocated = false;
    while (!sendButtonLocated) {
      try {
        await driver.wait(until.elementIsVisible(await driver.findElement(By.className('_1U1xa'))))
        sendButtonLocated = true;
      } catch (e) {
        await sleep(1000)
      }
    }
    await (await driver.findElement(By.className('_1U1xa'))).click() //click send text
    await sleep(500)
    // await driver.findElement(By.className('_2FVVk _2UL8j')).sendKeys(message, Key.RETURN); //clicks "Enter" to send text
  } catch (e) {
    console.log('not logged in');
    console.log('e', e);
  }
}

(async function run() {
  let driver = await new Builder().forBrowser('chrome').build();
  try {
    const phones = await getPhones();
    const message = await getMessage()
    // const message = ''
    // await driver.actions().keyDown(Key.CONTROL).sendKeys('a').perform();
    let i = 1
    for (const phone of phones) {
      console.log(`run ${i}: ${phone}`);
      let message = await getMessage()
      try {
        await sendMessage({ driver, phone, message })
      } catch (e) {
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
