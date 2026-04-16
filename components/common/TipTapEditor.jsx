"use client";
import React, { useState, useEffect } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Heading from "@tiptap/extension-heading";
import Bold from "@tiptap/extension-bold";
import Italic from "@tiptap/extension-italic";
import Blockquote from "@tiptap/extension-blockquote";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import BulletList from "@tiptap/extension-bullet-list";
import OrderedList from "@tiptap/extension-ordered-list";
import {
  ImageIcon,
  LinkIcon,
  OrderListIcon,
  QuoteIcon,
  UnorderListIcon,
} from "@/public/assets/icons/icons";

const TipTapEditor = ({
  value = "",
  onChange = () => {},
  placeholder = "Enter content here...",
  className = "",
}) => {
  const [editorValue, setEditorValue] = useState(value);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Heading.configure({
        levels: [1, 2],
      }),
      Bold,
      Italic,
      Blockquote,
      Link.configure({
        openOnClick: false,
      }),
      Image,
      BulletList,
      OrderedList,
    ],
    content: editorValue,
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      setEditorValue(html);
      onChange(html);
    },
    editorProps: {
      attributes: {
        class:
          "prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none",
        "data-placeholder": placeholder,
      },
    },
    // Fix for SSR hydration issues
    immediatelyRender: false,
  });

  useEffect(() => {
    if (editor && value !== editorValue) {
      editor.commands.setContent(value);
      setEditorValue(value);
    }
  }, [value, editor]);

  const handleToolbarAction = (action) => {
    if (!editor) return;

    switch (action) {
      case "bold":
        editor.chain().focus().toggleBold().run();
        break;
      case "italic":
        editor.chain().focus().toggleItalic().run();
        break;
      case "heading1":
        editor.chain().focus().toggleHeading({ level: 1 }).run();
        break;
      case "heading2":
        editor.chain().focus().toggleHeading({ level: 2 }).run();
        break;
      case "quote":
        editor.chain().focus().toggleBlockquote().run();
        break;
      case "bullet":
        editor.chain().focus().toggleBulletList().run();
        break;
      case "numbered":
        editor.chain().focus().toggleOrderedList().run();
        break;
      case "link": {
        const url = window.prompt("Enter URL:");
        if (url) {
          editor.chain().focus().setLink({ href: url }).run();
        }
        break;
      }
      case "image": {
        const imageUrl = window.prompt("Enter image URL:");
        if (imageUrl) {
          editor.chain().focus().setImage({ src: imageUrl }).run();
        }
        break;
      }
      default:
        break;
    }
  };

  if (!editor) {
    return (
      <div
        className={`bg-white border border-gray-300 rounded-lg ${className}`}
      >
        <div className="flex items-center gap-2 p-4 border-b border-gray-200 bg-gray-50">
          <div className="px-3 py-1 border border-gray-300 rounded text-sm bg-transparent">
            Normal text
          </div>
          <div className="flex gap-2">
            <button className="p-1 hover:bg-gray-100 rounded font-bold text-gray-700">
              B
            </button>
            <button className="p-1 hover:bg-gray-100 rounded text-gray-700">
              I
            </button>
            <button className="p-1 hover:bg-gray-100 rounded font-bold text-gray-700 text-base">
              H
            </button>
            <button className="p-1 hover:bg-gray-100 rounded font-bold text-gray-700 text-sm">
              H
            </button>
            <button className="p-1 hover:bg-gray-100 rounded text-gray-700">
              &quot;
            </button>
            <button className="p-1 hover:bg-gray-100 rounded text-gray-700">
              📎
            </button>
            <button className="p-1 hover:bg-gray-100 rounded text-gray-700">
              🖼️
            </button>
            <button className="p-1 hover:bg-gray-100 rounded text-gray-700">
              ≡
            </button>
            <button className="p-1 hover:bg-gray-100 rounded text-gray-700">
              ☰
            </button>
          </div>
        </div>
        <div className="p-4 min-h-[400px]">
          <div className="h-[350px] bg-gray-100 animate-pulse rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white border border-gray-300 rounded-lg ${className}`}>
      {/* Custom Toolbar */}
      <div className="flex items-center gap-2 p-4 border-b border-gray-200 bg-gray-50 rounded-t-xl">
        {/* Normal text dropdown */}
        <select
          className="px-3 py-1 border border-gray-300 rounded text-sm bg-transparent"
          value={
            editor.isActive("heading", { level: 1 })
              ? "h1"
              : editor.isActive("heading", { level: 2 })
                ? "h2"
                : "normal"
          }
          onChange={(e) => {
            if (e.target.value === "h1") {
              editor.chain().focus().toggleHeading({ level: 1 }).run();
            } else if (e.target.value === "h2") {
              editor.chain().focus().toggleHeading({ level: 2 }).run();
            } else {
              editor.chain().focus().setParagraph().run();
            }
          }}
        >
          <option value="normal">Normal text</option>
          <option value="h1">Heading 1</option>
          <option value="h2">Heading 2</option>
        </select>

        {/* Formatting buttons */}
        <button
          className={`p-1 rounded font-bold text-gray-700 ${
            editor.isActive("bold") ? "bg-gray-200" : "hover:bg-gray-100"
          }`}
          title="Bold"
          onClick={() => handleToolbarAction("bold")}
          type="button"
        >
          B
        </button>
        <button
          className={`p-1 rounded text-gray-700 font-bold italic font-serif ${
            editor.isActive("italic") ? "bg-gray-200" : "hover:bg-gray-100"
          }`}
          title="Italic"
          onClick={() => handleToolbarAction("italic")}
          type="button"
        >
          I
        </button>
        <button
          className={`p-1 rounded font-bold text-gray-700 text-base ${
            editor.isActive("heading", { level: 1 })
              ? "bg-gray-200"
              : "hover:bg-gray-100"
          }`}
          title="Heading 1"
          onClick={() => handleToolbarAction("heading1")}
          type="button"
        >
          H
        </button>
        <button
          className={`p-1 rounded font-bold text-gray-700 text-sm ${
            editor.isActive("heading", { level: 2 })
              ? "bg-gray-200"
              : "hover:bg-gray-100"
          }`}
          title="Heading 2"
          onClick={() => handleToolbarAction("heading2")}
          type="button"
        >
          H
        </button>
        <button
          className={`p-1 rounded text-gray-700 ${
            editor.isActive("blockquote") ? "bg-gray-200" : "hover:bg-gray-100"
          }`}
          title="Quote"
          onClick={() => handleToolbarAction("quote")}
          type="button"
        >
          {QuoteIcon}
        </button>
        <button
          className={`p-1 rounded text-gray-700 ${
            editor.isActive("link") ? "bg-gray-200" : "hover:bg-gray-100"
          }`}
          title="Link"
          onClick={() => handleToolbarAction("link")}
          type="button"
        >
          {LinkIcon}
        </button>
        <button
          className="p-1 hover:bg-gray-100 rounded text-gray-700"
          title="Image"
          onClick={() => handleToolbarAction("image")}
          type="button"
        >
          {ImageIcon}
        </button>
        <button
          className={`p-1 rounded text-gray-700 ${
            editor.isActive("bulletList") ? "bg-gray-200" : "hover:bg-gray-100"
          }`}
          title="Bullet List"
          onClick={() => handleToolbarAction("bullet")}
          type="button"
        >
          {UnorderListIcon}
        </button>
        <button
          className={`p-1 rounded text-gray-700 ${
            editor.isActive("orderedList") ? "bg-gray-200" : "hover:bg-gray-100"
          }`}
          title="Numbered List"
          onClick={() => handleToolbarAction("numbered")}
          type="button"
        >
          {OrderListIcon}
        </button>
      </div>

      {/* TipTap Editor */}
      <div className="p-4 min-h-[400px]">
        <EditorContent
          editor={editor}
          className="min-h-[350px] focus:outline-none"
          style={{
            fontFamily: "inherit",
            fontSize: "14px",
            lineHeight: "1.6",
          }}
        />
      </div>
    </div>
  );
};

export default TipTapEditor;
