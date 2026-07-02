// sugora Calling System - WebRTC and Supabase Signaling
// Fully production-ready, peer-to-peer audio/video calling.
import { getRealSupabaseClient } from './supabase';

export interface CallRecord {
  id: string;
  caller_id: string;
  receiver_id: string;
  type: 'voice' | 'video';
  status: 'ringing' | 'active' | 'completed' | 'missed' | 'rejected' | 'cancelled';
  started_at: string;
  ended_at?: string;
  duration?: number;
  caller_name?: string;
  receiver_name?: string;
}

export type CallStateStatus = 'ringing_outgoing' | 'ringing_incoming' | 'active' | 'completed' | 'missed' | 'rejected' | 'cancelled' | null;

export interface CallingState {
  callId: string | null;
  type: 'voice' | 'video' | null;
  status: CallStateStatus;
  otherUser: any | null;
  localStream: MediaStream | null;
  remoteStream: MediaStream | null;
  isMuted: boolean;
  isCameraOff: boolean;
  callDuration: number;
}

let ringtoneAudioCtx: AudioContext | null = null;
let ringtoneIntervalId: any = null;

export function playSyntheticRingtone() {
  if (ringtoneIntervalId) return;
  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;
    ringtoneAudioCtx = new AudioContextClass();
    
    const playTone = () => {
      if (!ringtoneAudioCtx || ringtoneAudioCtx.state === 'closed') return;
      
      const osc1 = ringtoneAudioCtx.createOscillator();
      const osc2 = ringtoneAudioCtx.createOscillator();
      const gainNode = ringtoneAudioCtx.createGain();

      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(440, ringtoneAudioCtx.currentTime); // Standard ringtone tone 1
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(480, ringtoneAudioCtx.currentTime); // Standard ringtone tone 2

      gainNode.gain.setValueAtTime(0, ringtoneAudioCtx.currentTime);
      gainNode.gain.linearRampToValueAtTime(0.25, ringtoneAudioCtx.currentTime + 0.1);
      gainNode.gain.exponentialRampToValueAtTime(0.001, ringtoneAudioCtx.currentTime + 1.8);

      osc1.connect(gainNode);
      osc2.connect(gainNode);
      gainNode.connect(ringtoneAudioCtx.destination);

      osc1.start();
      osc2.start();
      osc1.stop(ringtoneAudioCtx.currentTime + 2.0);
      osc2.stop(ringtoneAudioCtx.currentTime + 2.0);
    };

    playTone();
    ringtoneIntervalId = setInterval(playTone, 2500);
  } catch (e) {
    console.error('Failed to play synthetic ringtone:', e);
  }
}

export function stopSyntheticRingtone() {
  if (ringtoneIntervalId) {
    clearInterval(ringtoneIntervalId);
    ringtoneIntervalId = null;
  }
  if (ringtoneAudioCtx) {
    try {
      ringtoneAudioCtx.close();
    } catch (e) {}
    ringtoneAudioCtx = null;
  }
}

class CallingStoreClass {
  private state: CallingState = {
    callId: null,
    type: null,
    status: null,
    otherUser: null,
    localStream: null,
    remoteStream: null,
    isMuted: false,
    isCameraOff: false,
    callDuration: 0
  };

  private listeners: Set<() => void> = new Set();
  private peerConnection: RTCPeerConnection | null = null;
  private signalingChannel: any = null;
  private callTimerId: any = null;
  private currentUserId: string | null = null;
  private callHistory: CallRecord[] = [];

  public init(userId: string) {
    if (this.currentUserId === userId) return;
    this.currentUserId = userId;
    this.setupSignaling(userId);
    this.fetchCallHistory();
  }

