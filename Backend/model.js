import fs from "fs";

const rawData = JSON.parse(fs.readFileSync("./simple spend data.json", "utf-8"));
export const Model = [];

let mainData = rawData;

// 🔍 Detect nested structure
if (rawData.simple_spend_data && rawData.simple_spend_data.brands) {
  mainData = rawData.simple_spend_data;
}

// helper to extract all image URLs
const extractImages = (q) => {
  const imgs = [];
  ["image1Url", "image2Url", "image3Url", "image4Url"].forEach((key) => {
    if (q[key]) imgs.push(q[key]);
  });
  return imgs;
};

// ✅ Case 1: JSON starts with { "brands": [ ... ] }
if (mainData.brands && Array.isArray(mainData.brands)) {
  console.log("📦 Found brand-based data structure (brands array detected).");

  for (const brandData of mainData.brands) {
    const brandName = brandData.brand;
    const items = brandData.items || [];

    for (const item of items) {
      const productName = item.name?.trim() || "Unnamed Product";
      const description = item.description || "";

      const storeEntry = {
        storeName: "SimpleSpendStore",
        brand: brandName,
        productName,
        description,
        quantities: item.quantities.map((q) => ({
          size: q.size,
          cost: Number(q.cost) || 0,
          offer: q.offer || "",
          barcode: q.barcode || "",
          imageUrls: extractImages(q),
        })),
      };

      let existingProduct = Model.find(
        (p) => p.name.toLowerCase() === productName.toLowerCase()
      );

      if (existingProduct) {
        existingProduct.stores.push(storeEntry);
      } else {
        Model.push({
          name: productName,
          category: "Atta & Grains",
          stores: [storeEntry],
          bestPrice: null,
          bestStore: null,
        });
      }
    }
  }
}
