const http = require("http");
const fs = require("fs");
const url = require("url");

const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, "utf8");
const dataObj = JSON.parse(data);
const overviewTemplate = fs.readFileSync(
  `${__dirname}/templates/overview.html`,
  "utf-8"
);
const productTemplate = fs.readFileSync(
  `${__dirname}/templates/product.html`,
  "utf-8"
);
const cardTemplate = fs.readFileSync(
  `${__dirname}/templates/card-template.html`,
  "utf-8"
);
const fillInTemplate = function (product, cardTemplate) {
  let card = cardTemplate.replace(/{%IMAGE%}/g, product.image);
  card = card.replace(`{%PRODUCT_NAME%}`, product.productName);
  card = card.replace(`{%QUANTITY%}`, product.quantity);
  card = card.replace(`{%PRICE%}`, product.price);
  if (!product.organic) card = card.replace(`{%NOT_ORGANIC%}`, "not-organic");
  return card;
};

// Start http server
const server = http.createServer((req, res) => {
  const pathName = req.url;
  // console.log(pathName);
  if (pathName === "/" || pathName === "/overview") {
    const productCards = dataObj
      .map((el) => fillInTemplate(el, cardTemplate))
      .join("");
    const overview = overviewTemplate.replace(
      `{%PRODUCT_CARDS%}`,
      productCards
    );
    res.end(overview);
  } else if (pathName === "/product") res.end(product);
});

server.listen(8000, "127.0.0.1", () => {
  console.log("Listen to requests on port 8000");
});
