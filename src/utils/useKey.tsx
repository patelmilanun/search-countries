import { RefObject, useEffect } from 'react';

export default function useKey(key: string, ref: RefObject<HTMLInputElement>) {
  useEffect(() => {
    function hotkeyPress(e: KeyboardEvent) {
      if (e.code === key && e.ctrlKey) {
        e.preventDefault();
        ref?.current?.focus();
        return;
      }
    }

    document.addEventListener('keydown', hotkeyPress);
    return () => document.removeEventListener('keydown', hotkeyPress);
  }, [key]);
}
