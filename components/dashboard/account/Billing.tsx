'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

export function Billing() {
  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Subscription Plan</CardTitle>
          <CardDescription>You are currently on the <strong>Growth</strong> plan.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between">
              <p className="text-sm font-medium">Monthly AI Credits</p>
              <p className="text-sm">75/100</p>
            </div>
            <Progress value={75} />
            <p className="text-xs text-gray-500">Your credits will reset on August 1, 2025.</p>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline">Change Plan</Button>
          <Button variant="destructive">Cancel Subscription</Button>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Payment Method</CardTitle>
          <CardDescription>Update your billing details.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4">
            <img src="/mastercard.svg" alt="Mastercard" className="h-8" />
            <div>
              <p className="font-medium">Mastercard **** 4444</p>
              <p className="text-sm text-gray-500">Expires 12/2028</p>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button variant="outline">Update Payment Method</Button>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Billing History</CardTitle>
          <CardDescription>View your past invoices.</CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="space-y-4">
            <li className="flex items-center justify-between">
              <div>
                <p className="font-medium">July 2025</p>
                <p className="text-sm text-gray-500">Invoice #INV-00123</p>
              </div>
              <Button variant="outline">Download</Button>
            </li>
            <li className="flex items-center justify-between">
              <div>
                <p className="font-medium">June 2025</p>
                <p className="text-sm text-gray-500">Invoice #INV-00122</p>
              </div>
              <Button variant="outline">Download</Button>
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
