// admin/src/components/ManufacturerBannerAdmin.jsx
import Image from "next/image";
import React, { useState, useEffect } from "react";

export default function ManufacturerBannerAdmin() {
  const [banners, setBanners] = useState([]);
  useEffect(() => {
    fetch("/api/manufacturer-banners")
      .then((r) => r.json())
      .then(setBanners);
  }, []);
  return (
    <div>
      <h3>Manufacturer Banners</h3>
      <div className="grid grid-cols-3 gap-3">
        {banners.map((b) => (
          <div key={b._id} className="border rounded p-2">
            <Image
              src={b.image}
              alt="banner"
              className="w-full h-36 object-cover"
            />
            <div className="mt-1 font-medium">{b.manufacturer?.name}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
