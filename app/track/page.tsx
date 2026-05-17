import { redirect } from "next/navigation";

export default async function TrackRedirectPage({ searchParams }: { searchParams: Promise<{ code?: string }> }) {
  const params = await searchParams;
  if (!params.code) {
    redirect("/");
  }
  redirect(`/track/${encodeURIComponent(params.code.trim())}`);
}
