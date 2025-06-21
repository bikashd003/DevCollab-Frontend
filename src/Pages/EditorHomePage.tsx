import { setIsModalOpen } from '../Redux/OvarallSlice';
import { useDispatch } from 'react-redux';
import { useAuth } from '../Secure/AuthContext';
import CreateProjectModal from '../Components/EditorHome/CreateProjectmodal';
import { useState, useEffect } from 'react';

const EditorHomePage = () => {
  const { isAuthenticated } = useAuth();
  const dispatch = useDispatch();
  const [isOpen, setIsOpen] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [currentCodeIndex, setCurrentCodeIndex] = useState(0);

  const codeExamples = [
    {
      language: 'JavaScript',
      code: `function calculateFactorial(n) {
  if (n === 0 || n === 1) {
    return 1;
  }
  return n * calculateFactorial(n - 1);
}

const result = calculateFactorial(5);
console.log(result); // Output: 120`,
      highlight: 'from-yellow-400 to-orange-500',
    },
    {
      language: 'Python',
      code: `def fibonacci(n):
    if n <= 1:
        return n
    return fibonacci(n-1) + fibonacci(n-2)

# Generate sequence
sequence = [fibonacci(i) for i in range(10)]
print(sequence)  # [0, 1, 1, 2, 3, 5, 8, 13, 21, 34]`,
      highlight: 'from-blue-400 to-cyan-500',
    },
    {
      language: 'React JSX',
      code: `const UserProfile = ({ user }) => {
  const [isOnline, setIsOnline] = useState(false);
  
  useEffect(() => {
    setIsOnline(user.status === 'online');
  }, [user.status]);

  return (
    <div className="profile-card">
      <h2>{user.name}</h2>
      <span className={isOnline ? 'online' : 'offline'}>
        {isOnline ? '🟢 Online' : '⚫ Offline'}
      </span>
    </div>
  );
};`,
      highlight: 'from-purple-400 to-pink-500',
    },
  ];

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentCodeIndex(prev => (prev + 1) % codeExamples.length);
    }, 4000);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleStartCoding = () => {
    if (!isAuthenticated) {
      dispatch(setIsModalOpen(true));
    } else {
      setIsOpen(true);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-950/20 via-purple-950/10 to-pink-950/20"></div>

        {/* Floating Orbs */}
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-3/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-1/4 left-1/3 w-80 h-80 bg-pink-500/10 rounded-full blur-3xl animate-pulse delay-2000"></div>

        {/* Grid Pattern */}
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `
              linear-gradient(rgba(59, 130, 246, 0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(59, 130, 246, 0.1) 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px',
            transform: `translate(${mousePosition.x * -0.01}px, ${mousePosition.y * -0.01}px)`,
          }}
        ></div>
      </div>

      {/* Hero Section */}
      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
        <div className="text-center space-y-12">
          {/* Main Heading */}
          <div className="space-y-6">
            <div className="inline-flex items-center px-4 py-2 bg-blue-500/10 rounded-full border border-blue-500/20 backdrop-blur-sm">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse mr-2"></div>
              <span className="text-sm text-blue-300 font-medium">
                Real-time collaboration enabled
              </span>
            </div>

            <h1 className="text-4xl md:text-6xl font-black leading-tight">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-white via-blue-100 to-white">
                Code
              </span>
              <br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 animate-gradient-x">
                Together
              </span>
            </h1>

            <p className="text-xl md:text-2xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
              Experience the future of collaborative development with our
              <span className="text-blue-400 font-semibold"> real-time editor</span>. Write, debug,
              and innovate together from anywhere in the world.
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row justify-center gap-6 items-center">
            <button
              onClick={handleStartCoding}
              className="group relative px-8 py-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl font-bold text-lg overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/25"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative flex items-center gap-3">
                <span>Start Coding Now</span>
                <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
              </div>
            </button>

            <button className="group px-8 py-2 border border-gray-600 hover:border-gray-400 rounded-2xl font-semibold text-lg transition-all duration-300 backdrop-blur-sm hover:bg-white/5">
              <span className="flex items-center gap-2">
                <svg
                  className="w-5 h-5 group-hover:scale-110 transition-transform"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                  <path
                    fillRule="evenodd"
                    d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                    clipRule="evenodd"
                  />
                </svg>
                Watch Demo
              </span>
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-8">
            <div className="text-center">
              <div className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-cyan-400">
                50K+
              </div>
              <div className="text-gray-400 mt-2">Active Developers</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-400">
                1M+
              </div>
              <div className="text-gray-400 mt-2">Lines of Code</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-emerald-400">
                99.9%
              </div>
              <div className="text-gray-400 mt-2">Uptime</div>
            </div>
          </div>
        </div>

        {/* Interactive Code Preview */}
        <div className="mt-24 relative">
          <div className="absolute -inset-4 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20 rounded-3xl blur-xl"></div>

          <div className="relative bg-gray-900/80 backdrop-blur-xl rounded-3xl overflow-hidden border border-gray-700/50 shadow-2xl">
            {/* Terminal Header */}
            <div className="flex items-center justify-between px-6 py-4 bg-gray-800/50 border-b border-gray-700/50">
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 rounded-full bg-red-500 shadow-lg"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500 shadow-lg"></div>
                <div className="w-3 h-3 rounded-full bg-green-500 shadow-lg"></div>
              </div>

              <div className="flex items-center space-x-4">
                <div
                  className={`px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r ${codeExamples[currentCodeIndex].highlight} text-black`}
                >
                  {codeExamples[currentCodeIndex].language}
                </div>
                <div className="flex items-center space-x-2 text-gray-400">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse delay-200"></div>
                    <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse delay-400"></div>
                  </div>
                  <span className="text-sm">3 developers online</span>
                </div>
              </div>
            </div>

            {/* Code Content */}
            <div className="p-8 font-mono text-sm leading-relaxed">
              <pre className="text-gray-300 whitespace-pre-wrap">
                {codeExamples[currentCodeIndex].code.split('\n').map((line, index) => (
                  <div
                    key={index}
                    className="group hover:bg-blue-500/5 px-2 py-1 rounded transition-colors"
                  >
                    <span className="text-gray-500 select-none mr-4 text-xs">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <span className="syntax-highlight">{line}</span>
                  </div>
                ))}
              </pre>
            </div>

            {/* Live Cursor Simulation */}
            <div className="absolute top-32 left-48 pointer-events-none">
              <div className="flex items-center space-x-2 animate-bounce">
                <div className="w-0.5 h-5 bg-blue-400 animate-pulse"></div>
                <div className="px-2 py-1 bg-blue-500 text-white text-xs rounded shadow-lg">
                  Alex is typing...
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Features Grid */}
        <div className="mt-32 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="group p-8 bg-gradient-to-br from-blue-500/10 to-transparent rounded-3xl border border-blue-500/20 hover:border-blue-400/40 transition-all duration-300 hover:transform hover:scale-105">
            <div className="w-12 h-12 bg-blue-500/20 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <svg
                className="w-6 h-6 text-blue-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-bold mb-4">Lightning Fast</h3>
            <p className="text-gray-400">
              Experience instant synchronization and real-time collaboration with zero lag.
            </p>
          </div>

          <div className="group p-8 bg-gradient-to-br from-purple-500/10 to-transparent rounded-3xl border border-purple-500/20 hover:border-purple-400/40 transition-all duration-300 hover:transform hover:scale-105">
            <div className="w-12 h-12 bg-purple-500/20 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <svg
                className="w-6 h-6 text-purple-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-bold mb-4">Team Collaboration</h3>
            <p className="text-gray-400">
              Work together seamlessly with live cursors, comments, and voice chat integration.
            </p>
          </div>

          <div className="group p-8 bg-gradient-to-br from-green-500/10 to-transparent rounded-3xl border border-green-500/20 hover:border-green-400/40 transition-all duration-300 hover:transform hover:scale-105">
            <div className="w-12 h-12 bg-green-500/20 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <svg
                className="w-6 h-6 text-green-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-bold mb-4">Smart Features</h3>
            <p className="text-gray-400">
              AI-powered code completion, debugging assistance, and intelligent suggestions.
            </p>
          </div>
        </div>
      </main>

      <CreateProjectModal isOpen={isOpen} onOpenChange={open => setIsOpen(open)} />
    </div>
  );
};

export default EditorHomePage;
