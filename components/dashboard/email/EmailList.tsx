"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { mailData } from "@/lib/data";
import { Search, Filter, MoreVertical, RefreshCw } from "lucide-react";

interface MailListProps {
  onSelectMail: (mail: (typeof mailData)[0]) => void;
  filterCategory: string | null;
}

export function MailList({ onSelectMail, filterCategory }: MailListProps) {
  const filteredMailData = filterCategory
    ? mailData.filter((mail) => mail.category === filterCategory)
    : mailData;

  return (
    <div className="flex-1 flex flex-col bg-white/60 backdrop-blur-sm dark:bg-slate-950/60 h-full">
      {/* Enhanced Header */}
      <div className="flex items-center justify-between p-6 pb-4 border-b border-slate-200/60 dark:border-slate-700/60">
        <div className="flex items-center gap-4">
          <h1 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
            {filterCategory
              ? filterCategory.charAt(0).toUpperCase() + filterCategory.slice(1)
              : "All Conversations"}
          </h1>
          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-100 text-xs font-medium text-blue-700 dark:bg-blue-900/50 dark:text-blue-300">
            {filteredMailData.length}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-slate-500 hover:bg-slate-100 hover:text-slate-700 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-300"
          >
            <Search className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-slate-500 hover:bg-slate-100 hover:text-slate-700 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-300"
          >
            <Filter className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-slate-500 hover:bg-slate-100 hover:text-slate-700 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-300"
          >
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Enhanced Table */}
      <div className="flex-1 overflow-auto">
        <Table>
          <TableHeader className="sticky top-0 z-10">
            <TableRow className="bg-slate-50/80 backdrop-blur-sm hover:bg-slate-50/80 border-b border-slate-200/60 dark:bg-slate-900/50 dark:hover:bg-slate-900/50 dark:border-slate-800/60">
              <TableHead className="w-[40px] py-3 pl-6">
                <Checkbox
                  id="select-all"
                  className="border-slate-300 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                />
              </TableHead>
              <TableHead className="min-w-[150px] py-3 text-slate-700 font-semibold dark:text-slate-300">
                Customer
              </TableHead>
              <TableHead className="min-w-[350px] py-3 text-slate-700 font-semibold dark:text-slate-300">
                Conversation
              </TableHead>
              <TableHead className="w-[100px] hidden md:table-cell py-3 text-slate-700 font-semibold dark:text-slate-300">
                Number
              </TableHead>
              <TableHead className="w-[120px] text-right py-3 pr-6 text-slate-700 font-semibold dark:text-slate-300">
                Last Updated
              </TableHead>
              <TableHead className="w-[40px] py-3 pr-6"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredMailData.map((mail, index) => (
              <TableRow
                key={mail.id}
                className="group cursor-pointer border-b border-slate-100/80 hover:bg-blue-50/30 transition-all duration-200 dark:border-slate-800/40 dark:hover:bg-blue-950/20"
                onClick={() => onSelectMail(mail)}
              >
                <TableCell className="py-4 pl-6">
                  <Checkbox
                    id={`select-${mail.id}`}
                    className="border-slate-300 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                    onClick={(e) => e.stopPropagation()}
                  />
                </TableCell>

                <TableCell className="py-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 text-white text-sm font-medium">
                      {mail.customer.charAt(0)}
                    </div>
                    <span className="font-medium text-slate-900 dark:text-slate-100 group-hover:text-blue-700 dark:group-hover:text-blue-300 transition-colors">
                      {mail.customer}
                    </span>
                  </div>
                </TableCell>

                <TableCell className="py-4">
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      {mail.tags.map((tag, tagIndex) => (
                        <Badge
                          key={tagIndex}
                          variant={
                            tag.variant as "default" | "secondary" | "outline"
                          }
                          className="text-xs px-2 py-0.5 rounded-full font-medium border-0 bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-800 dark:from-blue-950/50 dark:to-indigo-950/50 dark:text-blue-300"
                        >
                          {tag.text}
                        </Badge>
                      ))}
                    </div>
                    <div className="space-y-1">
                      <span className="font-semibold text-slate-900 dark:text-slate-100 group-hover:text-blue-700 dark:group-hover:text-blue-300 transition-colors text-sm">
                        {mail.subject}
                      </span>
                      <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed">
                        {mail.snippet}
                      </p>
                    </div>
                  </div>
                </TableCell>

                <TableCell className="text-slate-600 dark:text-slate-400 hidden md:table-cell py-4 text-sm font-medium">
                  {mail.number}
                </TableCell>

                <TableCell className="text-right text-slate-600 dark:text-slate-400 py-4 pr-4 text-sm">
                  {mail.lastUpdated}
                </TableCell>

                <TableCell className="py-4 pr-6">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 opacity-0 group-hover:opacity-100 text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300 transition-all"
                    onClick={(e) => {
                      e.stopPropagation();
                      // Handle more actions
                    }}
                  >
                    <MoreVertical className="h-3 w-3" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Enhanced Footer */}
      <div className="flex items-center justify-between px-6 py-4 border-t border-slate-200/60 dark:border-slate-700/60 bg-slate-50/30 dark:bg-slate-900/30">
        <div className="text-sm text-slate-600 dark:text-slate-400">
          <span className="font-medium">{filteredMailData.length}</span> active
          conversations
          {filterCategory && (
            <span className="ml-2 text-slate-500 dark:text-slate-500">
              in {filterCategory}
            </span>
          )}
        </div>

        <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
          <Button
            variant="ghost"
            size="sm"
            className="h-8 px-3 text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100"
          >
            Mark all read
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 px-3 text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100"
          >
            Archive all
          </Button>
        </div>
      </div>
    </div>
  );
}
