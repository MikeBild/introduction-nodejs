// Context Verkauf: eigene Sprache, eigenes Modell. Für den Verkauf ist ein Produkt
// etwas mit Name, Preis in Cent und der Frage, ob die Kundin es kaufen kann.

export type ProductId = string & { readonly __brand: 'ProductId' }
export const ProductId = (id: string) => id as ProductId

export type Product = { id: ProductId; name: string; priceCents: number; available: boolean }

// Port: Der Verkauf sagt, was er braucht. Wer es liefert, ist ihm egal.
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
