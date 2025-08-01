import { NextResponse } from "next/server"
import { mockClientData } from "@/lib/mockClientData"

export async function GET(request: Request, context: any) {
  const { client_id } = context.params

  if (!client_id) {
    return NextResponse.json({ error: "Client ID is required" }, { status: 400 })
  }

  const clientData = mockClientData[client_id]

  if (!clientData) {
    return NextResponse.json({ error: "Client not found" }, { status: 404 })
  }

  return NextResponse.json(clientData)
}