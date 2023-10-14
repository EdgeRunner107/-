const puppeteer = require('puppeteer');
const cheerio = require('cheerio');
const fs = require('fs');  // 파일 저장을 위한 fs 모듈을 가져옵니다.

(async() => {
  const browser = await puppeteer.launch({
    headless: false
  });

  const page = await browser.newPage();
  await page.setViewport({
    width: 1366,
    height: 768
  });

  await page.goto('https://rocketalert.live/');

  // 해당 선택자의 컨텐츠가 로드될 때까지 기다립니다.
  await page.waitForSelector('#root > div > section.section.mostRecentAlerts');

  const content = await page.content();
  const $ = cheerio.load(content);
  
  const sectionContent = $('#root > div > section.section.mostRecentAlerts').html();
  console.log(sectionContent);  // 해당 부분의 전체 HTML 내용을 출력합니다.

  // JSON 형식으로 파일에 저장
  fs.writeFileSync('alerts.json', JSON.stringify({ html: sectionContent }, null, 2));

  browser.close();
})();
