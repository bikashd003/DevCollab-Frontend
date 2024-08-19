import React from 'react';
import QuestionCard from '../Components/QuestionCard';
import { CiSearch } from "react-icons/ci";
import { useNavigate } from 'react-router-dom';

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
                avatar: "/placeholder-user.jpg"
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
                avatar: "/placeholder-user.jpg"
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
                avatar: "/placeholder-user.jpg"
            },
            postedAt: "3 days ago"
        }
    ];
    return (
        <div className="flex flex-col min-h-screen bg-background text-foreground dark:bg-dark-background dark:text-dark-foreground">
            <main className="flex-1 container px-4 md:px-6 py-8">
                <div className="grid grid-cols-[240px_1fr] gap-8">
                    <aside className="bg-background dark:bg-dark-background rounded-lg shadow-sm p-4">
                        <h3 className="text-lg font-semibold mb-4">Filters</h3>
                        <div className="grid gap-4">
                            <div>
                                <h4 className="text-sm font-medium mb-2">Tags</h4>
                                <div className="grid grid-cols-2 gap-2">
                                    {['React', 'JavaScript', 'Python', 'CSS', 'Node.js', 'SQL'].map((tag) => (
                                        <a key={tag} className="bg-muted/50 rounded-md px-2 py-1 text-sm hover:bg-muted" href="#">
                                            {tag}
                                        </a>
                                    ))}
                                </div>
                            </div>
                            <div>
                                <h4 className="text-sm font-medium mb-2">Sort By</h4>
                            </div>
                        </div>
                    </aside>
                    <section>
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
                    </section>
                </div>
            </main>
            <footer className="bg-muted py-6 border-t">
                <div className="container flex items-center justify-between px-4 md:px-6">
                    <div className="text-sm text-muted-foreground">© 2024 StackOverflow. All rights reserved.</div>
                    <div className="flex items-center gap-4">
                        <a className="text-sm hover:underline" href="#">Terms of Service</a>
                        <a className="text-sm hover:underline" href="#">Privacy Policy</a>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default QuestionsPage;