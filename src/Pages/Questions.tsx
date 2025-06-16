import React, { useEffect, useState } from 'react';
import QuestionCard from '../Components/QuestionCard';
import { SearchOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { Pagination, Skeleton, Button } from '@nextui-org/react';
import { GET_ALL_QUESTIONS, SEARCH_QUESTIONS } from '../GraphQL/Queries/Questions/Questions';
import { GET_POPULAR_TAGS } from '../GraphQL/Queries/Blogs/Blog';
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
  upvotes: { id: string }[];
  downvotes: { id: string }[];
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

  const { data: popularTagsData } = useQuery(GET_POPULAR_TAGS, {
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
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 shadow-lg">
      {searchResults.length === 0 ? (
        <div className="w-[32vw] grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="space-y-2">
            <p className="text-gray-700 dark:text-gray-300 text-sm">
              <strong className="text-blue-600 dark:text-blue-400">[tag]</strong>{' '}
              <span className="text-gray-500 dark:text-gray-400">search by tag</span>
            </p>
            <p className="text-gray-700 dark:text-gray-300 text-sm">
              <strong className="text-blue-600 dark:text-blue-400">title</strong>{' '}
              <span className="text-gray-500 dark:text-gray-400">search by title</span>
            </p>
          </div>
          <div className="space-y-2">
            <p className="text-gray-700 dark:text-gray-300 text-sm">
              <strong className="text-blue-600 dark:text-blue-400">user:username</strong>{' '}
              <span className="text-gray-500 dark:text-gray-400">search by user</span>
            </p>
          </div>
        </div>
      ) : (
        <div className="space-y-2 max-h-60 overflow-y-auto custom-scrollbar-thin">
          {searchResults.map((question, index) => (
            <div
              className="flex gap-3 items-center text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 p-2 rounded-lg transition-all duration-200 cursor-pointer"
              key={index}
              onClick={() => navigate(`/questions/${question.id}`)}
            >
              <SearchOutlined className="text-blue-600 dark:text-blue-400 text-sm" />
              <span className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200 text-sm truncate">
                {question.title}
              </span>
            </div>
          ))}
        </div>
      )}
      <hr className="my-3 border-gray-200 dark:border-gray-700" />
      <div className="flex justify-end">
        <button
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-all duration-200 text-sm shadow-sm hover:shadow-md"
          onClick={() => navigate('/questions/ask')}
        >
          Ask Question
        </button>
      </div>
    </div>
  );
  const filters = {
    tags:
      popularTagsData?.getPopularTags?.map((tag: any) => ({
        value: tag.tag,
        label: `${tag.tag} (${tag.count})`,
      })) || [],
    sortBy: [
      { value: 'newest', label: 'Newest' },
      { value: 'oldest', label: 'Oldest' },
      { value: 'most-voted', label: 'Most Voted' },
      { value: 'most-answered', label: 'Most Answered' },
    ],
  };

  const handleFiltersChange = async () => {
    // TODO: Implement filter functionality
    // This would involve updating the GraphQL query with filter parameters
  };
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 dark:bg-gray-900 dark:text-gray-100 transition-colors duration-300">
      <div className="h-20"></div>
      <main className="container mx-auto px-4 py-6 flex flex-col lg:flex-row gap-6">
        {/* Main Content Area */}
        <div className="lg:w-3/4 space-y-6">
          {/* Header Section */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
          >
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-1">
                Questions
              </h1>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Find answers or ask your own questions to the community
              </p>
            </div>
            <Button
              onClick={() => navigate('/questions/ask')}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow-sm flex items-center gap-2 transition-all duration-200"
              startContent={<FiPlus size={16} />}
              size="sm"
            >
              Ask Question
            </Button>
          </motion.div>

          {/* Search and Filter Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="flex flex-col sm:flex-row gap-3"
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
                      className="w-full h-10 text-sm"
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
              className="h-10 px-4 border-gray-300 dark:border-gray-600 text-sm"
              startContent={<FiFilter size={16} />}
              size="sm"
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
                className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 shadow-sm"
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
            className="space-y-4"
          >
            {error ? (
              <EmptyState type="error" onRetry={refetch} />
            ) : loading ? (
              // Loading skeletons
              Array.from({ length: 5 }).map((_, index) => (
                <Skeleton
                  key={index}
                  className="w-full h-40 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700"
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
              className="flex justify-center pt-6"
            >
              <Pagination
                showControls
                total={searchTerm ? totalSearchPages : data?.getQuestions?.totalPages || 1}
                initialPage={1}
                page={page}
                onChange={newPage => setPage(newPage)}
                className="pagination-theme"
                size="sm"
              />
            </motion.div>
          )}
        </div>

        {/* Right Sidebar */}
        <aside className="lg:w-1/4 space-y-4">
          {/* Quick Stats */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 shadow-sm"
          >
            <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100 mb-3 flex items-center gap-2">
              <FiTrendingUp className="text-blue-600 dark:text-blue-400" size={16} />
              Community Stats
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-600 dark:text-gray-400 text-sm">Total Questions</span>
                <span className="font-semibold text-gray-900 dark:text-gray-100 text-sm">
                  {data?.getQuestions?.totalQuestions || 0}
                </span>
              </div>
            </div>
          </motion.div>

          {/* Popular Tags */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 shadow-sm"
          >
            <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100 mb-3">
              Popular Tags
            </h3>
            <div className="flex flex-wrap gap-2">
              {popularTagsData?.getPopularTags?.slice(0, 6).map((tag: any) => (
                <span
                  key={tag.tag}
                  className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full text-xs hover:bg-blue-100 dark:hover:bg-blue-900/30 hover:text-blue-700 dark:hover:text-blue-300 cursor-pointer transition-colors duration-200"
                  onClick={() => {
                    setSearchTerm(`[${tag.tag}]`);
                    handleSearch(`[${tag.tag}]`);
                  }}
                >
                  {tag.tag} ({tag.count})
                </span>
              )) ||
                // Fallback if no data
                ['React', 'JavaScript', 'TypeScript', 'Node.js', 'CSS', 'HTML'].map(tag => (
                  <span
                    key={tag}
                    className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full text-xs hover:bg-blue-100 dark:hover:bg-blue-900/30 hover:text-blue-700 dark:hover:text-blue-300 cursor-pointer transition-colors duration-200"
                    onClick={() => {
                      setSearchTerm(`[${tag}]`);
                      handleSearch(`[${tag}]`);
                    }}
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
            className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 shadow-sm"
          >
            <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100 mb-2">
              Need Help?
            </h3>
            <p className="text-gray-600 dark:text-gray-400 text-xs mb-3">
              Learn how to ask great questions and get better answers.
            </p>
            <Button
              variant="bordered"
              className="w-full border-blue-300 dark:border-blue-700 text-blue-700 dark:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/30 text-xs"
              startContent={<FiMessageSquare size={14} />}
              size="sm"
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
