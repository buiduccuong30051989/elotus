const WS_BASE = import.meta.env.VITE_BINANCE_WS_URL as string;

export class BinanceWs {
  private ws: WebSocket | null = null;
  private reconnectDelay = 1000;
  private stopped = false;

  constructor(
    private stream: string,
    private onMessage: (data: unknown) => void,
  ) {}

  connect() {
    this.stopped = false;
    this.ws = new WebSocket(`${WS_BASE}/${this.stream}`);

    this.ws.onmessage = (event: MessageEvent) => {
      const data: unknown = JSON.parse(event.data as string);
      this.onMessage(data);
    };

    this.ws.onclose = () => {
      if (!this.stopped) this.scheduleReconnect();
    };

    this.ws.onerror = () => {
      this.ws?.close();
    };
  }

  disconnect() {
    this.stopped = true;
    this.ws?.close();
    this.ws = null;
  }

  private scheduleReconnect() {
    setTimeout(() => {
      this.reconnectDelay = Math.min(this.reconnectDelay * 2, 30000);
      this.connect();
    }, this.reconnectDelay);
  }
}
