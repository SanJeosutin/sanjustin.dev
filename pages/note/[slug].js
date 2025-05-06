import React from 'react';

// ✅ Pre-render note pages at build time
export async function getStaticPaths() {
  try {
    const res = await fetch('https://apisanjustin.vercel.app/api/notes');
    const notes = await res.json();

    if (!Array.isArray(notes)) throw new Error('Invalid notes response');

    const paths = notes.map(note => ({
      params: { slug: note.slug }
    }));

    return {
      paths,
      fallback: 'blocking' // Generate missing pages at request time
    };
  } catch (e) {
    console.error('[getStaticPaths] Error:', e);
    return {
      paths: [],
      fallback: 'blocking'
    };
  }
}

// ✅ Load a specific note’s data
export async function getStaticProps({ params }) {
  try {
    const res = await fetch(`https://apisanjustin.vercel.app/api/notes/${params.slug}`);
    const note = await res.json();

    if (!note || note.error) {
      return { notFound: true };
    }

    return {
      props: { note },
      revalidate: 60 // Optional: revalidate after 60 seconds
    };
  } catch (e) {
    console.error('[getStaticProps] Error:', e);
    return { notFound: true };
  }
}

// ✅ Page component
export default function NotePage({ note }) {
  if (!note) return <p>Note not found.</p>;

  return (
    <main style={{ maxWidth: '768px', margin: '2rem auto', padding: '0 1rem' }}>
      <h1>{note.title}</h1>
      <p><em>{note.date}</em></p>
      <hr />
      <div dangerouslySetInnerHTML={{ __html: note.contentHtml }} />
    </main>
  );
}
