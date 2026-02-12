import { motion } from "framer-motion";
import { ShoppingCart } from "lucide-react";
import { Product } from "@/data/products";
import { useCart } from "@/contexts/CartContext";
import { useRef } from "react";

interface ProductCardProps {
  product: Product;
  index: number;
  onProductClick: (product: Product) => void;
}

const rarityColors: Record<string, string> = {
  common: "bg-muted text-muted-foreground",
  rare: "bg-primary/20 text-primary",
  epic: "bg-neon-purple/20 text-neon-purple",
  legendary: "bg-neon-gold/20 text-neon-gold",
};

const rarityNames: Record<string, string> = {
  common: "عادي",
  rare: "نادر",
  epic: "ملحمي",
  legendary: "أسطوري",
};

const ProductCard = ({ product, index, onProductClick }: ProductCardProps) => {
  const { addToCart, setFlyingProduct } = useCart();
  const buttonRef = useRef<HTMLButtonElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (imageRef.current) {
      const rect = imageRef.current.getBoundingClientRect();
      setFlyingProduct({ product, startRect: rect });
    }
    addToCart(product);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.4 }}
      onClick={() => onProductClick(product)}
      className="group cursor-pointer rounded-2xl neon-border bg-card/60 backdrop-blur-sm overflow-hidden transition-all duration-300 hover:shadow-[0_0_30px_hsl(var(--primary)/0.2)]"
    >
      {/* Image */}
      <div className="relative aspect-square overflow-hidden">
        <img
          ref={imageRef}
          src={product.image}
          alt={product.nameAr}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent opacity-60" />

        {/* Rarity Badge */}
        <span className={`absolute top-3 right-3 rounded-lg px-2.5 py-1 text-[10px] font-bold ${rarityColors[product.rarity]}`}>
          {rarityNames[product.rarity]}
        </span>

        {/* Discount Badge */}
        {product.originalPrice && (
          <span className="absolute top-3 left-3 rounded-lg bg-destructive/90 px-2.5 py-1 text-[10px] font-bold text-destructive-foreground">
            -{Math.round((1 - product.price / product.originalPrice) * 100)}%
          </span>
        )}
      </div>

      {/* Info */}
      <div className="p-4" dir="rtl">
        <h3 className="font-bold text-foreground text-sm mb-1 truncate">{product.nameAr}</h3>
        <p className="text-xs text-muted-foreground mb-3">{product.categoryAr}</p>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-lg font-black text-primary">${product.price}</span>
            {product.originalPrice && (
              <span className="text-xs text-muted-foreground line-through">${product.originalPrice}</span>
            )}
          </div>
          <motion.button
            ref={buttonRef}
            onClick={handleAddToCart}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="rounded-xl gradient-primary p-2.5 text-primary-foreground shadow-[0_0_10px_hsl(var(--primary)/0.3)] transition-shadow hover:shadow-[0_0_20px_hsl(var(--primary)/0.5)]"
          >
            <ShoppingCart className="h-4 w-4" />
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;
