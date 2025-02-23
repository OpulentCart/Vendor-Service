const PDFDocument = require("pdfkit");

exports.generateVendorCertificate = async (vendor) => {
    return new Promise((resolve, reject) => {
        const doc = new PDFDocument({ size: "A4", margin: 50 });
        let buffers = [];

        doc.on("data", buffers.push.bind(buffers));
        doc.on("end", () => resolve(Buffer.concat(buffers)));
        doc.on("error", reject);

        // Background and Title
        doc.rect(0, 0, 612, 792).fill("#f0f0f0"); // Light Gray Background
        doc.fillColor("#000").font("Helvetica-Bold").fontSize(24).text("Vendor Store Certificate", { align: "center" });
        doc.moveDown(1);

        // Certificate Body
        doc.fontSize(16).font("Helvetica").text(`This certifies that`, { align: "center" });
        doc.fontSize(20).font("Helvetica-Bold").text(`${vendor.store_name}`, { align: "center" });
        doc.fontSize(16).font("Helvetica").text(`has been allocated an online store and is recognized as a registered vendor.`, { align: "center" });
        doc.moveDown(2);

        // Vendor Details
        doc.fontSize(14).font("Helvetica-Bold").text("Vendor Details:");
        doc.fontSize(12).font("Helvetica").text(`Business Email: ${vendor.business_email}`);
        doc.text(`Business Phone: ${vendor.business_phone}`);
        doc.text(`Address: ${vendor.street_address}, ${vendor.city}, ${vendor.state}, ${vendor.country} - ${vendor.pincode}`);
        doc.text(`Registration Date: ${new Date(vendor.date).toDateString()}`);
        doc.moveDown(2);

        // Authorized Signature
        doc.fontSize(12).text("Authorized By,", { align: "right" });
        doc.moveDown(3);
        doc.fontSize(14).font("Helvetica-Bold").text("Vendor Store Authority", { align: "right" });

        doc.end();
    });
};
