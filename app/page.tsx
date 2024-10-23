'use client'

import React, { useState, useEffect, useRef } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { X, Edit2, Play, Pause, SkipForward, RotateCcw, Check, Maximize2 } from "lucide-react"

interface Event {
  id: string;
  name: string;
  hours: number;
  minutes: number;
  seconds: number;
}

const createEvent = (name: string, hours: number, minutes: number, seconds: number): Event => ({
  id: Date.now().toString(),  // Ensure this is a string
  name,
  hours,
  minutes,
  seconds
});

export default function ProductionTimer() {
  const [events, setEvents] = useState<Event[]>([])
  const [newEventName, setNewEventName] = useState('')
  const [newEventHours, setNewEventHours] = useState('')
  const [newEventMinutes, setNewEventMinutes] = useState('')
  const [newEventSeconds, setNewEventSeconds] = useState('')
  const [isTimerRunning, setIsTimerRunning] = useState(false)
  const [currentEventIndex, setCurrentEventIndex] = useState(0)
  const [timeRemaining, setTimeRemaining] = useState(0)
  const [isBlinking, setIsBlinking] = useState(false)
  const [editingEvent, setEditingEvent] = useState<Event | null>(null)
  const [isFullScreen, setIsFullScreen] = useState(false)

  useEffect(() => {
    const savedEvents = localStorage.getItem('productionTimerEvents');
    if (savedEvents) {
      setEvents(JSON.parse(savedEvents));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('productionTimerEvents', JSON.stringify(events));
  }, [events]);

  useEffect(() => {
    let interval;
    if (isTimerRunning && events.length > 0) {
      interval = setInterval(() => {
        setTimeRemaining((prevTime) => {
          if (prevTime > 0) {
            if (prevTime <= 10) {  // Changed from 5 to 10
              setIsBlinking(true);
            }
            return prevTime - 1;
          } else {
            setIsBlinking(false);
            if (currentEventIndex < events.length - 1) {
              const nextIndex = currentEventIndex + 1;
              setCurrentEventIndex(nextIndex);
              const nextEvent = events[nextIndex];
              console.log("Moving to next event:", nextEvent.name); // Add this for debugging
              return nextEvent.hours * 3600 + nextEvent.minutes * 60 + nextEvent.seconds;
            } else {
              setIsTimerRunning(false);
              setIsFullScreen(false);
              console.log("Timer finished, exiting fullscreen"); // Add this for debugging
              return 0;
            }
          }
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, events, currentEventIndex]);

  const addEvent = () => {
    if (newEventName && (newEventHours || newEventMinutes || newEventSeconds)) {
      const newEvent = createEvent(
        newEventName,
        parseInt(newEventHours) || 0,
        parseInt(newEventMinutes) || 0,
        parseInt(newEventSeconds) || 0
      );
      setEvents(prevEvents => [...prevEvents, newEvent]);
      console.log("Added new event:", newEvent);
      setNewEventName('');
      setNewEventHours('');
      setNewEventMinutes('');
      setNewEventSeconds('');
    }
  }

  const removeEvent = (id: string) => {
    setEvents(events.filter(event => event.id !== id))
  }

  const startTimer = () => {
    if (events.length > 0) {
      setIsTimerRunning(true)
      setCurrentEventIndex(0)
      const firstEvent = events[0]
      setTimeRemaining(firstEvent.hours * 3600 + firstEvent.minutes * 60 + firstEvent.seconds)
      setIsFullScreen(true)
    } else {
      alert("Please add events before starting the timer.")
    }
  }

  const pauseTimer = () => {
    setIsTimerRunning(false)
  }

  const resumeTimer = () => {
    if (timeRemaining > 0) {
      setIsTimerRunning(true)
    }
  }

  const skipToNextEvent = () => {
    if (currentEventIndex < events.length - 1) {
      const nextIndex = currentEventIndex + 1;
      setCurrentEventIndex(nextIndex);
      const nextEvent = events[nextIndex];
      setTimeRemaining(nextEvent.hours * 3600 + nextEvent.minutes * 60 + nextEvent.seconds);
      setIsTimerRunning(true);
      setIsBlinking(false);
      console.log("Skipped to next event:", nextEvent.name); // Add this for debugging
    } else {
      setIsTimerRunning(false);
      setTimeRemaining(0);
      setIsBlinking(false);
      setIsFullScreen(false);
      console.log("No more events, exiting fullscreen"); // Add this for debugging
    }
  }

  const resetTimer = () => {
    setIsTimerRunning(false)
    if (events.length > 0) {
      setCurrentEventIndex(0)
      const firstEvent = events[0]
      setTimeRemaining(firstEvent.hours * 3600 + firstEvent.minutes * 60 + firstEvent.seconds)
    } else {
      setCurrentEventIndex(0)
      setTimeRemaining(0)
      setIsFullScreen(false)
    }
    setIsBlinking(false)
  }

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const startEditing = (event) => {
    setEditingEvent({ ...event })
  }

  const cancelEditing = () => {
    setEditingEvent(null)
  }

  const saveEdit = () => {
    if (editingEvent) {
      setEvents(events.map(event => 
        event.id === editingEvent.id ? editingEvent : event
      ))
      setEditingEvent(null)
    }
  }

  const exitFullScreen = () => {
    setIsTimerRunning(false)
    setTimeRemaining(0)
    setIsFullScreen(false)
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      {!isFullScreen ? (
        <div className="max-w-2xl mx-auto space-y-4">
          <Card>
            <CardHeader className="flex flex-col items-center text-center">
              <div className="text-6xl font-bold mb-2">
                even<span className="text-blue-500">T</span>imer
              </div>
              <p className="text-gray-600 text-lg">Your go-to time tracker by Echo.</p>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col space-y-2 mb-4">
                <Input
                  placeholder="Event name"
                  value={newEventName}
                  onChange={(e) => setNewEventName(e.target.value)}
                />
                <div className="flex space-x-2">
                  <Input
                    placeholder="Hours"
                    type="number"
                    min="0"
                    value={newEventHours}
                    onChange={(e) => setNewEventHours(e.target.value)}
                  />
                  <Input
                    placeholder="Minutes"
                    type="number"
                    min="0"
                    max="59"
                    value={newEventMinutes}
                    onChange={(e) => setNewEventMinutes(e.target.value)}
                  />
                  <Input
                    placeholder="Seconds"
                    type="number"
                    min="0"
                    max="59"
                    value={newEventSeconds}
                    onChange={(e) => setNewEventSeconds(e.target.value)}
                  />
                </div>
                <Button onClick={addEvent}>Add Event</Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-xl font-semibold">Event List</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {events.map((event, index) => (
                  <div
                    key={event.id}
                    className="flex items-center justify-between bg-white p-2 rounded shadow"
                  >
                    {editingEvent && editingEvent.id === event.id ? (
                      <>
                        <div className="flex-grow mr-2">
                          <Input
                            value={editingEvent.name}
                            onChange={(e) => setEditingEvent({...editingEvent, name: e.target.value})}
                            className="mb-2"
                          />
                          <div className="flex space-x-2">
                            <Input
                              type="number"
                              min="0"
                              value={editingEvent.hours}
                              onChange={(e) => setEditingEvent({...editingEvent, hours: parseInt(e.target.value) || 0})}
                            />
                            <Input
                              type="number"
                              min="0"
                              max="59"
                              value={editingEvent.minutes}
                              onChange={(e) => setEditingEvent({...editingEvent, minutes: parseInt(e.target.value) || 0})}
                            />
                            <Input
                              type="number"
                              min="0"
                              max="59"
                              value={editingEvent.seconds}
                              onChange={(e) => setEditingEvent({...editingEvent, seconds: parseInt(e.target.value) || 0})}
                            />
                          </div>
                        </div>
                        <div>
                          <Button variant="ghost" size="icon" onClick={saveEdit}>
                            <Check className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={cancelEditing}>
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      </>
                    ) : (
                      <>
                        <span className="flex items-center">
                          <span className="font-semibold mr-2">{index + 1}.</span>
                          {event.name} - {formatTime(event.hours * 3600 + event.minutes * 60 + event.seconds)}
                        </span>
                        <div>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => startEditing(event)}
                          >
                            <Edit2 className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => removeEvent(event.id)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      </>
                    )}
                  </div>
                ))}
              </div>
              {events.length > 0 && (
                <Button className="mt-4 w-full bg-green-500 hover:bg-green-600 text-white" onClick={startTimer}>
                  <Play className="mr-2 h-4 w-4" /> Start Timer
                </Button>
              )}
            </CardContent>
          </Card>
        </div>
      ) : events.length > 0 ? (
        <div
          className="fixed bg-black text-white flex flex-col items-center justify-center"
          style={{
            left: 0,
            top: 0,
            width: '100vw',
            height: '100vh',
            userSelect: 'none',
          }}
        >
          <div className="text-6xl font-bold mb-2">
            even<span className="text-blue-500">T</span>imer
          </div>
          <p className="text-gray-400 text-lg mb-8">Your go-to time tracker by Echo.</p>
          <h1 className="text-2xl md:text-4xl lg:text-5xl mb-4 lg:mb-6">
            {events[currentEventIndex]?.name || 'No event'}
          </h1>
          <div 
            className={`text-7xl md:text-9xl lg:text-[10rem] font-bold ${isBlinking ? 'text-red-500 animate-pulse' : ''}`}
            style={{
              animation: isBlinking ? 'blink 1s linear infinite' : 'none'
            }}
          >
            {formatTime(timeRemaining)}
          </div>
          <div className="mt-4 md:mt-8 lg:mt-10 space-x-2 md:space-x-4 lg:space-x-6">
            <Button size="sm" className="md:text-lg lg:text-xl md:px-6 md:py-3 lg:px-8 lg:py-4" onClick={isTimerRunning ? pauseTimer : resumeTimer}>
              {isTimerRunning ? <Pause className="mr-2 h-4 w-4" /> : <Play className="mr-2 h-4 w-4" />}
              {isTimerRunning ? 'Pause' : 'Resume'}
            </Button>
            <Button size="sm" className="md:text-lg lg:text-xl md:px-6 md:py-3 lg:px-8 lg:py-4" onClick={skipToNextEvent}>
              <SkipForward className="mr-2 h-4 w-4" />
              Skip
            </Button>
            <Button size="sm" className="md:text-lg lg:text-xl md:px-6 md:py-3 lg:px-8 lg:py-4" onClick={resetTimer}>
              <RotateCcw className="mr-2 h-4 w-4" />
              Reset
            </Button>
          </div>
          <Button
            className="absolute top-2 right-2 md:top-4 md:right-4 lg:top-6 lg:right-6 bg-white text-black hover:bg-gray-200"
            size="sm"
            onClick={exitFullScreen}
          >
            Exit
          </Button>
        </div>
      ) : (
        <div className="fixed inset-0 flex flex-col items-center justify-center bg-black text-white">
          <div className="text-6xl font-bold mb-2">
            even<span className="text-blue-500">T</span>imer
          </div>
          <p className="text-gray-400 text-lg mb-8">Your go-to time tracker by Echo.</p>
          <p className="text-2xl">No events added. Please add events to start the timer.</p>
        </div>
      )}
      <style jsx global>{`
        @keyframes blink {
          0% { opacity: 1; }
          50% { opacity: 0; }
          100% { opacity: 1; }
        }
      `}</style>
    </div>
  )
}
