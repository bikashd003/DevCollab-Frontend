const CodePreview = () => {
  return (
    <div className="rounded-xl overflow-hidden bg-background text-foreground dark:bg-dark-background dark:text-dark-foreground border border-gray-700">
      <div className="flex items-center space-x-2 px-4 py-2 bg-gray-800">
        <div className="w-3 h-3 rounded-full bg-red-500"></div>
        <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
        <div className="w-3 h-3 rounded-full bg-green-500"></div>
      </div>
      <div className="p-4 font-mono text-sm">
        <pre>
          <span className="text-purple-400">function</span>
          <span className="text-yellow-400"> calculateFactorial</span>(n) {'{'}
        </pre>
        <pre className="ml-4">
          <span className="text-blue-400">if</span> (n ==={' '}
          <span className="text-orange-400">0</span> || n ==={' '}
          <span className="text-orange-400">1</span>) {'{'}
        </pre>
        <pre className="ml-8">
          <span className="text-blue-400">return</span> <span className="text-orange-400">1</span>;
        </pre>
        <pre className="ml-4">{'}'}</pre>
        <pre className="ml-4">
          <span className="text-blue-400">return</span> n * calculateFactorial(n -{' '}
          <span className="text-orange-400">1</span>);
        </pre>
        <pre>{'}'}</pre>
        <pre> </pre>
        <pre>
          <span className="text-purple-400">const</span> result = calculateFactorial(
          <span className="text-orange-400">5</span>);
        </pre>
        <pre>
          console.<span className="text-yellow-400">log</span>(result);{' '}
          <span className="text-gray-400">{'// Output: 120'}</span>
        </pre>
      </div>
    </div>
  );
};

export default CodePreview;
