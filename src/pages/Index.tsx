import { useState, useMemo, useRef, useEffect } from "react";
import SpaceBackground from "@/components/SpaceBackground";
import DiscordLogin from "@/components/DiscordLogin";
import StoreHeader from "@/components/StoreHeader";
import CategoryFilter from "@/components/CategoryFilter";
import ProductCard from "@/components/ProductCard";
import ProductDetail from "@/components/ProductDetail";
import CartDrawer from "@/components/CartDrawer";
import FlyingProduct from "@/components/FlyingProduct";
import MembershipCheck from "@/components/MembershipCheck";
import { CartProvider } from "@/contexts/CartContext";
import { products, Product } from "@/data/products";
import { discordService } from "@/services/discordService";
import { useDiscordVerification } from "@/hooks/useDiscordVerification";

type AppState = "login" | "store" | "membership_required";

const StoreContent = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [cartOpen, setCartOpen] = useState(false);
  const cartIconRef = useRef<HTMLButtonElement>(null!);

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchesSearch =
        p.nameAr.includes(searchQuery) ||
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.categoryAr.includes(searchQuery);
      const matchesCategory = selectedCategory === "all" || p.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory]);

  return (
    <>
      <StoreHeader
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onCartOpen={() => setCartOpen(true)}
        onLogout={() => {
          discordService.clearAuthData();
          window.location.reload();
        }}
        cartIconRef={cartIconRef}
      />

      <main className="relative z-10 container mx-auto px-4 py-6">
        <div className="mb-6">
          <CategoryFilter selected={selectedCategory} onSelect={setSelectedCategory} />
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredProducts.map((product, index) => (
            <ProductCard
              key={product.id}
              product={product}
              index={index}
              onProductClick={setSelectedProduct}
            />
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
            <p className="text-lg">لا توجد منتجات</p>
          </div>
        )}
      </main>

      <ProductDetail product={selectedProduct} onClose={() => setSelectedProduct(null)} />
      <CartDrawer isOpen={cartOpen} onClose={() => setCartOpen(false)} />
      <FlyingProduct cartIconRef={cartIconRef} />
    </>
  );
};

const Index = () => {
  const [appState, setAppState] = useState<AppState>("login");
  const [isLoading, setIsLoading] = useState(true);
  const { verifyMembership, isVerifying } = useDiscordVerification();

  useEffect(() => {
    // Check authentication status on component mount
    const checkAuthStatus = async () => {
      console.log('Checking auth status...');
      try {
        const storedData = discordService.getStoredAuthData();
        console.log('Stored data:', storedData);
        
        if (storedData.user) {
          // Verify user is still in the channel
          const result = await verifyMembership();
          
          if (result.isMember) {
            console.log('User is in channel, showing store');
            setAppState("store");
          } else if (result.needsRejoin) {
            console.log('User not in channel, showing membership required');
            setAppState("membership_required");
          } else {
            console.log('Verification failed, showing login');
            setAppState("login");
          }
        } else {
          console.log('No user data, showing login');
          setAppState("login");
        }
      } catch (error) {
        console.error('Error checking auth status:', error);
        setAppState("login");
      } finally {
        setIsLoading(false);
      }
    };

    checkAuthStatus();
  }, [verifyMembership]);

  const handleDiscordLogin = () => {
    // After successful login, go to store
    setAppState("store");
  };

  const handleRejoinRequired = () => {
    // User needs to rejoin, go back to login
    setAppState("login");
  };

  const handleRecheck = async () => {
    const result = await verifyMembership();
    if (result.isMember) {
      // User is back in the server, reload page
      window.location.reload();
    }
  };

  if (isLoading) {
    return (
      <div className="relative z-10 flex min-h-screen items-center justify-center px-4">
        <div className="glass neon-border rounded-2xl p-8 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">جاري التحميل...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative">
      <SpaceBackground />

      {appState === "login" && (
        <DiscordLogin onLogin={handleDiscordLogin} />
      )}

      {appState === "membership_required" && (
        <MembershipCheck 
          onRejoinRequired={handleRejoinRequired} 
          onRecheck={handleRecheck}
          isVerifying={isVerifying}
        />
      )}

      {appState === "store" && (
        <CartProvider>
          <StoreContent />
        </CartProvider>
      )}
    </div>
  );
};

export default Index;
