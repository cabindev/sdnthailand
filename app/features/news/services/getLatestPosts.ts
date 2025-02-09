// app/features/news/services/getLatestPosts.ts
export async function getLatestPosts() {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/sdnpost?per_page=4`, {
        next: { revalidate: 3600 } // revalidate every hour
      });
  
      if (!res.ok) throw new Error('Failed to fetch');
      
      const data = await res.json();
      return data.posts;
    } catch (error) {
      console.error('Error fetching posts:', error);
      throw error;
    }
  }