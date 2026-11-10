// CRUD: every change overwrites the row. What came before is gone.

export type OrderStatus = 'draft' | 'placed' | 'paid' | 'shipped' | 'cancelled'
export type OrderItem = { productId: string; quantity: number; priceCents: number }

export type OrderRow = {
  id: string
  customerId: string
  status: OrderStatus
  items: OrderItem[]
  totalCents: number
  updatedAt: string
}

// Simulates a database: reading and writing are asynchronous, without a version check.
export const createOrderTable = () => {
  const rows = new Map<string, OrderRow>()
  return {
    find: async (id: string) => {
      const row = rows.get(id)
      return row ? structuredClone(row) : undefined
    },
    save: async (row: OrderRow) => {
      rows.set(row.id, structuredClone(row))
    },
  }
}

export type OrderTable = ReturnType<typeof createOrderTable>

// Money always in whole cents: total = Σ quantity × priceCents
const total = (items: OrderItem[]) =>
  items.reduce((sum, item) => sum + item.quantity * item.priceCents, 0)

export const createOrderService = (table: OrderTable, now = () => new Date()) => {
  const load = async (id: string) => {
    const row = await table.find(id)
    if (!row) throw new Error(`Order ${id} not found`)
    return row
  }
  const moveTo = async (id: string, from: OrderStatus, to: OrderStatus) => {
    const row = await load(id)
    if (row.status !== from) throw new Error(`Only ${from} orders can become ${to}`)
    await table.save({ ...row, status: to, updatedAt: now().toISOString() })
  }

  return {
    createOrder: async (id: string, customerId: string) => {
      await table.save({
        id,
        customerId,
        status: 'draft',
        items: [],
        totalCents: 0,
        updatedAt: now().toISOString(),
      })
    },
    addItem: async (id: string, item: OrderItem) => {
      const row = await load(id)
      if (row.status !== 'draft') throw new Error('Only draft orders accept items')
      const items = [...row.items, item]
      await table.save({ ...row, items, totalCents: total(items), updatedAt: now().toISOString() })
    },
    placeOrder: (id: string) => moveTo(id, 'draft', 'placed'),
    payOrder: (id: string) => moveTo(id, 'placed', 'paid'),
    shipOrder: (id: string) => moveTo(id, 'paid', 'shipped'),
    getOrder: load,
  }
}
