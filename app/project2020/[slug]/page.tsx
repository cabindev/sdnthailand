// app/project2020/[slug]/page.tsx
import Image from 'next/image'
import Link from 'next/link'

interface Project {
  id: number
  slug: string  
  title: {
    rendered: string
  }
  content: {
    rendered: string
  }
  _embedded?: {
    'wp:featuredmedia'?: [{
      source_url: string
      alt_text: string
    }]
  }
  date: string
  modified: string
}

// Fetch function
async function getProject(slug: string) {
  try {
    const res = await fetch(
      `https://blog.sdnthailand.com/wp-json/wp/v2/project?slug=${slug}&_embed=true`,
      { 
        next: { revalidate: 3600 }, // Cache for 1 hour
        headers: {
          'Content-Type': 'application/json',
        },
      }
    )

    if (!res.ok) {
      throw new Error('Failed to fetch project')
    }

    const projects = await res.json()
    return projects[0]
  } catch (error) {
    console.error('Error fetching project:', error)
    throw error
  }
}

// Error Component
function ErrorMessage() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h2 className="text-xl font-light text-gray-800 mb-4">
          เกิดข้อผิดพลาดในการโหลดข้อมูล
        </h2>
        <Link 
          href="/project2020"
          className="text-orange-500 hover:text-orange-600 text-sm"
        >
          ← กลับไปหน้าโครงการทั้งหมด
        </Link>
      </div>
    </div>
  )
}

// Loading Component 
function LoadingState() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-pulse">
        <div className="h-8 w-64 bg-gray-200 rounded mb-8"></div>
        <div className="h-4 w-96 bg-gray-200 rounded mb-4"></div>
        <div className="h-4 w-80 bg-gray-200 rounded"></div>
      </div>
    </div>
  )
}

// Main Page Component
export default async function ProjectPage({ 
  params 
}: { 
  params: { slug: string } 
}) {
  try {
    const project = await getProject(params.slug)

    if (!project) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-xl font-light text-gray-800 mb-4">
              ไม่พบโครงการที่ต้องการ
            </h2>
            <Link 
              href="/project2020"
              className="text-orange-500 hover:text-orange-600 text-sm"
            >
              ← กลับไปหน้าโครงการทั้งหมด
            </Link>
          </div>
        </div>
      )
    }

    const featuredMedia = project._embedded?.['wp:featuredmedia']?.[0]
    const publishDate = new Date(project.date).toLocaleDateString('th-TH', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
    const modifiedDate = new Date(project.modified).toLocaleDateString('th-TH', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })

    return (
      <article className="min-h-screen">
        <main className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-8 pt-16 sm:pt-24">
          {/* Featured Image */}
          {featuredMedia && (
            <div className="flex justify-center mb-8 sm:mb-12">
              <div className="relative w-full sm:w-4/5 md:w-3/4 h-[300px] sm:h-[400px] md:h-[500px]">
                <Image
                  src={featuredMedia.source_url}
                  alt={featuredMedia.alt_text || project.title.rendered}
                  fill
                  className="object-cover rounded-lg shadow-lg"
                  priority
                />
              </div>
            </div>
          )}
          
          <div className="max-w-4xl mx-auto">
            {/* Title */}
            <h1 
              className="text-xl sm:text-2xl md:text-3xl font-extralight 
                text-center tracking-wide mb-4 text-gray-800"
            >
              {project.title.rendered}
            </h1>

            {/* Dates */}
            <div className="text-center mb-8 text-sm text-gray-500 space-y-1">
              <p>วันที่เผยแพร่: {publishDate}</p>
              <p>แก้ไขล่าสุด: {modifiedDate}</p>
            </div>
            
            {/* Content */}
            <div 
              className="prose prose-sm sm:prose-base max-w-none
                prose-headings:font-extralight 
                prose-headings:tracking-wide
                prose-p:font-thin 
                prose-p:leading-relaxed sm:leading-loose
                prose-p:text-gray-600
                prose-p:tracking-wide
                prose-li:font-thin
                prose-li:text-gray-600
                prose-img:mx-auto 
                prose-img:block
                prose-img:rounded-lg
                prose-img:shadow-lg
                prose-img:w-full sm:w-11/12 md:w-3/4
                prose-img:h-auto
                prose-img:object-cover
                prose-table:w-full
                prose-table:border-collapse
                prose-td:border
                prose-td:border-gray-300
                prose-td:p-2
                space-y-4 sm:space-y-6"
              dangerouslySetInnerHTML={{ __html: project.content.rendered }}
            />
            
            {/* Back Link */}
            <div className="mt-8 sm:mt-12 border-t pt-8">
              <Link 
                href="/project2020"
                className="text-orange-500 hover:text-orange-600 
                  font-normal tracking-wide text-sm sm:text-base 
                  transition duration-200"
              >
                ← กลับไปหน้าโครงการทั้งหมด
              </Link>
            </div>
          </div>
        </main>
      </article>
    )
  } catch (error) {
    return <ErrorMessage />
  }
}

// Generate Static Params
export async function generateStaticParams() {
  try {
    const res = await fetch(
      'https://blog.sdnthailand.com/wp-json/wp/v2/project',
      { next: { revalidate: 3600 } }
    )
    
    if (!res.ok) throw new Error('Failed to fetch projects')
    
    const projects = await res.json()
    
    return projects.map((project: Project) => ({
      slug: project.slug,
    }))
  } catch (error) {
    console.error('Error generating static params:', error)
    return []
  }
}

// Metadata
export async function generateMetadata({ 
  params 
}: { 
  params: { slug: string } 
}) {
  try {
    const project = await getProject(params.slug)
    
    if (!project) {
      return {
        title: 'ไม่พบโครงการ - SDN Thailand'
      }
    }

    return {
      title: `${project.title.rendered} - SDN Thailand`,
      description: project.content.rendered.slice(0, 200).replace(/<[^>]*>/g, ''),
      openGraph: {
        title: project.title.rendered,
        description: project.content.rendered.slice(0, 200).replace(/<[^>]*>/g, ''),
        images: [
          {
            url: project._embedded?.['wp:featuredmedia']?.[0]?.source_url || '',
            width: 1200,
            height: 630,
          }
        ],
      }
    }
  } catch (error) {
    return {
      title: 'Error - SDN Thailand'
    }
  }
}