// app/project2020/components/ProjectGrid.tsx
'use client'
import { useState, useEffect } from 'react';
import { ProjectCard } from './ProjectCard';

interface Project {
  id: number;
  title: {
    rendered: string;
  };
  content: {
    rendered: string;
  };
  excerpt: {
    rendered: string;
  };
  _embedded?: {
    'wp:featuredmedia'?: Array<{
      source_url: string;
    }>;
  };
  slug: string;
}

export default function ProjectGrid() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProjects() {
      try {
        const res = await fetch('/api/projects?_embed=true');
        const data = await res.json();
        setProjects(data);
      } catch (error) {
        console.error('Error fetching projects:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchProjects();
  }, []);

  if (loading) {
    return <div>กำลังโหลด...</div>;
  }

  return (
    <div>
      <h1 className="text-4xl font-bold text-center text-orange-500 mb-8">
        ข่าวสารและกิจกรรม
      </h1>
      <p className="text-center text-gray-600 mb-12">
        เรื่องราวและกิจกรรมล่าสุดจาก SDN Thailand
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => (
          <ProjectCard
            key={project.id}
            title={project.title.rendered}
            image={project._embedded?.['wp:featuredmedia']?.[0]?.source_url || '/placeholder.jpg'}
            excerpt={project.excerpt.rendered.replace(/<[^>]+>/g, '')}
            slug={project.slug}
          />
        ))}
      </div>
    </div>
  );
}