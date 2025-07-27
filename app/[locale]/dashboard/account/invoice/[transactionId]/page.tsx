import InvoiceCard from "@/components/Invoice/InvoiceCard";
import React from "react";

const Page = async (props: any) => {
  const params = await props.params;

  return <InvoiceCard transactionId={params.transactionId} />;
};

export default Page;
