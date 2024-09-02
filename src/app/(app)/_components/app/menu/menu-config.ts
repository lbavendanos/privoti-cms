import { Home, LineChart, Package, ShoppingCart, Users } from 'lucide-react'

export interface MenuItem {
  href: string
  title: string
  icon: React.FC<React.SVGProps<SVGSVGElement>>
}

export type MenuItems = MenuItem[]

export const MENU_ITEMS: MenuItems = [
  { href: '/', title: 'Inicio', icon: Home },
  { href: '/orders', title: 'Pedidos', icon: ShoppingCart },
  { href: '/products', title: 'Productos', icon: Package },
  { href: '/customers', title: 'Clientes', icon: Users },
  { href: '/analytics', title: 'Estadísticas', icon: LineChart },
]
