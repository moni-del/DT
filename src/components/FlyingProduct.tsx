import { motion } from "framer-motion";
import { useCart } from "@/contexts/CartContext";
import { useEffect, useState } from "react";

interface FlyingProductProps {
  cartIconRef: React.RefObject<HTMLButtonElement>;
}

const FlyingProduct = ({ cartIconRef }: FlyingProductProps) => {
  const { flyingProduct, setFlyingProduct } = useCart();
  const [targetRect, setTargetRect] = useState<DOMRect | null>(null);

  useEffect(() => {
    if (flyingProduct && cartIconRef.current) {
      setTargetRect(cartIconRef.current.getBoundingClientRect());
    }
  }, [flyingProduct, cartIconRef]);

  if (!flyingProduct || !targetRect) return null;

  const { product, startRect } = flyingProduct;

  return (
    <motion.div
      className="fixed z-[100] pointer-events-none"
      initial={{
        top: startRect.top,
        left: startRect.left,
        width: startRect.width,
        height: startRect.height,
        opacity: 1,
        borderRadius: 12,
      }}
      animate={{
        top: targetRect.top + targetRect.height / 2 - 15,
        left: targetRect.left + targetRect.width / 2 - 15,
        width: 30,
        height: 30,
        opacity: 0,
        borderRadius: 999,
      }}
      transition={{
        duration: 0.6,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
      onAnimationComplete={() => setFlyingProduct(null)}
    >
      <img
        src={product.image}
        alt=""
        className="h-full w-full rounded-xl object-cover shadow-[0_0_30px_hsl(var(--primary)/0.6)]"
      />
    </motion.div>
  );
};

export default FlyingProduct;
