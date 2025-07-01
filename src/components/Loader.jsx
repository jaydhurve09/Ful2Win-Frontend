import BackgroundBubbles from "./BackgroundBubbles";
import Header from "./Header";
import Navbar from "./Navbar";


const Loader = () => {
    return (
        <div className="min-h-screen bg-blueGradient text-white">
          <BackgroundBubbles />
          <Header />
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-500"></div>
          </div>
          <Navbar />
        </div>
      );
}


    