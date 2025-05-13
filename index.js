const fs = require("fs");
const handlebars = require("handlebars");
const puppeteer = require("puppeteer");

// ข้อมูลที่จะใช้เติมใน template
const data = {
  date: new Date().toLocaleDateString("th-TH"),
  name: "จักรรพงศ์",
  items: [
    { name: "สินค้า A", quantity: 10, price: 150 },
    { name: "สินค้า B", quantity: 5, price: 300 },
    { name: "สินค้า C", quantity: 2, price: 500 },
  ],
};

(async () => {
  // โหลด template
  const templateHtml = fs.readFileSync(
    "./templates/report-template.hbs",
    "utf8"
  );
  const template = handlebars.compile(templateHtml);
  const html = template(data);

  // เริ่ม puppeteer
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setContent(html, { waitUntil: "domcontentloaded" });

  // export เป็น PDF
  await page.pdf({ path: "output/report.pdf", format: "A4", printBackground: true });

  await browser.close();
  console.log("✅ PDF generated successfully!");
})();
