import React from 'react';
import Editor from '@monaco-editor/react';
import { useTheme } from '../../context/ThemeContext';
import { Code2, Settings2, RotateCcw } from 'lucide-react';

const CodeEditor = ({
  language = 'javascript',
  setLanguage,
  code = '',
  setCode,
  onReset,
  height = '480px',
}) => {
  const { theme } = useTheme();

  const handleEditorChange = (value) => {
    setCode(value || '');
  };

  return (
    <div className="rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-lg bg-[#1e1e1e] flex flex-col">
      {/* Editor Top Bar */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-slate-900 border-b border-slate-800 text-slate-300">
        <div className="flex items-center space-x-2">
          <Code2 className="w-4 h-4 text-brand-400" />
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-300">
            Monaco Assessment Editor
          </span>
        </div>

        <div className="flex items-center space-x-3">
          {/* Language Selector */}
          <div className="flex items-center space-x-1.5">
            <label htmlFor="lang-select" className="text-xs text-slate-400 font-medium">
              Language:
            </label>
            <select
              id="lang-select"
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="bg-slate-800 text-xs text-white rounded-lg px-2.5 py-1 border border-slate-700 focus:outline-none focus:ring-1 focus:ring-brand-500"
            >
              <option value="javascript">JavaScript (Node.js)</option>
              <option value="python">Python 3</option>
              <option value="java">Java</option>
              <option value="cpp">C++</option>
            </select>
          </div>

          {onReset && (
            <button
              onClick={onReset}
              className="p-1 text-slate-400 hover:text-white transition-colors"
              title="Reset Starter Code"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Monaco Editor Canvas */}
      <div className="flex-1 w-full relative">
        <Editor
          height={height}
          language={language === 'cpp' ? 'cpp' : language}
          value={code}
          onChange={handleEditorChange}
          theme={theme === 'dark' ? 'vs-dark' : 'vs-dark'} // dark editor is preferred for coding contrast
          options={{
            fontSize: 14,
            fontFamily: "'Fira Code', monospace",
            minimap: { enabled: false },
            scrollBeyondLastLine: false,
            automaticLayout: true,
            tabSize: 2,
            lineNumbers: 'on',
            renderLineHighlight: 'all',
            padding: { top: 12, bottom: 12 },
          }}
        />
      </div>
    </div>
  );
};

export default CodeEditor;
