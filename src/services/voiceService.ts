export type VoiceState = 'idle' | 'listening' | 'processing' | 'speaking' | 'error';

export interface VoiceListenerCallback {
  onStateChange: (state: VoiceState) => void;
  onTranscript: (text: string, isFinal: boolean) => void;
  onError: (errorMsg: string) => void;
}

export class VoiceService {
  private static currentState: VoiceState = 'idle';
  private static recognition: any = null;

  public static isSupported(): boolean {
    return typeof window !== 'undefined' && ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window);
  }

  public static startListening(callbacks: VoiceListenerCallback): void {
    if (!this.isSupported()) {
      callbacks.onError('Voice recognition is not supported in this browser. You can type your symptoms below.');
      return;
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    try {
      this.recognition = new SpeechRecognition();
      this.recognition.continuous = false;
      this.recognition.interimResults = true;
      this.recognition.lang = 'en-IN'; // defaults to Indian English, can adapt to hi-IN

      this.recognition.onstart = () => {
        this.currentState = 'listening';
        callbacks.onStateChange('listening');
      };

      this.recognition.onresult = (event: any) => {
        let interimTranscript = '';
        let finalTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          } else {
            interimTranscript += event.results[i][0].transcript;
          }
        }

        if (finalTranscript) {
          callbacks.onTranscript(finalTranscript, true);
        } else if (interimTranscript) {
          callbacks.onTranscript(interimTranscript, false);
        }
      };

      this.recognition.onerror = (event: any) => {
        this.currentState = 'error';
        callbacks.onStateChange('error');
        callbacks.onError(event.error === 'not-allowed' ? 'Microphone permission denied. Please allow microphone access or type instead.' : `Voice error: ${event.error}`);
      };

      this.recognition.onend = () => {
        if (this.currentState === 'listening') {
          this.currentState = 'idle';
          callbacks.onStateChange('idle');
        }
      };

      this.recognition.start();
    } catch (err: any) {
      this.currentState = 'error';
      callbacks.onStateChange('error');
      callbacks.onError(err.message || 'Could not start microphone');
    }
  }

  public static stopListening(): void {
    if (this.recognition) {
      try {
        this.recognition.stop();
      } catch (e) {
        // ignore
      }
      this.currentState = 'idle';
    }
  }

  public static getCurrentState(): VoiceState {
    return this.currentState;
  }
}
