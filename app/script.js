import React, { useState, useMemo, useEffect, useRef } from 'react';
import { render } from 'react-dom';

const App = () => {
  const [status, setStatus] = useState('off');
  const [time, setTime] = useState(0);
  const [timer, setTimer] = useState(null);
  const audioRef = useRef(null);

  const formatTime = useMemo(() => {
    const ss = Math.floor((time / 1000) % 60);
    const mm = Math.floor((time / (60 * 1000)) % 60);

    function formatedTime(num, targetLength) {
      return num.toString().padStart(targetLength, '0');
    }
    return `${formatedTime(mm, 2)} : ${formatedTime(ss, 2)}`;
  }, [time]);

  const startTimer = () => {
    setStatus('work');
    setTime(20 * 1000 * 60);
  };

  const stopTimer = () => {
    clearInterval(timer);
    setTime(0);
    setStatus('off');
  };

  const playBell = () => {
    audioRef.current.play();
  };

  useEffect(() => {
    if (status === 'work') {
      setTimer(
        setInterval(() => {
          setTime((prevTime) => {
            if (prevTime === 0) {
              clearInterval(timer);
              setStatus('rest');
              setTime(20 * 1000);
              playBell();
            }
            return prevTime - 1000;
          });
        }, 1000)
      );
    } else if (status === 'rest') {
      setTimer(
        setInterval(() => {
          setTime((prevTime) => {
            if (prevTime === 0) {
              clearInterval(timer);
              setStatus('work');
              setTime(20 * 1000 * 60);
              playBell();
            }
            return prevTime - 1000;
          });
        }, 1000)
      );
    }

    return () => clearInterval(timer);
  }, [status]);

  return (
    <div>
      <h1>Protect your eyes</h1>
      {status === 'off' && (
        <div>
          <p>
            According to optometrists in order to save your eyes, you should
            follow the 20/20/20. It means you should to rest your eyes every 20
            minutes for 20 seconds by looking more than 20 feet away.
          </p>
          <p>
            This app will help you track your time and inform you when it's time
            to rest.
          </p>
        </div>
      )}

      <div>
        <audio ref={audioRef}>
          <source src='./sounds/bell.wav' type='audio/wav' />
        </audio>
      </div>

      {status === 'work' && <img src='./images/work.png' />}
      {status === 'rest' && <img src='./images/rest.png' />}
      {status !== 'off' && <div className='timer'>{formatTime}</div>}
      {status === 'off' && (
        <button onClick={startTimer} className='btn'>
          Start
        </button>
      )}
      {status !== 'off' && (
        <button onClick={stopTimer} className='btn'>
          Stop
        </button>
      )}
      <button onClick={() => window.close()} className='btn btn-close'>
        X
      </button>
    </div>
  );
};

render(<App />, document.querySelector('#app'));

// playBell = () => {
//   const bell = new Audio('./sounds/bell.wav');
//   bell.play();
// };
