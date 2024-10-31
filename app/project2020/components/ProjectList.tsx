// app/project2020/components/ProjectList.tsx
'use client'
import { useState, useEffect } from 'react'
import { ProjectCard } from './ProjectCard'
import type { ProjectCardProps } from './ProjectCard'

// สร้าง Loading Component แยก
function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="flex flex-col items-center gap-2">
        <div className="w-8 h-8 border-4 border-gray-200 border-t-orange-500 rounded-full animate-spin"></div>
        <div className="text-sm font-light text-gray-500">กำลังโหลด...</div>
      </div>
    </div>
  );
}

interface WordPressProject {
  id: number;
  title: {
    rendered: string;
  };
  excerpt: {
    rendered: string;
  };
  slug: string;
  _embedded?: {
    'wp:featuredmedia'?: Array<{
      source_url: string;
    }>;
  };
}

export default function ProjectList() {
  const [projects, setProjects] = useState<WordPressProject[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await fetch('/api/projects')
        if (!res.ok) throw new Error('Failed to fetch')
        const data = await res.json()
        setProjects(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load projects')
      } finally {
        setLoading(false)
      }
    }

    fetchProjects()
  }, [])

  if (loading) return <LoadingSpinner />
  if (error) return <div>Error: {error}</div>

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {projects.map((project) => (
        <ProjectCard
          key={project.id}
          title={project.title.rendered}
          image={project._embedded?.['wp:featuredmedia']?.[0]?.source_url || '/placeholder.jpg'}
          excerpt={project.excerpt.rendered}
          slug={project.slug}
        />
      ))}
    </div>
  )
}