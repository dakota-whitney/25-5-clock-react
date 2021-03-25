import { render } from '@testing-library/react';
import React from 'react';
import './App.css';

class App extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      session: new Date(2021,4,19,0,25,0),
      sessionLength: 25,
      break: new Date(2021,4,19,0,5,0),
      breakLength: 5,
      sessionActive: true,
      timerActive: false,
      timerId: 0,
    }
    this.incrementSession = this.incrementSession.bind(this);
    this.decrementSession = this.decrementSession.bind(this);
    this.incrementBreak = this.incrementBreak.bind(this);
    this.decrementBreak = this.decrementBreak.bind(this);
    this.startTimer = this.startTimer.bind(this);
    this.resetTimer = this.resetTimer.bind(this);
    this.toggleStyle = this.toggleStyle.bind(this);
  }
  componentDidMount() {
    const fccScript = document.createElement("script");
    fccScript.src =
      "https://cdn.freecodecamp.org/testable-projects-fcc/v1/bundle.js";
    fccScript.async = true;
    document.body.appendChild(fccScript);
  }
  componentDidUpdate(){
    if(this.state.sessionActive){
      if(this.state.session.getHours() !== 1 && this.state.session.getMinutes() === 0 && this.state.session.getSeconds() === 0){
        setTimeout(() => {
          document.getElementById('beep').play()
          this.setState({
            sessionActive: false,
            timerActive: false
          })
          this.startTimer();
        },1000)
      }
    } else {
      if(this.state.break.getHours() !== 1 && this.state.break.getMinutes() === 0 && this.state.break.getSeconds() === 0){
        setTimeout(() => {
          document.getElementById('beep').play()
          this.setState({
            sessionActive: true,
            timerActive: false
          })
          this.startTimer();
        },1000)
      }
    }
  }
  toggleStyle(btnId){
    let buttonClicked = document.getElementById(`${btnId}`)
    buttonClicked.style.color = '#558000'
    setTimeout(() => {
      buttonClicked.style.color = 'white'
    },120)
  }
