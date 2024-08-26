import React, { useEffect, useState } from 'react';
import QuestionCard from '../Components/QuestionCard';
import { SearchOutlined } from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import { Pagination } from '@nextui-org/react';
import { GET_ALL_QUESTIONS, SEARCH_QUESTIONS } from '../GraphQL/Queries/Questions/Questions';
import { useQuery, useLazyQuery } from '@apollo/client';
import { Input, Popover } from 'antd';
import Filter from '../Components/Questions/Filter';
import { debounce } from 'lodash';

interface Question {
    id: number;
    title: string;
    content: string;
    votes: number;
    tags: string[];
    author: {
        username: string;
        profilePicture: string;
    };
    createdAt: string;
}

const QuestionsPage: React.FC = () => {
    const navigate = useNavigate()
    const [questions, setQuestions] = useState<Question[]>([])
    const [searchTerm, setSearchTerm] = useState('');
    const [popoverVisible, setPopoverVisible] = useState(false);
    const [searchResults, setSearchResults] = useState<Question[]>([]);
    const [totalSearchPages, setTotalSearchPages] = useState(0);
    const [page, setPage] = useState(1);
    const [itemsPerPage] = useState(10);
    const { loading, data } = useQuery(GET_ALL_QUESTIONS, {
        variables: {
            limit: itemsPerPage,
            offset: (page - 1) * itemsPerPage,
        },
        skip: searchTerm ? true : false,
    },
    );
    useEffect(() => {
        if (data?.getQuestions?.questions) {
            setQuestions(data?.getQuestions?.questions)
        }
    }, [data])
    const [executeSearch] = useLazyQuery(SEARCH_QUESTIONS, {
        onCompleted: (data) => {
            setSearchResults(data.searchQuestions.questions);
            setTotalSearchPages(data.searchQuestions.totalPages);
        },
    });
    const [executeSubmitSearch, { loading: submitSearchLoading }] = useLazyQuery(SEARCH_QUESTIONS, {
        onCompleted: (data) => {
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
            const tags = searchTerm.match(/\[(.*?)\]/g)?.map(tag => tag.replace(/\[|\]/g, ''));
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
        <>
            {searchResults.length === 0 ? (
                <div className='w-[35vw] grid grid-cols-1 md:grid-cols-2 gap-2'>
                    <div className=''>
                        <p><strong>[tag]</strong> :search by tag</p>
                        <p><strong>title</strong> :search by title</p>
                    </div>
                    <div className='whitespace-nowrap'>
                        <p><strong>user:1234</strong> :search by user</p>
                    </div>
                </div>
            ) :
                searchResults.map((question, index) => (
                    <div className='flex gap-2 items-center text-primary' key={index}>
                        <SearchOutlined />
                        <Link to="">{question.title}</Link>
                    </div>
                ))
            }
            <hr className='my-2' />
            <div className='flex justify-end'>
                <button className='bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 rounded-md' onClick={() => navigate('/questions/ask')}>Ask Question</button>
            </div>
        </>
    );
    return (
        <div className="flex flex-col min-h-screen bg-background text-foreground dark:bg-dark-background dark:text-dark-foreground">
            <main className="md:px-8 p-8">
                <div className="grid grid-cols-12 gap-4">
                    <Filter />

                    <section className='col-span-12 md:col-span-6  rounded-lg shadow-md p-4 overflow-y-auto max-h-[85vh]'>
                        <div className="flex flex-col gap-4 mb-4">
                            <button className="w-fit self-end bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 rounded-md" onClick={() => navigate('/questions/ask')}>
                                Ask Question
                            </button>
                            <Popover
                                content={content}
                                placement="bottom"
                                trigger="click"
                                open={popoverVisible}
                                onOpenChange={setPopoverVisible}
                            >
                                <form onSubmit={submitSearch}>

                                    <Input
                                        placeholder="Search questions..."
                                        prefix={<SearchOutlined />}
                                        value={searchTerm}
                                        onChange={(e) => { setSearchTerm(e.target.value), handleSearch(e.target.value) }}
                                    />
                                </form>
                            </Popover>

                        </div>
                        <div className="grid gap-4">
                            {
                                questions?.map((question: Question) => (
                                    <QuestionCard key={question.id} question={question} loading={searchTerm ? submitSearchLoading : loading} />
                                ))
                            }
                        </div>
                        <div className='flex justify-end mt-2'>
                            <Pagination
                                showControls
                                total={searchTerm ? totalSearchPages : data?.getQuestions?.totalPages}
                                initialPage={1}
                                page={page}
                                onChange={(newPage) => setPage(newPage)}
                            />
                        </div>
                    </section>
                    <aside className="col-span-12 md:col-span-3 dark:bg-dark-background rounded-lg shadow-md p-4">

                    </aside>
                </div>
            </main>
            <hr />
        </div>
    );
};

export default QuestionsPage;