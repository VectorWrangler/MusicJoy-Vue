declare module 'howler' {
  export class Howl {
    constructor(options: any);
    play(): void;
    pause(): void;
    stop(): void;
    unload(): void;
    volume(volume?: number): number;
    seek(seek?: number): number;
  }
  
  export const Howler: any;
}