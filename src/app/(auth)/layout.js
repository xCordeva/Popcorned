import "@/css/auth.css";

export const metadata = {
  title: "Popcorned - Your Ultimate Destination for Movies & TV Shows",
  description:
    "Discover a world of entertainment with Popcorned. Explore the latest movies, TV shows, and celebrity news, create your personalized watchlist, and dive deep into reviews and ratings. Stay updated with the hottest trends and what's coming soon, all in one place. Your journey into the cinematic universe starts here!",
};

export default function RootLayout({ children }) {
  return (
    <div className="user-signs">
      <img
        src="https://firebasestorage.googleapis.com/v0/b/popcorned-x.appspot.com/o/popcorned.png?alt=media&token=db91cd2d-06cd-4808-bb3b-5548b0e03762"
        alt="popcorned-logo"
      />
      {children}
    </div>
  );
}
