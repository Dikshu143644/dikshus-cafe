import React, { useState, useRef, useEffect } from 'react';
import { 
  Send, Sparkles, Coffee, Clock, Calendar, HelpCircle, 
  Mic, MicOff, Volume2, VolumeX, Info, AlertCircle, ShoppingBag, CheckCircle, HeartHandshake
} from 'lucide-react';
import { MenuItem, User } from '../types';
import GlassCard from './GlassCard';
import ScrollReveal from './ScrollReveal';

interface Message {
  sender: 'user' | 'assistant';
  text: string;
}

interface AssistantViewProps {
  onSendMessage: (prompt: string, history: Message[]) => Promise<{ response: string; action?: any }>;
  onAddToCart: (item: MenuItem) => void;
  onAutoBook: (bookingData: any) => Promise<any>;
  featuredItems: MenuItem[];
  user: User | null;
}

export default function AssistantView({ 
  onSendMessage, 
  onAddToCart, 
  onAutoBook, 
  featuredItems, 
  user 
}: AssistantViewProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      sender: 'assistant',
      text: "Greetings! I am your **Café Vista Voice & Digital Guide** ☕ You can speak to me or type your request below.\n\nI can **auto-order pastries** (try: *'Add a Pistachio Glazed Croissant'*) or **auto-book glasshouse table spots** (try: *'Reserve a garden table for 4'*). I will read responses back aloud too!"
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  
  // Voice Synthesis & Recognition States
  const [speechEnabled, setSpeechEnabled] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(false);
  const [speakingIndex, setSpeakingIndex] = useState<number | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const touchStartYRef = useRef<number>(0);
  const scrollTopStartRef = useRef<number>(0);
  const recognitionRef = useRef<any>(null);

  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    touchStartYRef.current = e.touches[0].clientY;
    scrollTopStartRef.current = scrollContainerRef.current ? scrollContainerRef.current.scrollTop : 0;
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!scrollContainerRef.current) return;
    const currentY = e.touches[0].clientY;
    const diffY = currentY - touchStartYRef.current;
    scrollContainerRef.current.scrollTop = scrollTopStartRef.current - diffY;
  };

  const scrollToBottom = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = scrollContainerRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages.length]);

  // Handle Speech Recognition Setup Check
  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      setSpeechSupported(true);
    }

    return () => {
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch (e) {
          console.error(e);
        }
      }
    };
  }, []);

  // Web Speech synthesis reader
  const speakResponse = (text: string, index: number) => {
    if (!window.speechSynthesis) return;

    window.speechSynthesis.cancel(); // Clears any ongoing speech queue
    setSpeakingIndex(index);
    setIsSpeaking(true);

    // Clean out markdown characters so they are not read aloud
    const cleanedText = text
      .replace(/\*\*|__|\*|_|#/g, '')
      .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // markdown links
      .replace(/-\s+/g, '') // bullet markers
      .trim();

    const utterance = new SpeechSynthesisUtterance(cleanedText);
    utterance.volume = 1;
    utterance.rate = 1.0;
    utterance.pitch = 1.05; // Slightly optimistic warm tone

    // Attempt to procure premium english speaking voices
    const voices = window.speechSynthesis.getVoices();
    const premiumVoice = voices.find(
      v => v.lang.startsWith('en') && 
      (v.name.includes('Google') || v.name.includes('Natural') || v.name.includes('Premium'))
    );
    if (premiumVoice) {
      utterance.voice = premiumVoice;
    }

    utterance.onstart = () => {
      setIsSpeaking(true);
      setSpeakingIndex(index);
    };
    utterance.onend = () => {
      setIsSpeaking(false);
      setSpeakingIndex(null);
    };
    utterance.onerror = () => {
      setIsSpeaking(false);
      setSpeakingIndex(null);
    };

    window.speechSynthesis.speak(utterance);
  };

  const stopSpeaking = () => {
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    setIsSpeaking(false);
    setSpeakingIndex(null);
  };

  // Automated Action Processor
  const processAutomatedAction = async (action: any) => {
    if (!action || !action.type) return;

    if (action.type === 'add_to_cart') {
      const match = featuredItems.find(i => i.id === action.itemId || i.name.toLowerCase().includes((action.itemName || '').toLowerCase()));
      const finalItem = match || featuredItems[0]; // Fallback to Gilded Espresso if not resolved
      
      if (finalItem) {
        onAddToCart(finalItem);
        const autoMsgText = `🛒 **Auto-Order Execution successful!** Added **${finalItem.name}** into your active Cart Drawer.`;
        setMessages((prev) => {
          const newMsgs: Message[] = [...prev, { sender: 'assistant', text: autoMsgText }];
          if (speechEnabled) {
            setTimeout(() => {
              speakResponse(`Added ${finalItem.name} to your cart.`, newMsgs.length - 1);
            }, 50);
          }
          return newMsgs;
        });
      }
    } 
    
    else if (action.type === 'book_table') {
      const todayStr = new Date().toISOString().split('T')[0];
      const payload = {
        customerName: user?.name || 'Valued Guest',
        customerEmail: user?.email || 'guest@example.com',
        customerPhone: user?.phone || '+44 7911 123456',
        date: action.date || todayStr,
        time: action.time || '18:30',
        guestsCount: action.guestsCount || 2,
        tablePreference: action.tablePreference || 'window',
        occasion: 'Conversational Auto-Booking',
        specialNotes: 'Table secured automatically via voice concierge assistance.',
        userId: user?.id || null
      };

      try {
        await onAutoBook(payload);
        const autoMsgText = `📅 **Auto-Booking Executed Successful!** A **${payload.tablePreference.toUpperCase()} table** has been reserved for **${payload.guestsCount} guests** on **${payload.date}** at **${payload.time}**.`;
        setMessages((prev) => {
          const newMsgs: Message[] = [...prev, { sender: 'assistant', text: autoMsgText }];
          if (speechEnabled) {
            setTimeout(() => {
              speakResponse(`Successfully booked your ${payload.tablePreference} table for ${payload.guestsCount} guests on ${payload.date}.`, newMsgs.length - 1);
            }, 50);
          }
          return newMsgs;
        });
      } catch (err: any) {
        console.error('Auto booking error:', err);
        setMessages((prev) => [
          ...prev,
          { 
            sender: 'assistant', 
            text: `⚠️ **Auto-Booking Notice:** We detected a booking parameter issue: *${err.message || 'Verification failed'}*. Go to **Reserve Table** view to lock it manually!` 
          }
        ]);
      }
    }
  };

  const handleSend = async (textToSend: string) => {
    if (!textToSend.trim()) return;

    // Prime the speech synthesis engine to unlock audio playback for mobile browsers
    if (window.speechSynthesis) {
      try {
        const primingUtterance = new SpeechSynthesisUtterance("");
        primingUtterance.volume = 0;
        window.speechSynthesis.speak(primingUtterance);
      } catch (primeErr) {
        console.warn("Speech synthesis priming warning:", primeErr);
      }
    }

    const userMsg: Message = { sender: 'user', text: textToSend };
    const updatedMsgs = [...messages, userMsg];
    setMessages(updatedMsgs);
    setInputText('');
    setIsTyping(true);

    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    setIsSpeaking(false);
    setSpeakingIndex(null);

    try {
      const result = await onSendMessage(textToSend, updatedMsgs);
      
      setMessages((prev) => {
        const newMsgs: Message[] = [...prev, { sender: 'assistant', text: result.response }];
        const newIndex = newMsgs.length - 1;
        
        if (speechEnabled) {
          setTimeout(() => {
            speakResponse(result.response, newIndex);
          }, 50);
        }
        return newMsgs;
      });

      // Handle automation
      if (result.action) {
        setTimeout(async () => {
          await processAutomatedAction(result.action);
        }, 100);
      }
    } catch (e) {
      console.error(e);
      setMessages((prev) => [
        ...prev,
        {
          sender: 'assistant',
          text: "I apologize, our smart concierge is slightly overloaded. Feel free to browse menu or reserve directly via main links!"
        }
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const toggleListening = () => {
    // Prime the speech synthesis engine to unlock audio playback for mobile browsers
    if (window.speechSynthesis) {
      try {
        const primingUtterance = new SpeechSynthesisUtterance("");
        primingUtterance.volume = 0;
        window.speechSynthesis.speak(primingUtterance);
      } catch (primeErr) {
        console.warn("Speech synthesis priming warning:", primeErr);
      }
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setMessages((prev) => [
        ...prev,
        { 
          sender: 'assistant', 
          text: "🎤 **Voice input unsupported**: Real-time voice speech recognition is supported in modern Chrome, Edge, and mobile Safari. Please use a compatible browser or type below!" 
        }
      ]);
      return;
    }

    if (isListening) {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (e) {
          console.error(e);
        }
      }
      setIsListening(false);
      return;
    }

    try {
      // Cancel speech synthesis first if talking
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
        setIsSpeaking(false);
      }

      const rec = new SpeechRecognition();
      rec.continuous = false;
      rec.interimResults = true;
      rec.lang = 'en-US';

      rec.onstart = () => {
        setIsListening(true);
      };

      rec.onend = () => {
        setIsListening(false);
        recognitionRef.current = null;
      };

      rec.onerror = (e: any) => {
        console.error('Speech recognition error:', e);
        setIsListening(false);
        recognitionRef.current = null;

        let errorMsg = "Speech recognition issue.";
        if (e.error === 'not-allowed') {
          errorMsg = "🎤 **Microphone Access Denied**: Please click the permissions lock in your address bar to allow browser and iframe microphone access!";
        } else if (e.error === 'no-speech') {
          errorMsg = "🎤 **No speech heard**: Please speak more clearly or closer to the microphone.";
        } else if (e.error === 'aborted') {
          // Quietly abort if stopped manually
          return;
        } else {
          errorMsg = `🎤 **Voice Signal Notice**: ${e.error || 'Temporary microphone connection issue'}. Try typing your command!`;
        }
        setMessages((prev) => [
          ...prev,
          { sender: 'assistant', text: errorMsg }
        ]);
      };

      rec.onresult = (event: any) => {
        let interimText = '';
        let finalListText = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          const trans = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalListText += trans;
          } else {
            interimText += trans;
          }
        }

        if (interimText) {
          setInputText(interimText);
        }

        if (finalListText) {
          setInputText(finalListText);
          try {
            rec.stop();
          } catch (stopErr) {
            console.error(stopErr);
          }
          setIsListening(false);
          handleSend(finalListText);
        }
      };

      recognitionRef.current = rec;
      rec.start();
    } catch (err) {
      console.error('Failed to start recognition:', err);
      setIsListening(false);
      recognitionRef.current = null;
    }
  };

  const handleChipClick = (prompt: string) => {
    handleSend(prompt);
  };

  const starterChips = [
    { title: "Order Lavender Honey Latte", icon: <Coffee className="w-3.5 h-3.5 text-cafe-gold" /> },
    { title: "Book lounge table for 3 people", icon: <Calendar className="w-3.5 h-3.5 text-cafe-gold" /> },
    { title: "What are your open timings?", icon: <Clock className="w-3.5 h-3.5 text-cafe-gold" /> },
    { title: "Add Pistachio Croissant to cart", icon: <ShoppingBag className="w-3.5 h-3.5 text-cafe-gold" /> }
  ];

  return (
    <div id="ai-voice-assistant-page" className="bg-transparent min-h-[calc(100vh-130px)] pt-16 sm:pt-24 pb-8 sm:pb-16 font-sans text-cafe-smoky relative z-10 flex flex-col justify-start">
      <div className="max-w-5xl mx-auto px-2 sm:px-6 w-full flex flex-col justify-start">
        
        {/* Page Title Header */}
        <div className="text-center space-y-2 mb-4 sm:mb-8 shrink-0">
          <span className="text-[9px] sm:text-[10px] uppercase font-extrabold text-[#C4A484] tracking-[0.2em] font-mono bg-cafe-smoky text-white px-3 sm:px-4 py-1 rounded-full border border-[#C4A484]/30 inline-block">
            ☕ DIGITAL HARMONY CONCIERGE
          </span>
          <h1 className="font-serif text-xl sm:text-4xl lg:text-5xl font-extrabold uppercase text-cafe-charcoal tracking-tight mt-0.5 sm:mt-2">
            Parlour Concierge
          </h1>
          <p className="hidden md:block text-xs sm:text-sm text-cafe-charcoal/80 max-w-xl mx-auto leading-relaxed">
            A bespoke Slow-Living digital host ready to answer menu descriptions, retrieve glasshouse booking availability, and coordinate order add-to-carts instantly.
          </p>
        </div>

        {/* Center-aligned Chat Container */}
        <div id="voice-assistant-chat-wrapper" className="flex justify-center w-full relative z-30">
          
          {/* Main Chat Interface with precise responsive height bounds */}
          <div className="w-full max-w-3xl flex flex-col justify-start h-[75vh] min-h-[480px] max-h-[740px]">
            
            <ScrollReveal direction="up" delay={50} className="w-full h-full flex flex-col">
              <GlassCard theme="light" className="h-full w-full flex flex-col justify-between p-0 overflow-hidden relative shadow-2xl border border-[#A88665]/20" hoverEffect={false}>
                
                {/* Header with status controls and speech toggle */}
                <div className="px-5 py-3.5 border-b border-[#A88665]/20 bg-stone-50/90 flex items-center justify-between shrink-0">
                  <div className="flex items-center space-x-3 text-left">
                    <div className={`w-8.5 h-8.5 rounded-full bg-cafe-smoky flex items-center justify-center border transition-all ${isListening ? 'border-red-500 animate-pulse ring-4 ring-red-500/10' : 'border-[#A88665]'}`}>
                      {isListening ? (
                        <Mic className="w-4 h-4 text-red-500 animate-bounce" />
                      ) : (
                        <Coffee className="w-4 h-4 text-cafe-gold" />
                      )}
                    </div>
                    <div>
                      <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#1C1814] block">Aura Parlour Guide</span>
                      {isListening ? (
                        <div className="flex items-center space-x-2 mt-0.5">
                          <span className="text-[8px] uppercase tracking-widest text-red-600 font-extrabold animate-pulse font-mono block">● Listening closely...</span>
                          <div className="flex items-center space-x-0.5 h-3">
                            {[0.1, 0.35, 0.2, 0.45, 0.15].map((delay, index) => (
                              <div
                                key={index}
                                className="w-[2px] bg-red-500 rounded-full animate-pulse shrink-0"
                                style={{
                                  height: `${6 + delay * 12}px`,
                                  animationDuration: `${0.4 + delay}s`,
                                  animationDelay: `${delay}s`,
                                }}
                              />
                            ))}
                          </div>
                      </div>
                    ) : (
                      <span className="text-[8px] uppercase tracking-widest text-[#A47E54] font-extrabold block font-mono mt-0.5 animate-pulse">● Ready for voice or text</span>
                    )}
                  </div>
                </div>

                {/* Sound & Speak Panel Indicators */}
                <div className="flex items-center space-x-1.5 sm:space-x-2">
                  
                  {/* Talk Back Toggle */}
                  <button
                    type="button"
                    onClick={() => {
                      const nextState = !speechEnabled;
                      setSpeechEnabled(nextState);
                      if (!nextState && window.speechSynthesis) {
                        window.speechSynthesis.cancel();
                        setIsSpeaking(false);
                        setSpeakingIndex(null);
                      }
                    }}
                    className={`flex items-center space-x-1 px-2.5 py-1.5 rounded-lg border text-[9px] font-extrabold uppercase transition-all duration-300 ${speechEnabled ? 'bg-amber-100/50 border-[#A88665]/40 text-[#A47E54]' : 'bg-stone-100 border-stone-200 text-stone-400'}`}
                    title={speechEnabled ? "Auto-speak is active" : "Auto-speak is disabled"}
                  >
                    {speechEnabled ? <Volume2 className="w-3.5 h-3.5 shrink-0" /> : <VolumeX className="w-3.5 h-3.5 shrink-0" />}
                    <span className="hidden sm:inline">{speechEnabled ? "AUTO-SPEAK ON" : "AUTO-SPEAK OFF"}</span>
                    <span className="inline sm:hidden">{speechEnabled ? "TALK" : "MUTED"}</span>
                  </button>

                  <span className="hidden sm:inline px-2 py-1 bg-stone-100 border border-stone-200 rounded text-[8px] font-mono tracking-wide text-stone-500 font-extrabold">
                    gemini-3.5-flash
                  </span>
                </div>
              </div>

              {/* Chat Log Window scroll area */}
              <div 
                ref={scrollContainerRef} 
                className="flex-1 overflow-y-auto px-5 py-4 space-y-4 bg-[#FDFBF7]/40 touch-pan-y overscroll-contain text-left"
                style={{ WebkitOverflowScrolling: 'touch' }}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
              >
                {messages.map((msg, i) => (
                  <div
                    key={i}
                    className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'} animate-fadeIn`}
                  >
                    <div className="flex items-start space-x-2 max-w-[85%]">
                      {msg.sender === 'assistant' && (
                        <div className="w-6 h-6 rounded-full bg-[#9C7346]/10 border border-[#9C7346]/40 flex items-center justify-center shrink-0 mt-0.5 text-xs">
                          ✨
                        </div>
                      )}
                      <div className="space-y-1.5">
                        <div
                          className={`rounded-2xl px-3.5 py-2.5 text-[11px] sm:text-xs leading-relaxed shadow-sm ${
                            msg.sender === 'user'
                              ? 'bg-[#1C1814] text-white rounded-tr-none border border-black font-semibold'
                              : 'bg-white border border-[#A88665]/25 text-[#1C1814] rounded-tl-none font-medium'
                          }`}
                        >
                          <p className="whitespace-pre-line font-medium prose max-w-none text-[11.5px] tracking-wide">
                            {msg.text}
                          </p>
                        </div>
                        
                        {/* Manual Speech/Stop Speaking buttons for assistant messages */}
                        {msg.sender === 'assistant' && (
                          <div className="flex items-center space-x-2 pl-1">
                            {speakingIndex === i ? (
                              <button
                                type="button"
                                onClick={stopSpeaking}
                                className="px-2 py-0.5 rounded bg-red-100 hover:bg-red-200 text-red-700 text-[9px] font-extrabold flex items-center space-x-1 border border-red-200 transition-all cursor-pointer"
                                title="Stop audio playback"
                              >
                                <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping inline-block"></span>
                                <VolumeX className="w-3.5 h-3.5 text-red-600 shrink-0" />
                                <span>STOP AUDIO</span>
                              </button>
                            ) : (
                              <button
                                type="button"
                                onClick={() => speakResponse(msg.text, i)}
                                className="px-2 py-0.5 rounded bg-amber-50 hover:bg-amber-100 text-[#A47E54] hover:text-[#1C1814] text-[9px] font-extrabold flex items-center space-x-1 border border-[#A88665]/20 transition-all cursor-pointer"
                                title="Speak this message out loud"
                              >
                                <Volume2 className="w-3.5 h-3.5 text-[#A47E54] shrink-0" />
                                <span>LISTEN VOICE</span>
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}

                {isSpeaking && (
                  <div className="flex justify-start animate-fadeIn">
                    <div className="flex items-center space-x-3 px-4 py-2 bg-amber-50 border border-[#A88665]/20 rounded-2xl shadow-sm">
                      <div className="flex items-center space-x-1.5 text-[9px] text-[#A47E54] font-extrabold tracking-wider font-mono uppercase">
                        <span className="relative flex h-2 w-2">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
                        </span>
                        <span>Guide is speaking...</span>
                      </div>
                      <button
                        type="button"
                        onClick={stopSpeaking}
                        className="px-2.5 py-1 bg-red-500 hover:bg-red-600 active:bg-red-700 text-white font-extrabold text-[9px] rounded-full uppercase tracking-wider transition-all duration-300 flex items-center space-x-1 cursor-pointer border border-red-600 shadow-sm"
                      >
                        <VolumeX className="w-3 h-3 shrink-0" />
                        <span>STOP AUDIO ASSIST</span>
                      </button>
                    </div>
                  </div>
                )}

                {isTyping && (
                  <div className="flex justify-start animate-pulse">
                    <div className="bg-white border border-[#A88665]/20 text-cafe-smoky rounded-2xl rounded-tl-none px-3.5 py-2.5 text-xs flex items-center space-x-1 shadow-sm">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#966F42] animate-bounce"></span>
                      <span className="w-1.5 h-1.5 rounded-full bg-[#966F42] animate-bounce [animation-delay:0.2s]"></span>
                      <span className="w-1.5 h-1.5 rounded-full bg-[#966F42] animate-bounce [animation-delay:0.4s]"></span>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Action Area for chat chips & typing + speech mic controls */}
              <div className="p-4 border-t border-[#A88665]/20 bg-stone-50/95 space-y-3 shrink-0">
                
                {/* Micro starter chip controllers */}
                <div className="flex items-center space-x-2 overflow-x-auto pb-1 no-scrollbar scroll-smooth">
                  {starterChips.map((chip, k) => (
                    <button
                      key={k}
                      type="button"
                      onClick={() => handleChipClick(chip.title)}
                      className="flex items-center space-x-1 shrink-0 px-3 py-1.5 bg-white hover:bg-[#FAF6F0] border border-[#A88665]/25 text-[9px] sm:text-[10px] font-extrabold tracking-wider text-[#1C1814] rounded-full transition-all cursor-pointer shadow-subtle"
                    >
                      {chip.icon}
                      <span>{chip.title}</span>
                    </button>
                  ))}
                </div>

                {/* Input forms + mic controllers */}
                <div
                  className="flex items-center space-x-2"
                >
                  
                  {/* Microphone Trigger Action */}
                  <button
                    type="button"
                    onClick={toggleListening}
                    className={`p-3 relative rounded-xl border transition-all duration-300 shrink-0 cursor-pointer ${
                      isListening 
                        ? 'bg-red-500 border-red-600 text-white shadow-lg ring-4 ring-red-500/25 animate-pulse' 
                        : 'bg-white border-[#A88665]/35 text-[#1C1814] hover:bg-stone-50'
                    }`}
                    title={isListening ? "Stop voice listening" : "Start speaking with microphone"}
                  >
                    {isListening ? (
                      <div className="flex items-center justify-center space-x-1.5 h-4">
                        <MicOff className="w-4 h-4 text-center" />
                        <div className="flex items-center space-x-0.5 h-3">
                          {[0.08, 0.24, 0.16].map((delay, index) => (
                            <div
                              key={index}
                              className="w-[1.5px] bg-white rounded-full animate-pulse shrink-0"
                              style={{
                                height: `${5 + delay * 10}px`,
                                animationDuration: `${0.35 + delay}s`,
                                animationDelay: `${delay}s`,
                              }}
                            />
                          ))}
                        </div>
                      </div>
                    ) : (
                      <Mic className="w-4 h-4 text-center" />
                    )}
                    
                    {/* Ring Pulse overlay */}
                    {isListening && (
                      <span className="absolute inset-0 rounded-xl border border-red-300 scale-125 animate-ping opacity-60"></span>
                    )}
                  </button>

                  <input
                    type="text"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleSend(inputText);
                      }
                    }}
                    placeholder="Speak or type your request..."
                    className="flex-1 min-w-0 bg-white border border-[#A88665]/35 rounded-xl px-4 py-3 text-[11px] text-[#1C1814] font-bold font-mono outline-none focus:border-[#1C1814] tracking-tight uppercase placeholder:text-stone-400"
                  />
                  
                  <button
                    type="button"
                    onClick={() => handleSend(inputText)}
                    className="p-3 bg-[#1C1814] hover:bg-[#A88665] text-white hover:text-[#1C1814] rounded-xl transition-all duration-300 shadow-md cursor-pointer shrink-0 border border-black"
                  >
                    <Send className="w-4 h-4 text-center" />
                  </button>
                </div>

              </div>

              </GlassCard>
            </ScrollReveal>

          </div>

        </div>

      </div>
    </div>
  );
}
