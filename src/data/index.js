const img = (n) => `/images/saree${n}.png`;

export const categories = [
  { id: 1, name: 'Silk Sarees', slug: 'silk-sarees', image: img(1), count: 45 },
  { id: 2, name: 'Cotton Sarees', slug: 'cotton-sarees', image: img(3), count: 38 },
  { id: 3, name: 'Designer Sarees', slug: 'designer-sarees', image: img(4), count: 30 },
  { id: 4, name: 'Wedding Sarees', slug: 'wedding-sarees', image: img(5), count: 52 },
  { id: 5, name: 'Party Wear', slug: 'party-wear', image: img(7), count: 27 },
  { id: 6, name: 'Handloom', slug: 'handloom', image: img(6), count: 33 },
  { id: 7, name: 'Banarasi', slug: 'banarasi', image: img(2), count: 20 },
  { id: 8, name: 'Kanjivaram', slug: 'kanjivaram', image: img(8), count: 25 },
];

export const shops = [
  { id: 1, name: 'Lakshmi Silks', owner: 'Lakshmi Devi', location: 'Chennai, TN', logo: 'https://ui-avatars.com/api/?name=Lakshmi+Silks&background=7B1E3A&color=fff&size=128', products: 45, rating: 4.8, status: 'approved' },
  { id: 2, name: 'Royal Weaves', owner: 'Rajesh Kumar', location: 'Varanasi, UP', logo: 'https://ui-avatars.com/api/?name=Royal+Weaves&background=D4AF37&color=4A2C2A&size=128', products: 38, rating: 4.6, status: 'approved' },
  { id: 3, name: 'Meena Boutique', owner: 'Meena Sharma', location: 'Jaipur, RJ', logo: 'https://ui-avatars.com/api/?name=Meena+Boutique&background=7B1E3A&color=fff&size=128', products: 30, rating: 4.7, status: 'approved' },
  { id: 4, name: 'Pattu Palace', owner: 'Srinivas Rao', location: 'Hyderabad, TS', logo: 'https://ui-avatars.com/api/?name=Pattu+Palace&background=D4AF37&color=4A2C2A&size=128', products: 52, rating: 4.9, status: 'approved' },
  { id: 5, name: 'Handloom Hub', owner: 'Anita Patel', location: 'Ahmedabad, GJ', logo: 'https://ui-avatars.com/api/?name=Handloom+Hub&background=7B1E3A&color=fff&size=128', products: 27, rating: 4.5, status: 'approved' },
  { id: 6, name: 'Silk Symphony', owner: 'Priya Nair', location: 'Kochi, KL', logo: 'https://ui-avatars.com/api/?name=Silk+Symphony&background=D4AF37&color=4A2C2A&size=128', products: 33, rating: 4.7, status: 'approved' },
  { id: 7, name: 'Zari Creations', owner: 'Fatima Begum', location: 'Lucknow, UP', logo: 'https://ui-avatars.com/api/?name=Zari+Creations&background=7B1E3A&color=fff&size=128', products: 20, rating: 4.4, status: 'pending' },
  { id: 8, name: 'Woven Wonders', owner: 'Kavita Singh', location: 'Bhopal, MP', logo: 'https://ui-avatars.com/api/?name=Woven+Wonders&background=D4AF37&color=4A2C2A&size=128', products: 15, rating: 4.3, status: 'pending' },
  { id: 9, name: 'Kanchi Collections', owner: 'Sundari M', location: 'Kanchipuram, TN', logo: 'https://ui-avatars.com/api/?name=Kanchi+Collections&background=7B1E3A&color=fff&size=128', products: 40, rating: 4.8, status: 'approved' },
  { id: 10, name: 'Desi Drapes', owner: 'Ritu Agarwal', location: 'Kolkata, WB', logo: 'https://ui-avatars.com/api/?name=Desi+Drapes&background=D4AF37&color=4A2C2A&size=128', products: 22, rating: 4.6, status: 'approved' },
];

export const testimonials = [
  { id: 1, name: 'Ananya Reddy', image: 'https://ui-avatars.com/api/?name=Ananya+Reddy&background=7B1E3A&color=fff&size=128&rounded=true', review: 'Absolutely stunning collection! The Kanjivaram saree I ordered was exactly as shown. The quality and zari work were magnificent.', rating: 5 },
  { id: 2, name: 'Preethi Menon', image: 'https://ui-avatars.com/api/?name=Preethi+Menon&background=D4AF37&color=4A2C2A&size=128&rounded=true', review: 'SareeVault made shopping for my wedding sarees so easy. Trusted shopkeepers and genuine silk sarees delivered right to my doorstep.', rating: 5 },
  { id: 3, name: 'Divya Gupta', image: 'https://ui-avatars.com/api/?name=Divya+Gupta&background=7B1E3A&color=fff&size=128&rounded=true', review: 'I love the variety here. Found the perfect Banarasi saree for my sister\'s reception. Fast delivery and beautiful packaging.', rating: 4 },
  { id: 4, name: 'Sneha Iyer', image: 'https://ui-avatars.com/api/?name=Sneha+Iyer&background=D4AF37&color=4A2C2A&size=128&rounded=true', review: 'As a shopkeeper on this platform, I have seen amazing growth. The admin support and marketplace visibility are excellent!', rating: 5 },
  { id: 5, name: 'Kavya Pillai', image: 'https://ui-avatars.com/api/?name=Kavya+Pillai&background=7B1E3A&color=fff&size=128&rounded=true', review: 'The handloom sarees are authentic and directly from weavers. Love how this platform supports artisan communities.', rating: 4 },
  { id: 6, name: 'Meera Joshi', image: 'https://ui-avatars.com/api/?name=Meera+Joshi&background=D4AF37&color=4A2C2A&size=128&rounded=true', review: 'Best saree shopping experience online! The filter options make it so easy to find exactly what you want.', rating: 5 },
];

