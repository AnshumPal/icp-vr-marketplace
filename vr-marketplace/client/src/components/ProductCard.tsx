import { Product } from "@shared/schema";
import { motion } from "framer-motion";

interface ProductCardProps {
  product: Product;
  onPreview: (product: Product) => void;
  onAddToWishlist: (productId: string) => void;
  onShare: (product: Product) => void;
}

export function ProductCard({ product, onPreview, onAddToWishlist, onShare }: ProductCardProps) {
  const getCategoryIcon = (category: string) => {
    const icons: Record<string, string> = {
      fantasy: "fas fa-magic",
      gaming: "fas fa-gamepad",
      science: "fas fa-rocket",
      art: "fas fa-palette",
      wellness: "fas fa-leaf",
      utility: "fas fa-briefcase",
    };
    return icons[category] || "fas fa-cube";
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      fantasy: "from-cyan/20 to-purple-500/20 border-cyan/30",
      gaming: "from-pink-500/20 to-cyan/20 border-pink-500/30",
      science: "from-green-400/20 to-cyan/20 border-green-400/30",
      art: "from-cyan/20 to-pink-500/20 border-cyan/30",
      wellness: "from-green-400/20 to-blue-500/20 border-green-400/30",
      utility: "from-pink-500/20 to-green-400/20 border-pink-500/30",
    };
    return colors[category] || "from-cyan/20 to-pink-500/20 border-cyan/30";
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="glass-morphism rounded-2xl overflow-hidden card-hover glow-border"
      data-testid={`card-product-${product.id}`}
    >
      <div className="relative">
        <img
          src={product.imageUrl}
          alt={product.name}
          className="w-full h-48 object-cover"
          data-testid={`img-product-${product.id}`}
        />
        <div className="absolute top-4 left-4">
          <span className={`category-badge px-2 py-1 rounded-full text-xs bg-gradient-to-r ${getCategoryColor(product.category)}`}>
            <i className={`${getCategoryIcon(product.category)} mr-1`}></i>
            {product.category.charAt(0).toUpperCase() + product.category.slice(1)}
          </span>
        </div>
        <div className="absolute top-4 right-4">
          {product.isBlockchainVerified && (
            <i
              className="fas fa-shield-alt blockchain-verified text-lg"
              title="Blockchain Verified"
              data-testid={`icon-verified-${product.id}`}
            ></i>
          )}
        </div>
      </div>
      <div className="p-6">
        <h3 className="text-lg font-mono font-semibold mb-2" data-testid={`text-title-${product.id}`}>
          {product.name}
        </h3>
        <p className="text-gray-400 text-sm mb-4 line-clamp-3" data-testid={`text-description-${product.id}`}>
          {product.description}
        </p>
        <div className="flex items-center justify-between mb-4">
          <div className="price-glow text-xl font-bold" data-testid={`text-price-${product.id}`}>
            ${product.price}
          </div>
          <div className="flex items-center text-sm text-gray-400">
            <i className="fas fa-star text-green-400 mr-1"></i>
            <span data-testid={`text-rating-${product.id}`}>{product.rating}</span>
          </div>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => onPreview(product)}
            className="flex-1 bg-gradient-to-r from-cyan to-green-400 text-black py-2 px-4 rounded-lg text-sm font-semibold hover:scale-105 transition-transform"
            data-testid={`button-preview-${product.id}`}
          >
            Preview
          </button>
          <button
            onClick={() => onAddToWishlist(product.id)}
            className="p-2 glass-morphism rounded-lg hover:bg-cyan/20 transition-colors"
            data-testid={`button-wishlist-${product.id}`}
          >
            <i className="fas fa-heart"></i>
          </button>
          <button
            onClick={() => onShare(product)}
            className="p-2 glass-morphism rounded-lg hover:bg-pink-500/20 transition-colors"
            data-testid={`button-share-${product.id}`}
          >
            <i className="fas fa-share"></i>
          </button>
        </div>
      </div>
    </motion.div>
  );
}
