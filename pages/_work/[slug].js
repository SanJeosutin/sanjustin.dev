import { fetchDetail } from '../../lib/api'
export { default } from '../../components/ProjectDetail'

export async function getServerSideProps({ params }) {
  const project = await fetchDetail('current-projects', params.slug)
  return project ? { props: { project } } : { notFound: true }
}
