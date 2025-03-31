-- Insert sample users
-- Default password is 'password123' (hashed with bcrypt)
INSERT INTO users (name, email, password, role) VALUES
('Admin User', 'admin@example.com', '$2b$10$mLPTyzCZBXc9vP2W0Xg.8.CzhbsFYN5xRx1Vq2P3wz0tIKMiVHKIS', 'admin'),
('John Doe', 'john@example.com', '$2b$10$mLPTyzCZBXc9vP2W0Xg.8.CzhbsFYN5xRx1Vq2P3wz0tIKMiVHKIS', 'user'),
('Jane Smith', 'jane@example.com', '$2b$10$mLPTyzCZBXc9vP2W0Xg.8.CzhbsFYN5xRx1Vq2P3wz0tIKMiVHKIS', 'user');

-- Insert sample products
INSERT INTO products (name, description, price, original_price, image, category, stock, featured, rating) VALUES
('Wireless Noise Cancelling Headphones', 'Premium noise cancelling headphones with 30-hour battery life and superior sound quality.', 299.99, 349.99, 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8cHJvZHVjdHxlbnwwfHwwfHx8MA%3D%3D', 'Electronics', 50, TRUE, 4.5),

('Premium Cotton T-Shirt', 'Sustainable fashion t-shirt made from 100% organic cotton. Comfortable and stylish for everyday wear.', 29.99, NULL, 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTR8fHRzaGlydHxlbnwwfHwwfHx8MA%3D%3D', 'Clothing', 100, FALSE, 4.2),

('Smart Home Security Camera', 'HD security camera with motion detection, night vision, and smartphone alerts. Easy to install and use.', 89.99, 119.99, 'https://images.unsplash.com/photo-1565130838609-c3a86655db61?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8Y2FtZXJhfGVufDB8fDB8fHww', 'Smart Home', 30, TRUE, 4.0),

('Organic Skincare Gift Set', 'All-natural skincare collection featuring facial cleanser, toner, and moisturizer. Made with organic ingredients.', 49.99, NULL, 'https://images.unsplash.com/photo-1527947030665-8b6c8a586350?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTR8fHNraW5jYXJlfGVufDB8fDB8fHww', 'Beauty', 25, FALSE, 4.7),

('Professional Chef Knife Set', '5-piece premium kitchen knife set with ergonomic handles and sharp stainless steel blades. Perfect for professional and home cooks.', 129.99, 159.99, 'https://images.unsplash.com/photo-1593618998160-e34014e67546?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTR8fGtuaWZlJTIwc2V0fGVufDB8fDB8fHww', 'Kitchen', 15, TRUE, 4.8),

('Fitness Smart Watch', 'Advanced smartwatch with heart rate monitor, GPS, fitness tracking, and smartphone notifications. Water-resistant design.', 159.99, 199.99, 'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MzR8fHdhdGNofGVufDB8fDB8fHww', 'Electronics', 40, TRUE, 4.3),

('Ergonomic Office Chair', 'Ultra comfortable office chair with adjustable lumbar support, height, and armrests. Breathable mesh design for all-day comfort.', 249.99, NULL, 'https://images.unsplash.com/photo-1580480055273-228ff5388ef8?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NzV8fGNoYWlyfGVufDB8fDB8fHww', 'Furniture', 10, FALSE, 4.6),

('Portable Bluetooth Speaker', 'Waterproof Bluetooth speaker with 24-hour battery life, impressive sound quality, and durable design. Perfect for outdoor adventures.', 69.99, 89.99, 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8c3BlYWtlcnxlbnwwfHwwfHx8MA%3D%3D', 'Electronics', 60, TRUE, 4.1),

('Wireless Gaming Mouse', 'Premium gaming mouse with programmable buttons, RGB lighting, and high precision sensor. Wireless design with minimal lag.', 79.99, 99.99, 'https://images.unsplash.com/photo-1605773527852-c546a8584ea3?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MzF8fG1vdXNlfGVufDB8fDB8fHww', 'Electronics', 35, FALSE, 4.4),

('Designer Leather Wallet', 'Handcrafted genuine leather wallet with multiple card slots and secure coin pocket. Elegant design for the modern man.', 39.99, NULL, 'https://images.unsplash.com/photo-1627123424574-724758594e93?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8d2FsbGV0fGVufDB8fDB8fHww', 'Accessories', 50, FALSE, 4.3),

('Stainless Steel Water Bottle', 'Double-walled insulated water bottle that keeps drinks cold for 24 hours or hot for 12 hours. Environmentally friendly and durable.', 24.99, 29.99, 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fHdhdGVyJTIwYm90dGxlfGVufDB8fDB8fHww', 'Kitchen', 75, FALSE, 4.7),

('Ceramic Coffee Mug Set', 'Set of four handcrafted ceramic coffee mugs. Microwave and dishwasher safe with elegant minimalist design.', 34.99, NULL, 'https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8Y29mZmVlJTIwbXVnfGVufDB8fDB8fHww', 'Kitchen', 20, FALSE, 4.9);

-- Insert sample cart items
INSERT INTO cart_items (user_id, product_id, quantity) VALUES
(2, 1, 1),
(2, 5, 2),
(3, 3, 1),
(3, 8, 1);

-- Insert sample orders
INSERT INTO orders (user_id, shipping_address, payment_method, total_price, shipping_price, tax_price, status, is_paid, paid_at) VALUES
(2, '{"address": "123 Main St", "city": "New York", "postalCode": "10001", "country": "USA"}', 'PayPal', 389.98, 0.00, 31.20, 'delivered', TRUE, NOW() - INTERVAL '30 days'),
(3, '{"address": "456 Oak Ave", "city": "San Francisco", "postalCode": "94107", "country": "USA"}', 'Credit Card', 159.98, 5.99, 12.80, 'shipped', TRUE, NOW() - INTERVAL '7 days');

-- Insert sample order items
INSERT INTO order_items (order_id, product_id, name, quantity, price, image) VALUES
(1, 1, 'Wireless Noise Cancelling Headphones', 1, 299.99, 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8cHJvZHVjdHxlbnwwfHwwfHx8MA%3D%3D'),
(1, 5, 'Professional Chef Knife Set', 1, 129.99, 'https://images.unsplash.com/photo-1593618998160-e34014e67546?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTR8fGtuaWZlJTIwc2V0fGVufDB8fDB8fHww'),
(2, 8, 'Portable Bluetooth Speaker', 1, 69.99, 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8c3BlYWtlcnxlbnwwfHwwfHx8MA%3D%3D'),
(2, 10, 'Designer Leather Wallet', 1, 39.99, 'https://images.unsplash.com/photo-1627123424574-724758594e93?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8d2FsbGV0fGVufDB8fDB8fHww'),
(2, 11, 'Stainless Steel Water Bottle', 2, 24.99, 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fHdhdGVyJTIwYm90dGxlfGVufDB8fDB8fHww');
