const { getFileFromLocalPath } = require("../utiles");

const { mediaServiceUrl, productServiceUrl } = require("../utiles/contant");

const json = [
    {
        name: "Bosch",
        slug: "bosch",
        image: {
            caption: "Bosch thumbnail",
            imageUrl:
                "/Users/tanha/dev/work/data/dienmaykimkhi/images/brand/bosch-1584089519.png",
        },
    },
    {
        name: "Felix",
        slug: "felix",
        image: {
            caption: "Felix thumbnail",
            imageUrl:
                "/Users/tanha/dev/work/data/dienmaykimkhi/images/brand/felix-logo-aa-1592023490.jpg",
        },
    },
    {
        name: "Fisher",
        slug: "fisher",
        image: {
            caption: "Fisher thumbnail",
            imageUrl:
                "/Users/tanha/dev/work/data/dienmaykimkhi/images/brand/fisher-2-1585014127.jpg",
        },
    },
    {
        name: "Hakawa",
        slug: "hakawa",
        image: {
            caption: "hakawa thumbnail",
            imageUrl:
                "/Users/tanha/dev/work/data/dienmaykimkhi/images/brand/hakawa-to-1593678404.png",
        },
    },
    {
        name: "Jasic",
        slug: "jasic",
        image: {
            caption: "Jasic thumbnail",
            imageUrl:
                "/Users/tanha/dev/work/data/dienmaykimkhi/images/brand/jasic-1592387465.png",
        },
    },
    {
        name: "Lai Sai",
        slug: "lai-sai",
        image: {
            caption: "Lai sai thumbnail",
            imageUrl:
                "/Users/tanha/dev/work/data/dienmaykimkhi/images/brand/lai-sai-m-1585034011.png",
        },
    },
    {
        name: "Kenmax",
        slug: "kenmax",
        image: {
            caption: "Kenmax thumbnail",
            imageUrl:
                "/Users/tanha/dev/work/data/dienmaykimkhi/images/brand/kenmax-logo-1598237147.jpg",
        },
    },
    {
        name: "Hong Ky",
        slug: "Hong Ky",
        image: {
            caption: "Hong Ky thumbnail",
            imageUrl:
                "/Users/tanha/dev/work/data/dienmaykimkhi/images/brand/hong-ky-1590715297.png",
        },
    },
    {
        name: "Nikita",
        slug: "nikita",
        image: {
            caption: "nikita thumbnail",
            imageUrl:
                "/Users/tanha/dev/work/data/dienmaykimkhi/images/brand/logo-nikita-1594192967.png",
        },
    },
    {
        name: "Weldcom",
        slug: "weldcom",
        image: {
            caption: "weldcom thumbnail",
            imageUrl:
                "/Users/tanha/dev/work/data/dienmaykimkhi/images/brand/logo-weldcom-1592365218.jpg",
        },
    },
    {
        name: "Makita",
        slug: "makita",
        image: {
            caption: "Makita thumbnail",
            imageUrl:
                "/Users/tanha/dev/work/data/dienmaykimkhi/images/brand/makita-1584090120.png",
        },
    },
    {
        name: "Protech",
        slug: "protech",
        image: {
            caption: "Protech thumbnail",
            imageUrl:
                "/Users/tanha/dev/work/data/dienmaykimkhi/images/brand/protech-1616730860.png",
        },
    },
    {
        name: "Riland",
        slug: "riland",
        image: {
            caption: "Riland thumbnail",
            imageUrl:
                "/Users/tanha/dev/work/data/dienmaykimkhi/images/brand/riland-logo-1601634345.png",
        },
    },
    {
        name: "Sasuke",
        slug: "sasuke",
        image: {
            caption: "Sasuke thumbnail",
            imageUrl:
                "/Users/tanha/dev/work/data/dienmaykimkhi/images/brand/sasuke-png-1596862054.png",
        },
    },
    {
        name: "Sentech",
        slug: "sentech",
        image: {
            caption: "Sentech thumbnail",
            imageUrl:
                "/Users/tanha/dev/work/data/dienmaykimkhi/images/brand/sentech-2-1598252062.png",
        },
    },
];

const insertBrand = async function () {
    try {
        json.forEach(async (i) => {
            const formData = new FormData();
            formData.set("caption", i.image.caption);

            // formData.set("filename", i.image.fileName);

            const file = await getFileFromLocalPath(i.image.imageUrl);

            formData.set("file", file);

            formData.set("fileType", "IMAGE");
            const res = await (
                await fetch(mediaServiceUrl + "/medias", {
                    method: "POST",
                    body: formData,
                })
            ).json();

            const { id } = res;

            const newBrand = {
                name: i.name,
                slug: i.slug,
                thumbnailId: id,
            };

            await fetch(productServiceUrl + "/bff-admin/brands", {
                method: "post",
                body: JSON.stringify(newBrand),
                headers: {
                    "Content-type": "application/json",
                },
            });
        });
    } catch (error) {
        console.log(error);
    }
};

module.exports = insertBrand;
