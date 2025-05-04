import SiteNav from '../../components/Navbar'
import { currentProjects } from '../../data/currentProjects'

export default function ProjectDetail({ project, theme, setTheme }) {
  if (!project) return <p>Project not found</p>

  return (
    <>
      <SiteNav theme={theme} setTheme={setTheme} />
      <section className="py-16 px-4 max-w-6xl mx-auto transition-colors duration-500 ease-in-out">
        <h1 className="text-4xl font-bold mb-4 text-charcoal-700 dark:text-white">
          {project.name}
        </h1>
        <p className="text-lg text-gray-700 dark:text-gray-300 mb-6">
          {project.details}
        </p>
        <a
          href={project.githubUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="
            inline-block px-6 py-3 rounded
            bg-sandy_brown-500 text-white
            hover:bg-sandy_brown-600
            transition-colors duration-300
          "
        >
          View on GitHub
        </a>
      </section>
    </>
  )
}

export async function getStaticPaths() {
  const paths = currentProjects.map((p) => ({ params: { slug: p.slug } }))
  return { paths, fallback: false }
}

export async function getStaticProps({ params }) {
  const project = currentProjects.find((p) => p.slug === params.slug) || null
  return { props: { project } }
}
