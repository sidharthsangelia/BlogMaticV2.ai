import RichTextEditor from "./rich-text-editor";

export default function Post({
  content,
  onContentChange,
}: {
  content: string;
  onContentChange?: (val: string) => void;
}) {
  return (
    <main>
      <RichTextEditor content={content} onChange={onContentChange} />
    </main>
  );
}
