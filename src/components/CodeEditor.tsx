import CodeMirror from '@uiw/react-codemirror';
import { javascript } from '@codemirror/lang-javascript';
import { ClipboardDocumentIcon } from '@heroicons/react/20/solid';

interface CodeEditorProps {
  value: string;
  onChange?: (value: string) => void;
  readOnly?: boolean;
  placeholder?: string;
  className?: string;
}

export function CodeEditor({
  value,
  onChange,
  readOnly = false,
  placeholder = '',
  className = '',
}: CodeEditorProps) {
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(value);
    } catch (err) {
      console.error('Failed to copy text:', err);
    }
  };

  return (
    <div className={`relative h-full ${className}`}>
      <button
        onClick={handleCopy}
        className="absolute top-2 right-2 z-10 p-1 rounded-md bg-gray-100 hover:bg-gray-200 transition-colors"
        title="Copy to clipboard"
      >
        <ClipboardDocumentIcon className="h-5 w-5 text-gray-600" />
      </button>
      <div className="h-full overflow-auto border rounded-lg shadow-sm">
        <CodeMirror
          value={value}
          onChange={onChange}
          readOnly={readOnly}
          placeholder={placeholder}
          theme="light"
          height="100%"
          extensions={[javascript()]}
          basicSetup={{
            lineNumbers: true,
            foldGutter: true,
            highlightActiveLine: true,
            highlightSelectionMatches: true,
            syntaxHighlighting: true,
          }}
        />
      </div>
    </div>
  );
} 