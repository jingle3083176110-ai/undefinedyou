import { notFound, redirect } from "next/navigation";
import milestones from "@/json/milestones.json";

export default async function LegacyWritingEntry({ params }) {
  const { slug } = await params;
  if (!milestones.entries.some((entry) => entry.slug === slug)) notFound();
  redirect(`/journal/milestones/${slug}`);
}
