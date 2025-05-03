import ProjectCard from '../components/ProjectCard';
import styles from '../styles/Home.module.css';

export default function Home({ repos }) {
  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1>Justin San.</h1>
        <p>My very own software portfolio</p>
      </header>
      <main>
        <h2>Featured Projects</h2>
        <div className={styles.grid}>
          {repos.map(repo => (
            <ProjectCard key={repo.id} repo={repo} />
          ))}
        </div>
      </main>
    </div>
  );
}

export async function getStaticProps() {
  const username = process.env.GITHUB_USERNAME || 'SanJeosutin';
  const res = await fetch(`https://api.github.com/users/${username}/repos`);
  const data = await res.json();
  const repos = (Array.isArray(data) ? data : [])
    .filter(r => !r.fork)
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

  return {
    props: { repos },
    revalidate: 3600 // Re-generate every hour
  };
}
