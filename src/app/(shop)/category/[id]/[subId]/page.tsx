import { getProducts, getCategories, getSubcategories, getSubcategoryById } from '@/lib/db';
import { notFound } from 'next/navigation';
import SubcategoryClient from './SubcategoryClient';

export const revalidate = 86400; // 24 hours ISR
export const dynamicParams = true;

export async function generateStaticParams() {
  try {
    const subcategories = await getSubcategories();
    return subcategories.map((sub) => ({
      id: sub.categoryId,
      subId: sub.id,
    }));
  } catch (error) {
    console.error('generateStaticParams error in category/[id]/[subId]:', error);
    return [];
  }
}

export default async function SubcategoryPage({ params }: { params: Promise<{ id: string; subId: string }> }) {
  const { id, subId } = await params;
  
  const categories = await getCategories();
  const categoryDetail = categories.find(cat => cat.id === id);
  const subcategoryDetail = await getSubcategoryById(subId);

  if (!categoryDetail || !subcategoryDetail) {
    notFound();
  }

  const allProducts = await getProducts();
  // Filter by category and subcategory name
  const subcategoryProducts = allProducts.filter(p => 
    p.category === categoryDetail.name && 
    p.subcategory === subcategoryDetail.name
  );

  return (
    <SubcategoryClient 
      initialProducts={subcategoryProducts} 
      categoryDetail={categoryDetail} 
      subcategoryDetail={subcategoryDetail} 
    />
  );
}
