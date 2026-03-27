import fs from "fs";
import mongoose from "mongoose";
import Product from "./models/Product.js";
import connectDB from "./config/dbConnect.js"; // your existing DB connection

// 🧠 Read and flatten data from all shops
const loadData = () => {
  const raw = fs.readFileSync("./newData.json", "utf8");
  const data = JSON.parse(raw);
  const allProducts = [];

  for (const [shopName, shopData] of Object.entries(data)) {
    if (!Array.isArray(shopData)) continue;

    shopData.forEach((category) => {
      // 🧩 check for category.brands array
      if (!category?.brands || !Array.isArray(category.brands)) return;

      category.brands.forEach((brandObj) => {
        const brand = brandObj?.brand || "Unknown Brand";

        // 🧩 check for brandObj.items array
        if (!Array.isArray(brandObj.items)) return;

        brandObj.items.forEach((item) => {
          if (!item?.name) return;

          const product = {
            shopName,
            brand,
            name: item.name.trim(),
            description: item.description?.trim() || "",
            quantities:
              Array.isArray(item.quantities) && item.quantities.length > 0
                ? item.quantities.map((q) => ({
                    size: q.size || "N/A",
                    cost: Number(q.cost) || 0,
                    offer: q.offer || "",
                    barcode: q.barcode || "",
                    images: [
                      q.image1Url,
                      q.image2Url,
                      q.image3Url,
                      q.image4Url,
                    ].filter(Boolean),
                  }))
                : [],
          };

          if (product.quantities.length > 0) {
            allProducts.push(product);
          }
        });
      });
    });
  }

  return allProducts;
};

const seedProducts = async () => {
  try {
    await connectDB();
    console.log("✅ MongoDB Connected");

    await Product.deleteMany();
    console.log("🧹 Old product data cleared.");

    const allShopProducts = loadData();
    console.log(`📦 Loaded ${allShopProducts.length} raw product entries.`);

    const grouped = {};

    // 🔄 Group same products by name
    for (const item of allShopProducts) {
      const key = item.name.toLowerCase();
      if (!grouped[key]) {
        grouped[key] = {
          name: item.name,
          description: item.description,
          stores: [],
        };
      }
      grouped[key].stores.push({
        storeName: item.shopName,
        brand: item.brand,
        quantities: item.quantities,
      });
    }

    // 💸 Compute best price
    const finalProducts = Object.values(grouped).map((prod) => {
      let min = { cost: Infinity, storeName: "", size: "" };
      prod.stores.forEach((store) => {
        store.quantities.forEach((q) => {
          if (q.cost && q.cost < min.cost) {
            min = { cost: q.cost, storeName: store.storeName, size: q.size };
          }
        });
      });
      return { ...prod, bestPrice: min.cost !== Infinity ? min : null };
    });

    await Product.insertMany(finalProducts);
    console.log(`🌱 Inserted ${finalProducts.length} unique products successfully.`);
    process.exit(0);
  } catch (err) {
    console.error("❌ Seeding failed:", err);
    process.exit(1);
  }
};

seedProducts();
