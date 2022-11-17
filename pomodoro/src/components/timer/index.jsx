import React, { useEffect, useRef, useState, useMemo } from "react";
import toast, { Toaster } from 'react-hot-toast';
import "./timer.scss";

let textTime = "Time to work"
let breaks = 0;
let breakTime = false;

const Timer = () => {
  const [timer, setTimer] = useState(10); // 25 minutes
  const [start, setStart] = useState(false);
  const firstStart = useRef(true);
  const tick = useRef();
  const btnStart = useRef();
  const btnRestore = useRef();
  const btnSkip = useRef();

  const restablecerPomodoro = () => {
    textTime = "Time to work"
    breaks = 0;
    breakTime = false;
    setTimer(10)
    btnRestore.current.disabled = true
    btnSkip.current.disabled = true
  }

  const omitirDescanso = () => {
    setTimer(1);
  }

  const notificaContinuarPomodoro = (actionType) => {
    toast((t) => (
      <span>
        <b>{actionType} time start...  </b>
        <button className="buttons__continue" onClick={() => {
          setStart(start)
          toast.dismiss(t.id)
        }}>
          Continue
        </button>
      </span>
    ), { duration: 100000 });
  }


  const validaPomodoro = (time) => {
    if (time == 0 && !breakTime) {
      console.log("Break : " + breakTime)
      breaks++;
      if (breaks > 0) {
        textTime = `${4 - breaks} breaks to go with the long break`
      } else {
        textTime = 'Long break'
      }
      toggleStart()
      notificaContinuarPomodoro("Break")
      btnSkip.current.disabled = false;
      if (breaks === 4 && !breakTime) {
        breaks = 0
        console.log(breakTime)
        breakTime = true
        return 15;
      }
      breakTime = true
      return 3;
    } else if (time === 0) {
      console.log("Work : " + breakTime)
      toggleStart()
      notificaContinuarPomodoro("Work")
      btnSkip.current.disabled = true;
      textTime = "Time to work"
      breakTime = false;
      return 10;
    }
    return time;
  }

  const toggleStart = () => {
    setStart(!start);
    if (start) {
      toast('Timer paused', {
        duration: 1000,
        position: 'bottom-right',
        style: {
          width: 200,
          height: 50,
          background: 'white'
        },
        className: '',
        icon: '⌚',
        iconTheme: {
          primary: '#212',
          secondary: '#AAAAAA',
        },
        ariaProps: {
          role: 'status',
          'aria-live': 'polite',
        },
      });
    }
  };

  const dispSecondsAsMins = (seconds) => {
    const mins = Math.floor(seconds / 60);
    let seconds_ = seconds % 60;
    if (seconds_ < 10) {
      seconds_ = "0" + seconds_;
    }
    return (
      (mins == 0 ? "00" : mins.toString()) +
      ":" +
      (seconds_ == 0 ? "00" : seconds_.toString())
    );
  };


  useEffect(() => {
    if (firstStart.current) {
      btnSkip.current.disabled = true
      firstStart.current = !firstStart.current;
      return;
    }
    if (start) {
      btnRestore.current.disabled = false
      tick.current = setInterval(() => {
        setTimer((timer) => {
          let time = timer - 1;
          if (time <= 5 && time > 0 && !breakTime) {
            textTime = 'Break time starts in:'
          }
          return validaPomodoro(time)
        });
      }, 1000);

    } else {
      clearInterval(tick.current);
    }
  }, [start]);


  return (
    <div className="container">
      <div className="container__message">
        <div>
          <p>{textTime}</p>
        </div>
      </div>
      <div className="container__timer">{dispSecondsAsMins(timer)}</div>
      <div className="buttons">
        <button className="buttons__start" ref={btnStart} onClick={toggleStart}>
          {!start ? "Start" : "Stop"}
        </button>
        <button className="buttons__reset" ref={btnRestore} onClick={restablecerPomodoro}>Reset</button>
        <button className="buttons__skip" ref={btnSkip} onClick={omitirDescanso }>Skip</button>
        <Toaster />
      </div>
    </div>
  );
};

export default Timer;
