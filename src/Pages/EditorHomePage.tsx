import { setIsModalOpen } from '../Redux/OvarallSlice';
import { useDispatch } from 'react-redux';
import CodePreview from '../Components/EditorHome/CodePreview';
import { useAuth } from '../Secure/AuthContext';
import CreateProjectModal from '../Components/EditorHome/CreateProjectmodal';
import { useState } from 'react';

const EditorHomePage = () => {
  const { isAuthenticated } = useAuth();
  const dispatch = useDispatch();
  const [isOpen, setIsOpen] = useState(false);

  const handleStartCoding = () => {
    if (!isAuthenticated) {
      dispatch(setIsModalOpen(true));
    } else {
      setIsOpen(true);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground dark:bg-dark-background dark:text-dark-foreground">
      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
        <div className="text-center space-y-8">
          <h1 className="text-5xl md:text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-violet-500">
            Code Together,{' '}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-violet-500 to-pink-500">
              Learn Faster
            </span>
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Experience real-time collaborative coding with our powerful online editor. Write, debug,
            and learn together from anywhere in the world.
          </p>
          <div className="flex justify-center gap-4">
            <button
              onClick={handleStartCoding}
              className="px-8 py-3 border border-gray-700 hover:bg-blue-500 rounded-lg font-semibold transition-all bg-background text-foreground dark:bg-dark-background dark:text-dark-foreground"
            >
              Start Coding
            </button>
            <button className="px-8 py-3 border border-gray-700 hover:bg-gray-700 rounded-lg font-semibold transition-all bg-background text-foreground dark:bg-dark-background dark:text-dark-foreground">
              Watch Demo
            </button>
          </div>
        </div>

        {/* Code Preview */}
        <div className="mt-20">
          <CodePreview />
        </div>
      </main>
      <CreateProjectModal isOpen={isOpen} onOpenChange={open => setIsOpen(open)} />
    </div>
  );
};

export default EditorHomePage;
