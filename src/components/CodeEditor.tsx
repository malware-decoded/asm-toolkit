import CodeMirror from '@uiw/react-codemirror';
import { javascript } from '@codemirror/lang-javascript';
import { ClipboardDocumentIcon } from '@heroicons/react/20/solid';
import { useEffect, useState } from 'react';

interface CodeEditorProps {
  value: string;
  onChange?: (value: string) => void;
  readOnly?: boolean;
  placeholder?: string;
  className?: string;
  showCopyButton?: boolean;
}

export function CodeEditor({
  value,
  onChange,
  readOnly = false,
  placeholder = '',
  className = '',
  showCopyButton = true,
}: CodeEditorProps) {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    // Check if dark mode is enabled
    const isDark = document.documentElement.classList.contains('dark');
    setIsDarkMode(isDark);

    // Listen for changes to dark mode
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === 'class') {
          setIsDarkMode(document.documentElement.classList.contains('dark'));
        }
      });
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    });

    return () => observer.disconnect();
  }, []);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(value);
    } catch (err) {
      console.error('Failed to copy text:', err);
    }
  };

  return (
    <div className={`relative h-full ${className}`}>
      {showCopyButton && (
        <button
          onClick={handleCopy}
          className="absolute top-2 right-2 z-10 p-1 rounded-md bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
          title="Copy to clipboard"
        >
          <ClipboardDocumentIcon className="h-5 w-5 text-gray-600 dark:text-gray-300" />
        </button>
      )}
      <div className="h-full overflow-auto border dark:border-gray-700 rounded-lg shadow-sm">
        <CodeMirror
          value={value}
          onChange={onChange}
          readOnly={readOnly}
          placeholder={placeholder}
          theme={isDarkMode ? 'dark' : 'light'}
          height="100%"
          extensions={[javascript()]}
          basicSetup={{
            lineNumbers: true,
            foldGutter: true,
            highlightActiveLine: true,
            highlightSelectionMatches: true,
            syntaxHighlighting: true,
            autocompletion: false,
            bracketMatching: false,
            closeBrackets: false,
            searchKeymap: false,
            defaultKeymap: false,
            historyKeymap: false,
            drawSelection: false,
            dropCursor: false,
            highlightActiveLineGutter: false,
            highlightSpecialChars: false,
            rectangularSelection: false,
            crosshairCursor: false,
            allowMultipleSelections: false,
            tabSize: 2,
          }}
          style={{
            textAlign: "left"
          }}
        />
      </div>
    </div>
  );
} 