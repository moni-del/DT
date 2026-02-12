import { motion, AnimatePresence } from "framer-motion";
import { X, ShoppingCart, Star } from "lucide-react";
import { Product } from "@/data/products";
import { useCart } from "@/contexts/CartContext";
import { useRef } from "react";

interface ProductDetailProps {
  product: Product | null;
  onClose: () => void;
}

const rarityColors: Record<string, string> = {
  common: "text-muted-foreground",
  rare: "text-primary",
  epic: "text-neon-purple",
  legendary: "text-neon-gold",
};

const rarityNames: Record<string, string> = {
  common: "عادي",
  rare: "نادر",
  epic: "ملحمي",
  legendary: "أسطوري",
};

const ProductDetail = ({ product, onClose }: ProductDetailProps) => {
  const { addToCart, setFlyingProduct } = useCart();
  const imageRef = useRef<HTMLImageElement>(null);

  if (!product) return null;

  const handleAdd = () => {
    if (imageRef.current) {
      setFlyingProduct({ product, startRect: imageRef.current.getBoundingClientRect() });
    }
    addToCart(product);
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-md p-4"
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
          className="relative w-full max-w-lg rounded-2xl neon-border bg-card/90 backdrop-blur-xl overflow-hidden"
        >
          {/* Close */}
          <button onClick={onClose} className="absolute left-4 top-4 z-10 rounded-full bg-muted/80 p-2 text-foreground hover:bg-muted">
            <X className="h-4 w-4" />
          </button>

          {/* Image */}
          <div className="relative aspect-[4/3] overflow-hidden">
            <img ref={imageRef} src={product.image} alt={product.nameAr} className="h-full w-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent" />
          </div>

          {/* Content */}
          <div className="p-6" dir="rtl">
            <div className="flex items-start justify-between mb-2">
              <h2 className="font-orbitron text-xl font-bold text-foreground">{product.nameAr}</h2>
              <div className={`flex items-center gap-1 ${rarityColors[product.rarity]}`}>
                <Star className="h-4 w-4 fill-current" />
                <span className="text-xs font-bold">{rarityNames[product.rarity]}</span>
              </div>
            </div>

            <p className="text-xs text-muted-foreground mb-1">{product.categoryAr}</p>
            <p className="text-sm text-foreground/80 leading-relaxed mb-6">{product.description}</p>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-3xl font-black text-primary">${product.price}</span>
                {product.originalPrice && (
                  <span className="text-sm text-muted-foreground line-through">${product.originalPrice}</span>
                )}
              </div>
              <motion.button
                onClick={handleAdd}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-2 rounded-xl gradient-primary px-6 py-3 font-bold text-primary-foreground shadow-[0_0_15px_hsl(var(--primary)/0.4)]"
              >
                <ShoppingCart className="h-5 w-5" />
                <span>أضف للسلة</span>
              </motion.button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ProductDetail;
