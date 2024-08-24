import Footer from "../components/Footer";

export const metadata = {
  title: "Popcorned | Your Ultimate Destination for Movies & TV Shows",
  description:
    "Discover a world of entertainment with Popcorned. Explore the latest movies, TV shows, and celebrity news, create your personalized watchlist, and dive deep into reviews and ratings. Stay updated with the hottest trends and what's coming soon, all in one place. Your journey into the cinematic universe starts here!",
};

export default function RootLayout({ children }) {
  return (
    <div>
      {children}
      <Footer />
    </div>
  );
}
