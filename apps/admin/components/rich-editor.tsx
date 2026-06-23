"use client";

import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import Table from "@tiptap/extension-table";
import TableCell from "@tiptap/extension-table-cell";
import TableHeader from "@tiptap/extension-table-header";
import TableRow from "@tiptap/extension-table-row";
import Youtube from "@tiptap/extension-youtube";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import {
  Bold,
  Heading2,
  Heading3,
  ImagePlus,
  Italic,
  Link as LinkIcon,
  List,
  ListOrdered,
  Quote,
  Redo,
  Table as TableIcon,
  Undo,
  Youtube as YoutubeIcon,
} from "lucide-react";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { uploadImageAction } from "@/app/(dashboard)/upload-actions";
import { cn } from "@/lib/utils";

export function RichEditor({
  name,
  defaultValue = "",
}: {
  name: string;
  defaultValue?: string;
}) {
  const [html, setHtml] = useState(defaultValue);
  const fileRef = useRef<HTMLInputElement>(null);

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit,
      Link.configure({ openOnClick: false }),
      Image,
      Youtube.configure({ width: 640, height: 360 }),
      Table.configure({ resizable: false }),
      TableRow,
      TableHeader,
      TableCell,
    ],
    content: defaultValue,
    editorProps: {
      attributes: { class: "tiptap prose-none" },
    },
    onUpdate: ({ editor }) => setHtml(editor.getHTML()),
  });

  if (!editor) {
    return <div className="h-80 animate-pulse rounded-lg bg-gray-100" />;
  }

  async function uploadImage(file: File) {
    const fd = new FormData();
    fd.append("file", file);
    const res = await uploadImageAction(fd);
    if (res.error) {
      toast.error(res.error);
      return;
    }
    editor?.chain().focus().setImage({ src: res.url! }).run();
  }

  function addYoutube() {
    const url = window.prompt("Tempel URL YouTube:");
    if (url) editor?.chain().focus().setYoutubeVideo({ src: url }).run();
  }

  function addLink() {
    const url = window.prompt("Tempel URL tautan:");
    if (url) editor?.chain().focus().setLink({ href: url }).run();
  }

  return (
    <div>
      <input type="hidden" name={name} value={html} />
      <div className="rounded-lg border border-gray-300 bg-white">
        {/* Toolbar */}
        <div className="flex flex-wrap gap-1 border-b border-gray-200 p-2">
          <Tb onClick={() => editor.chain().focus().toggleBold().run()} active={editor.isActive("bold")}>
            <Bold className="h-4 w-4" />
          </Tb>
          <Tb onClick={() => editor.chain().focus().toggleItalic().run()} active={editor.isActive("italic")}>
            <Italic className="h-4 w-4" />
          </Tb>
          <Sep />
          <Tb
            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
            active={editor.isActive("heading", { level: 2 })}
          >
            <Heading2 className="h-4 w-4" />
          </Tb>
          <Tb
            onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
            active={editor.isActive("heading", { level: 3 })}
          >
            <Heading3 className="h-4 w-4" />
          </Tb>
          <Sep />
          <Tb onClick={() => editor.chain().focus().toggleBulletList().run()} active={editor.isActive("bulletList")}>
            <List className="h-4 w-4" />
          </Tb>
          <Tb onClick={() => editor.chain().focus().toggleOrderedList().run()} active={editor.isActive("orderedList")}>
            <ListOrdered className="h-4 w-4" />
          </Tb>
          <Tb onClick={() => editor.chain().focus().toggleBlockquote().run()} active={editor.isActive("blockquote")}>
            <Quote className="h-4 w-4" />
          </Tb>
          <Sep />
          <Tb onClick={addLink} active={editor.isActive("link")}>
            <LinkIcon className="h-4 w-4" />
          </Tb>
          <Tb onClick={() => fileRef.current?.click()}>
            <ImagePlus className="h-4 w-4" />
          </Tb>
          <Tb onClick={addYoutube}>
            <YoutubeIcon className="h-4 w-4" />
          </Tb>
          <Tb
            onClick={() =>
              editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()
            }
          >
            <TableIcon className="h-4 w-4" />
          </Tb>
          <Sep />
          <Tb onClick={() => editor.chain().focus().undo().run()}>
            <Undo className="h-4 w-4" />
          </Tb>
          <Tb onClick={() => editor.chain().focus().redo().run()}>
            <Redo className="h-4 w-4" />
          </Tb>
        </div>

        <EditorContent editor={editor} />
      </div>

      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) uploadImage(f);
          e.target.value = "";
        }}
      />
    </div>
  );
}

function Tb({
  onClick,
  active,
  children,
}: {
  onClick: () => void;
  active?: boolean;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "grid h-8 w-8 place-items-center rounded transition-colors",
        active ? "bg-primary text-white" : "text-gray-600 hover:bg-gray-100",
      )}
    >
      {children}
    </button>
  );
}

function Sep() {
  return <span className="mx-1 w-px self-stretch bg-gray-200" />;
}
