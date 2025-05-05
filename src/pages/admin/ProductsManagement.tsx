import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Search, Plus, Edit, Trash2, Eye, ArrowUpDown, Check, X } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Toaster, toast } from 'sonner';

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

  

  useEffect(() => {
    // Check if user is admin
    if (!user || user.role !== 'admin') {
      navigate('/login');
      return;
    }

    const fetchProducts = async () => {
      try {
        const response = await fetch('http://localhost:3001/api/products');
        const data = await response.json();
        
        if (data.products && Array.isArray(data.products)) {
          const products: Product[] = data.products;
          setProducts(products);
          setCategories([...new Set(products.map(product => product.category))]);
        }
      } catch (error) {
        console.error('Error fetching products:', error);
        toast.error('Failed to fetch products');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
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

  const handleDeleteConfirmation = (product_id: string) => {
    setDeleteConfirmation(product_id);
  };

  const handleDeleteProduct = async (product_id: string) => {
    try {
      const response = await fetch(`http://localhost:3001/api/products/${product_id}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (response.ok) {
        setProducts(products.filter(product => product.id !== product_id));
        toast.success('Product deleted successfully');
      } else {
        toast.error('Failed to delete product');
      }
    } catch (error) {
      console.error('Error deleting product:', error);
      toast.error('Failed to delete product');
    } finally {
      setDeleteConfirmation(null);
    }
  };

  const handleToggleFeatured = async (product_id: string) => {
    try {
      const product = products.find(p => p.id === product_id);
      if (!product) return;

      const response = await fetch(`http://localhost:3001/api/products/${product_id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          ...product,
          featured: !product.featured
        }),
      });

      if (response.ok) {
        setProducts(products.map(p => 
          p.id === product_id ? { ...p, featured: !p.featured } : p
        ));
        toast.success('Product updated successfully');
      } else {
        toast.error('Failed to update product');
      }
    } catch (error) {
      console.error('Error updating product:', error);
      toast.error('Failed to update product');
    }
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
              title='category filter'
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
                      src={`http://localhost:3001${product.image}`}
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
                    <p className="text-sm font-medium text-slate-900">${product.price}</p>
                    {product.originalPrice && (
                      <p className="text-xs text-slate-500 line-through">${product.originalPrice}</p>
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
                        <Button variant="ghost" size="sm">
                          <Eye size={16} className="mr-2" />
                          View
                        </Button>
                      </Link>
                      <Link to={`/admin/products/edit/${product.id}`}>
                        <Button variant="ghost" size="sm">
                          <Edit size={16} className="mr-2" />
                          Edit
                        </Button>
                      </Link>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteConfirmation(product.id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 size={16} className="mr-2" />
                        Delete
                      </Button>
                    </div>

                    {/* Delete confirmation modal */}
                    {deleteConfirmation === product.id && (
                      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                        <div className="bg-white p-6 rounded-lg shadow-lg">
                          <h3 className="text-lg font-semibold mb-4">Confirm Delete</h3>
                          <p className="mb-4">Are you sure you want to delete this product?</p>
                          <div className="flex justify-end space-x-4">
                            <Button
                              variant="outline"
                              onClick={() => setDeleteConfirmation(null)}
                            >
                              Cancel
                            </Button>
                            <Button
                              variant="destructive"
                              onClick={() => handleDeleteProduct(product.id)}
                            >
                              Delete
                            </Button>
                          </div>
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
      <Toaster richColors />
    </div>
  );
}
