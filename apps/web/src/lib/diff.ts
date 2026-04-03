'use client';

// Unified diffing utility placeholder
export function computeDiff(oldText: string, newText: string) {
  // Simple line-based diff for demo
  const oldLines = oldText.split('\n');
  const newLines = newText.split('\n');
  
  return {
    removed: oldLines.filter(l => !newLines.includes(l)),
    added: newLines.filter(l => !oldLines.includes(l)),
  };
}
