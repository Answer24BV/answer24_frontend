import {notFound} from "next/navigation"

export async function generateStaticParams() {
  return [
    { not_found: ['404'] },
  ];
}

export default function NotFoundCatchAll() {
  notFound()
}