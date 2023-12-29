const fs = require("fs");

const attibute = [
    {
        name: "Công suất",
        value: "800W",
    },
    {
        name: "Năng lượng va đập",
        value: "3 J",
    },
    {
        name: "Tốc độ đập",
        value: "0 – 4000 vòng/phút",
    },
    {
        name: "Tốc độ không tải",
        value: "0 – 900 vòng/phút",
    },
    {
        name: "Trọng lượng",
        value: "2.9 kg",
    },
    {
        name: "Kích thước",
        value: "407mm x 83mm x 210mm (Dài x rộng x cao)",
    },
    {
        name: "Đầu kẹp mũi khoan",
        value: "SDS-plus",
    },
    {
        name: "Đường kính khoan bê tông",
        value: "4 – 26 mm",
    },
    {
        name: "Làm việc tối ưu trên bê tông, các mũi khoan búa",
        value: "8 – 16 mm",
    },
    {
        name: "Đường kính khoan gạch",
        value: "26 mm",
    },
    {
        name: "Đường kính khoan thép",
        value: "13 mm",
    },
    {
        name: "Đường kính khoan gỗ",
        value: "30 mm",
    },
];

for (let i = 0; i < attibute.length; i++) {
    const sql = `INSERT INTO product_attribute_item 
    (display_order, product_attribute_id, product_id, \`name\`, \`value\`) 
    VALUES (0, 1, 8, \'${attibute[i].name}\', \'${attibute[i].value}\'); \n`;
    fs.appendFile("./sql.txt", sql, { encoding: "utf8" }, () => {
        console.log("insert success");
    });
}
