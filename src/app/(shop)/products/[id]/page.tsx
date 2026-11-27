import { getProducts, getCategories, getSubcategories } from '@/lib/db';
import { notFound } from 'next/navigation';
import ProductDetailClient from './ProductDetailClient';

export const dynamic = 'force-dynamic';
export const dynamicParams = true;

export async function generateStaticParams() {
  try {
    const products = await getProducts();
    return products.map((p) => ({
      id: p.id,
    }));
  } catch (error) {
    console.error('generateStaticParams error in products/[id]:', error);
    return [];
  }
}

export default async function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [products, categories, subcategories] = await Promise.all([
    getProducts(),
    getCategories(),
    getSubcategories()
  ]);
  
  const product = products.find(p => p.slug === id || p.id === id);

  if (!product) {
    notFound();
  }

  // Related products
  const relatedProducts = product.isSpecial
    ? products.filter(p => p.isSpecial && p.id !== product.id).slice(0, 4)
    : products.filter(p => !p.isSpecial && p.category === product.category && p.id !== product.id).slice(0, 4);

  return (
    <div className="pt-28 pb-20 px-6 md:px-12 max-w-[1440px] mx-auto min-h-screen">
      <ProductDetailClient 
        product={product} 
        relatedProducts={relatedProducts} 
        categories={categories}
        subcategories={subcategories}
      />
    </div>
  );
}
