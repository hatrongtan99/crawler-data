const fs = require("fs").promises;
const path = require("path");
const { productServiceUrl, mediaServiceUrl } = require("../utiles/contant");
const { getFileFromLocalPath } = require("../utiles");

const PATH_FILE_JSON_PRODUCT = path.resolve(
    __dirname,
    "../../product-may-khoan.json"
);

const createNewProduct = async (body) => {
    try {
        return await (
            await fetch(productServiceUrl + "/bff-admin/products", {
                method: "post",
                body: JSON.stringify(body),
                headers: {
                    "Content-type": "application/json",
                },
            })
        ).json();
    } catch (error) {
        throw error;
    }
};

const getBrandBySlug = async (slug) => {
    try {
        return await (
            await fetch(productServiceUrl + "/bff-customer/brands/" + slug)
        ).json();
    } catch (error) {
        console.log(error);
        console.log("brand not found " + slug);
    }
};

const saveImage = async (pathImageLocal, caption = "") => {
    try {
        const file = await getFileFromLocalPath(pathImageLocal);
        const formData = new FormData();
        formData.set("file", file);
        formData.set("caption", caption);

        // formData.set("filename", i.image.fileName);

        formData.set("file", file);

        formData.set("fileType", "IMAGE");
        return await (
            await fetch(mediaServiceUrl + "/medias", {
                method: "post",
                body: formData,
            })
        ).json();
    } catch (error) {
        throw error;
    }
};

const insertProduct = async () => {
    try {
        const json = await fs.readFile(PATH_FILE_JSON_PRODUCT, {
            encoding: "utf8",
        });

        const products = JSON.parse(json);
        for (const product of products) {
            const listImagesId = [];

            try {
                for await (const img of product.images) {
                    const { id } = await saveImage(
                        img.urlLocalImage,
                        img.caption
                    );
                    listImagesId.push(id);
                }
            } catch (error) {
                console.log("cant not save file");
            }

            let brandId = null;

            try {
                const { id } = await getBrandBySlug(
                    product.brand.toLowerCase()
                );
                brandId = id;
            } catch (error) {
                console.log(error);
            }

            const newProduct = {
                name: product.name,
                shortDescription: "",
                description: "mo ta",
                sku: product.sku,
                slug: product.slug,
                price: product.price,
                thumbnailId: listImagesId[0],
                brandId: brandId || 1,
                categoryId: [62],
                images: listImagesId,
                productRelate: [],
                metadata: product.metadata,
                isAvailInStock: false,
            };

            await createNewProduct(newProduct);
        }
    } catch (error) {
        console.log(error);
    }
};

insertProduct();

module.exports = insertProduct;
