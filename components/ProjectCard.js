export default function ProjectCard({ repo }) {
    return (
      <a href={repo.html_url} target="_blank" rel="noopener noreferrer" className="card">
        <h3>{repo.name}</h3>
        <p>{repo.description || 'No description provided.'}</p>
      </a>
    );
  }