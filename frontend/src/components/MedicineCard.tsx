import type { MedicineListItem } from "../types/medicine";
import { Link } from "react-router-dom";

interface Props {
  medicine: MedicineListItem;
}

export default function MedicineCard({ medicine }: Props) {
  return (
    <Link
      to={`/medicine/${medicine.id}`}
      className="block rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition hover:shadow-md hover:border-blue-300"
    >
      <div className="flex items-start justify-between gap-2">
        <h3 className="text-lg font-semibold text-gray-900 leading-snug">
          {medicine.name}
        </h3>
        <span
          className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs font-medium ${
            medicine.in_stock
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {medicine.in_stock ? "In Stock" : "Out"}
        </span>
      </div>

      <p className="mt-2 text-sm text-gray-500 line-clamp-2">
        {medicine.purpose}
      </p>

      <div className="mt-3 flex items-center justify-between">
        <span className="text-xl font-bold text-blue-600">
          ₹{Number(medicine.price).toFixed(2)}
        </span>
        <span className="text-xs bg-gray-100 text-gray-600 rounded-full px-2 py-0.5">
          {medicine.category_name}
        </span>
      </div>

      <div className="mt-2 flex items-center gap-2 text-xs text-gray-400">
        <span className="capitalize">{medicine.age_group}</span>
      </div>
    </Link>
  );
}
