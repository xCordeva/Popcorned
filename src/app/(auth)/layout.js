import "@/css/auth.css";

export const metadata = {
  title: "Popcorned | Online Planner & Organizer",
  description:
    "Calendizer is an online planner and organizer to help you manage your schedule and tasks efficiently. Stay organized and productive with Calendizer.",
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
