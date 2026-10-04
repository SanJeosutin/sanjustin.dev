import { fetchDetail, fetchPaths } from '../../lib/api'
export { default } from '../../components/ProjectDetail'

export async function getStaticPaths() {
  return { paths: await fetchPaths('current-projects'), fallback: 'blocking' }
}

export async function getStaticProps({ params }) {
  const project = await fetchDetail('current-projects', params.slug)
  return project
    ? { props: { project }, revalidate: 60 }
    : { notFound: true, revalidate: 60 }
}
