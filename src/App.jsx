import { useEffect, useState, useRef } from 'react';
import './App.css';
import { URL } from './constants';
import Answer from './components/Answers';

function App() {
  const [question, setquestion] = useState('');
  const [result, setResult] = useState([]);
  const [recentHistory, setrecentHistory] = useState([JSON.parse(localStorage.getItem('history'))]);
  const [SelectedHistory, setSelectedHistory] = useState('');
  const scrollToAns = useRef();

  const askQuestion = async () => {
    if (!question && !SelectedHistory) return false;

    if (question) {
      let history = localStorage.getItem('history')
        ? [question, ...JSON.parse(localStorage.getItem('history'))]
        : [question];
      localStorage.setItem('history', JSON.stringify(history));
      setrecentHistory(history);
    }

    const payloadData = question || SelectedHistory;
    const payload = {
      contents: [{ parts: [{ text: payloadData }] }]
    };

    let response = await fetch(URL, {
      method: 'POST',
      body: JSON.stringify(payload)
    });

    response = await response.json();
    let dataString = response.candidates[0].content.parts[0].text;
    dataString = dataString.split('* ').map(item => item.trim());

    setResult([
      ...result,
      { type: 'q', text: payloadData },
      { type: 'a', text: dataString }
    ]);
    setquestion('');

    setTimeout(() => {
      scrollToAns.current.scrollTop = scrollToAns.current.scrollHeight;
    }, 500);
  };

  const clearHistory = () => {
    localStorage.clear();
    setrecentHistory([]);
  };

  const isEnter = (event) => {
    if (event.key === 'Enter') askQuestion();
  };

  useEffect(() => {
    askQuestion();
  }, [SelectedHistory]);

  return (
    <div className="flex h-screen bg-zinc-900 text-white">
      {/* Sidebar */}
      <div className="hidden md:flex md:flex-col w-64 bg-zinc-800 p-4 overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Recent Search</h2>
          <button onClick={clearHistory}>
            <svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" fill="#e3e3e3">
              <path d="M312-144q-29.7 0-50.85-21.15Q240-186.3 240-216v-480h-48v-72h192v-48h192v48h192v72h-48v479.57Q720-186 698.85-165T648-144H312Zm336-552H312v480h336v-480ZM384-288h72v-336h-72v336Zm120 0h72v-336h-72v336ZM312-696v480-480Z" />
            </svg>
          </button>
        </div>
        <ul className="space-y-2">
          {recentHistory &&
            recentHistory.map((item, index) => (
              <li
                key={index}
                onClick={() => setSelectedHistory(item)}
                className="cursor-pointer truncate p-2 rounded hover:bg-zinc-700 hover:text-white"
              >
                {item}
              </li>
            ))}
        </ul>
      </div>

      {/* Main Chat Area */}
      <div className="flex flex-col flex-1">
        <header className="p-4 text-center text-2xl sm:text-3xl font-bold bg-gradient-to-r from-pink-700 to-violet-700 bg-clip-text text-transparent">
          Hello User Ask me Anything
        </header>

        {/* Chat Scroll Area */}
        <div className="flex-1 overflow-y-auto px-4 sm:px-10 py-4" ref={scrollToAns}>
          <ul className="space-y-4">
            {result.map((item, index) => (
              <div key={index + Math.random()} className={item.type === 'q' ? 'flex justify-end' : ''}>
                {item.type === 'q' ? (
                  <li className="bg-zinc-700 p-3 rounded-3xl max-w-md ml-auto">
                    <Answer ans={item.text} totalResult={1} index={index} />
                  </li>
                ) : (
                  item.text.map((ansItem, ansIndex) => (
                    <li key={ansIndex + Math.random()} className="bg-zinc-800 p-3 rounded-3xl max-w-md">
                      <Answer ans={ansItem} totalResult={item.text.length} index={ansIndex} />
                    </li>
                  ))
                )}
              </div>
            ))}
          </ul>
        </div>

        {/* Input Box */}
        <div className="p-4 border-t border-zinc-700 bg-zinc-900">
          <div className="flex flex-col sm:flex-row items-center sm:items-stretch gap-2 sm:gap-4 max-w-3xl mx-auto">
            <input
              type="text"
              value={question}
              onKeyDown={isEnter}
              onChange={(e) => setquestion(e.target.value)}
              className="flex-1 p-3 rounded-xl bg-zinc-800 text-white outline-none"
              placeholder="Ask me anything"
            />
            <button
              onClick={askQuestion}
              className="px-6 py-3 bg-pink-700 hover:bg-pink-800 rounded-xl font-semibold"
            >
              Ask
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;




