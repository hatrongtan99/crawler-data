const fs = require("fs").promises;
const path = require("path");
const { productServiceUrl, mediaServiceUrl } = require("../utiles/contant");
const { getFileFromLocalPath } = require("../utiles");
const PATH_FILE_JSON_CATE = path.resolve(__dirname, "../../categories.json");

const createCategory = async (body) => {
    try {
        return await (
            await fetch(productServiceUrl + "/bff-admin/categories", {
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

const saveImage = async (pathImageLocal) => {
    try {
        const file = await getFileFromLocalPath(pathImageLocal);
        const formData = new FormData();
        formData.set("file", file);
        formData.set("caption", "");

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

const insertCategories = async () => {
    try {
        const json = await fs.readFile(PATH_FILE_JSON_CATE, {
            encoding: "utf8",
        });

        const data = JSON.parse(json);
        for (let key of Object.keys(data)) {
            const parentCate = {
                name: data[key].name,
                slug: data[key].slug,
                thumbnailId: data[key].thumbnailId,
            };
            const newCate = await createCategory(parentCate);
            const { id: parentId } = newCate;
            for (let childCateItem of data[key]["child"]) {
                const { id: thumbnailId } = await saveImage(
                    childCateItem.imageUrl
                );
                const childBody = {
                    name: childCateItem.name,
                    slug: childCateItem.slug,
                    parentId,
                    thumbnailId,
                };
                await createCategory(childBody);
            }
        }
    } catch (error) {
        throw error;
    }
};

module.exports = insertCategories;
