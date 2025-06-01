import { Injectable } from "@angular/core";
import { environment } from "../../../environments/environment";
import { WebSocketType } from "../resource/websocket-type";
import { Observable, Subject } from "rxjs";
import { AppConfig } from "../config/app.config";
import { ChatMessageModel } from "../../data/model/chat-message/chat-message.model";

@Injectable({ providedIn: 'root' })
export class WebSocketService {
    private socket: WebSocket | null = null;
    private socketUrl = environment.SOCKET_SERVER;
    private isConnecting: boolean = false;
    private messagesSubject = new Subject<any>();
    private connectionType: 'user' | 'shop' | null = null;
    private userId: number | null = null;
    private shopId: number | null = null;
    private ownerId: number | null = null;

    constructor(
        private appConfig: AppConfig
    ) { }

    connectWebSocket(id: number) {
        if (this.isConnecting || (this.socket && this.socket.readyState === WebSocket.OPEN)) {
            console.log('WebSocket already connected or connecting');
            return;
        }
        this.connectionType = 'user';
        this.userId = id;
        this.shopId = null;
        this.ownerId = null;
        this.connect();
    }

    connectWebSocketShop(shopId: number, ownerId: number) {
        if (this.isConnecting || (this.socket && this.socket.readyState === WebSocket.OPEN)) {
            console.log('WebSocket already connected or connecting');
            return;
        }
        this.connectionType = 'shop';
        this.shopId = shopId;
        this.ownerId = ownerId;
        this.userId = null;
        this.connect();
    }

    private connect() {
        this.isConnecting = true;
        this.socket = new WebSocket(this.socketUrl);

        this.socket.onopen = () => {
            console.log(`>>> ${this.connectionType === 'user' ? 'User' : 'Shop'} connected to WebSocket`);
            if (this.socket?.readyState === WebSocket.OPEN) {
                const payload = this.connectionType === 'user'
                    ? { type: WebSocketType.REGISTER, userId: this.userId }
                    : { type: WebSocketType.REGISTER, shopId: this.shopId, ownerId: this.ownerId };
                this.socket.send(JSON.stringify(payload));
            }
            this.isConnecting = false;
        }

        this.socket.onmessage = (event: MessageEvent) => {
            try {
                const message = JSON.parse(event.data);
                console.log('Received notification: ', message);
                if (message.type === WebSocketType.NEW_MESSAGE) {
                    const transformedMessage = {
                        ...message,
                        data: new ChatMessageModel().fromJson(message.data, this.appConfig.getPreImage() ?? '')
                    }
                    this.messagesSubject.next(transformedMessage);
                } else {
                    this.messagesSubject.next(message);
                }
            } catch (error) {
                console.error('>>> Error parsing WebSocket message: ', error);
            }
        }

        this.socket.onerror = (error) => {
            console.error('WebSocket connection error:', error);
            this.isConnecting = false;
        };

        this.socket.onclose = () => {
            console.log('WebSocket disconnected');
            this.isConnecting = false;
            this.socket = null;
            /** Tái kích hoạt sau 5 giây **/
            setTimeout(() => {
                if (this.connectionType === 'user' && this.userId) {
                    this.connectWebSocket(this.userId);
                } else if (this.connectionType === 'shop' && this.shopId && this.ownerId) {
                    this.connectWebSocketShop(this.shopId, this.ownerId);
                }
            }, 5000);
        }
    }

    sendMessage(data: any) {
        if (this.socket && this.socket.readyState === WebSocket.OPEN) {
            this.socket.send(JSON.stringify(data));
        } else {
            console.warn('WebSocket is not connected');
        }
    }

    getMessages(): Observable<any> {
        return this.messagesSubject.asObservable();
    }

    isConnected(): boolean {
        return this.socket?.readyState === WebSocket.OPEN || false;
    }

    disconnect() {
        if (this.socket && this.socket.readyState === WebSocket.OPEN) {
            const payload = this.connectionType === 'user'
                ? { type: WebSocketType.LOGOUT, userId: this.userId }
                : { type: WebSocketType.LOGOUT, shopId: this.shopId, ownerId: this.ownerId };
            this.socket.send(JSON.stringify(payload));
            this.socket.close();
        }
        this.socket = null;
        this.connectionType = null;
        this.userId = null;
        this.shopId = null;
        this.ownerId = null;
    }
}