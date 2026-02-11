import { motion, AnimatePresence } from "framer-motion";
import { X, Minus, Plus, Trash2, Tag, CreditCard, ArrowLeft, ShoppingBag, Sparkles, Package } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { useState } from "react";

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

const CartDrawer = ({ isOpen, onClose }: CartDrawerProps) => {
  const { items, removeFromCart, updateQuantity, totalPrice, discount, applyDiscount, discountCode, clearCart, totalItems } = useCart();
  const [codeInput, setCodeInput] = useState("");
  const [codeError, setCodeError] = useState(false);
  const [codeSuccess, setCodeSuccess] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<string | null>(null);
  const [removingId, setRemovingId] = useState<string | null>(null);

  const handleApplyCode = () => {
    const success = applyDiscount(codeInput);
    if (success) {
      setCodeSuccess(true);
      setTimeout(() => setCodeSuccess(false), 2000);
    } else {
      setCodeError(true);
      setTimeout(() => setCodeError(false), 2000);
    }
    setCodeInput("");
  };

  const handleRemove = (id: string) => {
    setRemovingId(id);
    setTimeout(() => {
      removeFromCart(id);
      setRemovingId(null);
    }, 300);
  };

  const subtotal = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  const paymentMethods = [
    { id: "paypal", name: "PayPal", icon: "💳" },
    { id: "visa", name: "Visa / MasterCard", icon: "💎" },
    { id: "apple", name: "Apple Pay", icon: "🍎" },
    { id: "google", name: "Google Pay", icon: "🔷" },
    { id: "crypto", name: "Crypto", icon: "₿" },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-background/70 backdrop-blur-md"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 280 }}
            className="fixed right-0 top-0 z-50 h-full w-full max-w-[420px] flex flex-col overflow-hidden"
            dir="rtl"
          >
            {/* Glass background */}
            <div className="absolute inset-0 bg-card/90 backdrop-blur-2xl" />
            <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-secondary/5" />
            <div className="absolute left-0 top-0 bottom-0 w-px bg-gradient-to-b from-primary/50 via-primary/20 to-secondary/50" />

            {/* Content wrapper */}
            <div className="relative flex flex-col h-full">
              {/* Header */}
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="flex items-center justify-between p-5 border-b border-border/30"
              >
                <div className="flex items-center gap-3">
                  <motion.div
                    animate={{ rotate: [0, -10, 10, 0] }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                  >
                    {showCheckout ? (
                      <CreditCard className="h-5 w-5 text-primary" />
                    ) : (
                      <ShoppingBag className="h-5 w-5 text-primary" />
                    )}
                  </motion.div>
                  <div>
                    <h2 className="font-orbitron text-base font-bold text-foreground">
                      {showCheckout ? "إتمام الشراء" : "سلة التسوق"}
                    </h2>
                    {!showCheckout && totalItems > 0 && (
                      <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-xs text-muted-foreground"
                      >
                        {totalItems} منتج
                      </motion.p>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {!showCheckout && items.length > 0 && (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={clearCart}
                      className="rounded-xl bg-destructive/10 px-3 py-1.5 text-xs font-semibold text-destructive hover:bg-destructive/20 transition-colors"
                    >
                      مسح الكل
                    </motion.button>
                  )}
                  <motion.button
                    whileHover={{ scale: 1.1, rotate: 90 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => showCheckout ? setShowCheckout(false) : onClose()}
                    className="rounded-full bg-muted/60 p-2.5 text-foreground hover:bg-muted transition-colors"
                  >
                    {showCheckout ? <ArrowLeft className="h-4 w-4" /> : <X className="h-4 w-4" />}
                  </motion.button>
                </div>
              </motion.div>

              <AnimatePresence mode="wait">
                {!showCheckout ? (
                  <motion.div
                    key="cart"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="flex flex-col flex-1 min-h-0"
                  >
                    {/* Items */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-3">
                      {items.length === 0 ? (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="flex flex-col h-full items-center justify-center gap-4 text-muted-foreground"
                        >
                          <motion.div
                            animate={{ y: [0, -8, 0] }}
                            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                          >
                            <Package className="h-16 w-16 text-muted-foreground/30" />
                          </motion.div>
                          <p className="text-base font-semibold">السلة فارغة</p>
                          <p className="text-sm text-muted-foreground/60">أضف بعض المنتجات للبدء!</p>
                        </motion.div>
                      ) : (
                        <AnimatePresence>
                          {items.map((item, index) => (
                            <motion.div
                              key={item.product.id}
                              layout
                              initial={{ opacity: 0, x: 30, scale: 0.9 }}
                              animate={{
                                opacity: removingId === item.product.id ? 0 : 1,
                                x: removingId === item.product.id ? -100 : 0,
                                scale: removingId === item.product.id ? 0.8 : 1,
                              }}
                              exit={{ opacity: 0, x: -100, scale: 0.8 }}
                              transition={{ delay: index * 0.05, duration: 0.3 }}
                              className="group relative flex gap-3 rounded-2xl bg-muted/30 p-3 border border-border/20 hover:border-primary/30 hover:bg-muted/50 transition-all duration-300"
                            >
                              {/* Product image */}
                              <motion.div
                                whileHover={{ scale: 1.05 }}
                                className="relative h-20 w-20 rounded-xl overflow-hidden flex-shrink-0"
                              >
                                <img
                                  src={item.product.image}
                                  alt={item.product.nameAr}
                                  className="h-full w-full object-cover"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-background/40 to-transparent" />
                              </motion.div>

                              {/* Info */}
                              <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
                                <div>
                                  <h4 className="text-sm font-bold text-foreground truncate">{item.product.nameAr}</h4>
                                  <p className="text-xs text-muted-foreground mt-0.5">{item.product.categoryAr}</p>
                                </div>
                                <div className="flex items-center justify-between mt-2">
                                  {/* Quantity controls */}
                                  <div className="flex items-center gap-1 bg-muted/60 rounded-xl p-0.5">
                                    <motion.button
                                      whileHover={{ scale: 1.15 }}
                                      whileTap={{ scale: 0.85 }}
                                      onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                                      className="rounded-lg bg-background/60 p-1.5 text-foreground hover:bg-primary/20 hover:text-primary transition-colors"
                                    >
                                      <Minus className="h-3 w-3" />
                                    </motion.button>
                                    <motion.span
                                      key={item.quantity}
                                      initial={{ scale: 1.3 }}
                                      animate={{ scale: 1 }}
                                      className="text-sm font-bold text-foreground w-7 text-center"
                                    >
                                      {item.quantity}
                                    </motion.span>
                                    <motion.button
                                      whileHover={{ scale: 1.15 }}
                                      whileTap={{ scale: 0.85 }}
                                      onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                                      className="rounded-lg bg-background/60 p-1.5 text-foreground hover:bg-primary/20 hover:text-primary transition-colors"
                                    >
                                      <Plus className="h-3 w-3" />
                                    </motion.button>
                                  </div>
                                  {/* Price */}
                                  <motion.p
                                    key={item.product.price * item.quantity}
                                    initial={{ scale: 1.2 }}
                                    animate={{ scale: 1 }}
                                    className="text-sm font-black text-primary"
                                  >
                                    ${(item.product.price * item.quantity).toFixed(2)}
                                  </motion.p>
                                </div>
                              </div>

                              {/* Delete button */}
                              <motion.button
                                whileHover={{ scale: 1.15 }}
                                whileTap={{ scale: 0.85 }}
                                onClick={() => handleRemove(item.product.id)}
                                className="absolute -top-1.5 -left-1.5 rounded-full bg-destructive/90 p-1.5 text-destructive-foreground opacity-0 group-hover:opacity-100 transition-all duration-200 shadow-lg shadow-destructive/30"
                              >
                                <Trash2 className="h-3 w-3" />
                              </motion.button>
                            </motion.div>
                          ))}
                        </AnimatePresence>
                      )}
                    </div>

                    {/* Footer */}
                    {items.length > 0 && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="border-t border-border/30 p-4 space-y-3 bg-card/50"
                      >
                        {/* Discount Code */}
                        <div className="flex gap-2">
                          <div className="relative flex-1">
                            <Tag className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                            <input
                              type="text"
                              placeholder="كود الخصم"
                              value={codeInput}
                              onChange={(e) => setCodeInput(e.target.value)}
                              onKeyDown={(e) => e.key === "Enter" && handleApplyCode()}
                              className={`w-full rounded-xl bg-muted/40 border py-2.5 pr-10 pl-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 transition-all duration-300 ${
                                codeError
                                  ? "border-destructive focus:ring-destructive/50 animate-[shake_0.3s_ease-in-out]"
                                  : codeSuccess
                                  ? "border-green-500 focus:ring-green-500/50"
                                  : "border-border/30 focus:ring-primary/30"
                              }`}
                            />
                          </div>
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={handleApplyCode}
                            className="rounded-xl gradient-primary px-5 text-sm font-bold text-primary-foreground shadow-lg shadow-primary/20"
                          >
                            تطبيق
                          </motion.button>
                        </div>

                        {discountCode && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            className="flex items-center gap-2 rounded-xl bg-accent/10 border border-accent/30 px-3 py-2"
                          >
                            <Sparkles className="h-4 w-4 text-accent" />
                            <p className="text-xs font-semibold text-accent">تم تطبيق كود {discountCode} — خصم {discount}%</p>
                          </motion.div>
                        )}
                        {codeError && (
                          <motion.p
                            initial={{ opacity: 0, x: 10 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="text-xs text-destructive font-semibold"
                          >
                            ❌ كود خاطئ! حاول مرة أخرى
                          </motion.p>
                        )}

                        {/* Price breakdown */}
                        <div className="space-y-2 pt-2">
                          <div className="flex justify-between text-sm text-muted-foreground">
                            <span>المجموع الفرعي</span>
                            <span>${subtotal.toFixed(2)}</span>
                          </div>
                          {discount > 0 && (
                            <motion.div
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              className="flex justify-between text-sm"
                            >
                              <span className="text-accent">الخصم ({discount}%)</span>
                              <span className="text-accent font-bold">-${(subtotal * discount / 100).toFixed(2)}</span>
                            </motion.div>
                          )}
                          <div className="h-px bg-gradient-to-l from-transparent via-border to-transparent" />
                          <div className="flex justify-between items-baseline">
                            <span className="text-base font-bold text-foreground">الإجمالي</span>
                            <motion.span
                              key={totalPrice}
                              initial={{ scale: 1.2 }}
                              animate={{ scale: 1 }}
                              className="text-2xl font-black text-primary neon-text"
                            >
                              ${totalPrice.toFixed(2)}
                            </motion.span>
                          </div>
                        </div>

                        {/* Checkout button */}
                        <motion.button
                          whileHover={{ scale: 1.02, boxShadow: "0 0 30px hsl(200 100% 50% / 0.4)" }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => setShowCheckout(true)}
                          className="w-full rounded-2xl gradient-primary py-3.5 font-bold text-primary-foreground shadow-lg shadow-primary/30 flex items-center justify-center gap-2"
                        >
                          <CreditCard className="h-4 w-4" />
                          إتمام الشراء
                        </motion.button>
                      </motion.div>
                    )}
                  </motion.div>
                ) : (
                  /* Checkout view */
                  <motion.div
                    key="checkout"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="flex-1 flex flex-col min-h-0"
                  >
                    <div className="flex-1 overflow-y-auto p-5 space-y-4">
                      <p className="text-sm text-muted-foreground">اختر طريقة الدفع المفضلة</p>
                      <div className="space-y-2.5">
                        {paymentMethods.map((method, index) => (
                          <motion.button
                            key={method.id}
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.08 }}
                            whileHover={{ scale: 1.02, x: -4 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => setSelectedPayment(method.id)}
                            className={`w-full flex items-center gap-4 rounded-2xl border p-4 text-foreground transition-all duration-300 ${
                              selectedPayment === method.id
                                ? "border-primary/60 bg-primary/10 shadow-lg shadow-primary/10 neon-border"
                                : "border-border/30 bg-muted/30 hover:bg-muted/50 hover:border-border/50"
                            }`}
                          >
                            <span className="text-2xl">{method.icon}</span>
                            <span className="font-semibold">{method.name}</span>
                            {selectedPayment === method.id && (
                              <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                className="mr-auto h-5 w-5 rounded-full gradient-primary flex items-center justify-center"
                              >
                                <span className="text-xs text-primary-foreground">✓</span>
                              </motion.div>
                            )}
                          </motion.button>
                        ))}
                      </div>
                    </div>

                    {/* Checkout footer */}
                    <div className="border-t border-border/30 p-5 space-y-4 bg-card/50">
                      {/* Order summary */}
                      <div className="rounded-2xl bg-muted/30 p-3 space-y-2">
                        {items.map((item) => (
                          <div key={item.product.id} className="flex justify-between text-xs text-muted-foreground">
                            <span>{item.product.nameAr} × {item.quantity}</span>
                            <span>${(item.product.price * item.quantity).toFixed(2)}</span>
                          </div>
                        ))}
                        {discount > 0 && (
                          <div className="flex justify-between text-xs text-accent">
                            <span>الخصم</span>
                            <span>-{discount}%</span>
                          </div>
                        )}
                      </div>

                      <div className="flex justify-between items-baseline">
                        <span className="text-base font-bold text-foreground">الإجمالي</span>
                        <span className="text-2xl font-black text-primary neon-text">${totalPrice.toFixed(2)}</span>
                      </div>

                      <motion.button
                        whileHover={{ scale: 1.02, boxShadow: "0 0 30px hsl(200 100% 50% / 0.4)" }}
                        whileTap={{ scale: 0.98 }}
                        disabled={!selectedPayment}
                        className={`w-full rounded-2xl py-3.5 font-bold flex items-center justify-center gap-2 transition-all duration-300 ${
                          selectedPayment
                            ? "gradient-primary text-primary-foreground shadow-lg shadow-primary/30"
                            : "bg-muted text-muted-foreground cursor-not-allowed"
                        }`}
                      >
                        <CreditCard className="h-4 w-4" />
                        ادفع الآن
                      </motion.button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CartDrawer;
