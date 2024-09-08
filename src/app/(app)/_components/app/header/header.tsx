import { Search } from './search'
import { Account } from './account/account'
import { MenuMobile } from '../menu/menu-mobile'

export function Header() {
  return (
    <header className="fixed inset-x-0 z-10 h-14 w-full md:pl-56 lg:h-[60px] lg:pl-72">
      <div className="flex h-full w-full items-center gap-4 border-b bg-white px-4 lg:px-6">
        <MenuMobile />
        <Search />
        <Account />
      </div>
    </header>
  )
}
