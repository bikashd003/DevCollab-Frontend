import React from 'react';
import QuestionCard from '../Components/QuestionCard';
import { CiSearch } from "react-icons/ci";
import { useNavigate } from 'react-router-dom';
import { Pagination } from '@nextui-org/react';

interface Question {
    id: number;
    title: string;
    excerpt: string;
    votes: number;
    tags: string[];
    author: {
        name: string;
        avatar: string;
    };
    postedAt: string;
}
const QuestionsPage: React.FC = () => {
    const navigate = useNavigate()
    const questions: Question[] = [
        {
            id: 1,
            title: "How to create a custom React hook?",
            excerpt: "I'm trying to create a custom React hook to handle form state, but I'm not sure where to start. Any tips or resources would be helpful.",
            votes: 42,
            tags: ["react", "hooks", "forms"],
            author: {
                name: "John Doe",
                avatar: "https://avatars.githubusercontent.com/u/99291618?v=4"
            },
            postedAt: "2 hours ago"
        },
        {
            id: 2,
            title: "How to optimize SQL queries for better performance?",
            excerpt: "I'm working on a project that requires a lot of database queries, and I'm noticing some performance issues. Any tips on how to optimize my SQL queries?",
            votes: 28,
            tags: ["sql", "performance", "optimization"],
            author: {
                name: "Sarah Anderson",
                avatar: "https://avatars.githubusercontent.com/u/99291618?v=4"
            },
            postedAt: "1 day ago"
        },
        {
            id: 3,
            title: "How to implement authentication in a Next.js app?",
            excerpt: "I'm building a Next.js app and I need to implement authentication. I'm not sure where to start. Any guidance would be appreciated.",
            votes: 19,
            tags: ["next.js", "authentication", "security"],
            author: {
                name: "Michael Johnson",
                avatar: "https://avatars.githubusercontent.com/u/99291618?v=4"
            },
            postedAt: "3 days ago"
        }
    ];
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

                    <section className='col-span-12 md:col-span-6  rounded-lg shadow-md p-4'>
                        <div className="flex items-center mb-4">
                            <div className="relative flex-1">
                                <input
                                    className="flex h-10 w-full rounded-md border bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 pl-8"
                                    placeholder="Search questions..."
                                    type="search"
                                />
                                <CiSearch className="absolute left-2 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            </div>
                            <button className="ml-4 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 rounded-md" onClick={() => navigate('/questions/ask')}>
                                Ask Question
                            </button>
                        </div>
                        <div className="grid gap-4">
                            {questions.map((question) => (
                                <QuestionCard key={question.id} question={question} />
                            ))}
                        </div>
                        <div className='flex justify-end mt-2'>
                            <Pagination showControls total={10} initialPage={1} />
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