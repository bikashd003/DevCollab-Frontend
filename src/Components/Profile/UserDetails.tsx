import { Skeleton } from '@nextui-org/react';

const UserDetails = () => {
  const skills = ['JavaScript', 'React', 'Node.js', 'TypeScript', 'CSS', 'SQL', 'Git', 'AWS'];
  const projects = [
    {
      title: 'Project 1',
      description: 'A web application that helps users manage their tasks and projects.',
    },
    {
      title: 'Project 2',
      description: 'A mobile app that helps users track their fitness goals and progress.',
    },
    {
      title: 'Project 3',
      description: 'A data visualization tool that helps users analyze complex datasets.',
    },
    {
      title: 'Project 4',
      description: 'A content management system that helps users create and manage their websites.',
    },
  ];
  return (
    <div className="w-full md:max-w-2xl border border-zinc-600 rounded-lg shadow-lg">
      <div className="flex items-center justify-between p-2 bg-zinc-800 rounded-t-lg">
        <div className="flex space-x-2">
          <span className="w-3 h-3 bg-red-500 rounded-full"></span>
          <span className="w-3 h-3 bg-yellow-500 rounded-full"></span>
          <span className="w-3 h-3 bg-green-500 rounded-full"></span>
        </div>
        <div className="text-zinc-400 text-sm">index.js - My Portfolio</div>
      </div>

      {/* Code-like Content */}
      <div className="p-6 space-y-6">
        <div className="space-y-4">
          <div className="flex items-start">
            <span className="text-zinc-600 select-none">1</span>
            <h2 className="ml-4 text-3xl font-bold text-teal-400">
              <span className="text-purple-400">const</span>{' '}
              <span className="text-teal-400">Portfolio</span>{' '}
              <span className="text-zinc-300">= () </span>
              <span className="text-yellow-400">{'=>'}</span>
              <span className="text-zinc-300">{' {'}</span>
            </h2>
          </div>
          <div className="flex items-start">
            <span className="text-zinc-600 select-none">2</span>
            <p className="ml-4 text-zinc-400">
              `// Experienced software engineer with a passion for building innovative products.`
            </p>
          </div>
        </div>

        {/* Skills Section */}
        <div>
          <div className="flex items-start">
            <span className="text-zinc-600 select-none">3</span>
            <h3 className="ml-4 text-xl font-semibold text-purple-400">Skills</h3>
          </div>
          <div className="mt-2 grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-5 ml-8">
            {skills.map(skill => (
              <div
                key={skill}
                className="rounded-md bg-zinc-800 px-3 py-1 text-sm font-medium text-teal-400 border border-zinc-600 shadow-sm"
              >
                {skill}
              </div>
            ))}
          </div>
        </div>

        {/* Projects Section */}
        <div>
          <div className="flex items-start">
            <span className="text-zinc-600 select-none">4</span>
            <h3 className="ml-4 text-xl font-semibold text-purple-400">Projects</h3>
          </div>
          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 ml-8">
            {projects.map((project, index) => (
              <Skeleton
                key={index}
                className="dark:bg-zinc-800 shadow-md border border-zinc-700 rounded-lg"
              >
                <div className="p-4">
                  <img
                    src="/placeholder.svg"
                    alt={project.title}
                    className="mb-4 h-32 w-full rounded-md object-cover"
                    style={{ aspectRatio: '400/300' }}
                  />
                  <h4 className="text-lg font-semibold text-teal-400">{project.title}</h4>
                  <p className="text-sm text-zinc-400">{project.description}</p>
                </div>
              </Skeleton>
            ))}
          </div>
        </div>

        {/* Closing Bracket */}
        <div className="flex items-start">
          <span className="text-zinc-600 select-none">5</span>
          <p className="ml-4 text-3xl font-bold text-zinc-300">{'};'}</p>
        </div>
      </div>
    </div>
  );
};
export default UserDetails;