export const festivalBanners = [
  { id: 1, title: 'Wedding Collection', subtitle: 'Bridal sarees that make your special day unforgettable', image: img(5), color: '#7B1E3A' },
  { id: 2, title: 'Pongal Collection', subtitle: 'Celebrate harvest with vibrant traditional silk sarees', image: img(1), color: '#D4AF37' },
  { id: 3, title: 'Diwali Collection', subtitle: 'Light up the festival with dazzling designer sarees', image: img(4), color: '#4A2C2A' },
  { id: 4, title: 'Bridal Collection', subtitle: 'Exquisite sarees for the most beautiful bride', image: img(2), color: '#7B1E3A' },
];

const sareeImages = [img(1), img(2), img(3), img(4), img(5), img(6), img(7), img(8)];

const names = [
  'Royal Kanjivaram Silk Saree', 'Banarasi Brocade Saree', 'Pure Cotton Handloom Saree',
  'Designer Georgette Saree', 'Wedding Special Pattu Saree', 'Party Wear Chiffon Saree',
  'Traditional Pochampally Ikat', 'Mysore Silk Crepe Saree', 'Chanderi Silk Saree',
  'Bhagalpuri Tussar Saree', 'Sambalpuri Ikat Cotton', 'Paithani Silk Saree',
  'Bandhani Georgette Saree', 'Kasavu Kerala Saree', 'Jamdani Muslin Saree',
  'Uppada Silk Saree', 'Gadwal Silk Cotton Saree', 'Tant Cotton Bengal Saree',
  'Bomkai Silk Saree', 'Muga Silk Assam Saree', 'Venkatagiri Cotton Saree',
  'Ilkal Silk Saree', 'Narayanpet Cotton Saree', 'Maheshwari Silk Saree',
  'Lucknowi Chikan Saree', 'Kota Doria Cotton Saree', 'Kanchi Pattu Wedding Saree',
  'Organza Designer Saree', 'Linen Handloom Saree', 'Bridal Red Benarasi Saree',
];

const categoryIds = [1,2,3,4,5,6,7,8];
const shopIds = [1,2,3,4,5,6,9,10];
const colors = ['Red','Gold','Green','Blue','Pink','Maroon','Orange','White','Black','Yellow','Purple','Cream'];
const fabrics = ['Silk','Cotton','Georgette','Chiffon','Linen','Organza','Crepe','Tussar'];

export const products = Array.from({ length: 30 }, (_, i) => ({
  id: i + 1,
  name: names[i],
  category: categories.find(c => c.id === categoryIds[i % 8])?.name || 'Silk Sarees',
  categoryId: categoryIds[i % 8],
  shopId: shopIds[i % 8],
  shopName: shops.find(s => s.id === shopIds[i % 8])?.name || 'Lakshmi Silks',
  price: Math.round((2000 + Math.random() * 13000) / 100) * 100,
  offerPrice: Math.round((1500 + Math.random() * 10000) / 100) * 100,
  rating: +(4 + Math.random() * 1).toFixed(1),
  reviews: Math.floor(20 + Math.random() * 200),
  image: sareeImages[i % sareeImages.length],
  images: [sareeImages[i % sareeImages.length], sareeImages[(i + 1) % sareeImages.length], sareeImages[(i + 2) % sareeImages.length]],
  color: colors[i % colors.length],
  fabric: fabrics[i % fabrics.length],
  stock: Math.floor(5 + Math.random() * 50),
  description: `This exquisite ${names[i]} is a masterpiece of Indian textile art. Crafted with precision and adorned with intricate motifs, this saree is perfect for special occasions. The rich color palette and premium fabric ensure elegance and comfort. Each saree is handpicked from trusted artisans who have been perfecting their craft for generations.`,
  specifications: { Fabric: fabrics[i % fabrics.length], Color: colors[i % colors.length], Length: '6.3 meters', Blouse: 'Running Blouse (0.8m)', Wash: 'Dry Clean Only', Weight: '450g approx' },
  status: i < 22 ? 'approved' : i < 26 ? 'pending' : 'rejected',
  featured: i < 8,
  trending: i >= 4 && i < 12,
  newArrival: i >= 20,
}));

// Fix offerPrice to always be less than price
products.forEach(p => {
  if (p.offerPrice >= p.price) {
    p.offerPrice = Math.round(p.price * (0.7 + Math.random() * 0.2) / 100) * 100;
  }
});
