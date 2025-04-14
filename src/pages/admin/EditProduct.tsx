import { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Toaster, toast } from 'sonner';
import { ArrowLeft } from 'lucide-react';

interface Product {
  id: string;
  name: string;
  price: number;
  original_price?: number;
  category: string;
  stock: number;
  featured: boolean;
  image: string;
  description?: string;
}

interface FormDataState {
  id?: string;
  name?: string;
  price?: number;
  original_price?: number;
  category?: string;
  stock?: number;
  featured?: boolean;
  image?: string | File;
  description?: string;
}

export default function EditProduct() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [product, setProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState<FormDataState>({});
  const [uploading, setUploading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/login');
      return;
    }

    const fetchProduct = async () => {
      try {
        const response = await fetch(`http://localhost:3001/api/products/${id}`);
        const data = await response.json();
        
        if (data.product) {
          setProduct(data.product);
          setFormData(data.product);
        }
      } catch (error) {
        console.error('Error fetching product:', error);
        toast.error('Failed to fetch product details');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id, user, navigate]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? Number(value) : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const formDataToSend = new FormData();
      
      // Append all form data
      Object.entries(formData).forEach(([key, value]) => {
        if (value !== undefined) {
          if (key === 'image') {
            if (value instanceof File) {
              formDataToSend.append('image', value);
            } else if (typeof value === 'string') {
              formDataToSend.append('image', value);
            }
          } else if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
            formDataToSend.append(key, value.toString());
          }
        }
      });

      const response = await fetch(`http://localhost:3001/api/products/${id}`, {
        method: 'PUT',
        credentials: 'include',
        body: formDataToSend,
      });

      if (response.ok) {
        toast.success('Product updated successfully');
        setTimeout(() => {
          navigate('/admin/products');
        }, 2000);
      } else {
        const error = await response.json();
        toast.error(error.message || 'Failed to update product');
      }
    } catch (error) {
      console.error('Error updating product:', error);
      toast.error('Failed to update product');
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      // Update the form data with the new file
      setFormData(prev => ({
        ...prev,
        image: file
      }));

      // Show preview of the selected image
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          setImagePreview(e.target.result as string);
        }
      };
      reader.readAsDataURL(file);
      
      toast.success('Image selected successfully');
    } catch (error) {
      console.error('Error handling image:', error);
      toast.error('Failed to handle image');
    } finally {
      setUploading(false);
    }
  };

  // const getImageUrl = (imagePath: string | undefined) => {
  //   if (!imagePath) return '/images/placeholder.png';
  //   if (imagePath.startsWith('http')) return imagePath;
  //   return `http://localhost:3001${imagePath}`;
  // };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-24">
        <div className="animate-pulse">
          <div className="h-10 bg-slate-200 rounded w-1/4 mb-8"></div>
          <div className="h-64 bg-slate-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-24">
        <p className="text-center text-slate-500">Product not found</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-24">
      <Toaster richColors />
      
      <div className="mb-8">
        <Button
          variant="ghost"
          onClick={() => navigate('/admin/products')}
          className="mb-4"
        >
          <ArrowLeft size={16} className="mr-2" />
          Back to Products
        </Button>
        <h1 className="text-2xl font-bold text-slate-900">Edit Product</h1>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Product Name
            </label>
            <Input
              type="text"
              name="name"
              value={formData.name || ''}
              onChange={handleInputChange}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Category
            </label>
            <Input
              type="text"
              name="category"
              value={formData.category || ''}
              onChange={handleInputChange}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Price
            </label>
            <Input
              type="number"
              name="price"
              value={formData.price || ''}
              onChange={handleInputChange}
              required
              min="0"
              step="0.01"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Original Price
            </label>
            <Input
              type="number"
              name="original_price"
              value={formData.original_price || ''}
              onChange={handleInputChange}
              min="0"
              step="0.01"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Stock
            </label>
            <Input
              type="number"
              name="stock"
              value={formData.stock || ''}
              onChange={handleInputChange}
              required
              min="0"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Product Image
            </label>
            <div className="flex flex-col space-y-4">
              <div className="relative w-full h-48 rounded-lg overflow-hidden border border-slate-200">
                {imagePreview && (
                  <img
                    src={imagePreview}
                    alt="Product preview"
                    className="w-full h-full object-cover"
                  />
                )}
              </div>
              
              <div className="flex space-x-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                >
                  {uploading ? 'Uploading...' : 'Upload New Image'}
                </Button>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageUpload}
                  accept="image/*"
                  className="hidden"
                />
                <Input
                  type="text"
                  name="image"
                  value={typeof formData.image === 'string' ? formData.image : ''}
                  onChange={handleInputChange}
                  placeholder="Or enter image URL"
                  className="flex-1"
                />
              </div>
            </div>
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Description
            </label>
            <Input
              type="text"
              name="description"
              value={formData.description || ''}
              onChange={handleInputChange}
            />
          </div>

          <div className="md:col-span-2">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                name="featured"
                checked={formData.featured || false}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  featured: e.target.checked
                }))}
                className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm font-medium text-slate-700">
                Featured Product
              </span>
            </label>
          </div>
        </div>

        <div className="mt-8 flex justify-end space-x-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate('/admin/products')}
          >
            Cancel
          </Button>
          <Button type="submit">
            Save Changes
          </Button>
        </div>
      </form>
    </div>
  );
} 