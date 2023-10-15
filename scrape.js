var express = require('express');
var router = express.Router();
const puppeteer = require('puppeteer');
const cheerio = require('cheerio');
router.get('/result.json', async (req, res, next) => {
    const browser = await puppeteer.launch({
        headless: "new"
    });

    const page = await browser.newPage();
    await page.setViewport({
        width: 1366,
        height: 768
    });

    await page.goto('https://rocketalert.live/');

    await page.waitForSelector('#root > div > section.section.mostRecentAlerts');

    const content = await page.content();
    const $ = cheerio.load(content);

    const rows = [];
    
    // 해당 섹션 내부의 모든 <div> 항목을 가져옴
    $('#root > div > section.section.mostRecentAlerts > div').each((index, element) => {
        const itemData = $(element).text().trim(); // .trim()으로 공백 제거
        rows.push(itemData);
    });

    browser.close();

    res.send(rows); // rows 배열을 응답으로 반환
    
});

router.get('/', function(req, res) {
    res.render('index', {title:'스크랩', pageName:'scrapisrarel.ejs'});
});
module.exports = router;
