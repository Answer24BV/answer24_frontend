"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { sidebarLinks, folders } from "@/lib/data"
import { Settings, Plus } from "lucide-react"

interface SidebarProps {
  selectedCategory: string | null
  onSelectCategory: (category: string | null) => void
}

export function Sidebar({ selectedCategory, onSelectCategory }: SidebarProps) {
  return (
    <aside className="hidden md:flex w-64 flex-col border-r border-gray-200 bg-gray-50 p-4 h-full shadow-inner">
      <div className="flex items-center justify-between pb-4">
        <h2 className="text-lg font-semibold text-foreground">J&G Clothing</h2>
      </div>
      <ScrollArea className="flex-1 pr-2">
        <nav className="grid gap-1">
          {sidebarLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-gray-700 transition-all hover:bg-calmBlue-100 hover:text-calmBlue-700 data-[active=true]:bg-calmBlue-100 data-[active=true]:text-calmBlue-700 font-medium"
              data-active={selectedCategory === link.category}
              onClick={() => onSelectCategory(link.category)}
              prefetch={false}
            >
              <link.icon className="h-4 w-4 text-gray-600 data-[active=true]:text-calmBlue-700" />
              {link.name}
              {link.count !== 0 && (
                <span className="ml-auto flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-gray-200 text-xs font-medium text-gray-600">
                  {link.count}
                </span>
              )}
            </Link>
          ))}
        </nav>
        <Separator className="my-4 bg-gray-200" />
        <div className="px-3 text-xs font-semibold uppercase text-gray-500">Folders</div>
        <nav className="grid gap-1 pt-2">
          {folders.map((folder) => (
            <Link
              key={folder.name}
              href={folder.href}
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-gray-700 transition-all hover:bg-calmBlue-100 hover:text-calmBlue-700 data-[active=true]:bg-calmBlue-100 data-[active=true]:text-calmBlue-700 font-medium"
              data-active={selectedCategory === folder.category}
              onClick={() => onSelectCategory(folder.category)}
              prefetch={false}
            >
              {folder.name}
            </Link>
          ))}
        </nav>
      </ScrollArea>
      <div className="mt-auto flex items-center justify-between pt-4 border-t border-gray-200">
        <Button variant="ghost" size="icon" className="text-gray-600 hover:bg-gray-100 hover:text-calmBlue-700">
          <Settings className="h-5 w-5" />
          <span className="sr-only">Settings</span>
        </Button>
        <Button variant="ghost" size="icon" className="text-gray-600 hover:bg-gray-100 hover:text-calmBlue-700">
          <Plus className="h-5 w-5" />
          <span className="sr-only">New folder</span>
        </Button>
      </div>
    </aside>
  )
}
