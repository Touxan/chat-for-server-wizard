
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Mic, MicOff, Loader2 } from "lucide-react";

// Define the SpeechRecognition interface
interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList;
  resultIndex: number;
  error: any;
}

interface SpeechRecognitionResultList {
  length: number;
  item(index: number): SpeechRecognitionResult;
  [index: number]: SpeechRecognitionResult;
}

interface SpeechRecognitionResult {
  isFinal: boolean;
  length: number;
  item(index: number): SpeechRecognitionAlternative;
  [index: number]: SpeechRecognitionAlternative;
}

interface SpeechRecognitionAlternative {
  transcript: string;
  confidence: number;
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start(): void;
  stop(): void;
  abort(): void;
  onresult: (event: SpeechRecognitionEvent) => void;
  onerror: (event: SpeechRecognitionEvent) => void;
  onstart: (event: Event) => void;
  onend: (event: Event) => void;
}

// Declare global SpeechRecognition types
declare global {
  interface Window {
    SpeechRecognition: {
      new(): SpeechRecognition;
    };
    webkitSpeechRecognition: {
      new(): SpeechRecognition;
    };
  }
}

interface VoiceInputProps {
  onTranscript: (transcript: string) => void;
}

const VoiceInput = ({ onTranscript }: VoiceInputProps) => {
  const [isListening, setIsListening] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const toggleListening = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  const startListening = () => {
    setIsLoading(true);
    
    // Check if browser supports SpeechRecognition
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
      console.error("Speech recognition not supported in this browser");
      setIsLoading(false);
      return;
    }
    
    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.continuous = true;
    recognition.interimResults = true;
    
    recognition.onstart = () => {
      setIsListening(true);
      setIsLoading(false);
    };
    
    recognition.onresult = (event) => {
      const transcript = Array.from(event.results)
        .map((result) => result[0].transcript)
        .join("");
      
      if (event.results[0].isFinal) {
        onTranscript(transcript);
      }
    };
    
    recognition.onerror = (event) => {
      console.error("Speech recognition error", event.error);
      setIsListening(false);
      setIsLoading(false);
    };
    
    recognition.onend = () => {
      setIsListening(false);
    };
    
    recognition.start();
    
    // Store recognition instance to stop it later
    (window as any).recognition = recognition;
  };
  
  const stopListening = () => {
    if ((window as any).recognition) {
      (window as any).recognition.stop();
      (window as any).recognition = null;
    }
    setIsListening(false);
  };

  useEffect(() => {
    return () => {
      if ((window as any).recognition) {
        (window as any).recognition.stop();
      }
    };
  }, []);

  return (
    <Button
      variant={isListening ? "destructive" : "outline"}
      size="icon"
      onClick={toggleListening}
      className="rounded-full h-10 w-10 flex items-center justify-center"
      disabled={isLoading}
    >
      {isLoading ? (
        <Loader2 className="h-5 w-5 animate-spin" />
      ) : isListening ? (
        <MicOff className="h-5 w-5" />
      ) : (
        <Mic className="h-5 w-5" />
      )}
    </Button>
  );
};

export default VoiceInput;
