import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Search, Plus, Edit, Trash2, Eye, ArrowUpDown, Check, X } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  category: string;
  stock: number;
  featured: boolean;
  image: string;
}

export default function ProductsManagement() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState<keyof Product>('name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [categories, setCategories] = useState<string[]>([]);
  const [deleteConfirmation, setDeleteConfirmation] = useState<string | null>(null);

  // Mock products data
  const mockProducts: Product[] = [
    {
      id: '1',
      name: 'Wireless Noise Cancelling Headphones',
      price: 299.99,
      originalPrice: 349.99,
      category: 'Electronics',
      stock: 50,
      featured: true,
      image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8cHJvZHVjdHxlbnwwfHwwfHx8MA%3D%3D'
    },
    {
      id: '2',
      name: 'Premium Cotton T-Shirt',
      price: 29.99,
      category: 'Clothing',
      stock: 100,
      featured: false,
      image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTR8fHRzaGlydHxlbnwwfHwwfHx8MA%3D%3D'
    },
    {
      id: '3',
      name: 'Smart Home Security Camera',
      price: 89.99,
      originalPrice: 119.99,
      category: 'Smart Home',
      stock: 30,
      featured: true,
      image: 'https://images.unsplash.com/photo-1565130838609-c3a86655db61?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8Y2FtZXJhfGVufDB8fDB8fHww'
    },
    {
      id: '4',
      name: 'Organic Skincare Gift Set',
      price: 49.99,
      category: 'Beauty',
      stock: 25,
      featured: false,
      image: 'https://images.unsplash.com/photo-1527947030665-8b6c8a586350?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTR8fHNraW5jYXJlfGVufDB8fDB8fHww'
    },
    {
      id: '5',
      name: 'Professional Chef Knife Set',
      price: 129.99,
      originalPrice: 159.99,
      category: 'Kitchen',
      stock: 15,
      featured: true,
      image: 'https://images.unsplash.com/photo-1593618998160-e34014e67546?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTR8fGtuaWZlJTIwc2V0fGVufDB8fDB8fHww'
    },
    {
      id: '6',
      name: 'Fitness Smart Watch',
      price: 159.99,
      originalPrice: 199.99,
      category: 'Electronics',
      stock: 40,
      featured: true,
      image: 'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MzR8fHdhdGNofGVufDB8fDB8fHww'
    },
    {
      id: '7',
      name: 'Ergonomic Office Chair',
      price: 249.99,
      category: 'Furniture',
      stock: 10,
      featured: false,
      image: 'https://images.unsplash.com/photo-1580480055273-228ff5388ef8?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NzV8fGNoYWlyfGVufDB8fDB8fHww'
    },
    {
      id: '8',
      name: 'Portable Bluetooth Speaker',
      price: 69.99,
      originalPrice: 89.99,
      category: 'Electronics',
      stock: 60,
      featured: true,
      image: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8c3BlYWtlcnxlbnwwfHwwfHx8MA%3D%3D'
    }
  ];

  useEffect(() => {
    // Check if user is admin
    if (!user || user.role !== 'admin') {
      navigate('/login');
      return;
    }

    // Simulate API call
    setTimeout(() => {
      setProducts(mockProducts);

      // Extract unique categories
      const uniqueCategories = [...new Set(mockProducts.map(product => product.category))];
      setCategories(uniqueCategories);

      setLoading(false);
    }, 500);
  }, [user, navigate]);

  // Handle sorting
  const handleSort = (field: keyof Product) => {
    if (field === sortField) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // Filter and sort products
  const filteredProducts = products
    .filter(product => {
      // Apply search filter
      if (searchTerm && !product.name.toLowerCase().includes(searchTerm.toLowerCase())) {
        return false;
      }

      // Apply category filter
      if (selectedCategory && product.category !== selectedCategory) {
        return false;
      }

      return true;
    })
    .sort((a, b) => {
      // Sort by selected field
      const aValue = a[sortField] ?? '';
      const bValue = b[sortField] ?? '';
      if (aValue < bValue) {
        return sortDirection === 'asc' ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortDirection === 'asc' ? 1 : -1;
      }
      return 0;
    });

  const handleDeleteConfirmation = (productId: string) => {
    setDeleteConfirmation(productId);
  };

  const handleDeleteProduct = (productId: string) => {
    // In a real app, this would call an API to delete the product
    setProducts(products.filter(product => product.id !== productId));
    setDeleteConfirmation(null);
  };

  const handleToggleFeatured = (productId: string) => {
    // In a real app, this would call an API to update the product
    setProducts(products.map(product => {
      if (product.id === productId) {
        return { ...product, featured: !product.featured };
      }
      return product;
    }));
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-24">
        <div className="animate-pulse">
          <div className="h-10 bg-slate-200 rounded w-1/4 mb-8"></div>
          <div className="h-12 bg-slate-200 rounded mb-6"></div>
          <div className="h-64 bg-slate-200 rounded mb-8"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-24">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Manage Products</h1>
        <Link to="/admin/products/new">
          <Button variant="primary">
            <Plus size={16} className="mr-2" /> Add New Product
          </Button>
        </Link>
      </div>

      {/* Search and filters */}
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search */}
          <div className="md:col-span-2">
            <div className="relative">
              <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
              <Input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Category filter */}
          <div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full h-10 rounded-md border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Categories</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          {/* Reset filters */}
          <div className="flex items-center">
            <Button
              variant="outline"
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('');
              }}
              className="ml-auto"
            >
              Reset Filters
            </Button>
          </div>
        </div>
      </div>

      {/* Products table */}
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden mb-8">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50">
              <tr>
                <th className="w-16 px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Image
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider cursor-pointer" onClick={() => handleSort('name')}>
                  <div className="flex items-center">
                    Product Name
                    <ArrowUpDown size={14} className="ml-2" />
                  </div>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider cursor-pointer" onClick={() => handleSort('category')}>
                  <div className="flex items-center">
                    Category
                    <ArrowUpDown size={14} className="ml-2" />
                  </div>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider cursor-pointer" onClick={() => handleSort('price')}>
                  <div className="flex items-center">
                    Price
                    <ArrowUpDown size={14} className="ml-2" />
                  </div>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider cursor-pointer" onClick={() => handleSort('stock')}>
                  <div className="flex items-center">
                    Stock
                    <ArrowUpDown size={14} className="ml-2" />
                  </div>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Featured
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filteredProducts.map((product) => (
                <tr key={product.id} className="hover:bg-slate-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="h-12 w-12 object-cover rounded-md"
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <p className="text-sm font-medium text-slate-900">{product.name}</p>
                    <p className="text-xs text-slate-500">ID: {product.id}</p>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                    {product.category}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <p className="text-sm font-medium text-slate-900">${product.price.toFixed(2)}</p>
                    {product.originalPrice && (
                      <p className="text-xs text-slate-500 line-through">${product.originalPrice.toFixed(2)}</p>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${
                      product.stock > 20
                        ? 'bg-emerald-100 text-emerald-800'
                        : product.stock > 5
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {product.stock} in stock
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={() => handleToggleFeatured(product.id)}
                      className={`inline-flex rounded-full p-1 ${
                        product.featured
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-slate-100 text-slate-800'
                      }`}
                    >
                      {product.featured ? <Check size={16} /> : <X size={16} />}
                    </button>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end space-x-2">
                      <Link to={`/products/${product.id}`}>
                        <button className="text-slate-500 hover:text-slate-700 p-1">
                          <Eye size={16} />
                        </button>
                      </Link>
                      <Link to={`/admin/products/edit/${product.id}`}>
                        <button className="text-blue-500 hover:text-blue-700 p-1">
                          <Edit size={16} />
                        </button>
                      </Link>
                      <button
                        className="text-red-500 hover:text-red-700 p-1"
                        onClick={() => handleDeleteConfirmation(product.id)}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>

                    {/* Delete confirmation popup */}
                    {deleteConfirmation === product.id && (
                      <div className="absolute right-0 mt-2 w-72 bg-white rounded-md shadow-lg border border-slate-200 p-4 z-10">
                        <p className="text-sm text-slate-600 mb-4">
                          Are you sure you want to delete <strong>{product.name}</strong>?
                        </p>
                        <div className="flex justify-end space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setDeleteConfirmation(null)}
                          >
                            Cancel
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleDeleteProduct(product.id)}
                          >
                            Delete
                          </Button>
                        </div>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-8">
            <p className="text-slate-500">No products found matching your criteria.</p>
          </div>
        )}
      </div>

      <div className="flex justify-between items-center">
        <p className="text-sm text-slate-500">
          Showing {filteredProducts.length} of {products.length} products
        </p>
      </div>
    </div>
  );
}
