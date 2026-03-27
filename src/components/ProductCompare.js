import React, { useEffect, useState } from "react";
import { fetchProductComparison } from "../services/dbService";

const ProductCompare = ({ productId, onClose }) => {
  const [data, setData] = useState(null);

  useEffect(() => {
    const load = async () => {
      const res = await fetchProductComparison(productId);
      setData(res);
    };
    load();
  }, [productId]);

  if (!data) {
    return (
      <div className="flex justify-center items-center py-6 text-gray-500">
        Loading comparison...
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-2xl shadow-lg w-11/12 md:w-2/3 lg:w-1/2 p-6">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">
          Compare Prices for {data.name}
        </h2>

        <div className="overflow-x-auto">
          <table className="min-w-full border text-sm">
            <thead className="bg-gray-100 text-gray-700">
              <tr>
                <th className="py-2 px-3 text-left">Store</th>
                <th className="py-2 px-3 text-left">Brand</th>
                <th className="py-2 px-3 text-left">Size</th>
                <th className="py-2 px-3 text-left">Cost (₹)</th>
                <th className="py-2 px-3 text-left">Offer</th>
              </tr>
            </thead>
            <tbody>
              {data.stores.map((store) =>
                store.options.map((opt, i) => (
                  <tr
                    key={`${store.storeName}-${i}`}
                    className={`border-t ${
                      opt.cost === data.bestPrice?.cost
                        ? "bg-green-50 font-semibold"
                        : ""
                    }`}
                  >
                    <td className="py-2 px-3">{store.storeName}</td>
                    <td className="py-2 px-3">{store.brand || "—"}</td>
                    <td className="py-2 px-3">{opt.size}</td>
                    <td className="py-2 px-3">₹{opt.cost}</td>
                    <td className="py-2 px-3">{opt.offer || "—"}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="mt-4 flex justify-end">
          <button
            onClick={onClose}
            className="bg-pink-600 text-white px-4 py-2 rounded-full hover:bg-pink-700"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCompare;
