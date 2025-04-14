import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingCart, Star } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { formatPrice } from '@/lib/utils';
import { useCart } from '@/context/CartContext';

interface Product {
  id: string;
  name: string;
  price: number;
  original_price?: number;
  image: string;
  category: string;
}

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCart();
  const [isHovered, setIsHovered] = useState(false);
  const discountPercentage = product.original_price
    ? Math.round(((product.original_price - product.price) / product.original_price) * 100)
    : 0;

  const handleAddToCart = () => {
    addItem({
      productId: product.id,
      name: product.name,
      price: product.price,
      quantity: 1,
      image: product.image
    });
  };

  return (
    <Card
      className="group overflow-hidden transition-all duration-300 h-full flex flex-col"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative pt-4 px-4">
        {product.original_price && (
          <span className="absolute top-6 left-6 bg-red-500 text-white text-xs font-medium px-2 py-1 rounded z-10">
            -{discountPercentage}%
          </span>
        )}
        <button
          className="absolute top-6 right-6 p-1.5 bg-white rounded-full shadow-sm z-10 opacity-0 group-hover:opacity-100 transition-opacity"
          aria-label="Add to favorites"
        >
          <Heart size={18} className="text-slate-400 hover:text-red-500 transition-colors" />
        </button>
        <Link to={`/products/${product.id}`} className="block relative overflow-hidden aspect-square rounded-md">
          <img
            src={`http://localhost:3001${product.image}`}
            alt={product.name}
            className={`object-cover w-full h-full transform transition-transform duration-500 ${isHovered ? 'scale-110' : 'scale-100'}`}
          />
        </Link>
      </div>

      <CardContent className="p-4 flex-grow flex flex-col justify-between">
        <div>
        <Link to={`/categories?category=${encodeURIComponent(product.category)}`}
            className="text-xs text-[#138db3] hover:underline mb-1 inline-block"
          >
            {product.category}
          </Link>
          <Link to={`/products/${product.id}`} className="block">
            <h3 className="font-medium text-slate-900 hover:text-[#138db3] transition-colors line-clamp-2 mb-1">
              {product.name}
            </h3>
          </Link>
          <div className="flex items-center mb-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                size={14}
                className={`${
                  i < Math.round(5.0)
                    ? 'text-yellow-400 fill-yellow-400'
                    : 'text-slate-300'
                }`}
              />
            ))}
            <span className="text-xs text-slate-500 ml-1">({5.0})</span>
          </div>
        </div>

        <div>
          <div className="flex items-center gap-2 mb-3">
            <span className="font-medium text-slate-900">{formatPrice(product.price)}</span>
            {product.original_price && (
              <span className="text-slate-400 text-sm line-through">
                {formatPrice(product.original_price)}
              </span>
            )}
          </div>

          <Button
            variant="primary"
            size="sm"
            className="w-full gap-2 bg-[#138db3] hover:bg-[#138db3]/90"
            onClick={handleAddToCart}
          >
            <ShoppingCart size={16} /> Add to Cart
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