incrementSession(e){
  this.toggleStyle(e.target.id)
  this.setState(state => ({
    session: new Date(2021,4,19,0,state.session.getMinutes() + 1,state.session.getSeconds()),
    sessionLength: state.session.getMinutes() + 1
  }))
    this.setState(state => (
      console.log(`The current hours are ${state.session.getHours()}`)
    ))
}
decrementSession(e){
  this.toggleStyle(e.target.id)
  if(this.state.session.getMinutes() > 1){
    this.setState(state => ({
      session: new Date(2021,4,19,0,state.session.getMinutes() - 1,state.session.getSeconds()),
      sessionLength: state.session.getMinutes() - 1
   }))
  }
}
incrementBreak(e){
  this.toggleStyle(e.target.id)
    this.setState(state => ({
      break: new Date(2021,4,19,0,state.break.getMinutes() + 1,state.break.getSeconds()),
      breakLength: state.break.getMinutes() + 1
    }))
}
decrementBreak(e){
  this.toggleStyle(e.target.id)
  if(this.state.break.getMinutes() > 1){
    this.setState(state => ({
      break: new Date(2021,4,19,0,state.break.getMinutes() - 1,state.break.getSeconds()),
      breakLength: state.break.getMinutes() - 1
    }))
  }
}
startTimer(e){
  this.setState(state => (
    console.log(`The current hours are ${state.session.getHours()}`)
  ))
  if(e){
    this.toggleStyle(e.target.id)
  }
  this.setState(state => (
    console.log(`The timer is running: ${state.timerActive}`)
  ))
  //If timer is currently counting down
  if(this.state.timerActive){
    this.setState({
      timerActive: false
    })
    if(this.state.timerId !== 0){
      clearInterval(this.state.timerId)
    }
  }
    
  //If timer is currently paused
  else {
    let intervalId = 0;
    this.setState({
      timerActive: true
    })
    //If we're currently in a session, start counting down the Session clock
    if(this.state.sessionActive){
       intervalId = setInterval(() => this.setState(state => ({
        session: new Date(2021,4,19,0,state.session.getMinutes(),state.session.getSeconds() - 1)
      })),1000)
    }
    //If we're currently in a break, start counting down the Break clock
    else {
      intervalId = setInterval(() => this.setState(state => ({
        break: new Date(2021,4,19,0,state.break.getMinutes(),state.break.getSeconds() - 1)
      })),1000)
    }
    this.setState({
      timerId: intervalId
    })
  }
}
resetTimer(e){
  this.toggleStyle(e.target.id)
  if(this.state.timerId !== 0){
    clearInterval(this.state.timerId)
  }
  this.setState({
      session: new Date(2021,4,19,0,25,0),
      sessionLength: 25,
      break: new Date(2021,4,19,0,5,0),
      breakLength: 5,
      sessionActive: true,
      timerActive: false
  })
}
render(){
  let sessionTimeLeft = "";
  let breakTimeLeft = "";
  if(this.state.sessionLength === 60 && this.state.session.getMinutes() === 0){
    sessionTimeLeft = "60:00"
  } else {
    sessionTimeLeft = this.state.session.toTimeString().substring(3,8)
  }
  if(this.state.breakLength === 60 && this.state.break.getMinutes() === 0){
    breakTimeLeft = "60:00"
  } else {
    breakTimeLeft = this.state.break.toTimeString().substring(3,8)
  }
  return (
    <div className="container-fluid">
        <h1>Dakota's 25 + 5 Clock</h1>
        <h3>Developed in React.js</h3>
        <div id="clock">
        <UI
          breakLength={this.state.breakLength}
          sessionLength={this.state.sessionLength}
          incrementBreak={this.incrementBreak}
          decrementBreak={this.decrementBreak}
          incrementSession={this.incrementSession}
          decrementSession={this.decrementSession}
        />
        <Display
          breakLength={this.state.breakLength}
          sessionLength={this.state.sessionLength}
          sessionActive={this.state.sessionActive}
          timerActive={this.state.timerActive}
          sessionTimeLeft={sessionTimeLeft}
          breakTimeLeft={breakTimeLeft}
          startTimer={this.startTimer}
          resetTimer={this.resetTimer}
        />
        </div>
      </div>
  );
}
}

class UI extends React.Component{
  constructor(props){
    super(props);
  }
  render(){
    return(
      <div id="ui">
        <div id="break-label">
          <h2 className="label-header">Break Length:</h2>
          <div id="break-length" className="length">{this.props.breakLength}</div>
          <i id="break-increment" className="fas fa-arrow-circle-up fa-2x" onClick={this.props.incrementBreak}></i>
          <i id="break-decrement" className="fas fa-arrow-circle-down fa-2x" onClick={this.props.decrementBreak}></i>
        </div>
        <div id="session-label">
          <h2 className="label-header">Session Length:</h2>
          <div id="session-length" className="length">{this.props.sessionLength}</div>
          <i id="session-increment" className="fas fa-arrow-circle-up fa-2x" onClick={this.props.incrementSession}></i>
          <i id="session-decrement" className="fas fa-arrow-circle-down fa-2x" onClick={this.props.decrementSession}></i>
        </div>
      </div>
    )
  }
}

class Display extends React.Component{
  constructor(props){
    super(props);
  }
  render(){
    return(
    <div id="display">
      <div id="timer-label">{this.props.sessionActive ? "Session" : "Break"}</div>
      <div id="time-left">{this.props.sessionActive ? this.props.sessionTimeLeft : this.props.breakTimeLeft}<audio id="beep" src="https://github.com/dakota-whitney/25-5-clock-react/blob/main/public/beep.wav?raw=true"></audio></div>
      <i id="start_stop" className={this.props.timerActive ? 'far fa-pause-circle fa-2x' : 'fas fa-hourglass-start fa-2x'} onClick={this.props.startTimer}></i>
      <i id="reset" className="fas fa-redo fa-2x" onClick={this.props.resetTimer}></i>
    </div>
  )
}
}

export default App;