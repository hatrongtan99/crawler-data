const express = require("express");
const cheerio = require("cheerio");
const request = require("request");
const app = express();
const $ = cheerio.load('<h2 class="title">Hello world</h2>', null, false);

$("ul", '<ul id="fruits">...</ul>');

// app.get("/", (req, res) => {
//     // request("https://maydochuyendung.com/may-khoan", (err, response, body) => {
//     //     if (response.statusCode == 200) {
//     //         return res.send(body);
//     //     }
//     // });
//     $();
// });

// app.listen(3333, () => {
//     console.log("server running on port " + 3333);
// });
