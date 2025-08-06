"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { mailData } from "@/lib/data"

interface MailListProps {
  onSelectMail: (mail: (typeof mailData)[0]) => void
  filterCategory: string | null
}

export function MailList({ onSelectMail, filterCategory }: MailListProps) {
  const filteredMailData = filterCategory ? mailData.filter((mail) => mail.category === filterCategory) : mailData

  return (
    <div className="flex-1 overflow-auto  bg-background rounded-lg shadow-custom-medium ">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50 hover:bg-gray-50 border-b border-gray-200">
              <TableHead className="w-[40px] py-3 pl-4">
                <Checkbox id="select-all" />
              </TableHead>
              <TableHead className="min-w-[150px] py-3 text-gray-700 font-semibold">Customer</TableHead>
              <TableHead className="min-w-[300px] py-3 text-gray-700 font-semibold">Conversation</TableHead>
              <TableHead className="w-[100px] hidden md:table-cell py-3 text-gray-700 font-semibold">Number</TableHead>
              <TableHead className="w-[100px] text-right py-3 pr-4 text-gray-700 font-semibold">Last Updated</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredMailData.map((mail) => (
              <TableRow
                key={mail.id}
                className="cursor-pointer hover:bg-calmBlue-50 transition-colors border-b border-gray-100 last:border-b-0"
                onClick={() => onSelectMail(mail)}
              >
                <TableCell className="py-3 pl-4">
                  <Checkbox id={`select-${mail.id}`} />
                </TableCell>
                <TableCell className="font-medium text-foreground py-3">{mail.customer}</TableCell>
                <TableCell className="py-3">
                  <div className="flex flex-col">
                    <div className="flex items-center gap-2 mb-1">
                      {mail.tags.map((tag, index) => (
                        <Badge
                          key={index}
                          variant={tag.variant as "default" | "secondary" | "outline"}
                          className="text-xs px-2 py-0.5 rounded-full font-medium"
                        >
                          {tag.text}
                        </Badge>
                      ))}
                      <span className="font-semibold text-foreground">{mail.subject}</span>
                    </div>
                    <p className="text-sm text-gray-500 truncate max-w-[calc(100vw-200px)] md:max-w-full">
                      {mail.snippet}
                    </p>
                  </div>
                </TableCell>
                <TableCell className="text-gray-600 hidden md:table-cell py-3">{mail.number}</TableCell>
                <TableCell className="text-right text-gray-600 py-3 pr-4">{mail.lastUpdated}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <div className="mt-4 text-sm text-gray-500 px-4 py-2">{filteredMailData.length} active conversations</div>
    </div>
  )
}
