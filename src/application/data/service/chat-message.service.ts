import { Injectable } from "@angular/core";
import { AppConfig } from "../../common/config/app.config";
import { ServiceCore } from "../../common/service/service-core";
import { ChatAttachment, ChatMessageModel } from "../model/chat-message/chat-message.model";

@Injectable()
export class ChatMessageService {

    constructor(
        private serviceCore: ServiceCore,
        private appConfig: AppConfig
    ) { }

    async createMessage(chatMessage: ChatMessageModel): Promise<any> {
        try {
            const domain = this.appConfig.getDomain();
            const formData = new FormData();
            formData.append('receiverId', chatMessage.receiverId + '');
            if (chatMessage.attachments.length === 0) {
                formData.append('message', chatMessage.message);
            } else if (chatMessage.attachments.length > 0) {
                formData.append('message', '');
                chatMessage.attachments.forEach((attachment: ChatAttachment) => {
                    formData.append('chatAttachments', {
                        uri: attachment.url,
                        type: attachment.type, // 'image/png'
                        name: attachment.name,  // 'Filename.png'
                        size: attachment.size,  // 75016
                    } as any);
                })
            }
            const response = await this.serviceCore.POST(
                `${domain}`,
                `chat/send`,
                formData
            );

            return response;
        } catch (error) {
            throw error;
        }
    }

    async createConversation(shopOwnerId: number): Promise<any> {
        try {
            const domain = this.appConfig.getDomain();

            const response = await this.serviceCore.POST(
                `${domain}`,
                `chat/conversation`,
                { shopOwnerId }
            );

            return response;
        } catch (error) {
            throw error;
        }
    }

    async fetchConversations(): Promise<any> {
        try {
            const domain = this.appConfig.getDomain();
            const response = await this.serviceCore.GET(
                `${domain}`,
                `chat/conversations`,
            );
            return response;
        } catch (error) {
            throw error;
        }
    }

    async fetchChatHistory(receiverId: number): Promise<any> {
        try {
            const domain = this.appConfig.getDomain();
            const response = await this.serviceCore.GET(
                `${domain}`,
                `chat/history/${receiverId}`,
            );
            return response;
        } catch (error) {
            throw error;
        }
    }

    async markMessageAsRead(messageId: number): Promise<any> {
        try {
            const domain = this.appConfig.getDomain();
            const response = await this.serviceCore.PATCH(
                `${domain}`,
                `chat/read/${messageId}`,
                {}
            );
            return response;
        } catch (error) {
            throw error;
        }
    }

    async markConversationAsRead(receiverId: number): Promise<any> {
        try {
            const domain = this.appConfig.getDomain();
            const response = await this.serviceCore.PATCH(
                `${domain}`,
                `chat/read-conversation/${receiverId}`,
                {}
            );
            return response;
        } catch (error) {
            throw error;
        }
    }
}