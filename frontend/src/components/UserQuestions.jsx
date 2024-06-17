import React, { useState, useEffect } from 'react';
import axios from 'axios';

const UserQuestions = ({ API_URL, userId,questions }) => {
  
  console.log("User Questions in UserQuestions:",questions);

  return (
    <div  className="container  ">
      <div style={{margin:'50px'}}  className="list-group">
      <h1 style={{textAlign:'center'}} className="mb-2">User Questions</h1>

        {questions && questions.map((userQuestion, index) => (
          <div key={index} className="list-group-item mt-2">
            <h5 >
              <strong>Question {index + 1}:</strong> {userQuestion.question}
            </h5>
          
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserQuestions;
