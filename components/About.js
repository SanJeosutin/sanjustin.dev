import React from 'react'

export default function About() {
  return (
    <section
      id="about"
      className="
        py-16 px-4 max-w-6xl mx-auto
        transition-colors duration-500 ease-in-out
      "
    >
      <h2
        className="
          text-3xl font-bold mb-8
          text-celeste-800 dark:text-white
        "
      >
        About Me
      </h2>
      <p className="text-lg text-gray-300 dark:text-gray-300 mb-4">
      As an enthusiastic software developer, I am keen to apply my abilities to real-world projects and make a significant contribution. 
      </p>
      <p className="text-lg text-gray-300 dark:text-gray-300 mb-4">
      In my spare time, I like to solve puzzles, listen to music, and play video games. I'm also always seeking for new methods to study and broaden my knowledge.  
      </p>
      <p className="text-lg text-gray-300 dark:text-gray-300">
      Thank you for taking the time to visit my portfolio website, where you can learn more about my  work and experiences!
      </p>
    </section>
  )
}
