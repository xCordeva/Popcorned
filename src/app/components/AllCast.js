import Link from "next/link";
import React from "react";

export default function AllCast({ cast, type, title }) {
  return (
    <div className="all-cast">
      <h1>{title} Full Cast</h1>
      <div className="members">
        {cast.cast.map((member) => (
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
    </div>
  );
}
