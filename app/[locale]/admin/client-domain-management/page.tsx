import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { mockDomainStatuses } from "@/lib/mockClientData"
import { Badge } from "@/components/ui/badge"

export default function AdminDomainsPage() {
  return (
    <div className="container mx-auto pt-30">
      <h1 className="text-3xl font-bold text-center mb-8">Admin Domain Control</h1>

      <Card>
        <CardHeader>
          <CardTitle>Client Domains Overview</CardTitle>
        </CardHeader>
        <CardContent className="p-2">
          <Table className="w-full divide-y divide-gray-300">
            <TableHeader>
              <TableRow className="bg-gray-100">
                <TableHead className="px-6 py-3">Client Name</TableHead>
                <TableHead className="px-6 py-3">Domain</TableHead>
                <TableHead className="px-6 py-3">Status</TableHead>
                <TableHead className="px-6 py-3">Last Updated</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockDomainStatuses.map((domain) => (
                <TableRow key={domain.domain} className="hover:bg-gray-100">
                  <TableCell className="px-6 py-4">{domain.clientName}</TableCell>
                  <TableCell className="px-6 py-4">{domain.domain}</TableCell>
                  <TableCell className="px-6 py-4">
                    <Badge
                      className={
                        domain.status === "Active"
                          ? "bg-green-500 text-white"
                          : domain.status === "Pending DNS"
                            ? "bg-yellow-500 text-white"
                            : domain.status === "Error"
                              ? "bg-red-500 text-white"
                              : "bg-gray-500 text-white"
                      }
                    >
                      {domain.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="px-6 py-4">{domain.lastUpdated}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
