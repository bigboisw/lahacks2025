import React, { useState, useEffect } from 'react';
import './Leaderboard.css';
import { useNavigate } from 'react-router';

export default function Leaderboard() {
  const [profilesData, setProfilesData] = useState([]);
  const [isClassroomFiltered, setIsClassroomFiltered] = useState(false);
  const navigate = useNavigate();

  const handleClick = (e) => {
    const filterType = e.target.textContent;
    if (filterType === "Within Classroom") {
      setIsClassroomFiltered(true);
    } else {
      setIsClassroomFiltered(false);
    }
  };

  // Function to highlight the current user's profile
  const isCurrentUser = (username) => {
    const storedUsername = localStorage.getItem('username');
    return storedUsername === username;
  };

  const Profile = ({ rank, name, streak, isHighlighted }) => {
    return (
      <div className={`profile ${isHighlighted ? 'highlighted' : ''}`}>
        <div className="profile-details">
          <div className="profile-rank">Rank: {rank}</div>
          <div className="profile-name">{name}</div>
          <div className="profile-score">Streak: {streak}</div>
        </div>
      </div>
    );
  };

  const handleBackToQuiz = () => {
    navigate('/newsquiz');
  };

  useEffect(() => {
    // Fetch the users data from localStorage
    const usersData = JSON.parse(localStorage.getItem('usersData')) || [];

    // Find the current user's classroom from usersData
    const loggedInUsername = localStorage.getItem('username');
    const currentUser = usersData.find((user) => user.username === loggedInUsername);
    const loggedInClassroom = currentUser ? currentUser.classroom : '';

    // Sort users by streak in descending order
    const sortedUsers = usersData.sort((a, b) => b.streak - a.streak);

    // Filter users based on classroom if the filter is applied
    const filteredUsers = isClassroomFiltered
      ? sortedUsers.filter((user) => user.classroom === loggedInClassroom)
      : sortedUsers;

    // Map the filtered users data to create the profilesData array, adding a rank
    const profiles = filteredUsers.map((user, index) => ({
      rank: index + 1, // Ranks are 1-based, so add 1 to the index
      name: user.username,
      streak: user.streak,
      imageUrl: 'https://via.placeholder.com/50', // Placeholder image URL
      isHighlighted: isCurrentUser(user.username), // Check if this user is the current one
    }));

    // Set the sorted and filtered profiles data to state
    setProfilesData(profiles);
  }, [isClassroomFiltered]);  // Add `isClassroomFiltered` to dependencies to re-run the effect on filter change

  return (
    <div className="board">
      <button className="back-to-quiz-button" onClick={handleBackToQuiz}>
        Back to Quiz
      </button>
      <h1 className="leaderboard">Leaderboard</h1>
      <div className="duration">
        <button onClick={handleClick}>All Time</button>
        <button onClick={handleClick}>Within Classroom</button>
      </div>
      <div className="profiles-container">
        {profilesData.map((profile, index) => (
          <Profile
            key={index}
            rank={profile.rank}
            name={profile.name}
            streak={profile.streak}
            isHighlighted={profile.isHighlighted}
          />
        ))}
      </div>
    </div>
  );
}
