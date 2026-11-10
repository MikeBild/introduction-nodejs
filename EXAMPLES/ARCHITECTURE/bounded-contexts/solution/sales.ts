// Sales context: its own language, its own model. For sales, a product is
// something with a name, a price in cents and the question whether the customer can buy it.

export type ProductId = string & { readonly __brand: 'ProductId' }
export const ProductId = (id: string) => id as ProductId

export type Product = { id: ProductId; name: string; priceCents: number; available: boolean }

// Port: sales says what it needs. Who delivers it does not matter to sales.
export type Catalog = (id: ProductId) => Promise<Product | undefined>

export const createSales = (catalog: Catalog) => {
  const find = async (id: ProductId) => {
    const product = await catalog(id)
    if (!product) throw new Error(`Unknown product ${id}`)
    return product
  }
  return {
    cartTotalCents: async (lines: { productId: ProductId; quantity: number }[]) => {
      let total = 0
      for (const line of lines) total += (await find(line.productId)).priceCents * line.quantity
      return total
    },
    isAvailable: async (id: ProductId) => (await catalog(id))?.available ?? false,
  }
}
