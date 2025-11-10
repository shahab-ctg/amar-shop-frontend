// admin/src/components/PromoList.jsx
import Image from "next/image";
import React, { useEffect, useState } from "react";

export default function PromoList() {
  const [list, setList] = useState([]);
  useEffect(() => {
    fetch("/api/promocard") // (optional) create GET route for promos; else use admin API
      .then((r) => r.json())
      .then(setList)
      .catch(console.error);
  }, []);
  return (
    <div>
      <h3>Promo Cards</h3>
      <div className="grid grid-cols-3 gap-3">
        {list.map((p) => (
          <div key={p._id} className="border p-2 rounded">
            <Image
              src={p.image}
              className="w-full h-36 object-cover"
              alt={p.title}
            />
            <div className="mt-2">{p.title}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
