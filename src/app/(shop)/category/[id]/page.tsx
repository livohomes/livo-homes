import { getCategories, getSubcategoriesByCategory } from '@/lib/db';
import { notFound } from 'next/navigation';
import CategoryClient from './CategoryClient';

export const revalidate = 86400; // 24 hours ISR
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

  const subcategories = await getSubcategoriesByCategory(id);

  return <CategoryClient categoryDetail={categoryDetail} subcategories={subcategories} />;
}
