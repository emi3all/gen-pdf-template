const fs = require("fs");
const https = require('https');
const handlebars = require("handlebars");
const puppeteer = require("puppeteer");
const csv = require("csv-parser");

let results = [];

fs.createReadStream("./input/data.csv")
  .pipe(
    csv({
      headers: false,
      skipLines: 1,
    })
  )
  .on("data", async (data) => {
    results.push(data)
  })
  .on("end", async () => {
    // console.log(JSON.stringify(results));
    newResults = await results.map((item) => {
      return {
        date: new Date().toLocaleDateString("th-TH"),
        student: {
          image: item[5],
          imgBase64: "",
          prefix: item[6],
          fullname: item[7],
          nickname: item[8],
          religion: item[9],
          address: item[10],
          numberOfRoom: item[11],
          numberOfHouse: item[12],
          group: item[13],
          alley: item[14],
          road: item[15],
          subdistrict: item[16],
          district: item[17],
          province: item[18],
          postalCode: item[19],
          tel: item[20],
          contactPerson: item[64],
          contactPersonTel: item[65],
          father: {
            prefix: 'นาย",',
            fullname: item[21],
            occupation: item[22],
            tel: item[23],
          },
          mother: {
            prefix: item[24],
            fullname: item[25],
            occupation: item[26],
            tel: item[27],
          },
          parent: {
            numberOfSiblings: item[28],
            beGirls: item[29],
            beBoys: item[30],
            numberOfStudentsParent: item[31],
            status: item[32],
            fullname: item[44],
            relevance: item[45],
            tel: item[46],
            lineId: item[47],
            // other: item[78],
          },
          disease: item[66],
        },
        currentParent: {
          image: item[48],
          imgBase64: "",
          fullname: item[49],
          job: item[50],
          relevance: item[51],
          address: item[52],
          numberOfRoom: item[53],
          numberOfHouse: item[54],
          group: item[55],
          alley: item[56],
          road: item[57],
          subdistrict: item[58],
          district: item[59],
          province: item[60],
          postalCode: item[61],
          tel: item[62],
        },
        job:{
          addressName: item[33],
          numberOfHouse: item[34],
          group: item[35],
          alley: item[36],
          road: item[37],
          subdistrict: item[38],
          district: item[39],
          province: item[40],
          postalCode: item[41],
          tel1: item[42],
          tel2: item[43],
        },  
        oldSchool: {
          oldSchoolName: item[63]
        },
        educationalRecord: [
          {
            year: item[1],
            level: item[2],
            department: item[3],
            teacher: item[4],
          },
          {
            year: "",
            level: "",
            department: "",
            teacher: "",
          },
          {
            year: "",
            level: "",
            department: "",
            teacher: "",
          },
        ],
      };
    });

    // console.log(JSON.stringify(newResults[0]));

    // console.log("All images downloaded", newResults);


    newResults.forEach((item, index) => {
      (async () => {
        setTimeout(async () => {
          if (item.student.image && item.student.image !== "") {
            try {
              item.student.imgBase64 = fs.readFileSync(`img/student/${item.student.image.split("id=")[1]}.jpg`).toString('base64');
            } catch (error) {
              console.log('\x1b[33m%s\x1b[0m', "Error reading student image file:", item.student.image)
            }
          }
    
          if (item.currentParent.image && item.currentParent.image !== "") {
            try {
              item.currentParent.imgBase64 = fs.readFileSync(`img/currentparent/${item.currentParent.image.split("id=")[1]}.jpg`).toString('base64');
            } catch (error) {
              console.log('\x1b[33m%s\x1b[0m', "Error reading current parent image file:", item.currentParent.image);
            }
          }
          // console.log(item);
          const templateHtml = fs.readFileSync("./templates/student-info-001.hbs", "utf8");
          handlebars.registerHelper("eq", (a, b) => {
            return a === b;
          });
          handlebars.registerHelper("noteq", (a, b) => {
            return a != b;
          });
          const template = handlebars.compile(templateHtml);
          const html = template(item);
          

          const browser = await puppeteer.launch();
          const page = await browser.newPage();
          await page.setContent(html, { waitUntil: "domcontentloaded" });

          const filename = item.student.fullname.replace(/\s+/g, "_").toLowerCase();
          await page.pdf({
            path: `output/${filename}.pdf`,
            format: "A4",
            printBackground: true,
          });

          await browser.close();
          console.log('\x1b[36m%s\x1b[0m', `✅ PDF ${filename}.pdf generated successfully!`);
        }, 1000 * index);
      })();
    });
  });
