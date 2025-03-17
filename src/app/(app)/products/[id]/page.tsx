import { notFound } from 'next/navigation'
import { getProduct } from '@/core/actions/product'
import { getSessionToken } from '@/lib/session'
import type { Metadata } from 'next'
import { ProductsForm } from '../_components/products-form'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: number }>
}): Promise<Metadata> {
  const { id } = await params
  const sessionToken = await getSessionToken()
  const product = await getProduct(id, sessionToken!)

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
  const sessionToken = await getSessionToken()
  const product = await getProduct(id, sessionToken!)

  if (!product) {
    notFound()
  }

  return <ProductsForm product={product} />
}
