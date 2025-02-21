const PDFDocument = require("pdfkit");

exports.generateCertificate = async() => {
    return new Promise((resolve, reject) => {
        const doc = new PDFDocument();
        let buffers = [];

        doc.on("data", buffers.push.bind(buffers));
        doc.on("end", () => resolve(Buffer.concat(buffers)));
        doc.on("error", reject);

        doc.rect(0, 0, 612, 792).fill("#f0f0f0"); // Background color
        doc.fontSize(24).fillColor("#000").text("Vendor Store Certificate", { align: "center" });
        doc.moveDown().fontSize(16).text(`This certifies that has been allocated an online store.`);
    
        doc.moveDown().fontSize(14).text(`Project Name:`);
        doc.text(`Start Date: ${creditForm.startDate}`);
        doc.text(`End Date: ${creditForm.endDate}`);
        doc.text(`Reduction Achieved: ${creditForm.baselineEmissionAmount - creditForm.projectEmissionAmount} tons CO2`);

        doc.end();
    });
}

module.exports = generateCertificate;