import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const useTypingEffect = (text: any, speed = 50) => {
  const [displayedText, setDisplayedText] = useState('');

  useEffect(() => {
    let i = 0;
    const typingInterval = setInterval(() => {
      if (i < text.length) {
        setDisplayedText(prev => prev + text.charAt(i));
        i++;
      } else {
        clearInterval(typingInterval);
      }
    }, speed);

    return () => clearInterval(typingInterval);
  }, [text, speed]);

  return displayedText;
};

const CodeEditorMockup = () => {
  const codeSnippet = `
function collaborateAndCode() {
  const developers = connectToPeers();
  const project = createSharedWorkspace();

  developers.forEach(dev => {
    dev.shareIdeas();
    dev.reviewCode();
    dev.learnTogether();
  });

  return innovation();
}
  `;

  const typedCode = useTypingEffect(codeSnippet.trim(), 30);

  return (
    <div className="flex flex-col lg:flex-row gap-8 p-8 justify-center">
      <motion.div
        initial={{ opacity: 0, x: -100 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8 }}
        className="w-full max-w-md"
      >
        <div className="relative">
          <div className="absolute -inset-4 bg-gradient-to-r from-purple-500/20 via-pink-500/20 to-cyan-500/20 rounded-2xl blur-2xl" />
          <div className="relative bg-slate-900/90 backdrop-blur-xl border border-slate-700 rounded-2xl shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 bg-slate-800/50 border-b border-slate-700">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              </div>
              <div className="flex items-center space-x-4 text-slate-400 text-sm">
                <div className="flex items-center space-x-1">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span>Live</span>
                </div>
              </div>
            </div>
            <div className="p-6 font-mono text-sm relative h-96">
              <pre className="text-slate-300 h-full overflow-auto">{typedCode}</pre>
            </div>
            <div className="px-6 py-3 bg-slate-800/30 border-t border-slate-700">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-400">Active Collaborators</span>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
                    <span className="text-xs text-purple-400">Alex</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-cyan-500 rounded-full animate-pulse"></div>
                    <span className="text-xs text-cyan-400">Sarah</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, x: 100 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, delay: 0.3 }}
        className="w-full max-w-md"
      >
        <div className="relative">
          <div className="absolute -inset-4 bg-gradient-to-r from-purple-500/20 via-pink-500/20 to-cyan-500/20 rounded-2xl blur-2xl" />
          <div className="relative bg-slate-900/90 backdrop-blur-xl border border-slate-700 rounded-2xl shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 bg-slate-800/50 border-b border-slate-700">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              </div>
              <div className="flex items-center space-x-4 text-slate-400 text-sm">
                <div className="flex items-center space-x-1">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span>Live</span>
                </div>
              </div>
            </div>
            <div className="p-6 font-mono text-sm relative h-96">
              <pre className="text-slate-300 h-full overflow-auto">{typedCode}</pre>
            </div>
            <div className="px-6 py-3 bg-slate-800/30 border-t border-slate-700">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-400">Active Collaborators</span>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-cyan-500 rounded-full animate-pulse"></div>
                    <span className="text-xs text-cyan-400">Sarah</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
                    <span className="text-xs text-purple-400">Alex</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default CodeEditorMockup;
