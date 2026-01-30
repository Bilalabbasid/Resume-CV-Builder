"use client";

import { useEffect } from "react";

interface KeyboardShortcut {
  key: string;
  ctrlKey?: boolean;
  metaKey?: boolean;
  shiftKey?: boolean;
  handler: () => void;
  description: string;
}

export function useKeyboardShortcuts(shortcuts: KeyboardShortcut[]) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      shortcuts.forEach((shortcut) => {
        const matchesKey = e.key.toLowerCase() === shortcut.key.toLowerCase();
        const matchesCtrl = shortcut.ctrlKey ? e.ctrlKey || e.metaKey : !e.ctrlKey && !e.metaKey;
        const matchesShift = shortcut.shiftKey ? e.shiftKey : !e.shiftKey;

        if (matchesKey && matchesCtrl && matchesShift) {
          e.preventDefault();
          shortcut.handler();
        }
      });
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [shortcuts]);
}

export function KeyboardShortcutsHelp({ shortcuts }: { shortcuts: KeyboardShortcut[] }) {
  return (
    <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-4 max-w-md">
      <h3 className="font-semibold mb-3 text-sm">Keyboard Shortcuts</h3>
      <div className="space-y-2">
        {shortcuts.map((shortcut, idx) => (
          <div key={idx} className="flex justify-between items-center text-sm">
            <span className="text-neutral-400">{shortcut.description}</span>
            <kbd className="px-2 py-1 bg-neutral-800 rounded text-xs font-mono text-neutral-300">
              {shortcut.ctrlKey && "Ctrl+"}
              {shortcut.shiftKey && "Shift+"}
              {shortcut.key.toUpperCase()}
            </kbd>
          </div>
        ))}
      </div>
    </div>
  );
}
