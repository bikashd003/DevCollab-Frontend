import React, { useState } from 'react';
import QuestionCard from '../Components/QuestionCard';
import { CiSearch } from "react-icons/ci";
import { useNavigate } from 'react-router-dom';
import { Pagination } from '@nextui-org/react';
import { GET_ALL_QUESTIONS } from '../GraphQL/Queries/Questions/Questions';
import { useQuery } from '@apollo/client';
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
    const [page, setPage] = useState(1);
    const [itemsPerPage] = useState(10);
    const { loading, data } = useQuery(GET_ALL_QUESTIONS, {
        variables: {
            limit: itemsPerPage,
            offset: (page - 1) * itemsPerPage,
        }
    });


    return (
        <div className="flex flex-col min-h-screen bg-background text-foreground dark:bg-dark-background dark:text-dark-foreground">
            <main className="md:px-8 p-8">
                <div className="grid grid-cols-12 gap-4">
                    <aside className="col-span-12 md:col-span-3 dark:bg-dark-background rounded-lg shadow-md p-4">
                        <h3 className="text-xl font-bold text-gray-800 mb-4">Filters</h3>
                        <div className="grid gap-6">
                            {/* Tags Section */}
                            <div>
                                <h4 className="text-sm font-semibold text-gray-300 mb-3 border-b border-gray-700 pb-1">Tags</h4>
                                <div className="flex gap-2 flex-wrap">
                                    {['React', 'JavaScript', 'Python', 'CSS', 'Node.js', 'SQL'].map((tag) => (
                                        <a
                                            key={tag}
                                            className="bg-gray-700 hover:bg-gray-600 text-white rounded-md px-3 py-1 text-xs font-mono transition-colors duration-200 ease-in-out"
                                            href="#"
                                        >
                                            {tag}
                                        </a>
                                    ))}
                                </div>
                            </div>
                            {/* Sort By Section */}
                            <div>
                                <h4 className="text-sm font-semibold text-gray-300 mb-3 border-b border-gray-700 pb-1">Sort By</h4>
                                {/* Add sorting options here */}
                            </div>
                        </div>
                    </aside>

                    <section className='col-span-12 md:col-span-6  rounded-lg shadow-md p-4 overflow-y-auto max-h-[85vh]'>
                        <div className="flex flex-col gap-4 mb-4">
                            <button className="w-fit self-end bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 rounded-md" onClick={() => navigate('/questions/ask')}>
                                Ask Question
                            </button>
                            <form className="relative" onSubmit={() => { }}>
                                <input
                                    className="flex h-10 w-full rounded-md border bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 pl-8"
                                    placeholder="Search questions..."
                                    type="search"
                                />
                                <CiSearch className="absolute left-2 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            </form>

                        </div>
                        <div className="grid gap-4">
                            {data?.getQuestions?.questions?.map((question: Question) => (
                                <QuestionCard key={question.id} question={question} loading={loading} />
                            ))}
                        </div>
                        <div className='flex justify-end mt-2'>
                            <Pagination
                                showControls
                                total={data?.getQuestions?.totalPages}
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