import InvoiceCard from "@/components/Invoice/InvoiceCard";
import React from "react";

export async function generateStaticParams() {
  return [
    { transactionId: 'txn-1' },
    { transactionId: 'txn-2' },
    { transactionId: 'txn-3' },
    { transactionId: 'txn-4' },
    { transactionId: 'txn-5' },
  ];
}

const Page = async (props: any) => {
  const params = await props.params;

  return <InvoiceCard transactionId={params.transactionId} />;
};

export default Page;
