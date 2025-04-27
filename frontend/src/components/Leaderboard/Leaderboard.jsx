import React from 'react'
import './Leaderboard.css'
export default function leaderboard(){

    const handleClick = () => {
        console.log(e.target)
    }

    const Profile = ({ name, score, imageUrl }) => {
        return (
          <div className="profile">
            <img src={imageUrl} alt={name} className="profile-image" />
            <div className="profile-details">
              <div className="profile-name">{name}</div>
              <div className="profile-score">Score: {score}</div>
            </div>
          </div>
          );
      };
      
        // Sample data for profiles (replace with your actual data)
        const profilesData = [
          { name: 'Alice Marshall', score: 1250, imageUrl: 'https://via.placeholder.com/50' },
          { name: 'Bob Marley', score: 1100, imageUrl: 'https://via.placeholder.com/50' },
          { name: 'Charlie Brown', score: 1000, imageUrl: 'https://via.placeholder.com/50' },
          { name: 'David Dobrik', score: 950, imageUrl: 'https://via.placeholder.com/50' },
        ];
      const handleBackToQuiz = () => {
          // Replace this with your actual navigation logic (e.g., using React Router)
          console.log('Back to Quiz clicked!');
      };
  

    return(
        <div className = "board">
          <button className="back-to-quiz-button" onClick={handleBackToQuiz}>
            Back to Quiz
          </button>
            <h1 className = 'leaderboard'>Leaderboard</h1>
            <div className="duration">
                <button onClick={(handleClick)}>All Time</button>
                <button onClick={(handleClick)}>Within Classroom</button>
            </div>
            <div className="profiles-container">
            {profilesData.map((profile, index) => (
            <Profile
                key={index}
                name={profile.name} 
                score={profile.score}
                imageUrl={profile.imageUrl}
            />  
        ))}
            </div>
        </div>
    )
}