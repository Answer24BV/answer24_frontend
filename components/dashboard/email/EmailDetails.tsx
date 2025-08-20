"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  Reply,
  Forward,
  Archive,
  Trash2,
  MoreVertical,
  Clock,
  User,
} from "lucide-react";
import type { mailData } from "@/lib/data";

interface MailDetailProps {
  mail: (typeof mailData)[0];
  onBack: () => void;
}

export function MailDetail({ mail, onBack }: MailDetailProps) {
  return (
    <div className="flex-1 flex flex-col bg-white/60 backdrop-blur-sm dark:bg-slate-950/60 h-full">
      {/* Enhanced Header */}
      <div className="flex items-center justify-between p-6 pb-4 border-b border-slate-200/60 dark:border-slate-700/60">
        <div className="flex items-center gap-4 flex-1 min-w-0">
          <Button
            variant="ghost"
            size="icon"
            onClick={onBack}
            className="h-9 w-9 text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-100 shrink-0"
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="sr-only">Back to list</span>
          </Button>

          <div className="min-w-0 flex-1">
            <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100 truncate">
              {mail.subject}
            </h2>
            <div className="flex items-center gap-2 mt-1">
              {mail.tags.map((tag, index) => (
                <Badge
                  key={index}
                  variant={tag.variant as "default" | "secondary" | "outline"}
                  className="text-xs px-2 py-0.5 rounded-full font-medium border-0 bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-800 dark:from-blue-950/50 dark:to-indigo-950/50 dark:text-blue-300"
                >
                  {tag.text}
                </Badge>
              ))}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 shrink-0">
          <Button
            variant="outline"
            size="sm"
            className="h-9 px-3 border-slate-200 text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
          >
            <Reply className="mr-2 h-4 w-4" />
            Reply
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9 text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-100"
          >
            <Forward className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9 text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-100"
          >
            <Archive className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9 text-slate-600 hover:bg-red-100 hover:text-red-700 dark:text-slate-400 dark:hover:bg-red-950/30 dark:hover:text-red-400"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9 text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-100"
          >
            <MoreVertical className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Customer Info Section */}
      <div className="px-6 py-4 bg-slate-50/50 dark:bg-slate-900/20 border-b border-slate-200/60 dark:border-slate-700/60">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 text-white text-lg font-semibold">
            {mail.customer.charAt(0)}
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-3">
              <User className="h-4 w-4 text-slate-500 dark:text-slate-400" />
              <span className="font-semibold text-slate-900 dark:text-slate-100">
                {mail.customer}
              </span>
            </div>
            <div className="flex items-center gap-3 mt-1">
              <Clock className="h-4 w-4 text-slate-500 dark:text-slate-400" />
              <span className="text-sm text-slate-600 dark:text-slate-400">
                Last updated: {mail.lastUpdated}
              </span>
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm font-medium text-slate-900 dark:text-slate-100">
              #{mail.number}
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400">
              Ticket Number
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Content */}
      <div className="flex-1 overflow-auto">
        <div className="p-6">
          <div className="max-w-none">
            <div
              className="prose prose-slate max-w-none text-slate-700 dark:text-slate-300 leading-relaxed
                prose-headings:text-slate-900 dark:prose-headings:text-slate-100
                prose-p:text-slate-700 dark:prose-p:text-slate-300
                prose-strong:text-slate-900 dark:prose-strong:text-slate-100
                prose-a:text-blue-600 dark:prose-a:text-blue-400
                prose-code:text-blue-600 dark:prose-code:text-blue-400
                prose-code:bg-blue-50 dark:prose-code:bg-blue-950/30
                prose-code:px-1 prose-code:py-0.5 prose-code:rounded
                prose-pre:bg-slate-100 dark:prose-pre:bg-slate-800
                prose-blockquote:border-l-blue-500 dark:prose-blockquote:border-l-blue-400
                prose-blockquote:text-slate-600 dark:prose-blockquote:text-slate-400"
              dangerouslySetInnerHTML={{ __html: mail.content }}
            />
          </div>
        </div>
      </div>

      {/* Enhanced Footer with Quick Actions */}
      <div className="border-t border-slate-200/60 dark:border-slate-700/60 bg-slate-50/30 dark:bg-slate-900/30 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="h-8 px-3 text-sm border-slate-200 text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
            >
              Add Note
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="h-8 px-3 text-sm border-slate-200 text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
            >
              Add Tag
            </Button>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="h-8 px-3 text-sm border-slate-200 text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
            >
              Mark as Resolved
            </Button>
            <Button
              size="sm"
              className="h-8 px-4 text-sm bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white border-0 shadow-sm"
            >
              <Reply className="mr-2 h-3 w-3" />
              Quick Reply
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
