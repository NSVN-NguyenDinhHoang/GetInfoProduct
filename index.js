// // const puppeteer = require('puppeteer');
// // // $("#MyTextBox").val("Some text").change();
// // (async () => {
// //   const browser = await puppeteer.launch({ headless: false , ignoreHTTPSErrors: true});
// //   const page = await browser.newPage();
// //   await page.goto(url, 
// //     {waitUntil: 'networkidle2'}
// //   );
// //   await page.$eval('#employee-code-inp', el => {$('#employee-code-inp').val('000001').change()});
// //   await page.$eval('#password-input', el => {$('#password-input').val('0').change()});
// //   await page.click("#login-btn");
// //   await page.waitForNavigation(); 
// //   await page.screenshot({ path: 'example.png' });
// //   await browser.close();
// // })()

// // const url = "http://localhost:8080/nts.uk.com.web/view/ccg/007/d/index.xhtml";

// // const data = {
// //     companyCode: "0304",
// //     contractCode: "000000000000",
// //     contractPassword: "",
// //     employeeCode: "930005",
// //     password: "0"

// // }



// // Require library
// var excel = require('excel4node');

// // Create a new instance of a Workbook class
// var workbook = new excel.Workbook();

// // Add Worksheets to the workbook
// var worksheet = workbook.addWorksheet('Sheet 1');
// var worksheet2 = workbook.addWorksheet('Sheet 2');

// // Create a reusable style
// var style = workbook.createStyle({
//   font: {
//     color: '#FF0800',
//     size: 12
//   },
//   numberFormat: '$#,##0.00; ($#,##0.00); -'
// });

// // Set value of cell A1 to 100 as a number type styled with paramaters of style
// worksheet.cell(1,1).number(100).style(style);

// // Set value of cell B1 to 300 as a number type styled with paramaters of style
// worksheet.cell(1,2).number(200).style(style);

// // Set value of cell C1 to a formula styled with paramaters of style
// worksheet.cell(1,3).formula('A1 + B1').style(style);

// // Set value of cell A2 to 'string' styled with paramaters of style
// worksheet.cell(2,1).string('content').style(style);

// // Set value of cell A3 to true as a boolean type styled with paramaters of style but with an adjustment to the font size.
// // worksheet.cell(3,1).bool(true).style(style).style({font: {size: 14}});

// workbook.write('Excel.xlsx');

const readXlsxFile = require('read-excel-file/node');
const _ = require('lodash');
const puppeteer = require('puppeteer');
const cheerio = require('cheerio');
const cron = require('node-cron');
const excel = require('excel4node');


let urls = [];
async function readUrls() {
  await readXlsxFile('Excel.xlsx').then((rows) => {
    rows.forEach(element => {
      const link = element[4];
      if (!_.isNil(link)) urls.push(link);
    });

  });
  //console.log(urls);

}
async function getInfoUrl(url) {
  const browser = await puppeteer.launch({ headless: true , ignoreHTTPSErrors: true});
  const page = await browser.newPage();
  await page.goto(
    url, 
    {waitUntil: 'networkidle2'}
  );
  const content = await page.content();
  const $ = cheerio.load(content);
  console.log(url +': ' + $('#priceblock_ourprice').text());
  await browser.close();
}
async function main() {
  await readUrls();

  _.forEach(urls, url => {
      getInfoUrl(url);
  });

}



const task = cron.schedule('* * * * *', () => {
  console.log('start process ...');
  urls = [];
  main();
});
task.start();
// File path.

// Readable Stream.
// readXlsxFile(fs.createReadStream('/path/to/file')).then((rows) => {
//   ...
// })