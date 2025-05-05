// pages/index.js
import SiteNav from '../components/Navbar'
import Hero from '../components/Hero'
import About from '../components/About'
import Projects from '../components/Projects'
import CurrentlyWorkingOn from '../components/CurrentlyWorkingOn'
import Contact from '../components/Contact'

export default function Home({ repos, currentProjects, theme, setTheme }) {
  return (
    <>
      <SiteNav theme={theme} setTheme={setTheme} />

      <div id="hero">
        <Hero />
      </div>

      <div id="about">
        <About />
      </div>

      <div id="current-work">
        <CurrentlyWorkingOn projects={currentProjects} />
      </div>

      <div id="projects">
        <Projects repos={repos} />
      </div>

      <div id="contact">
        <Contact />
      </div>
    </>
  )
}

export async function getStaticProps() {
  // GitHub repos
  const resRepos = await fetch(`${process.env.API_BASE_URL}/api/projects`)
  const repos = await resRepos.json()

  // Currently Working On
  const resCW = await fetch(`${process.env.API_BASE_URL}/api/current-projects`)
  const currentProjects = await resCW.json()

  return {
    props: { repos, currentProjects }
  }
}
