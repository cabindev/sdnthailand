interface ProjectCardProps {
  title: string;
  image: string;
  excerpt: string;
  slug: string;
 }
 
 export function ProjectCard({ title, image, excerpt, slug }: ProjectCardProps) {
  const truncateExcerpt = (text: string) => {
    const strippedText = text.replace(/<[^>]*>/g, '');
    const lines = strippedText.split('\n');
    return lines.slice(0, 2).join('\n') + (lines.length > 2 ? '...' : '');
  };
 
  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      <div className="p-4">
        <div className="flex gap-4">
          {/* รูปด้านซ้าย */}
          <div className="w-full md:w-48 flex-shrink-0">
            <div className="aspect-w-16 aspect-h-9">
              <img 
                src={image} 
                alt={title}
                className="w-full h-full object-cover rounded-lg"
                onError={(e) => {
                  e.currentTarget.src = '/placeholder.jpg'
                }}
              />
            </div>
          </div>
          
          {/* excerpt ด้านขวา */}
          <div className="hidden md:block flex-1 min-w-0 mt-6">
            <div 
              className="text-sm text-gray-600 line-clamp-3 break-all pr-3"
              dangerouslySetInnerHTML={{ __html: truncateExcerpt(excerpt) }}
            />
          </div>
        </div>
 
        {/* title ด้านล่าง */}
        <a 
          href={`/project2020/${slug}`}
          className="block mt-4 group" // เพิ่ม group
        >
          <h3 className="text-base font-medium text-gray-800 break-all line-clamp-3 group-hover:text-orange-500 transition-colors duration-200 ease-in-out">
            {title}
            <span className="inline-block ml-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 ease-in-out transform translate-x-0 group-hover:translate-x-1">
              →
            </span>
          </h3>
        </a>
      </div>
    </div>
  );
 }
 
 export type { ProjectCardProps };