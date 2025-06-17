import React, { useEffect, useState } from 'react';
import QuestionCard from '../Components/QuestionCard';
import { useNavigate } from 'react-router-dom';
import { Skeleton, Button, Input } from '@nextui-org/react';
import Pagination from '../Components/Global/Pagination';
import { GET_ALL_QUESTIONS, SEARCH_QUESTIONS } from '../GraphQL/Queries/Questions/Questions';
import { GET_POPULAR_TAGS } from '../GraphQL/Queries/Blogs/Blog';
import { useQuery, useLazyQuery } from '@apollo/client';
import { debounce } from 'lodash';
import FiltersContainer from '../Components/Questions/Filter';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiSearch,
  FiFilter,
  FiPlus,
  FiMessageSquare,
  FiTrendingUp,
  FiUsers,
  FiHelpCircle,
  FiX,
} from 'react-icons/fi';
import EmptyState from '../Components/Questions/EmptyState';
import CustomPopover from '../Components/Global/CustomPopover';
import SearchPopoverContent from '../Components/Questions/SearchPopover';

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
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);

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

  // Refetch when page or itemsPerPage changes
  useEffect(() => {
    if (!searchTerm) {
      refetch({
        limit: itemsPerPage,
        offset: (page - 1) * itemsPerPage,
      });
    } else {
      // Handle pagination for search results
      handleSearchPagination();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, itemsPerPage, refetch, searchTerm]);

  const handleSearchPagination = () => {
    if (!searchTerm) return;

    setSearchLoading(true);

    if (searchTerm.startsWith('user:')) {
      const username = searchTerm.replace('user:', '').trim();
      executeSubmitSearch({
        variables: {
          userId: username,
          limit: itemsPerPage,
          offset: (page - 1) * itemsPerPage,
        },
      });
    } else if (searchTerm.startsWith('[') && searchTerm.endsWith(']')) {
      const tags = searchTerm.match(/\[(.*?)]/g)?.map(tag => tag.replace(/[[\]]/g, ''));
      executeSubmitSearch({
        variables: {
          tags: tags,
          limit: itemsPerPage,
          offset: (page - 1) * itemsPerPage,
        },
      });
    } else {
      executeSubmitSearch({
        variables: {
          searchTerm,
          limit: itemsPerPage,
          offset: (page - 1) * itemsPerPage,
        },
      });
    }
  };

  const [executeSearch] = useLazyQuery(SEARCH_QUESTIONS, {
    onCompleted: data => {
      setSearchResults(data.searchQuestions.questions);
      setTotalSearchPages(data.searchQuestions.totalPages);
      setSearchLoading(false);
    },
    onError: () => {
      setSearchLoading(false);
    },
  });

  const [executeSubmitSearch] = useLazyQuery(SEARCH_QUESTIONS, {
    onCompleted: data => {
      setQuestions(data.searchQuestions.questions);
      setTotalSearchPages(data.searchQuestions.totalPages);
      setSearchLoading(false);
    },
    onError: () => {
      setSearchLoading(false);
    },
  });

  const submitSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSearchLoading(true);
    setPage(1); // Reset to first page when searching

    if (searchTerm.startsWith('user:')) {
      const username = searchTerm.replace('user:', '').trim();
      executeSubmitSearch({
        variables: {
          userId: username,
          limit: itemsPerPage,
          offset: 0, // Always start from first page for new search
        },
      });
    } else if (searchTerm.startsWith('[') && searchTerm.endsWith(']')) {
      const tags = searchTerm.match(/\[(.*?)]/g)?.map(tag => tag.replace(/[[\]]/g, ''));
      executeSubmitSearch({
        variables: {
          tags: tags,
          limit: itemsPerPage,
          offset: 0, // Always start from first page for new search
        },
      });
    } else {
      executeSubmitSearch({
        variables: {
          searchTerm,
          limit: itemsPerPage,
          offset: 0, // Always start from first page for new search
        },
      });
    }
    setPopoverVisible(false); // Close popover after search
  };

  const handleSearch = debounce((value: string) => {
    setPopoverVisible(!!value);
    if (value) {
      setSearchLoading(true);
      executeSearch({
        variables: {
          searchTerm: value,
          limit: 5, // Limit results in popover for better UX
          offset: 0,
        },
      });
    } else {
      setSearchResults([]);
      setTotalSearchPages(0);
      setSearchLoading(false);
    }
  }, 300);

  const searchPopoverContent = (
    <SearchPopoverContent searchResults={searchResults} isLoading={searchLoading} />
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
  };

  const clearSearch = () => {
    setSearchTerm('');
    setSearchResults([]);
    setTotalSearchPages(0);
    setPopoverVisible(false);
    setPage(1);
    setSearchLoading(false);
    // Refetch original questions
    refetch({
      limit: itemsPerPage,
      offset: 0,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-50 to-blue-50/30 text-gray-900 dark:bg-gradient-to-br dark:from-gray-900 dark:via-gray-900 dark:to-blue-900/10 dark:text-gray-100 transition-all duration-500">
      <div className="h-20"></div>

      <main className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content Area */}
          <div className="lg:col-span-3 space-y-8">
            {/* Hero Header Section - Smaller */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
              className="relative"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 to-purple-600/5 dark:from-blue-400/5 dark:to-purple-400/5 rounded-xl"></div>
              <div className="relative bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 rounded-xl p-6 shadow-lg">
                <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-500 dark:bg-blue-600 rounded-lg shadow-md">
                        <FiMessageSquare className="text-white" size={20} />
                      </div>
                      <div>
                        <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-gray-100">
                          Questions
                        </h1>
                        <p className="text-gray-600 dark:text-gray-400 text-sm">
                          Discover answers, share knowledge, grow together
                        </p>
                      </div>
                    </div>
                  </div>
                  <Button
                    onClick={() => navigate('/questions/ask')}
                    className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700 text-white px-5 py-2 rounded-lg shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200 font-medium"
                    startContent={<FiPlus size={16} />}
                    size="md"
                  >
                    Ask Question
                  </Button>
                </div>
              </div>
            </motion.div>

            {/* Search Status Indicator */}
            {searchTerm && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="bg-blue-50/80 dark:bg-blue-900/20 border border-blue-200/50 dark:border-blue-800/50 rounded-lg p-3"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-blue-700 dark:text-blue-300">
                    <FiSearch className="w-4 h-4" />
                    <span className="text-sm font-medium">
                      Search results for: <span className="font-mono">{searchTerm}</span>
                    </span>
                  </div>
                  <button
                    onClick={clearSearch}
                    className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200 text-sm font-medium transition-colors duration-200"
                  >
                    Clear search
                  </button>
                </div>
              </motion.div>
            )}

            {/* Enhanced Search and Filter Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="space-y-4"
            >
              <div className="flex flex-col lg:flex-row gap-4">
                <div className="flex-1">
                  <CustomPopover
                    content={searchPopoverContent}
                    placement="bottomLeft"
                    trigger="click"
                    open={popoverVisible}
                    onOpenChange={setPopoverVisible}
                    overlayClassName="search-popover"
                    className="w-full"
                  >
                    <form onSubmit={submitSearch} className="w-full">
                      <div className="relative">
                        <Input
                          placeholder="Search questions, tags, or users..."
                          startContent={<FiSearch className="text-gray-400" size={16} />}
                          endContent={
                            searchTerm && (
                              <button
                                type="button"
                                onClick={clearSearch}
                                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors duration-200 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
                              >
                                <FiX size={14} />
                              </button>
                            )
                          }
                          value={searchTerm}
                          onChange={e => {
                            setSearchTerm(e.target.value);
                            handleSearch(e.target.value);
                          }}
                          className="w-full"
                          classNames={{
                            input: 'text-sm',
                            inputWrapper:
                              'h-10 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-2 border-gray-200 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-400 focus-within:border-blue-500 dark:focus-within:border-blue-400 transition-colors duration-200',
                          }}
                          size="md"
                        />
                      </div>
                    </form>
                  </CustomPopover>
                </div>

                <Button
                  onClick={() => setIsFilterOpen(!isFilterOpen)}
                  variant={isFilterOpen ? 'solid' : 'bordered'}
                  className={`h-10 px-4 rounded-lg font-medium transition-all duration-200 ${
                    isFilterOpen
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'border-2 border-gray-300 dark:border-gray-600 hover:border-blue-500 dark:hover:border-blue-400'
                  }`}
                  startContent={<FiFilter size={16} />}
                  size="md"
                >
                  Filters
                </Button>
              </div>

              {/* Enhanced Filter Panel */}
              <AnimatePresence>
                {isFilterOpen && (
                  <motion.div
                    initial={{ opacity: 0, height: 0, scale: 0.95 }}
                    animate={{ opacity: 1, height: 'auto', scale: 1 }}
                    exit={{ opacity: 0, height: 0, scale: 0.95 }}
                    transition={{ duration: 0.3, ease: 'easeOut' }}
                    className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-2 border-gray-200/50 dark:border-gray-700/50 rounded-lg p-4 shadow-lg"
                  >
                    <FiltersContainer filters={filters} onFiltersChange={handleFiltersChange} />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            {/* Questions List with Enhanced Loading States */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="space-y-5"
            >
              {error ? (
                <EmptyState type="error" onRetry={refetch} />
              ) : loading || searchLoading ? (
                <div className="space-y-4">
                  {Array.from({ length: 5 }).map((_, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                    >
                      <Skeleton className="w-full h-40 rounded-xl bg-white dark:bg-gray-800" />
                    </motion.div>
                  ))}
                </div>
              ) : questions?.length === 0 ? (
                searchTerm ? (
                  <EmptyState type="no-search-results" searchTerm={searchTerm} />
                ) : (
                  <EmptyState type="no-questions" />
                )
              ) : (
                <div className="space-y-4">
                  {questions?.map((question: Question, index) => (
                    <motion.div
                      key={question.id}
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: index * 0.05 }}
                      className="transform hover:scale-[1.01] transition-transform duration-200"
                    >
                      <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-lg border border-gray-200/50 dark:border-gray-700/50 shadow-md hover:shadow-lg transition-all duration-200">
                        <QuestionCard question={question} loading={false} />
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>

            {/* Enhanced Pagination */}
            {questions?.length > 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="flex justify-center pt-6"
              >
                <Pagination
                  currentPage={page}
                  totalPages={searchTerm ? totalSearchPages : data?.getQuestions?.totalPages || 1}
                  onPageChange={setPage}
                  totalItems={searchTerm ? undefined : data?.getQuestions?.totalQuestions}
                  itemsPerPage={itemsPerPage}
                  onItemsPerPageChange={setItemsPerPage}
                  itemsPerPageOptions={[5, 10, 20, 50]}
                  showQuickJump={true}
                  showPageInfo={true}
                  className="w-full max-w-4xl"
                />
              </motion.div>
            )}
          </div>

          {/* Enhanced Right Sidebar */}
          <aside className="lg:col-span-1 space-y-6">
            {/* Community Stats Card */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 rounded-lg p-4 shadow-md hover:shadow-lg transition-all duration-200"
            >
              <div className="flex items-center gap-2 mb-3">
                <div className="p-1.5 bg-green-500 dark:bg-green-600 rounded-lg shadow-sm">
                  <FiTrendingUp className="text-white" size={16} />
                </div>
                <h3 className="text-base font-bold text-gray-900 dark:text-gray-100">
                  Community Stats
                </h3>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between items-center p-2.5 bg-gray-50/80 dark:bg-gray-700/50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <FiMessageSquare className="text-blue-500" size={14} />
                    <span className="text-gray-600 dark:text-gray-400 text-xs font-medium">
                      Questions
                    </span>
                  </div>
                  <span className="font-bold text-gray-900 dark:text-gray-100 text-sm">
                    {data?.getQuestions?.totalQuestions?.toLocaleString() || '0'}
                  </span>
                </div>
                <div className="flex justify-between items-center p-2.5 bg-gray-50/80 dark:bg-gray-700/50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <FiUsers className="text-purple-500" size={14} />
                    <span className="text-gray-600 dark:text-gray-400 text-xs font-medium">
                      Active Today
                    </span>
                  </div>
                  <span className="font-bold text-gray-900 dark:text-gray-100 text-sm">
                    {Math.floor(Math.random() * 500) + 100}
                  </span>
                </div>
              </div>
            </motion.div>

            {/* Popular Tags Card */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 rounded-lg p-4 shadow-md hover:shadow-lg transition-all duration-200"
            >
              <h3 className="text-base font-bold text-gray-900 dark:text-gray-100 mb-3">
                🔥 Trending Tags
              </h3>
              <div className="flex flex-wrap gap-2">
                {(
                  popularTagsData?.getPopularTags?.slice(0, 8) || [
                    { tag: 'React', count: 245 },
                    { tag: 'JavaScript', count: 189 },
                    { tag: 'TypeScript', count: 156 },
                    { tag: 'Node.js', count: 134 },
                    { tag: 'CSS', count: 98 },
                    { tag: 'HTML', count: 87 },
                    { tag: 'Python', count: 76 },
                    { tag: 'Next.js', count: 65 },
                  ]
                ).map((tag: any, index: number) => (
                  <motion.span
                    key={tag.tag}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    className="px-2.5 py-1.5 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full text-xs font-medium hover:bg-blue-100 dark:hover:bg-blue-900/30 hover:text-blue-700 dark:hover:text-blue-300 cursor-pointer transition-all duration-300 transform hover:scale-105 shadow-sm hover:shadow-md"
                    onClick={() => {
                      setSearchTerm(`[${tag.tag}]`);
                      handleSearch(`[${tag.tag}]`);
                    }}
                  >
                    {tag.tag} <span className="text-xs opacity-75">({tag.count})</span>
                  </motion.span>
                ))}
              </div>
            </motion.div>

            {/* Help Section Card */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="bg-blue-50/80 dark:bg-blue-900/20 backdrop-blur-sm border border-blue-200/50 dark:border-blue-800/50 rounded-lg p-4 shadow-md hover:shadow-lg transition-all duration-200"
            >
              <div className="flex items-center gap-2 mb-2">
                <div className="p-1.5 bg-blue-500 dark:bg-blue-600 rounded-lg shadow-sm">
                  <FiHelpCircle className="text-white" size={16} />
                </div>
                <h3 className="text-base font-bold text-gray-900 dark:text-gray-100">Need Help?</h3>
              </div>
              <p className="text-gray-600 dark:text-gray-400 text-xs mb-3 leading-relaxed">
                Learn how to ask great questions and get better answers from our community.
              </p>
              <Button
                variant="bordered"
                className="w-full border border-blue-300 dark:border-blue-700 text-blue-700 dark:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/30 font-medium rounded-lg transition-all duration-200"
                startContent={<FiMessageSquare size={14} />}
                size="sm"
              >
                Question Guidelines
              </Button>
            </motion.div>
          </aside>
        </div>
      </main>
    </div>
  );
};

export default QuestionsPage;
