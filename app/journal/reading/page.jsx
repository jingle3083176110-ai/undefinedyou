import ReadingRoomClient from "@/components/ReadingRoomClient";
import { getReadingBooks } from "@/lib/reading";

export default function ReadingRoomPage() {
  return <ReadingRoomClient books={getReadingBooks()} />;
}
