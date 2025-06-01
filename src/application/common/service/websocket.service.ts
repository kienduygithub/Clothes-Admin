import { Injectable } from "@angular/core";
import { environment } from "../../../environments/environment";
import { WebSocketType } from "../resource/websocket-type";

@Injectable({ providedIn: 'root' })
export class WebSocketService {
    private socket!: WebSocket;
    private socketUrl = environment.SOCKET_SERVER;

    connectWebSocket(id: number) {
        this.socket = new WebSocket(this.socketUrl);

        this.socket.onopen = () => {
            console.log('>>> User connected websocket');
            const payload = {
                type: WebSocketType.REGISTER,
                userId: id
            }
            this.socket.send(JSON.stringify(payload));
        }

        this.socket.onmessage = (event: any) => {
            const message = JSON.parse(event.data);
            console.log('Received notification: ', message);
        }

        this.socket.onclose = () => {
            console.log('WebSocket disconnected');
        }
    }

    connectWebSocketShop(shopId: number, ownerId: number) {
        this.socket = new WebSocket(this.socketUrl);

        this.socket.onopen = () => {
            console.log('>>> Shop connected websocket');
            const payload = {
                type: WebSocketType.REGISTER,
                shopId: shopId,
                ownerId: ownerId
            }
            this.socket.send(JSON.stringify(payload));
        }

        this.socket.onmessage = (event: any) => {
            const message = JSON.parse(event.data);
            console.log('Received notification: ', message);
        }

        this.socket.onclose = () => {
            console.log('WebSocket disconnected');
        }
    }

    sendMessage(data: any) {
        if (this.socket && this.socket.readyState === WebSocket.OPEN) {
            this.socket.send(JSON.stringify(data));
        }
    }

    disconnect(user_id: number) {
        if (this.socket && this.socket.readyState === WebSocket.OPEN) {
            const payload = {
                type: WebSocketType.LOGOUT,
                userId: user_id
            };
            this.socket.send(JSON.stringify(payload));
            this.socket.close();
        }
    }

    disconnectShop(shop_id: number, ownerId: number) {
        if (this.socket && this.socket.readyState === WebSocket.OPEN) {
            const payload = {
                type: WebSocketType.LOGOUT,
                shopId: shop_id,
                ownerId: ownerId
            };
            this.socket.send(JSON.stringify(payload));
            this.socket.close();
        }
    }
}