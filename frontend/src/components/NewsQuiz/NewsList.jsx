import React from 'react';

const NewsList = ({ news }) => {
  return (
    <div className="NewsList">
      {Array.isArray(news) && news.map((item, index) => (
        <div key={index} className="NewsItem">
          <h3 className="NewsItem-title">{item.title}</h3>
          <a
            className="NewsItem-link"
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
          >
            Read Full Article →
          </a>
        </div>
      ))}
    </div>
  );
};

export default NewsList;
