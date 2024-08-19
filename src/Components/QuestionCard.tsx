import { FaChevronUp, FaChevronDown } from "react-icons/fa";

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
const VoteButton: React.FC<{ direction: 'up' | 'down' }> = ({ direction }) => (
    <button className="hover:bg-accent hover:text-accent-foreground h-10 w-10 rounded-md">
        {direction === 'up' ? <FaChevronUp /> : <FaChevronDown />}
        <span className="sr-only">{direction === 'up' ? 'Upvote' : 'Downvote'}</span>
    </button>
);
const QuestionCard: React.FC<{ question: Question }> = ({ question }) => (
    <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
        <div className="p-6">
            <div className="flex items-center gap-2 mb-4">
                <span className="relative flex shrink-0 overflow-hidden rounded-full w-8 h-8">
                    <img className="aspect-square h-full w-full" alt={question.author.name} src={question.author.avatar} />
                </span>
                <div>
                    <div className="font-medium">{question.author.name}</div>
                    <div className="text-muted-foreground text-sm">{question.postedAt}</div>
                </div>
            </div>
            <h3 className="text-lg font-semibold">{question.title}</h3>
            <p className="text-muted-foreground mt-2">{question.excerpt}</p>
            <div className="flex items-center gap-2 mt-4">
                {question.tags.map((tag) => (
                    <div key={tag} className="bg-muted/50 rounded-md px-2 py-1 text-sm">{tag}</div>
                ))}
            </div>
        </div>
        <div className="p-6 flex items-center justify-between">
            <div className="flex items-center gap-2">
                <VoteButton direction="up" />
                <div className="text-lg font-medium">{question.votes}</div>
                <VoteButton direction="down" />
            </div>
            <div className="flex items-center gap-2">
                <button className="border bg-background hover:bg-accent hover:text-accent-foreground h-9 rounded-md px-3">
                    Answer
                </button>
                <button className="border bg-background hover:bg-accent hover:text-accent-foreground h-9 rounded-md px-3">
                    Share
                </button>
            </div>
        </div>
    </div>
);
export default QuestionCard;