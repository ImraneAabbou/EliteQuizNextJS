"use client"
import React, { forwardRef, useImperativeHandle } from "react";
import { useTimer } from "react-timer-hook";
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css'; // Import the styles
import { websettingsData } from "src/store/reducers/webSettings";
import { useSelector } from "react-redux";
import LinearProgress from '@mui/material/LinearProgress';
import Box from '@mui/material/Box';

const Timer = forwardRef(({ timerSeconds, onTimerExpire,isQuiz }, ref) => {

    const time = new Date();

    time.setSeconds(time.getSeconds() + timerSeconds)

    const websettingsdata = useSelector(websettingsData);

    const themecolor = websettingsdata && websettingsdata?.primary_color

    const { seconds, restart, start, minutes, pause, hours } = useTimer({
        expiryTimestamp: time,
        autoStart: true,
        onExpire: () => {
            setTimeout(() => {
                onTimerExpire();
            }, 500);
        },
    });

    useImperativeHandle(ref, () => ({

        startTimer() {
            start();
        },

        resetTimer() {
            const time = new Date();
            time.setSeconds(time.getSeconds() + timerSeconds);
            restart(time);
        },

        pauseTimer() {
            pause();
        },

        getTimerSeconds() {
            return seconds;
        },

        getMinuteandSeconds() {
            return `${hours}:${minutes}:${seconds}`;
        },

    }));

    // this logic for reverse progressbar and based on hours and minutes and seconds check conditions
    const value = 100 / timerSeconds;

    let timervalue = 0;

    if (timerSeconds <= 60) {
        timervalue = value * seconds;
    } else if (timerSeconds >= 60 && timerSeconds <= 3600) {
        timervalue = value * (seconds + 60 * minutes);
    } else {
        timervalue = value * (seconds + 60 * minutes + 3600 * hours);
    }


    // this logic for circular progress color change
    let progressBarColor = '#ef5388'; // Default color

    if (timerSeconds <= 60 && seconds <= 10) {
        progressBarColor = 'red'; // Change to red when 10 seconds or less are remaining
    }else if (hours === 0 && minutes === 0 && timerSeconds >= 60 && timerSeconds <= 3600 && seconds <= 10) {
        progressBarColor = 'red';
    }else{
        progressBarColor
    }
    const displayTime = (hours === 0 && minutes === 0) 
    ? `${seconds}` 
    : (hours === 0) 
      ? `${minutes}:${seconds}` 
      : `${hours}:${minutes}:${seconds}`;

    return (
        <div className={`coinsdata ${isQuiz && "px-2"}`}>
            <div className="progressbar-container adj_timer_for_ui">
            <Box sx={{ width: '100%', textAlign: 'end' }}>
      <LinearProgress
        variant="determinate"
        value={timervalue}
        style={{height:"7px",borderRadius:'20px'}}
        sx={{
          backgroundColor: '#d6d6d6',
          '& .MuiLinearProgress-bar': {
            backgroundColor: progressBarColor,
            borderRadius:"10px"
          },
        }}
      />
      <Box sx={{ marginTop: '10px', fontSize: '16px', color: progressBarColor }}>
        {displayTime}
      </Box>
    </Box>

            </div>
        </div>
    );
});


export default Timer;
