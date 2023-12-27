const request = require("request");
const cheerio = require("cheerio");
const path = require("path");
const fs = require("fs").promises;
const {
    checkOrCreateFile,
    dowload,
    getFileNameFromUrl,
    checkOrCreateDir,
    getFileFromLocalPath,
} = require("../utiles");
const { default: slugify } = require("slugify");

const DEST_JSON_URL_FILE = path.resolve(__dirname, "../../productUrl.json");
const DEST_JSON_FILE_PRODUCT = path.resolve(__dirname, "../../product.json");
const DEST_IMAGE_PRODUCT_FILE = path.resolve(__dirname, "../../images/product");
const BASE_URL = "https://maydochuyendung.com";

const listUrl = [
    "https://maydochuyendung.com/may-khoan",
    // "https://maydochuyendung.com/may-siet-bu-long",
    // "https://maydochuyendung.com/may-mai",
    // "https://maydochuyendung.com/may-cua",
    // "https://maydochuyendung.com/may-cat",
    // "https://maydochuyendung.com/may-han",
    // "https://maydochuyendung.com/may-bat-van-oc-vit",
    // "https://maydochuyendung.com/may-rua-xe",
];

const crawlerProductUrl = async () => {
    await fs.writeFile(DEST_JSON_URL_FILE, "[]");
    const urlArray = [];

    return new Promise((resolve, reject) => {
        try {
            listUrl.forEach((url, index) => {
                request(url, async (err, response, body) => {
                    if (err) {
                        throw err;
                    }

                    const $ = cheerio.load(body);
                    const anchorTagProduct = $(
                        ".list_products .product_item > a"
                    );
                    for (let el of anchorTagProduct) {
                        const urlProduct = $(el).attr("href");
                        if (urlProduct) {
                            urlArray.push(BASE_URL + urlProduct);
                        }
                    }

                    const data = await fs.readFile(DEST_JSON_URL_FILE, {
                        encoding: "utf-8",
                    });
                    const jsonObject = JSON.parse(data);
                    jsonObject.push(...urlArray);
                    await fs.writeFile(
                        DEST_JSON_URL_FILE,
                        JSON.stringify(jsonObject, null, 4)
                    );
                    if (index == listUrl.length - 1) {
                        resolve(true);
                    }
                });
            });
        } catch (error) {
            reject(false);
        }
    });
};

const sleep = async (delay = 1000) => {
    return new Promise((resolve) => {
        setTimeout(resolve, delay);
    });
};

const crawlerDetailProduct = async (
    destSaveJson = DEST_JSON_FILE_PRODUCT,
    urlProduct
) => {
    checkOrCreateDir(DEST_IMAGE_PRODUCT_FILE);
    await fs.writeFile(destSaveJson, "[]");

    if (!Array.isArray(urlProduct)) {
        throw new Error("invalid input");
    }
    const result = [];
    let isDone = false;

    for (let i = 0; i < urlProduct.length; i++) {
        const urlItem = urlProduct[i];

        request(urlItem, async (err, response, body) => {
            if (err) {
                console.log(err);
                return;
            }
            const $ = cheerio.load(body);
            const title = $(".product-title h1.product_h1").text();
            const description = "mo ta";
            let price = $(".price_box strong.price").text();
            if (price && price.indexOf(" đ") != -1) {
                price = Number(price.slice(0, -2).split(".").join(""));
            } else {
                price = 0;
            }
            const brand = $(".price_box")
                .next()
                .find("p")
                .text()
                .slice("Hãng: ".length);
            const sku = $(".price_box")
                .next()
                .next()
                .find("p")
                .text()
                .slice("Mã sản phẩm: ".length);
            const metadata = [];
            const listUrlImage = [];

            // load images
            $(".image_box_top")
                .find(".item .owl-lazy")
                .each((i, el) => {
                    const caption = $(el).attr("alt");
                    const urlDowload = $(el).attr("data-src");
                    const urlLocalImage =
                        DEST_IMAGE_PRODUCT_FILE +
                        "/" +
                        getFileNameFromUrl(urlDowload);

                    dowload(urlDowload, urlLocalImage);
                    const newImage = {
                        caption,
                        urlLocalImage,
                    };
                    listUrlImage.push(newImage);
                });

            // metadata
            $(".property_customs .content p").each((i, el) => {
                const [name, value] = $(el).text().split(": ");
                if (name && value) {
                    metadata.push({
                        name,
                        value,
                    });
                }
            });

            const newProduct = {
                name: title,
                shortDescription: "",
                description,
                sku,
                slug: slugify(title),
                price: price,
                brand,
                images: listUrlImage,
                productRelate: null,
                metadata,
                isAvailInStock: false,
            };

            result.push(newProduct);

            if (i == urlProduct.length - 1) {
                isDone = true;
            }
        });
    }

    while (true) {
        console.log("application is running .... ");
        await sleep(1000);
        if (isDone) {
            await fs.writeFile(destSaveJson, JSON.stringify(result, null, 4));
            break;
        }
    }
};

(async function main() {
    const dest = path.resolve(__dirname, "../../product-may-khoan.json");
    await crawlerProductUrl();
    const urlList = JSON.parse(
        await fs.readFile(DEST_JSON_URL_FILE, { encoding: "utf8" })
    );
    await crawlerDetailProduct(dest, urlList);
})();
