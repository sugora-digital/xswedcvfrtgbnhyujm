import React, { useEffect, useRef, useState } from 'react';
import { callingStore, stopSyntheticRingtone } from '../lib/callingStore';
import { Phone, PhoneOff, Video, VideoOff, Mic, MicOff, Volume2, Maximize2, Signal, User } from 'lucide-react';

export default function CallOverlay() {
  const [state, setState] = useState(callingStore.getState());
  const [isSilenced, setIsSilenced] = useState(false);
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const unsubscribe = callingStore.subscribe(() => {
      setState(callingStore.getState());
    });
    return () => {
      unsubscribe();
    };
  }, []);

  // Sync media streams to video elements
  useEffect(() => {
    if (state.localStream && localVideoRef.current) {
      localVideoRef.current.srcObject = state.localStream;
    }
  }, [state.localStream, state.status]);

  useEffect(() => {
    if (state.remoteStream && remoteVideoRef.current) {
      remoteVideoRef.current.srcObject = state.remoteStream;
    }
  }, [state.remoteStream, state.status]);

  if (!state.status) return null;

  const formatDuration = (sec: number) => {
    const m = Math.floor(sec / 60).toString().padStart(2, '0');
    const s = (sec % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const handleSilence = () => {
    setIsSilenced(true);
    stopSyntheticRingtone();
  };

  const initials = state.otherUser?.display_name
    ? state.otherUser.display_name.substring(0, 2).toUpperCase()
    : state.otherUser?.username
    ? state.otherUser.username.substring(0, 2).toUpperCase()
    : 'U';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/95 backdrop-blur-md text-white font-sans overflow-hidden">
      {/* Background ambient light */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl animate-pulse" />

      {/* CALLING: RINGING INCOMING */}
      {state.status === 'ringing_incoming' && (
        <div className="max-w-md w-full px-6 text-center space-y-12 animate-in fade-in zoom-in-95 duration-300">
          <div className="space-y-4">
            <div className="relative inline-block">
              {state.otherUser?.avatar ? (
                <img
                  src={state.otherUser.avatar}
                  alt={state.otherUser.display_name}
                  className="w-28 h-28 rounded-full border-4 border-teal-500/30 object-cover mx-auto shadow-2xl"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <div className="w-28 h-28 rounded-full border-4 border-teal-500/30 bg-zinc-800 flex items-center justify-center text-3xl font-extrabold text-teal-400 mx-auto shadow-2xl">
                  {initials}
                </div>
              )}
              {/* Pulsing ring */}
              <div className="absolute inset-0 rounded-full border border-teal-400 animate-ping opacity-75" />
            </div>
            
            <div className="space-y-1">
              <h2 className="text-2xl font-bold tracking-tight text-neutral-50">
                {state.otherUser?.display_name || state.otherUser?.username || 'Incoming Call'}
              </h2>
              <p className="text-sm text-teal-400 font-semibold tracking-wider uppercase animate-pulse">
                Sugora Secure {state.type === 'video' ? 'Video' : 'Voice'} Call...
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => callingStore.acceptCall()}
              className="w-full sm:w-auto flex items-center justify-center gap-3 px-8 py-4 rounded-2xl bg-teal-500 hover:bg-teal-600 active:scale-95 text-white font-bold transition-all shadow-lg cursor-pointer"
            >
              <Phone className="h-5 w-5 fill-current" />
              <span>Accept</span>
            </button>

            <button
              onClick={() => callingStore.declineCall()}
              className="w-full sm:w-auto flex items-center justify-center gap-3 px-8 py-4 rounded-2xl bg-red-500 hover:bg-red-600 active:scale-95 text-white font-bold transition-all shadow-lg cursor-pointer"
            >
              <PhoneOff className="h-5 w-5 fill-current" />
              <span>Decline</span>
            </button>

            {!isSilenced && (
              <button
                onClick={handleSilence}
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-4 rounded-2xl bg-zinc-800 hover:bg-zinc-700 text-neutral-300 text-sm font-semibold transition-all cursor-pointer"
              >
                <span>Silence Ringtone</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* CALLING: RINGING OUTGOING */}
      {state.status === 'ringing_outgoing' && (
        <div className="max-w-md w-full px-6 text-center space-y-12 animate-in fade-in zoom-in-95 duration-300">
          <div className="space-y-4">
            <div className="relative inline-block">
              {state.otherUser?.avatar ? (
                <img
                  src={state.otherUser.avatar}
                  alt={state.otherUser.display_name}
                  className="w-28 h-28 rounded-full border-4 border-zinc-700 object-cover mx-auto shadow-2xl"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <div className="w-28 h-28 rounded-full border-4 border-zinc-700 bg-zinc-800 flex items-center justify-center text-3xl font-extrabold text-neutral-300 mx-auto shadow-2xl">
                  {initials}
                </div>
              )}
              {/* Single ripple circle */}
              <div className="absolute inset-0 rounded-full border border-zinc-500 animate-ping opacity-50" />
            </div>

            <div className="space-y-1">
              <h2 className="text-2xl font-bold tracking-tight text-neutral-50">
                {state.otherUser?.display_name || state.otherUser?.username || 'Calling...'}
              </h2>
              <p className="text-sm text-neutral-400 font-semibold tracking-wider uppercase animate-pulse">
                Outgoing {state.type === 'video' ? 'Video' : 'Voice'} Connection...
              </p>
            </div>
          </div>

          <div>
            <button
              onClick={() => callingStore.cancelCall()}
              className="inline-flex items-center justify-center gap-3 px-8 py-4 rounded-2xl bg-red-500 hover:bg-red-600 active:scale-95 text-white font-bold transition-all shadow-lg cursor-pointer"
            >
              <PhoneOff className="h-5 w-5 fill-current" />
              <span>Cancel</span>
            </button>
          </div>
        </div>
      )}

      {/* CALLING: ACTIVE SESSION */}
      {state.status === 'active' && (
        <div className="relative w-full h-full flex flex-col items-center justify-between p-6">
          {/* Top Bar with metadata */}
          <div className="w-full flex items-center justify-between z-10 max-w-4xl bg-zinc-900/60 p-4 rounded-2xl backdrop-blur-md border border-zinc-800/50">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-teal-500/10 text-teal-400">
                <Signal className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-neutral-100">
                  {state.otherUser?.display_name || state.otherUser?.username}
                </h3>
                <p className="text-xs text-neutral-400 flex items-center gap-1">
                  <span>Secured P2P Call</span>
                  <span className="h-1 w-1 bg-green-500 rounded-full animate-ping" />
                </p>
              </div>
            </div>

            <div className="bg-zinc-800/80 px-4 py-1.5 rounded-xl text-sm font-mono tracking-widest text-teal-400 font-bold border border-zinc-700/50">
              {formatDuration(state.callDuration)}
            </div>
          </div>

          {/* Video Feed Area */}
          {state.type === 'video' ? (
            <div className="absolute inset-0 w-full h-full z-0 bg-neutral-950">
              {/* Remote full-screen video */}
              {state.remoteStream ? (
                <video
                  ref={remoteVideoRef}
                  autoPlay
                  playsInline
                  className="w-full h-full object-cover"
                  id="remote-video"
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center gap-3 bg-zinc-900/40 text-neutral-400">
                  <div className="w-20 h-20 bg-zinc-800 rounded-full flex items-center justify-center text-3xl font-extrabold text-teal-500">
                    {initials}
                  </div>
                  <span className="text-sm font-medium">Waiting for video stream...</span>
                </div>
              )}

              {/* Local mini preview (pip) */}
              <div className="absolute bottom-28 right-6 w-32 sm:w-44 h-44 sm:h-56 bg-zinc-900 rounded-2xl overflow-hidden shadow-2xl border-2 border-teal-500/30 z-10">
                {state.isCameraOff ? (
                  <div className="w-full h-full flex items-center justify-center bg-zinc-850 text-neutral-500">
                    <VideoOff className="h-6 w-6" />
                  </div>
                ) : (
                  <video
                    ref={localVideoRef}
                    autoPlay
                    playsInline
                    muted
                    className="w-full h-full object-cover scale-x-[-1]"
                    id="local-video"
                  />
                )}
              </div>
            </div>
          ) : (
            // Voice feed visualizer (cosmic waves)
            <div className="flex-1 flex flex-col items-center justify-center space-y-6 z-10">
              <div className="relative">
                {state.otherUser?.avatar ? (
                  <img
                    src={state.otherUser.avatar}
                    alt={state.otherUser.display_name}
                    className="w-32 h-32 rounded-full border-4 border-teal-500/30 object-cover shadow-2xl"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="w-32 h-32 rounded-full border-4 border-teal-500/30 bg-zinc-850 flex items-center justify-center text-4xl font-extrabold text-teal-400 shadow-2xl">
                    {initials}
                  </div>
                )}
                {/* Audio visualizer rings */}
                <div className="absolute -inset-4 rounded-full border-2 border-teal-500/20 animate-pulse" />
                <div className="absolute -inset-8 rounded-full border border-indigo-500/10 animate-ping opacity-40" />
              </div>
              <p className="text-neutral-400 text-sm font-semibold uppercase tracking-widest animate-pulse">
                Active Audio Stream...
              </p>
            </div>
          )}

          {/* Call Controls Floating Bar */}
          <div className="w-full max-w-md bg-zinc-900/90 border border-zinc-800/80 p-4 rounded-3xl backdrop-blur-lg flex items-center justify-around z-10 shadow-2xl mb-4">
            <button
              onClick={() => callingStore.toggleMute()}
              className={`p-4 rounded-2xl transition-all cursor-pointer hover:bg-zinc-800 ${
                state.isMuted ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30' : 'bg-zinc-800/40 text-neutral-300'
              }`}
              title={state.isMuted ? 'Unmute Mic' : 'Mute Mic'}
            >
              {state.isMuted ? <MicOff className="h-6 w-6" /> : <Mic className="h-6 w-6" />}
            </button>

            {state.type === 'video' && (
              <button
                onClick={() => callingStore.toggleCamera()}
                className={`p-4 rounded-2xl transition-all cursor-pointer hover:bg-zinc-800 ${
                  state.isCameraOff ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30' : 'bg-zinc-800/40 text-neutral-300'
                }`}
                title={state.isCameraOff ? 'Turn Camera On' : 'Turn Camera Off'}
              >
                {state.isCameraOff ? <VideoOff className="h-6 w-6" /> : <Video className="h-6 w-6" />}
              </button>
            )}

            <button
              onClick={() => callingStore.endCall()}
              className="p-5 bg-red-500 hover:bg-red-600 active:scale-95 text-white rounded-2xl transition-all shadow-lg cursor-pointer"
              title="End Call"
            >
              <PhoneOff className="h-6 w-6 fill-current" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
