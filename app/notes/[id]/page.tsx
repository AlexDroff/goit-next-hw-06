import { QueryClient, dehydrate } from "@tanstack/react-query";
import { fetchNoteById } from "@/lib/api";
import NoteDetailsClient from "./NoteDetails.client";

interface NotePageProps {
  params: { id?: string };
}

export default async function NotePage({ params }: NotePageProps) {
  const noteId = params.id ?? "";

  if (!noteId) {
    return <p>Note ID is missing.</p>;
  }

  const queryClient = new QueryClient();

  try {
    await queryClient.prefetchQuery({
      queryKey: ["note", noteId],
      queryFn: () => fetchNoteById(noteId),
    });
  } catch (error) {
    return <p>Could not fetch note details. {(error as Error).message}</p>;
  }

  return (
    <NoteDetailsClient
      noteId={noteId}
      dehydratedState={dehydrate(queryClient)}
    />
  );
}
