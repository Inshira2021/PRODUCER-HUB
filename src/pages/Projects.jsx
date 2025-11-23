import Navbar from '../components/Navbar';

function Projects() {
  const projects = [
    { id: 1, title: "Summer Blockbuster 2025", status: "In Production", budget: "$50M" },
    { id: 2, title: "Indie Drama Series", status: "Pre-Production", budget: "$5M" },
    { id: 3, title: "Documentary Film", status: "Post-Production", budget: "$2M" },
  ];

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-6 sm:mb-8">My Projects</h1>
          <div className="space-y-3 sm:space-y-4">
            {projects.map((project) => (
              <div
                key={project.id}
                className="bg-white/10 backdrop-blur-lg rounded-xl p-4 sm:p-6 border border-white/20 hover:border-amber-500/50 transition-colors"
              >
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3 sm:gap-0">
                  <div>
                    <h3 className="text-xl sm:text-2xl font-semibold text-white mb-1 sm:mb-2">{project.title}</h3>
                    <p className="text-amber-400 text-sm sm:text-base">{project.status}</p>
                  </div>
                  <div className="text-left sm:text-right">
                    <p className="text-gray-400 text-xs sm:text-sm">Budget</p>
                    <p className="text-lg sm:text-xl font-bold text-white">{project.budget}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

export default Projects;