  public subscribe(listener: () => void) {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notify() {
    this.listeners.forEach((l) => l());
  }

  public getState(): CallingState {
    return this.state;
  }

  public getCallHistory(): CallRecord[] {
    return this.callHistory;
  }

  private async fetchCallHistory() {
    const client = getRealSupabaseClient();
    if (!client) return;

    try {
      const { data, error } = await client
        .from('calls')
        .select('*')
        .order('started_at', { ascending: false });

      if (data && !error) {
        this.callHistory = data;
        this.notify();
      }
    } catch (e) {
      console.error('Error fetching call history:', e);
    }
  }

  private setupSignaling(userId: string) {
    const client = getRealSupabaseClient();
    if (!client) return;

    if (this.signalingChannel) {
      client.removeChannel(this.signalingChannel);
    }

    this.signalingChannel = client.channel(`signaling-${userId}`);

    this.signalingChannel
      .on('broadcast', { event: 'ringing' }, async ({ payload }: any) => {
        console.log('Received incoming call ringing broadcast:', payload);
        if (this.state.status !== null) {
          // Send busy signal
          this.sendSignalingMessage(payload.callerId, 'busy', { callId: payload.callId });
          return;
        }

        this.state = {
          callId: payload.callId,
          type: payload.type,
          status: 'ringing_incoming',
          otherUser: payload.callerProfile,
          localStream: null,
          remoteStream: null,
          isMuted: false,
          isCameraOff: false,
          callDuration: 0
        };

        playSyntheticRingtone();
        this.notify();
      })
      .on('broadcast', { event: 'busy' }, ({ payload }: any) => {
        if (this.state.callId === payload.callId) {
          this.endCallLocally('rejected');
          alert('User is busy on another call.');
        }
      })
      .on('broadcast', { event: 'accepted' }, async ({ payload }: any) => {
        if (this.state.callId === payload.callId && this.state.status === 'ringing_outgoing') {
          stopSyntheticRingtone();
          this.state.status = 'active';
          this.startCallTimer();
          this.notify();

          // Initialize WebRTC Peer connection
          await this.initializeWebRTC(true);
        }
      })
      .on('broadcast', { event: 'declined' }, ({ payload }: any) => {
        if (this.state.callId === payload.callId) {
          this.endCallLocally('rejected');
        }
      })
      .on('broadcast', { event: 'cancelled' }, ({ payload }: any) => {
        if (this.state.callId === payload.callId) {
          this.endCallLocally('cancelled');
        }
      })
      .on('broadcast', { event: 'ended' }, ({ payload }: any) => {
        if (this.state.callId === payload.callId) {
          this.endCallLocally('completed');
        }
      })
      .on('broadcast', { event: 'webrtc-offer' }, async ({ payload }: any) => {
        if (this.state.callId === payload.callId) {
          await this.initializeWebRTC(false);
          if (this.peerConnection) {
            await this.peerConnection.setRemoteDescription(new RTCSessionDescription(payload.offer));
            const answer = await this.peerConnection.createAnswer();
            await this.peerConnection.setLocalDescription(answer);
            this.sendSignalingMessage(this.state.otherUser.id, 'webrtc-answer', {
              callId: this.state.callId,
              answer
            });
          }
        }
      })
      .on('broadcast', { event: 'webrtc-answer' }, async ({ payload }: any) => {
        if (this.state.callId === payload.callId && this.peerConnection) {
          await this.peerConnection.setRemoteDescription(new RTCSessionDescription(payload.answer));
        }
      })
      .on('broadcast', { event: 'webrtc-ice' }, async ({ payload }: any) => {
        if (this.state.callId === payload.callId && this.peerConnection && payload.candidate) {
          try {
            await this.peerConnection.addIceCandidate(new RTCIceCandidate(payload.candidate));
          } catch (e) {
            console.error('Error adding ICE candidate:', e);
          }
        }
      })
      .subscribe();
  }

  private sendSignalingMessage(receiverId: string, event: string, payload: any) {
    const client = getRealSupabaseClient();
    if (!client) return;

    client.channel(`signaling-${receiverId}`).send({
      type: 'broadcast',
      event,
      payload
    });
  }

  public async startCall(receiverProfile: any, type: 'voice' | 'video') {
    if (!this.currentUserId) return;
    const callId = 'call-' + Math.random().toString(36).substring(2, 15);

    this.state = {
      callId,
      type,
      status: 'ringing_outgoing',
      otherUser: receiverProfile,
      localStream: null,
      remoteStream: null,
      isMuted: false,
      isCameraOff: false,
      callDuration: 0
    };

    playSyntheticRingtone();
    this.notify();

    // 1. Save Call to Supabase Calls Table
    const client = getRealSupabaseClient();
    if (client) {
      await client.from('calls').insert({
        id: callId,
        caller_id: this.currentUserId,
        receiver_id: receiverProfile.id,
        type,
        status: 'ringing',
        started_at: new Date().toISOString()
      });
    }

    // 2. Fetch current user profile details
    let callerProfile: any = { id: this.currentUserId, username: 'User' };
    if (client) {
      const { data } = await client.from('profiles').select('*').eq('id', this.currentUserId).single();
      if (data) callerProfile = data;
    }

    // 3. Broadcast Ringing signal to Receiver
    this.sendSignalingMessage(receiverProfile.id, 'ringing', {
      callId,
      type,
      callerId: this.currentUserId,
      callerProfile
    });

    // Timeout call after 45 seconds if no answer
    setTimeout(() => {
      if (this.state.callId === callId && this.state.status === 'ringing_outgoing') {
        this.cancelCall();
      }
    }, 45000);
  }

  public async acceptCall() {
    if (!this.state.callId || !this.state.otherUser || !this.currentUserId) return;

    stopSyntheticRingtone();
    this.state.status = 'active';
    this.startCallTimer();
    this.notify();

    // 1. Update status to active in Supabase
    const client = getRealSupabaseClient();
    if (client) {
      await client.from('calls').update({ status: 'active' }).eq('id', this.state.callId);
    }

    // 2. Broadcast accepted signal to caller
    this.sendSignalingMessage(this.state.otherUser.id, 'accepted', {
      callId: this.state.callId
    });

    // 3. Setup WebRTC Peer
    await this.initializeWebRTC(false);
  }

  public async declineCall() {
    if (!this.state.callId || !this.state.otherUser) return;

    const callId = this.state.callId;
    const otherId = this.state.otherUser.id;

    // 1. Update status in Supabase
    const client = getRealSupabaseClient();
    if (client) {
      await client.from('calls').update({
        status: 'rejected',
        ended_at: new Date().toISOString()
      }).eq('id', callId);
    }

    // 2. Broadcast decline
    this.sendSignalingMessage(otherId, 'declined', { callId });

    this.endCallLocally('rejected');
  }

  public async cancelCall() {
    if (!this.state.callId || !this.state.otherUser) return;

    const callId = this.state.callId;
    const otherId = this.state.otherUser.id;

    // 1. Update status in Supabase
    const client = getRealSupabaseClient();
    if (client) {
      await client.from('calls').update({
        status: 'cancelled',
        ended_at: new Date().toISOString()
      }).eq('id', callId);
    }

    // 2. Broadcast cancel
    this.sendSignalingMessage(otherId, 'cancelled', { callId });

    this.endCallLocally('cancelled');
  }

  public async endCall() {
    if (!this.state.callId || !this.state.otherUser) return;

    const callId = this.state.callId;
    const otherId = this.state.otherUser.id;
    const duration = this.state.callDuration;

    // 1. Update status in Supabase
    const client = getRealSupabaseClient();
    if (client) {
      await client.from('calls').update({
        status: 'completed',
        ended_at: new Date().toISOString(),
        duration
      }).eq('id', callId);
    }

    // 2. Broadcast ended
    this.sendSignalingMessage(otherId, 'ended', { callId });

    this.endCallLocally('completed');
  }

  private async initializeWebRTC(isInitiator: boolean) {
    try {
      // Fetch local media stream
      const constraints = {
        audio: true,
        video: this.state.type === 'video'
      };
      
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      this.state.localStream = stream;
      this.notify();

      // Configure Peer Connection
      const configuration = {
        iceServers: [
          { urls: 'stun:stun.l.google.com:19302' },
          { urls: 'stun:stun1.l.google.com:19302' }
        ]
      };

      this.peerConnection = new RTCPeerConnection(configuration);

      // Add local stream tracks to connection
      stream.getTracks().forEach((track) => {
        this.peerConnection?.addTrack(track, stream);
      });

      // Stream remote handler
      this.peerConnection.ontrack = (event) => {
        if (event.streams && event.streams[0]) {
          this.state.remoteStream = event.streams[0];
          this.notify();
        }
      };

      // Ice Candidate exchange
      this.peerConnection.onicecandidate = (event) => {
        if (event.candidate && this.state.otherUser) {
          this.sendSignalingMessage(this.state.otherUser.id, 'webrtc-ice', {
            callId: this.state.callId,
            candidate: event.candidate
          });
        }
      };

      // Handle renegotiation if initiator
      if (isInitiator) {
        this.peerConnection.onnegotiationneeded = async () => {
          if (!this.peerConnection || !this.state.otherUser) return;
          const offer = await this.peerConnection.createOffer();
          await this.peerConnection.setLocalDescription(offer);
          this.sendSignalingMessage(this.state.otherUser.id, 'webrtc-offer', {
            callId: this.state.callId,
            offer
          });
        };
      }

    } catch (err) {
      console.error('Failed to initialize WebRTC Peer Connection:', err);
      alert('Permission denied or media hardware error.');
      this.endCall();
    }
  }

  private startCallTimer() {
    this.stopCallTimer();
    this.state.callDuration = 0;
    this.callTimerId = setInterval(() => {
      this.state.callDuration += 1;
      this.notify();
    }, 1000);
  }

  private stopCallTimer() {
    if (this.callTimerId) {
      clearInterval(this.callTimerId);
      this.callTimerId = null;
    }
  }

  private endCallLocally(finalStatus: CallStateStatus) {
    stopSyntheticRingtone();
    this.stopCallTimer();

    // Close tracks
    if (this.state.localStream) {
      this.state.localStream.getTracks().forEach((track) => track.stop());
    }

    if (this.peerConnection) {
      this.peerConnection.close();
      this.peerConnection = null;
    }

    this.state = {
      callId: null,
      type: null,
      status: null,
      otherUser: null,
      localStream: null,
      remoteStream: null,
      isMuted: false,
      isCameraOff: false,
      callDuration: 0
    };

    this.fetchCallHistory();
    this.notify();
  }

  public toggleMute() {
    if (this.state.localStream) {
      const audioTrack = this.state.localStream.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        this.state.isMuted = !audioTrack.enabled;
        this.notify();
      }
    }
  }

  public toggleCamera() {
    if (this.state.localStream) {
      const videoTrack = this.state.localStream.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
        this.state.isCameraOff = !videoTrack.enabled;
        this.notify();
      }
    }
  }
}

export const callingStore = new CallingStoreClass();
