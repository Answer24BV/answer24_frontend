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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { mailData } from "@/lib/data";
import {
  Mail,
  Trash2,
  Archive,
  UserCheck,
  UserX,
  Tag,
  MessageSquare,
  ChevronDown,
  Eye,
  Reply,
  Forward,
  Star,
  Clock,
  AlertCircle,
  MoreVertical,
} from "lucide-react";

interface MailListProps {
  onSelectMail: (mail: (typeof mailData)[0]) => void;
  filterCategory: string | null;
}

export function MailList({ onSelectMail, filterCategory }: MailListProps) {
  const filteredMailData = filterCategory
    ? mailData.filter((mail) => mail.category === filterCategory)
    : mailData;

  const handleAssignEmail = (
    emailId: string,
    action: "assign" | "unassign"
  ) => {
    console.log(`${action} email ${emailId}`);
    // Implementation for assigning/unassigning emails
  };

  const handleDeleteEmail = (emailId: string) => {
    console.log(`Delete email ${emailId}`);
    // Implementation for deleting emails
  };

  const handleArchiveEmail = (emailId: string) => {
    console.log(`Archive email ${emailId}`);
    // Implementation for archiving emails
  };

  return (
    <div className="flex-1 flex flex-col bg-gradient-to-br from-white via-blue-50/30 to-indigo-50/20 dark:from-slate-950 dark:via-blue-950/20 dark:to-indigo-950/10 h-full">
      {/* Colorful Header */}
      <div className="flex items-center justify-between p-6 pb-4 border-b border-slate-200/60 dark:border-slate-700/60 bg-gradient-to-r from-white/80 to-blue-50/80 dark:from-slate-900/80 dark:to-blue-950/40">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg">
              <Mail className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100">
                {filterCategory
                  ? filterCategory.charAt(0).toUpperCase() +
                    filterCategory.slice(1)
                  : "All Emails"}
              </h1>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                {filteredMailData.length} conversations
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <Button className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white shadow-lg hover:shadow-xl transition-all duration-200">
            <Mail className="mr-2 h-4 w-4" />
            Compose New
          </Button>
          <Button
            variant="outline"
            className="border-2 border-blue-200 text-blue-700 hover:bg-blue-50"
          >
            <Archive className="mr-2 h-4 w-4" />
            Archive Selected
          </Button>
          <Button
            variant="outline"
            className="border-2 border-red-200 text-red-700 hover:bg-red-50"
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Delete Selected
          </Button>
        </div>
      </div>

      {/* Enhanced Table */}
      <div className="flex-1 overflow-auto">
        <Table>
          <TableHeader className="sticky top-0 z-10">
            <TableRow className="bg-gradient-to-r from-slate-50 to-blue-50/60 hover:from-slate-50 hover:to-blue-50/80 border-b-2 border-blue-200/50 dark:from-slate-900/80 dark:to-blue-950/40 dark:hover:from-slate-900/90 dark:hover:to-blue-950/50 dark:border-blue-800/30">
              <TableHead className="w-[40px] py-4 pl-6">
                <Checkbox className="border-2 border-blue-300 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600" />
              </TableHead>
              <TableHead className="w-[50px] py-4">Status</TableHead>
              <TableHead className="min-w-[180px] py-4 text-slate-700 font-bold dark:text-slate-300">
                Customer
              </TableHead>
              <TableHead className="min-w-[400px] py-4 text-slate-700 font-bold dark:text-slate-300">
                Conversation & Subject
              </TableHead>
              <TableHead className="w-[100px] hidden md:table-cell py-4 text-slate-700 font-bold dark:text-slate-300">
                Thread
              </TableHead>
              <TableHead className="w-[120px] py-4 text-slate-700 font-bold dark:text-slate-300">
                Last Updated
              </TableHead>
              <TableHead className="w-[140px] py-4 text-center text-slate-700 font-bold dark:text-slate-300">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredMailData.map((mail, index) => (
              <TableRow
                key={mail.id}
                className="group border-b border-slate-100/80 hover:bg-gradient-to-r hover:from-blue-50/40 hover:to-indigo-50/30 transition-all duration-200 dark:border-slate-800/40 dark:hover:from-blue-950/20 dark:hover:to-indigo-950/15"
              >
                <TableCell className="py-4 pl-6">
                  <Checkbox
                    className="border-2 border-blue-300 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                    onClick={(e) => e.stopPropagation()}
                  />
                </TableCell>

                <TableCell className="py-4">
                  <div className="flex items-center justify-center">
                    {filterCategory === "unassigned" ? (
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-r from-orange-400 to-red-500 text-white shadow-sm">
                        <AlertCircle className="h-4 w-4" />
                      </div>
                    ) : filterCategory === "assigned" ? (
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-r from-green-400 to-emerald-500 text-white shadow-sm">
                        <UserCheck className="h-4 w-4" />
                      </div>
                    ) : (
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-r from-blue-400 to-purple-500 text-white shadow-sm">
                        <Clock className="h-4 w-4" />
                      </div>
                    )}
                  </div>
                </TableCell>

                <TableCell className="py-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white text-sm font-bold shadow-lg">
                      {mail.customer.charAt(0)}
                    </div>
                    <div>
                      <span className="font-semibold text-slate-900 dark:text-slate-100 block">
                        {mail.customer}
                      </span>
                      <span className="text-sm text-slate-500 dark:text-slate-400">
                        #{mail.number}
                      </span>
                    </div>
                  </div>
                </TableCell>

                <TableCell className="py-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      {mail.tags.map((tag, tagIndex) => (
                        <Badge
                          key={tagIndex}
                          className="text-xs px-2 py-1 rounded-full font-medium border-0 bg-gradient-to-r from-blue-100 via-purple-100 to-pink-100 text-purple-800 dark:from-blue-950/50 dark:via-purple-950/50 dark:to-pink-950/50 dark:text-purple-300 shadow-sm"
                        >
                          {tag.text}
                        </Badge>
                      ))}
                    </div>
                    <div className="space-y-1">
                      <div
                        className="font-semibold text-slate-900 dark:text-slate-100 cursor-pointer hover:text-blue-700 dark:hover:text-blue-400 transition-colors"
                        onClick={() => onSelectMail(mail)}
                      >
                        📧 {mail.subject}
                      </div>
                      <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed">
                        {mail.snippet}
                      </p>
                    </div>
                  </div>
                </TableCell>

                <TableCell className="hidden md:table-cell py-4">
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-2 border-blue-200 text-blue-700 hover:bg-blue-50 hover:border-blue-300 transition-all duration-200"
                    onClick={() => onSelectMail(mail)}
                  >
                    <MessageSquare className="mr-1 h-3 w-3" />
                    View Thread
                  </Button>
                </TableCell>

                <TableCell className="py-4">
                  <div className="text-sm">
                    <div className="font-medium text-slate-900 dark:text-slate-100">
                      {mail.lastUpdated}
                    </div>
                    <div className="text-xs text-slate-500 dark:text-slate-400">
                      Last activity
                    </div>
                  </div>
                </TableCell>

                <TableCell className="py-4">
                  <div className="flex items-center gap-1">
                    <Button
                      size="sm"
                      className="h-8 w-8 p-0 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-sm hover:shadow-md transition-all duration-200"
                      onClick={() => onSelectMail(mail)}
                      title="Read Email"
                    >
                      <Eye className="h-3 w-3" />
                    </Button>

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-8 w-8 p-0 border-2 border-purple-200 text-purple-700 hover:bg-purple-50 hover:border-purple-300"
                        >
                          <ChevronDown className="h-3 w-3" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="w-48 bg-white/95 backdrop-blur-sm border-2 border-slate-200/50">
                        <DropdownMenuLabel className="text-sm font-semibold text-slate-700">
                          Email Actions
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator />

                        <DropdownMenuItem
                          className="text-green-700 hover:bg-green-50 cursor-pointer"
                          onClick={() => handleAssignEmail(mail.id, "assign")}
                        >
                          <UserCheck className="mr-2 h-4 w-4" />
                          Move to Assigned
                        </DropdownMenuItem>

                        <DropdownMenuItem
                          className="text-orange-700 hover:bg-orange-50 cursor-pointer"
                          onClick={() => handleAssignEmail(mail.id, "unassign")}
                        >
                          <UserX className="mr-2 h-4 w-4" />
                          Move to Unassigned
                        </DropdownMenuItem>

                        <DropdownMenuSeparator />

                        <DropdownMenuItem className="text-blue-700 hover:bg-blue-50 cursor-pointer">
                          <Reply className="mr-2 h-4 w-4" />
                          Reply
                        </DropdownMenuItem>

                        <DropdownMenuItem className="text-indigo-700 hover:bg-indigo-50 cursor-pointer">
                          <Forward className="mr-2 h-4 w-4" />
                          Forward
                        </DropdownMenuItem>

                        <DropdownMenuItem className="text-purple-700 hover:bg-purple-50 cursor-pointer">
                          <Star className="mr-2 h-4 w-4" />
                          Add to Favorites
                        </DropdownMenuItem>

                        <DropdownMenuSeparator />

                        <DropdownMenuItem
                          className="text-slate-700 hover:bg-slate-50 cursor-pointer"
                          onClick={() => handleArchiveEmail(mail.id)}
                        >
                          <Archive className="mr-2 h-4 w-4" />
                          Archive
                        </DropdownMenuItem>

                        <DropdownMenuItem
                          className="text-red-700 hover:bg-red-50 cursor-pointer"
                          onClick={() => handleDeleteEmail(mail.id)}
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Colorful Footer */}
      <div className="flex items-center justify-between px-6 py-4 border-t-2 border-blue-200/50 bg-gradient-to-r from-white/90 to-blue-50/70 dark:border-blue-800/30 dark:from-slate-900/90 dark:to-blue-950/40">
        <div className="text-sm">
          <span className="font-bold text-slate-900 dark:text-slate-100">
            {filteredMailData.length}
          </span>
          <span className="text-slate-600 dark:text-slate-400 ml-1">
            active conversations
            {filterCategory && (
              <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium dark:bg-blue-900/50 dark:text-blue-300">
                in {filterCategory}
              </span>
            )}
          </span>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            className="border-2 border-emerald-200 text-emerald-700 hover:bg-emerald-50 hover:border-emerald-300"
          >
            <UserCheck className="mr-2 h-4 w-4" />
            Bulk Assign
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="border-2 border-blue-200 text-blue-700 hover:bg-blue-50 hover:border-blue-300"
          >
            <Archive className="mr-2 h-4 w-4" />
            Archive All
          </Button>
        </div>
      </div>
    </div>
  );
}
