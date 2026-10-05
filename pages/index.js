import { fetchList } from '../lib/api'
import { getShowcasedGithubProjects } from '../lib/github-project-settings'
import SiteNav from '../components/Navbar'
import Hero from '../components/Hero'
import About from '../components/About'
import Projects from '../components/Projects'
import CurrentProject from '../components/CurrentlyWorkingOn'

export default function Home({ repos, currentProjects, theme, setTheme }) {
  return (
    <>
      <SiteNav theme={theme} setTheme={setTheme} />

      <div id="hero">
        <Hero />
      </div>

      <div>
        <About />
      </div>

      <div id="current-work">
        <CurrentProject projects={currentProjects} />
      </div>

      <div>
        <Projects repos={repos} />
      </div>
    </>
  )
}

export async function getStaticProps() {
  const [repos, currentProjects] = await Promise.all([
    fetchList('projects'),
    fetchList('current-projects'),
  ])

  return {
    props: { repos: getShowcasedGithubProjects(repos), currentProjects }
  }
}
