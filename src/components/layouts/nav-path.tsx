import { capitalize } from '@/lib/utils'
import { useLocation } from '@tanstack/react-router'
import React from 'react'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { Link } from '@tanstack/react-router'

export function NavPath() {
  const pathname = useLocation({ select: (location) => location.pathname })
  const segments = pathname.split('/').filter(Boolean)

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {segments.map((segment, index) => {
          const href = `/${segments.slice(0, index + 1).join('/')}`
          const isLast = index === segments.length - 1

          return (
            <React.Fragment key={href}>
              {isLast ? (
                <BreadcrumbItem>
                  <BreadcrumbPage>{capitalize(segment)}</BreadcrumbPage>
                </BreadcrumbItem>
              ) : (
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink asChild>
                    <Link to={href}>{capitalize(segment)}</Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
              )}
              {!isLast && <BreadcrumbSeparator className="hidden md:block" />}
            </React.Fragment>
          )
        })}
      </BreadcrumbList>
    </Breadcrumb>
  )
}
