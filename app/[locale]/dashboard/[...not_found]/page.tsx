import {notFound} from "next/navigation"

export async function generateStaticParams() {
  return [
    { not_found: ['404'] },
    { not_found: ['not-found'] },
    { not_found: ['error'] },
  ];
}

export default function NotFoundCatchAll() {
  notFound()
}