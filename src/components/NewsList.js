import React from 'react';

const NewsList = ({ news }) => {
  return (
    <div>
      {news.map((item, index) => (
        <div key={index}>
          <h3>{item.title}</h3>
          <p>{item.description}</p>
          <a href={item.url} target="_blank" rel="noopener noreferrer">
            Read More
          </a>
        </div>
      ))}
    </div>
  );
};

export default NewsList;