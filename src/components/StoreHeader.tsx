import { Search, ShoppingCart, LogOut } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { motion, AnimatePresence } from "framer-motion";

interface StoreHeaderProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onCartOpen: () => void;
  onLogout: () => void;
  cartIconRef: React.RefObject<HTMLButtonElement>;
}

const StoreHeader = ({ searchQuery, onSearchChange, onCartOpen, onLogout, cartIconRef }: StoreHeaderProps) => {
  const { totalItems } = useCart();

  return (
    <header className="sticky top-0 z-40 glass border-b border-border/50">
      <div className="container mx-auto flex items-center justify-between gap-4 px-4 py-3">
        {/* Logo */}
        <h1 className="font-orbitron text-xl font-black neon-text text-primary shrink-0 sm:text-2xl">
          DT_STORE
        </h1>

        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="ابحث عن منتج..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full rounded-xl bg-muted/60 border border-border/50 py-2.5 pr-10 pl-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/50 transition-all"
            dir="rtl"
          />
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <motion.button
            ref={cartIconRef}
            onClick={onCartOpen}
            whileTap={{ scale: 0.9 }}
            className="relative rounded-xl bg-muted/60 p-2.5 text-foreground transition-colors hover:bg-muted"
          >
            <ShoppingCart className="h-5 w-5" />
            <AnimatePresence>
              {totalItems > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  className="absolute -left-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full gradient-primary text-[10px] font-bold text-primary-foreground"
                >
                  {totalItems}
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>

          <button
            onClick={onLogout}
            className="rounded-xl bg-muted/60 p-2.5 text-muted-foreground transition-colors hover:bg-destructive/20 hover:text-destructive"
          >
            <LogOut className="h-5 w-5" />
          </button>
        </div>
      </div>
    </header>
  );
};

export default StoreHeader;
