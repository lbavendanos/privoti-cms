import { Home, LineChart, Package, ShoppingCart, Users } from 'lucide-react'

interface MenuItem {
  href: string
  title: string
  icon: any
}

type MenuItems = MenuItem[]

export const MENU_ITEMS: MenuItems = [
  { href: '/', title: 'Inicio', icon: Home },
  { href: '/orders', title: 'Pedidos', icon: ShoppingCart },
  { href: '/products', title: 'Productos', icon: Package },
  { href: '/customers', title: 'Clientes', icon: Users },
  { href: '/analytics', title: 'Estadísticas', icon: LineChart },
]
