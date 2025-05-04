import SiteNav from '../components/Navbar'
import Hero from '../components/Hero'
import About from '../components/About'
import Projects from '../components/Projects'
import CurrentlyWorkingOn from '../components/CurrentlyWorkingOn'
import Contact from '../components/Contact'

export default function Home({ repos, theme, setTheme }) {
  return (
    <>
      {/* NAVBAR */}
      <SiteNav theme={theme} setTheme={setTheme} />

      <div id="hero">
        <Hero />
      </div>

      {/* ABOUT */}
      <div id="about">
        <About />
      </div>

      {/* CURRENT WORK */}
      <div id="current-work">
        <CurrentlyWorkingOn />
      </div>

      {/* PROJECTS */}
      <div id="projects">
        <Projects repos={repos} />
      </div>

      {/* CONTACT */}
      <div id="contact">
        <Contact />
      </div>
    </>
  )
}

export async function getStaticProps() {
  const res = await fetch(
    'https://api.github.com/users/SanJeosutin/repos?per_page=250'
  )
  let repos = await res.json()
  repos = repos
    .filter(r => !r.fork)
    .sort((a, b) =>
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    )

  return {
    props: { repos }
  }
}
