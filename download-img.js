const fs = require("fs");
const https = require('https');
const handlebars = require("handlebars");
const puppeteer = require("puppeteer");
const csv = require("csv-parser");

let results = [];

const downloadImg = async (fileId, imageDir) => {
  console.log('\x1b[34m%s\x1b[0m',`${imageDir} image ID:`, fileId);

  const url = `https://drive.usercontent.google.com/download?export=view&id=${fileId}`;;
  const file = await fs.createWriteStream(`img/${imageDir}/${fileId}.jpg`);

  // Download image
  await https.get(url, async (response) => {
    response.pipe(file);
    await file.on('finish', async () => {
      file.close();
      console.log('\x1b[36m%s\x1b[0m', `Download ${imageDir} ID : ${fileId} complete`);
    });
  }).on('error', (err) => {
    fs.unlink(`img/${imageDir}/${id}.jpg`, () => {}); // Delete the file on error
    console.error('\x1b[31m%s\x1b[0m', 'Error downloading the file:', err.message);
  });

}

fs.createReadStream("./input/data.csv")
  .pipe(
    csv({
      headers: false,
      skipLines: 1,
    })
  )
  .on("data", async (data) => {
    const studentImg = data[5];
    const currentParentImg = data[48];
    // console.log(data);
    if (studentImg && studentImg !== "") {
      console.log('\x1b[34m%s\x1b[0m',"studentImg", studentImg);
      await downloadImg(studentImg.split("id=")[1], "student");
    }

    if (currentParentImg && currentParentImg !== "") {
      console.log('\x1b[34m%s\x1b[0m',"currentParentImg", currentParentImg);
      await downloadImg(currentParentImg.split("id=")[1], "currentparent");
    }

    results.push(data)
  })

