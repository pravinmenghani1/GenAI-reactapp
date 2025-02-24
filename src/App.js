import React, { useState } from 'react';
import { BedrockRuntimeClient, InvokeModelCommand } from "@aws-sdk/client-bedrock-runtime";
import './App.css';

function App() {
  const [question, setQuestion] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    console.log('Sending question:', question); // Debug log

    try {
      const client = new BedrockRuntimeClient({
        region: process.env.REACT_APP_AWS_REGION || 'us-east-1',
        credentials: {
          accessKeyId: process.env.REACT_APP_AWS_ACCESS_KEY_ID,
          secretAccessKey: process.env.REACT_APP_AWS_SECRET_ACCESS_KEY,
        }
      });

      const input = {
        modelId: "anthropic.claude-3-sonnet-20240229-v1:0",
        contentType: "application/json",
        accept: "application/json",
        body: JSON.stringify({
          anthropic_version: "bedrock-2023-05-31",
          max_tokens: 4096,
          temperature: 0.7,
          messages: [{ 
            role: "user", 
            content: question 
          }]
        })
      };

      console.log('Sending request to Bedrock...'); // Debug log
      const command = new InvokeModelCommand(input);
      const bedrockResponse = await client.send(command);
      console.log('Raw response:', bedrockResponse); // Debug log

      if (bedrockResponse.body) {
        const responseData = JSON.parse(new TextDecoder().decode(bedrockResponse.body));
        console.log('Parsed response:', responseData); // Debug log
        setResponse(responseData.content[0].text);
      } else {
        throw new Error('No response body received from Bedrock');
      }
    } catch (err) {
      console.error('Error:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Ask Anything</h1>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Enter your question"
            style={{
              padding: '10px',
              width: '300px',
              marginRight: '10px'
            }}
          />
          <button 
            type="submit"
            disabled={loading}
            style={{
              padding: '10px 20px',
              cursor: 'pointer'
            }}
          >
            {loading ? 'Processing...' : 'Ask'}
          </button>
        </form>
        {error && (
          <div style={{ color: 'red', marginTop: '20px' }}>
            Error: {error}
          </div>
        )}
        {response && (
          <div style={{
            marginTop: '20px',
            padding: '20px',
            backgroundColor: '#f5f5f5',
            borderRadius: '5px',
            maxWidth: '600px'
          }}>
            {response}
          </div>
        )}
      </header>
    </div>
  );
}

export default App;
