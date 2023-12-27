const https = require("https");
const fs = require("fs");
const { File } = require("buffer");

const dowload = (url, dest) => {
    return new Promise((resolve, reject) => {
        const file = fs.createWriteStream(dest);
        https.get(url, (response) => {
            response.pipe(file);
            file.on("finish", () => {
                file.close(() => resolve(dest));
            }).on("error", (err) => {
                fs.unlink(dest);
                reject(err.message);
            });
        });
    });
};

const getFileNameFromUrl = (url) => {
    if (url) {
        return url.split(/(\\|\/)/g).pop();
    }
};

const checkOrCreateDir = (path) => {
    if (!fs.existsSync(path)) {
        fs.mkdir(path, (err) => {
            if (err) {
                process.exit(1);
            }
        });
    }
};

const checkOrCreateFile = (path) => {
    if (!fs.existsSync(path)) {
        fs.writeFile(path, "{}", (err) => {
            if (err) throw err;
            console.log("create file!");
        });
    }
};

const getExtention = (filename) => {
    if (filename) {
        return filename.split(".").pop();
    }
};

const isImage = (filename) => {
    const extension = getExtention(filename);
    return ["png", "jpg", "jpeg", "gif"].includes(extension.toLowerCase());
};

const getFileFromLocalPath = async (path) => {
    if (!path) {
        throw new Error("path not found when load File");
    }
    const filename = getFileNameFromUrl(path);
    try {
        const buffer = fs.readFileSync(path);
        let type = null;
        if (isImage(filename)) {
            type = "image/" + getExtention(filename);
        }
        return new File([buffer], filename, { type });
    } catch (error) {
        throw error;
    }
};

module.exports = {
    dowload,
    getFileNameFromUrl,
    checkOrCreateDir,
    checkOrCreateFile,
    getExtention,
    isImage,
    getFileFromLocalPath,
};
