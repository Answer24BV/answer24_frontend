'use client'

import { usePathname } from 'next/navigation'
import { Navbar } from './Navbar'
import { PrivateNavbar } from './PrivateNavbar'

const Header = () => {
  const pathname = usePathname()

  // Define routes that should have the private navbar
  const privateRoutes = ['/account', '/account/chat', '/wallet', 'dashboard']

  // Check if the current route is a private route
  const isPrivateRoute = privateRoutes.some(route => pathname.includes(route))

  return isPrivateRoute ? <PrivateNavbar /> : <Navbar />
}

export default Header
