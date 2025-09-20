import Footer from '@/components/Footer';
import Header from '@/components/Header';
import Blogs from '@/components/Blogs';


const BlogsPage = () => {
    return (
      <div className="min-h-screen">
        <Header />
        <main>
          <Blogs />
        </main>
        <Footer />
      </div>
    );
  };
  
  export default BlogsPage;