// app/project2020/[slug]/page.tsx
async function getProject(slug: string) {
    const res = await fetch(`https://sdnthailand.com/wp-json/wp/v2/project?slug=${slug}&_embed=true`);
    const projects = await res.json();
    return projects[0];
  }
  
  export default async function ProjectPage({ params }: { params: { slug: string } }) {
    const project = await getProject(params.slug);
  
    if (!project) {
      return <div className="text-thin">ไม่พบโครงการ</div>;
    }
  
    return (
      <article className="max-w-5xl mx-auto px-4 py-8 pt-24">
        {project._embedded?.['wp:featuredmedia']?.[0] && (
          <div className="flex justify-center mb-12">
            <img
              src={project._embedded['wp:featuredmedia'][0].source_url}
              alt={project.title.rendered}
              className="w-4/2 h-[500px] object-cover rounded-lg shadow-lg"
            />
          </div>
        )}
        
        <div className="max-w-4xl mx-auto">
          <h1 className="text-l font-extralight text-center tracking-wide mb-8 text-gray-800">
            {project.title.rendered}
          </h1>
          
          <div 
            className="prose prose-base max-w-none
              prose-headings:font-extralight 
              prose-headings:tracking-wide
              prose-p:font-thin 
              prose-p:leading-loose 
              prose-p:text-gray-600
              prose-p:tracking-wide
              prose-li:font-thin
              prose-li:text-gray-600
              prose-img:mx-auto 
              prose-img:block
              prose-img:rounded-lg
              prose-img:shadow-lg
              prose-img:w-3/4
              prose-img:h-auto
              prose-img:object-cover"
            dangerouslySetInnerHTML={{ __html: project.content.rendered }}
          />
          
          <div className="mt-12">
            <a 
              href="/project2020" 
              className="text-orange-500 hover:text-orange-600 font-normal tracking-wide"
            >
              ← กลับไปหน้าโครงการทั้งหมด
            </a>
          </div>
        </div>
      </article>
    );
  }