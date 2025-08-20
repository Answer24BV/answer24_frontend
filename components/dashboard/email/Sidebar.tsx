"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { sidebarLinks, folders } from "@/lib/data";
import { Settings, Plus, FolderPlus } from "lucide-react";

interface SidebarProps {
  selectedCategory: string | null;
  onSelectCategory: (category: string | null) => void;
}

export function Sidebar({ selectedCategory, onSelectCategory }: SidebarProps) {
  return (
    <aside className="flex w-full flex-col bg-white/60 backdrop-blur-sm dark:bg-slate-950/60 h-full">
      {/* Header */}
      <div className="flex items-center justify-between p-6 pb-4">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-sm">
            <span className="text-sm font-bold">JG</span>
          </div>
          <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
            J&G Clothing
          </h2>
        </div>
      </div>

      <ScrollArea className="flex-1 px-3">
        {/* Main Navigation */}
        <nav className="space-y-1">
          {sidebarLinks.map((link) => {
            const isActive = selectedCategory === link.category;
            return (
              <Link
                key={link.name}
                href={link.href}
                className={`
                  group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200
                  ${
                    isActive
                      ? "bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 shadow-sm dark:from-blue-950/50 dark:to-indigo-950/50 dark:text-blue-400 border border-blue-200/50 dark:border-blue-800/50"
                      : "text-slate-700 hover:bg-slate-100/80 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800/50 dark:hover:text-slate-100"
                  }
                `}
                onClick={() => onSelectCategory(link.category)}
                prefetch={false}
              >
                <link.icon
                  className={`h-4 w-4 transition-colors ${
                    isActive
                      ? "text-blue-600 dark:text-blue-400"
                      : "text-slate-500 group-hover:text-slate-600 dark:text-slate-400 dark:group-hover:text-slate-300"
                  }`}
                />
                <span className="flex-1">{link.name}</span>
                {link.count !== 0 && (
                  <span
                    className={`
                    flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-xs font-medium
                    ${
                      isActive
                        ? "bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300"
                        : "bg-slate-200 text-slate-600 dark:bg-slate-700 dark:text-slate-300"
                    }
                  `}
                  >
                    {link.count > 99 ? "99+" : link.count}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Folders Section */}
        {folders.length > 0 && (
          <>
            <Separator className="my-6 bg-slate-200/60 dark:bg-slate-700/60" />

            <div className="flex items-center justify-between px-3 pb-3">
              <div className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Folders
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0 text-slate-500 hover:bg-slate-100 hover:text-slate-700 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-300"
              >
                <FolderPlus className="h-3 w-3" />
              </Button>
            </div>

            <nav className="space-y-1">
              {folders.map((folder) => {
                const isActive = selectedCategory === folder.category;
                return (
                  <Link
                    key={folder.name}
                    href={folder.href}
                    className={`
                      group flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium transition-all duration-200
                      ${
                        isActive
                          ? "bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 shadow-sm dark:from-blue-950/50 dark:to-indigo-950/50 dark:text-blue-400 border border-blue-200/50 dark:border-blue-800/50"
                          : "text-slate-700 hover:bg-slate-100/80 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800/50 dark:hover:text-slate-100"
                      }
                    `}
                    onClick={() => onSelectCategory(folder.category)}
                    prefetch={false}
                  >
                    <div
                      className={`h-2 w-2 rounded-full ${
                        isActive
                          ? "bg-blue-500"
                          : "bg-slate-400 group-hover:bg-slate-500"
                      }`}
                    />
                    <span className="flex-1">{folder.name}</span>
                  </Link>
                );
              })}
            </nav>
          </>
        )}
      </ScrollArea>

      {/* Footer Actions */}
      <div className="flex items-center justify-between p-6 pt-4 border-t border-slate-200/60 dark:border-slate-700/60">
        <Button
          variant="ghost"
          size="sm"
          className="h-9 px-3 text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-100"
        >
          <Settings className="mr-2 h-4 w-4" />
          Settings
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-9 w-9 text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-100"
        >
          <Plus className="h-4 w-4" />
          <span className="sr-only">New conversation</span>
        </Button>
      </div>
    </aside>
  );
}
