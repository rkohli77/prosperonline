import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ChatbotComponent from '@/components/Chatbot';

const ChatbotPage = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <ChatbotComponent />
      </main>
      <Footer />
    </div>
  );
};

export default ChatbotPage;