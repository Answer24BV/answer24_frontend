"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { sidebarLinks, PRIMARY_TAB_COUNT, folders } from "@/lib/data"
import { MoreHorizontal } from "lucide-react"
import { useState } from "react"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"

interface BottomTabsProps {
  selectedCategory: string | null
  onSelectCategory: (category: string | null) => void
}

export function BottomTabs({ selectedCategory, onSelectCategory }: BottomTabsProps) {
  const primaryTabs = sidebarLinks.slice(0, PRIMARY_TAB_COUNT)
  const moreTabs = sidebarLinks.slice(PRIMARY_TAB_COUNT)
  const [isMoreMenuOpen, setIsMoreMenuOpen] = useState(false)

  const handleSelectCategoryAndClose = (category: string | null) => {
    onSelectCategory(category)
    setIsMoreMenuOpen(false) // Close the sheet after selecting a category
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-background border-t border-gray-200 shadow-lg md:hidden">
      <nav className="flex justify-around items-center h-16 px-2">
        {primaryTabs.map((link) => (
          <Link
            key={link.name}
            href={link.href}
            className="flex flex-col items-center justify-center flex-1 text-xs font-medium text-gray-600 data-[active=true]:text-calmBlue-700 transition-colors"
            data-active={selectedCategory === link.category}
            onClick={() => onSelectCategory(link.category)}
            prefetch={false}
          >
            <link.icon className="h-5 w-5 mb-1" />
            <span>{link.shortName}</span>
          </Link>
        ))}
        {moreTabs.length > 0 && (
          <Sheet open={isMoreMenuOpen} onOpenChange={setIsMoreMenuOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                className="flex flex-col items-center justify-center flex-1 text-xs font-medium text-gray-600 h-full"
              >
                <MoreHorizontal className="h-5 w-5 mb-1" />
                <span>More</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="bottom" className="h-3/4 p-4 bg-background rounded-t-lg">
              <h3 className="text-lg font-semibold mb-4 text-foreground">More Options</h3>
              <ScrollArea className="h-[calc(100%-4rem)]">
                <nav className="grid gap-2">
                  {moreTabs.map((link) => (
                    <Link
                      key={link.name}
                      href={link.href}
                      className="flex items-center gap-3 rounded-lg px-3 py-2 text-gray-700 transition-all hover:bg-calmBlue-100 hover:text-calmBlue-700 data-[active=true]:bg-calmBlue-100 data-[active=true]:text-calmBlue-700 font-medium"
                      data-active={selectedCategory === link.category}
                      onClick={() => handleSelectCategoryAndClose(link.category)}
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
                  <Separator className="my-2 bg-gray-200" />
                  <div className="px-3 text-xs font-semibold uppercase text-gray-500">Folders</div>
                  {folders.map((folder) => (
                    <Link
                      key={folder.name}
                      href={folder.href}
                      className="flex items-center gap-3 rounded-lg px-3 py-2 text-gray-700 transition-all hover:bg-calmBlue-100 hover:text-calmBlue-700 data-[active=true]:bg-calmBlue-100 data-[active=true]:text-calmBlue-700 font-medium"
                      data-active={selectedCategory === folder.category}
                      onClick={() => handleSelectCategoryAndClose(folder.category)}
                      prefetch={false}
                    >
                      {folder.name}
                    </Link>
                  ))}
                </nav>
              </ScrollArea>
            </SheetContent>
          </Sheet>
        )}
      </nav>
    </div>
  )
}
