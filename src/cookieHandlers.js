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

module.exports = {loadCookies , saveCookies, getCookies}