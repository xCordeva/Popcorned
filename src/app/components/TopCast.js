import Link from "next/link";

const TopCast = ({ cast }) => {
  return (
    <div className="cast">
      <h1>Top Cast</h1>
      <div className="members">
        {cast.cast.slice(0, 10).map((member) => (
          <div className="cast-member" key={member.cast_id}>
            <Link href={"/"}>
              <img
                src={
                  member.profile_path
                    ? `https://image.tmdb.org/t/p/w500${member.profile_path}`
                    : `https://firebasestorage.googleapis.com/v0/b/popcorned-x.appspot.com/o/no-image-available.jpg?alt=media&token=d411b50a-ca42-41ef-934d-3e2d393d91cf`
                }
                alt={member.name}
              />
            </Link>
            <div className="member-name">
              <Link
                href={{
                  pathname: `/title/${member.id}`,
                  query: { type: "person" },
                }}
              >
                {member.name}
              </Link>
              <p>{member.character}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TopCast;
