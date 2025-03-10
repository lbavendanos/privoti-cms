import { notFound } from 'next/navigation'
import { getProduct } from '@/core/actions/product'
import type { Metadata } from 'next'
import { ProductsForm } from '../_components/products-form'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: number }>
}): Promise<Metadata> {
  const { id } = await params
  const product = await getProduct(id)

  return {
    title: product?.title,
  }
}

export default async function EidtProductPage({
  params,
}: {
  params: Promise<{ id: number }>
}) {
  const { id } = await params
  const product = await getProduct(id)

  if (!product) {
    notFound()
  }

  return <ProductsForm product={product} />
}
