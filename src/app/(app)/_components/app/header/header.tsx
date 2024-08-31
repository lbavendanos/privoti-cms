import { Search } from './search'
import { Account } from './account/account'
import { MenuMobile } from '../menu/menu-mobile'

export function Header() {
  return (
    <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6">
      <MenuMobile />
      <Search />
      <Account />
    </header>
  )
}
