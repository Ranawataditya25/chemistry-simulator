import { ChevronDown } from "lucide-react";

export default function Navbar() {
  return (
    <div className="w-full bg-gray-100 border-b border-gray-200 py-5 flex items-center justify-center gap-1">
      <span className="font-semibold text-black text-base tracking-tight">
        Zero Order Reaction
      </span>
      <ChevronDown size={16} className="text-gray-500 mt-0.5" />
    </div>
  );
}