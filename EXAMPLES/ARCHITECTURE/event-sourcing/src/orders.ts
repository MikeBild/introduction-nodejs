// CRUD: Jede Änderung überschreibt die Zeile. Was vorher war, ist weg.

export type OrderItem = { sku: string; quantity: number; unitCents: number }

export type OrderRow = {
  id: string
  customerId: string
  status: 'placed' | 'shipped'
  items: OrderItem[]
  totalCents: number
  updatedAt: string
}

// Simuliert eine Datenbank: Lesen und Schreiben sind asynchron, ohne Versionsprüfung.
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

const total = (items: OrderItem[]) =>
  items.reduce((sum, item) => sum + item.quantity * item.unitCents, 0)

export const createOrderService = (table: OrderTable, now = () => new Date()) => {
  const load = async (id: string) => {
    const row = await table.find(id)
    if (!row) throw new Error(`Order ${id} not found`)
    return row
  }

  return {
    placeOrder: async (id: string, customerId: string) => {
      await table.save({
        id,
        customerId,
        status: 'placed',
        items: [],
        totalCents: 0,
        updatedAt: now().toISOString(),
      })
    },
    addItem: async (id: string, item: OrderItem) => {
      const row = await load(id)
      if (row.status !== 'placed') throw new Error('Only placed orders accept items')
      const items = [...row.items, item]
      await table.save({ ...row, items, totalCents: total(items), updatedAt: now().toISOString() })
    },
    shipOrder: async (id: string) => {
      const row = await load(id)
      if (row.status !== 'placed') throw new Error('Only placed orders can ship')
      await table.save({ ...row, status: 'shipped', updatedAt: now().toISOString() })
    },
    getOrder: load,
  }
}
