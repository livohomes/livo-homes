import { getCategories, getSubcategoriesByCategory, getProducts } from '@/lib/db';
import { notFound } from 'next/navigation';
import CategoryClient from './CategoryClient';

export const dynamic = 'force-dynamic';
export const dynamicParams = true;

export async function generateStaticParams() {
  try {
    const categories = await getCategories();
    return categories.map((cat) => ({
      id: cat.id,
    }));
  } catch (error) {
    console.error('generateStaticParams error in category/[id]:', error);
    return [];
  }
}

export default async function CategoryPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const categories = await getCategories();
  const categoryDetail = categories.find(cat => cat.id === id);

  if (!categoryDetail) {
    notFound();
  }

  const [subcategories, allProducts] = await Promise.all([
    getSubcategoriesByCategory(id),
    getProducts(),
  ]);

  const directProducts = allProducts.filter(
    (p) =>
      !p.isSpecial &&
      p.category?.trim().toLowerCase() === categoryDetail.name.trim().toLowerCase() &&
      !p.subcategory
  );

  return (
    <CategoryClient
      categoryDetail={categoryDetail}
      subcategories={subcategories}
      directProducts={directProducts}
    />
  );
}
