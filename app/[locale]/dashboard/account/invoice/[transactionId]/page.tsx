import InvoiceCard from "@/components/Invoice/InvoiceCard";
import React from "react";

const Page = async (props: any) => {
  console.log("=== INVOICE PAGE COMPONENT START ===");
  console.log("Page props received:", /* @next-codemod-error 'props' is passed as an argument. Any asynchronous properties of 'props' must be awaited when accessed. */
  props);
  
  const params = await props.params;
  console.log("Resolved params:", params);
  console.log("Transaction ID from params:", params.transactionId);
  
  // Log any search params if they exist
  if ((await props.searchParams)) {
    console.log("Search params:", (await props.searchParams));
  }
  
  console.log("Rendering InvoiceCard component with transactionId:", params.transactionId);
  console.log("=== INVOICE PAGE COMPONENT END ===");
  
  return <InvoiceCard transactionId={params.transactionId} />;
};

export default Page;
