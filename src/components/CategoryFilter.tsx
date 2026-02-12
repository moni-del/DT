import { categories } from "@/data/products";
import { motion } from "framer-motion";

interface CategoryFilterProps {
  selected: string;
  onSelect: (id: string) => void;
}

const CategoryFilter = ({ selected, onSelect }: CategoryFilterProps) => {
  return (
    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide" dir="rtl">
      {categories.map((cat) => (
        <motion.button
          key={cat.id}
          onClick={() => onSelect(cat.id)}
          whileTap={{ scale: 0.95 }}
          className={`shrink-0 rounded-xl px-5 py-2 text-sm font-semibold transition-all duration-300 ${
            selected === cat.id
              ? "gradient-primary text-primary-foreground shadow-[0_0_15px_hsl(var(--primary)/0.4)]"
              : "bg-muted/60 text-muted-foreground hover:bg-muted hover:text-foreground"
          }`}
        >
          {cat.nameAr}
        </motion.button>
      ))}
    </div>
  );
};

export default CategoryFilter;
