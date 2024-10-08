import Link from "next/link";

const TopCast = ({ cast, type, id }) => {
  return (
    <div className="cast">
      <h1>Top Cast</h1>
      <div className="members">
        {cast.cast.slice(0, 9).map((member) => (
          <div className="cast-member" key={member.id}>
            <Link
              href={{
                pathname: `/title/${member.id}`,
                query: { type: "person" },
              }}
            >
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
              {type === "tv" ? (
                <p>{member.roles[0].character}</p>
              ) : (
                <p>{member.character}</p>
              )}
            </div>
          </div>
        ))}
      </div>
      <Link
        href={{
          pathname: `/title/${id}/credits`,
          query: { type },
        }}
      >
        <h1>Show All cast members</h1>
      </Link>
    </div>
  );
};

export default TopCast;
