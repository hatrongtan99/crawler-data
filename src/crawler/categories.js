const cheerio = require("cheerio");
const request = require("request");
const fs = require("fs");
const path = require("path");

const {
    getFileNameFromUrl,
    dowload,
    checkOrCreateDir,
    checkOrCreateFile,
} = require("../utiles");
const { default: slugify } = require("slugify");

const dest = path.join(__dirname, "../../images/categories");

const DEST_JSON_FILE = path.join(__dirname, "../../categories.json");

const listUrl = [
    {
        url: "https://maydochuyendung.com/dung-cu-dien",
        name: "Dụng cụ điẹn",
        slug: "dung-cu-dien",
    },
    {
        url: "https://maydochuyendung.com/thiet-bi-do-kiem-tra-dien",
        name: "Thiết bị đo & Kiểm tra điện",
        slug: "thiet-bi-do-&-kiem-tr-dien",
    },
    {
        url: "https://maydochuyendung.com/thiet-bi-do-co-khi",
        name: "Thiết bị đo cơ khí",
        slug: "thiet-bi-do-co-khi",
    },
    {
        url: "https://maydochuyendung.com/thiet-bi-do-moi-truong",
        name: "Thiết bị đo môi trường",
        slug: "thiet-bi-do-moi-truong",
    },
    {
        url: "https://maydochuyendung.com/thiet-bi-do-chinh-xac",
        name: "Thiết bị đo chính xác",
        slug: "thiet-bi-do-chinh-xac",
    },
];

const crawlerCategory = () => {
    checkOrCreateDir(dest);
    checkOrCreateFile(DEST_JSON_FILE);
    return new Promise((resolve, rejected) => {
        try {
            for (let item of listUrl) {
                request(item.url, async (err, response, body) => {
                    const childList = [];

                    const parentCate = {
                        name: item.name,
                        slug: item.slug,
                        thumbnailId: null,
                    };

                    const $ = cheerio.load(body);

                    const contents = $(".item > .inner");

                    for (let i = 0; i < contents.length; i++) {
                        const el = contents[i];
                        const urlThumb = $(el)
                            .find(".thumb img")
                            .attr("data-src");
                        let localImageUrl = null;

                        const nameCategory = $(el).find(".title").text();

                        if (urlThumb) {
                            localImageUrl =
                                dest + "/" + getFileNameFromUrl(urlThumb);
                            const cate = {
                                name: nameCategory,
                                slug: slugify(nameCategory, { lower: true }),
                            };
                            cate.imageUrl = await dowload(
                                urlThumb,
                                localImageUrl
                            );
                            childList.push(cate);
                        }
                    }

                    // $(".item > .inner").each((index, el) => {
                    //     const urlThumb = $(el).find(".thumb img").attr("data-src");
                    //     let localImageUrl = null;

                    //     const nameCategory = $(el).find(".title").text();

                    //     if (urlThumb) {
                    //         localImageUrl = dest + "/" + getFileNameFromUrl(urlThumb);
                    //         dowload(urlThumb, localImageUrl);
                    //         const cate = {
                    //             name: nameCategory,
                    //             slug: slugify(nameCategory),
                    //         };

                    //         cate.imageUrl = localImageUrl;
                    //         childList.push(cate);
                    //     }
                    // });

                    fs.readFile(
                        DEST_JSON_FILE,
                        { encoding: "utf8" },
                        (err, data) => {
                            if (err) {
                                throw new Error(err.message);
                            }

                            const jsonObject = JSON.parse(data);

                            jsonObject[item.name] = parentCate;
                            jsonObject[item.name]["child"] = childList;
                            fs.writeFile(
                                DEST_JSON_FILE,
                                JSON.stringify(jsonObject, null, 4),
                                (err) => {}
                            );
                        }
                    );
                });
            }
        } catch (error) {}
    });
};

crawlerCategory();

module.exports = crawlerCategory;
