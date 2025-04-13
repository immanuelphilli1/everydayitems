import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Upload, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/context/AuthContext';

interface ProductFormData {
  name: string;
  description: string;
  price: string;
  originalPrice: string;
  category: string;
  stock: string;
  featured: boolean;
}

export default function CreateProductPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [formData, setFormData] = useState<ProductFormData>({
    name: '',
    description: '',
    price: '',
    originalPrice: '',
    category: '',
    stock: '',
    featured: false,
  });

  // Redirect if not admin
  if (!user || user.role !== 'admin') {
    navigate('/login');
    return null;
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        setError('Image size should be less than 5MB');
        return;
      }
      if (!file.type.startsWith('image/')) {
        setError('Please select an image file');
        return;
      }
      setSelectedImage(file);
      setError('');
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setSelectedImage(null);
    setImagePreview('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!selectedImage) {
      setError('Please select an image');
      return;
    }

    setLoading(true);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('image', selectedImage);
      formDataToSend.append('name', formData.name);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('price', formData.price);
      formDataToSend.append('originalPrice', formData.originalPrice);
      formDataToSend.append('category', formData.category);
      formDataToSend.append('stock', formData.stock);
      formDataToSend.append('featured', formData.featured.toString());

      console.log("originalPrice", formData.originalPrice);

      const response = await fetch('http://localhost:3001/api/products', {
        method: 'POST',
        credentials: 'include',
        body: formDataToSend,
      });

      if (!response.ok) {
        throw new Error('Failed to create product');
      }

      navigate('/admin/products');
    } catch (err: any) {
      setError(err.message || 'Failed to create product');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-24">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center mb-8">
          <Button
            variant="ghost"
            onClick={() => navigate('/admin/products')}
            className="mr-4"
          >
            <ArrowLeft size={20} className="mr-2" />
            Back to Products
          </Button>
          <h1 className="text-2xl font-bold text-slate-900">Create New Product</h1>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-6">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg shadow-sm border border-slate-200">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-slate-700 mb-1">
                Product Name
              </label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="focus:ring-[#138db3] focus:border-[#138db3]"
              />
            </div>

            <div>
              <label htmlFor="category" className="block text-sm font-medium text-slate-700 mb-1">
                Category
              </label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
                className="w-full h-10 rounded-md border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#138db3] focus:border-[#138db3]"
              >
                <option value="">Select a category</option>
                <option value="Electronics">Electronics</option>
                <option value="Mobile">Mobile</option>
                <option value="Fashion">Fashion</option>
                <option value="Home">Home</option>
                <option value="Kitchen">Kitchen</option>
                <option value="Gaming">Gaming</option>
                <option value="Books">Books</option>
                <option value="Accessories">Accessories</option>
              </select>
            </div>

            <div>
              <label htmlFor="price" className="block text-sm font-medium text-slate-700 mb-1">
                Price
              </label>
              <Input
                id="price"
                name="price"
                type="number"
                step="0.01"
                min="0"
                value={formData.price}
                onChange={handleChange}
                required
                className="focus:ring-[#138db3] focus:border-[#138db3]"
              />
            </div>

            <div>
              <label htmlFor="originalPrice" className="block text-sm font-medium text-slate-700 mb-1">
                Original Price (Optional)
              </label>
              <Input
                id="originalPrice"
                name="originalPrice"
                type="number"
                step="0.01"
                min="0"
                value={formData.originalPrice}
                onChange={handleChange}
                className="focus:ring-[#138db3] focus:border-[#138db3]"
              />
            </div>

            <div>
              <label htmlFor="stock" className="block text-sm font-medium text-slate-700 mb-1">
                Stock
              </label>
              <Input
                id="stock"
                name="stock"
                type="number"
                min="0"
                value={formData.stock}
                onChange={handleChange}
                required
                className="focus:ring-[#138db3] focus:border-[#138db3]"
              />
            </div>
          </div>

          <div>
            <label htmlFor="image" className="block text-sm font-medium text-slate-700 mb-1">
              Product Image
            </label>
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-slate-200 border-dashed rounded-md">
              <div className="space-y-1 text-center">
                {imagePreview ? (
                  <div className="relative">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="mx-auto h-48 w-48 object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={removeImage}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ) : (
                  <>
                    <Upload className="mx-auto h-12 w-12 text-slate-400" />
                    <div className="flex text-sm text-slate-600">
                      <label
                        htmlFor="image"
                        className="relative cursor-pointer rounded-md font-medium text-[#138db3] hover:text-[#138db3]/80 focus-within:outline-none focus-within:ring-2 focus-within:ring-[#138db3] focus-within:ring-offset-2"
                      >
                        <span>Upload a file</span>
                        <input
                          id="image"
                          name="image"
                          type="file"
                          ref={fileInputRef}
                          className="sr-only"
                          accept="image/*"
                          onChange={handleImageChange}
                          required
                        />
                      </label>
                      <p className="pl-1">or drag and drop</p>
                    </div>
                    <p className="text-xs text-slate-500">PNG, JPG, GIF up to 5MB</p>
                  </>
                )}
              </div>
            </div>
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-slate-700 mb-1">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              rows={4}
              className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#138db3] focus:border-[#138db3]"
            />
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="featured"
              name="featured"
              checked={formData.featured}
              onChange={handleChange}
              className="h-4 w-4 rounded border-slate-300 text-[#138db3] focus:ring-[#138db3]"
            />
            <label htmlFor="featured" className="ml-2 text-sm text-slate-700">
              Featured Product
            </label>
          </div>

          <div className="flex justify-end space-x-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate('/admin/products')}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              disabled={loading}
            >
              {loading ? 'Creating...' : 'Create Product'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
} 