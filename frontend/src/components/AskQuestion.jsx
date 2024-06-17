import React, { useState } from 'react';
import axios from 'axios';

const AskQuestion = ({ API_URL }) => {
  const [question, setQuestion] = useState('');
  const [askedQuestion, setAskedQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  
  const handleAskQuestion = async () => {
    try {
      const accessToken = localStorage.getItem('accessToken');
      const response = await axios.post(
        `${API_URL}/questions`,
        { question },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      console.log('Question asked:', response.data);
      setAskedQuestion(response.data.question);
      setAnswer(response.data.answer);
    } catch (error) {
      console.error('Error asking question:', error);
    }
  };

  const renderAnswer = (text) => {
    const lines = text.split('\n');
    let currentList = [];
    let paragraphs = [];
  
    lines.forEach((line, index) => {
      if (line.trim().startsWith('* ') || line.trim().startsWith('# ')) {
        const content = line.replace(/[*#]/g, '').trim(); // Remove all * and # and trim spaces
        currentList.push(<li key={index}>{content}</li>);
      } else {
        if (currentList.length > 0) {
          paragraphs.push(<ul key={`list-${index}`}>{currentList}</ul>);
          currentList = [];
        }
        const parts = line.split(/(\*\*.*?\*\*)/g).map((part, partIndex) => {
          if (part.startsWith('**') && part.endsWith('**')) {
            return <strong key={partIndex}> {part.slice(2, -2)}</strong>; // Add space before strong
          } else {
            return part.replace(/[*#]/g, ''); // Remove all '*' and '#' symbols
          }
        });
        if (parts.join('').trim() !== '') {
          paragraphs.push(<p key={`paragraph-${index}`}>{parts}</p>);
        }
      }
    });
  
    if (currentList.length > 0) {
      paragraphs.push(<ul key={`list-end`}>{currentList}</ul>);
    }
  
    return paragraphs;
  };

  return (
    <div className="container">
      <div className="col-md-8">
        <div className="card mt-5">
          <div className="card-body">
            <h1 className="card-title text-center mb-4">Ask a Question</h1>
            <div className="form-group">
              <input
                type="text"
                className="form-control"
                placeholder="Enter your question"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
              />
            </div>
            <button
              type="button"
              className="btn btn-primary btn-block"
              onClick={handleAskQuestion}
              style={{ marginTop: '10px' }}
            >
              Ask Question
            </button>
            {askedQuestion && (
              <div className="mt-4">
                <p><b>User asked:</b> {askedQuestion}</p>
                <div>
                  <h2>Answer:</h2>
                  {renderAnswer(answer)}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AskQuestion;
