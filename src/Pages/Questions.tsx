import React, { useEffect, useState } from 'react';
import QuestionCard from '../Components/QuestionCard';
import { SearchOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { Pagination, Skeleton, Button } from '@nextui-org/react';
import { GET_ALL_QUESTIONS, SEARCH_QUESTIONS } from '../GraphQL/Queries/Questions/Questions';
import { useQuery, useLazyQuery } from '@apollo/client';
import { Input, Popover } from 'antd';
import { debounce } from 'lodash';
import FiltersContainer from '../Components/Questions/Filter';
import { motion, AnimatePresence } from 'framer-motion';
import { FiSearch, FiFilter, FiPlus, FiMessageSquare, FiTrendingUp } from 'react-icons/fi';
import EmptyState from '../Components/Questions/EmptyState';

interface Question {
  id: string;
  title: string;
  votes: number;
  tags: string[];
  author: {
    username: string;
    profilePicture: string;
  };
  createdAt: string;
}

const QuestionsPage: React.FC = () => {
  const navigate = useNavigate();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [popoverVisible, setPopoverVisible] = useState(false);
  const [searchResults, setSearchResults] = useState<Question[]>([]);
  const [totalSearchPages, setTotalSearchPages] = useState(0);
  const [page, setPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const { loading, data, error, refetch } = useQuery(GET_ALL_QUESTIONS, {
    variables: {
      limit: itemsPerPage,
      offset: (page - 1) * itemsPerPage,
    },
    skip: !!searchTerm,
    errorPolicy: 'all',
  });
  useEffect(() => {
    if (data?.getQuestions?.questions) {
      setQuestions(data?.getQuestions?.questions);
    }
  }, [data]);
  const [executeSearch] = useLazyQuery(SEARCH_QUESTIONS, {
    onCompleted: data => {
      setSearchResults(data.searchQuestions.questions);
      setTotalSearchPages(data.searchQuestions.totalPages);
    },
  });
  const [executeSubmitSearch] = useLazyQuery(SEARCH_QUESTIONS, {
    onCompleted: data => {
      setQuestions(data.searchQuestions.questions);
      setTotalSearchPages(data.searchQuestions.totalPages);
    },
  });
  const submitSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (searchTerm.startsWith('user:')) {
      // Handle search by user
      const username = searchTerm.replace('user:', '').trim();
      executeSubmitSearch({
        variables: {
          userId: username,
          limit: itemsPerPage,
          offset: (page - 1) * itemsPerPage,
        },
      });
    } else if (searchTerm.startsWith('[') && searchTerm.endsWith(']')) {
      // Handle search by tags
      const tags = searchTerm.match(/\[(.*?)]/g)?.map(tag => tag.replace(/[[\]]/g, ''));
      executeSubmitSearch({
        variables: {
          tags: tags,
          limit: itemsPerPage,
          offset: (page - 1) * itemsPerPage,
        },
      });
    } else {
      // Handle normal search by title
      executeSubmitSearch({
        variables: {
          searchTerm,
          limit: itemsPerPage,
          offset: (page - 1) * itemsPerPage,
        },
      });
    }
  };

  const handleSearch = debounce((value: string) => {
    setPopoverVisible(!!value);
    if (value) {
      executeSearch({
        variables: {
          searchTerm: value,
          limit: itemsPerPage,
          offset: (page - 1) * itemsPerPage,
        },
      });
    } else {
      setSearchResults([]);
      setTotalSearchPages(0);
    }
  }, 300);

  const content = (
    <div className="bg-theme-secondary border-theme-primary border rounded-lg p-4 shadow-theme-lg glass-theme">
      {searchResults.length === 0 ? (
        <div className="w-[35vw] grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <p className="text-theme-secondary">
              <strong className="text-theme-accent">[tag]</strong>{' '}
              <span className="text-theme-muted">search by tag</span>
            </p>
            <p className="text-theme-secondary">
              <strong className="text-theme-accent">title</strong>{' '}
              <span className="text-theme-muted">search by title</span>
            </p>
          </div>
          <div className="space-y-2">
            <p className="text-theme-secondary">
              <strong className="text-theme-accent">user:1234</strong>{' '}
              <span className="text-theme-muted">search by user</span>
            </p>
          </div>
        </div>
      ) : (
        <div className="space-y-3 max-h-64 overflow-y-auto custom-scrollbar-thin">
          {searchResults.map((question, index) => (
            <div
              className="flex gap-3 items-center text-theme-primary hover-theme-bg p-2 rounded-lg transition-all duration-200 cursor-pointer"
              key={index}
              onClick={() => navigate(`/questions/${question.id}`)}
            >
              <SearchOutlined className="text-theme-accent" />
              <span className="text-theme-primary hover:text-theme-accent transition-colors duration-200">
                {question.title}
              </span>
            </div>
          ))}
        </div>
      )}
      <hr className="my-4 border-theme-primary" />
      <div className="flex justify-end">
        <button
          className="bg-theme-accent text-white hover-theme-bg px-4 py-2 rounded-lg font-medium transition-all duration-300 shadow-theme-md hover:shadow-theme-lg transform hover:-translate-y-0.5"
          onClick={() => navigate('/questions/ask')}
        >
          Ask Question
        </button>
      </div>
    </div>
  );
  const filters = {
    category: [
      { value: 'electronics', label: 'Electronics' },
      { value: 'clothing', label: 'Clothing' },
    ],
    price: [
      { value: '0-50', label: '$0 - $50' },
      { value: '51-100', label: '$51 - $100' },
    ],
  };

  const handleFiltersChange = async () => {
    // console.log(selectedFilters)
    // try {
    //   const response = await axios.get('/api/filter', { params: selectedFilters });
    //   setData(response.data);
    // } catch (error) {
    //   console.error('Error fetching filtered data:', error);
  };
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 dark:bg-gray-900 dark:text-gray-100 font-mono transition-colors duration-300">
      <div className="h-20"></div>
      <main className="container mx-auto px-6 py-10 flex flex-col lg:flex-row gap-10">
        {/* Main Content Area */}
        <div className="lg:w-3/4 space-y-8">
          {/* Header Section */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
          >
            <div>
              <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                Questions
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Find answers or ask your own questions to the community
              </p>
            </div>
            <Button
              onClick={() => navigate('/questions/ask')}
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-lg shadow-md flex items-center gap-2 transition-all duration-200"
              startContent={<FiPlus size={20} />}
            >
              Ask Question
            </Button>
          </motion.div>

          {/* Search and Filter Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="flex flex-col sm:flex-row gap-4"
          >
            <div className="flex-1">
              <Popover
                content={content}
                placement="bottom"
                trigger="click"
                open={popoverVisible}
                onOpenChange={setPopoverVisible}
              >
                <form onSubmit={submitSearch} className="w-full">
                  <div className="relative">
                    <Input
                      placeholder="Search questions by title, tags, or user..."
                      prefix={<FiSearch className="text-gray-400" />}
                      value={searchTerm}
                      onChange={e => {
                        setSearchTerm(e.target.value);
                        handleSearch(e.target.value);
                      }}
                      className="w-full h-12 text-base"
                      style={{
                        backgroundColor: 'transparent',
                        borderColor: 'rgb(209 213 219)',
                      }}
                    />
                  </div>
                </form>
              </Popover>
            </div>
            <Button
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              variant="bordered"
              className="h-12 px-6 border-gray-300 dark:border-gray-600"
              startContent={<FiFilter size={18} />}
            >
              Filters
            </Button>
          </motion.div>

          {/* Filter Panel */}
          <AnimatePresence>
            {isFilterOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6 shadow-sm"
              >
                <FiltersContainer filters={filters} onFiltersChange={handleFiltersChange} />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Questions List */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="space-y-6"
          >
            {error ? (
              <EmptyState type="error" onRetry={refetch} />
            ) : loading ? (
              // Loading skeletons
              Array.from({ length: 5 }).map((_, index) => (
                <Skeleton
                  key={index}
                  className="w-full h-48 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700"
                />
              ))
            ) : questions?.length === 0 ? (
              searchTerm ? (
                <EmptyState type="no-search-results" searchTerm={searchTerm} />
              ) : (
                <EmptyState type="no-questions" />
              )
            ) : (
              questions?.map((question: Question) => (
                <motion.div
                  key={question.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <QuestionCard question={question} loading={false} />
                </motion.div>
              ))
            )}
          </motion.div>

          {/* Pagination */}
          {questions?.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex justify-center pt-8"
            >
              <Pagination
                showControls
                total={searchTerm ? totalSearchPages : data?.getQuestions?.totalPages || 1}
                initialPage={1}
                page={page}
                onChange={newPage => setPage(newPage)}
                className="pagination-theme"
              />
            </motion.div>
          )}
        </div>

        {/* Right Sidebar */}
        <aside className="lg:w-1/4 space-y-6">
          {/* Quick Stats */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6 shadow-sm"
          >
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
              <FiTrendingUp className="text-emerald-600" />
              Community Stats
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600 dark:text-gray-400">Total Questions</span>
                <span className="font-semibold text-gray-900 dark:text-gray-100">
                  {data?.getQuestions?.totalQuestions || 0}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600 dark:text-gray-400">Active Users</span>
                <span className="font-semibold text-gray-900 dark:text-gray-100">1,234</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600 dark:text-gray-400">Answered</span>
                <span className="font-semibold text-emerald-600">89%</span>
              </div>
            </div>
          </motion.div>

          {/* Popular Tags */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6 shadow-sm"
          >
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
              Popular Tags
            </h3>
            <div className="flex flex-wrap gap-2">
              {['React', 'JavaScript', 'TypeScript', 'Node.js', 'CSS', 'HTML'].map(tag => (
                <span
                  key={tag}
                  className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full text-sm hover:bg-emerald-100 dark:hover:bg-emerald-900 hover:text-emerald-700 dark:hover:text-emerald-300 cursor-pointer transition-colors duration-200"
                >
                  {tag}
                </span>
              ))}
            </div>
          </motion.div>

          {/* Help Section */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="bg-gradient-to-br from-emerald-50 to-blue-50 dark:from-emerald-900/20 dark:to-blue-900/20 border border-emerald-200 dark:border-emerald-800 rounded-xl p-6"
          >
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">
              Need Help?
            </h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
              Learn how to ask great questions and get better answers.
            </p>
            <Button
              variant="bordered"
              className="w-full border-emerald-300 dark:border-emerald-700 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-50 dark:hover:bg-emerald-900/30"
              startContent={<FiMessageSquare size={16} />}
            >
              Question Guidelines
            </Button>
          </motion.div>
        </aside>
      </main>
    </div>
  );
};

export default QuestionsPage;
