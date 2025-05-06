import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useSpring, animated, config as springConfig } from '@react-spring/web';
import SiteNav from '../../components/Navbar';

export default function ProjectDetail({ project, theme, setTheme }) {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  // Fade-in + slide-up animation
  const animation = useSpring({
    opacity: mounted ? 1 : 0,
    transform: mounted ? 'translateY(0px)' : 'translateY(20px)',
    config: springConfig.gentle
  });

  if (!project) {
    return (
      <>
        <SiteNav theme={theme} setTheme={setTheme} />
        <div className="p-16 text-center">Project not found</div>
      </>
    );
  }

  return (
    <>
      <SiteNav theme={theme} setTheme={setTheme} />
      <animated.section
        className="py-16 px-4 max-w-6xl mx-auto"
        style={animation}
      >
        <button
          onClick={() => router.back()}
          className="inline-block mb-6 text-persian_green-500 dark:text-saffron-400 hover:underline transition-colors duration-200"
        >
          ← Back
        </button>

        <h1 className="text-4xl font-bold mb-4 text-charcoal-700 dark:text-white">
          {project.name}
        </h1>

        {project.contentHtml ? (
          <div
            className="prose lg:prose-xl dark:prose-invert"
            dangerouslySetInnerHTML={{ __html: project.contentHtml }}
          />
        ) : (
          <p className="text-lg text-gray-700 dark:text-gray-300 mb-6">
            {project.details}
          </p>
        )}

        <a
          href={project.githubUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block px-6 py-3 rounded bg-sandy_brown-500 text-white hover:bg-sandy_brown-600 transition-colors duration-300"
        >
          View on GitHub
        </a>
      </animated.section>
    </>
  );
}

// ✅ Server-side props
export async function getServerSideProps({ params }) {
  try {
    const res = await fetch(
      `https://apisanjustin.vercel.app/api/current-projects/${params.slug}`
    );
    if (!res.ok) {
      return { notFound: true };
    }

    const project = await res.json();
    return {
      props: { project }
    };
  } catch (e) {
    console.error('[getServerSideProps] Project fetch error:', e);
    return {
      props: { project: null }
    };
  }
}
