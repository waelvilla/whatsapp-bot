const puppeteer = require('puppeteer');
const fs = require('fs').promises;


function sleep(t){
    return new Promise((res, rej) =>{
        setTimeout(() => {
            res('done')
        }, t);
    })
}

async function saveCookies(page){
    const cookies = await page.cookies();
    await fs.writeFile('./cookies.json', JSON.stringify(cookies, null, 2));
    
}

async function loadCookies(page){
    const cookiesString = await fs.readFile('./cookies.json');
    const cookies = JSON.parse(cookiesString);
    await page.setCookie(...cookies);
}

const escapeXpathString = str => {
    const splitedQuotes = str.replace(/'/g, `', "'", '`);
    return `concat('${splitedQuotes}', '')`;
  };

(async() => {
    const browser = await puppeteer.launch({
        'headless': false, 'product': 'firefox',
        'executablePath': "D:/Program Files/Mozilla Firefox/firefox.exe"
    });
    const page = await browser.newPage();
    await sleep(1000)
    // loadCookies(page)
    await page.goto('https://www.whatismybrowser.com/')
    await sleep(1000)
    await page.screenshot({ path: 'example1.png' })
    return;
    // await page.goto('https://api.whatsapp.com/send?phone=966553903500&text=I%27m%20interested');
    // await page.goto('https://ithnain.com')
    // await page.waitFor('._36or _2y_c _2z0c _2z07')
    // await page.waitFor('#action-button')
    // await page.click('._whatsapp_www__block_action')
    await sleep(1000)
    await page.click('#action-button')
    await sleep(1000)
    // await page.click('a[href=https://web.whatsapp.com/send?phone=966553903500&text=I%27m+interested]')
    // let x = await page.evaluate(() => document.querySelectorAll('div'))
    // const hrefs = await page.evaluate(() => {
    //     const anchors = document.querySelectorAll('a');
    //     return anchors
    //     return [].map.call(anchors, a => a.href);
    //   });
    const escapedText = escapeXpathString('use WhatsApp Web')
    // .$x("//a[contains(text(), 'Some text')]");
    const linkHandlers = await page.$x(`//a[contains(text(), ${escapedText})]`);
    const links = await page.$$(`a`)
    // links.forEach(a => console.log(a.href))
    // console.log('links', linkHandlers.length);
    // let valueHandle = await links[0];
      
    if (linkHandlers.length > 0) {
        await linkHandlers[0].click();
    } else {
        // throw new Error(`Link not found: ${text}`);
    }
    // const theLink = links.filter((link)=> {

    //     // console.log(link._frameManager._mainFrame._navigationURL);
    //     if(link._frameManager._mainFrame._navigationURL.includes('https://web.whatsapp.com/send?phone=966553903500')){
    //         return true
    //     }
    //     return false
    // })
    
    // const hrefs = await page.$eval('a[href="https://web.whatsapp.com/send?phone=966553903500&text=I%27m+interested"]', a => a);
    // const hrefs = await page.$eval('a', a => {
    //     return a
    // });
    //   console.log(href.find(link => link.includes('https://web.whatsapp.com/send?phone=966553903500')));
    // console.log('hrefs',theLink);
    // await page.click(linkHandlers[0])
    await sleep(1000)
    // saveCookies(page)
    // let x = await page.evaluate(() => document.body.innerHTML)
    // console.log(x);
    await page.screenshot({ path: 'example.png' });

    await browser.close();
})();