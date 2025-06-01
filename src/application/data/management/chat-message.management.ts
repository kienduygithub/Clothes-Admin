import { Injectable } from "@angular/core";
import { CategoryModel } from "../model/category.model";
import { ChatMessageService } from "../service/chat-message.service";
import { ChatMessageModel, Conversation, StatusMessage } from "../model/chat-message/chat-message.model";
import { AppConfig } from "../../common/config/app.config";
import { UserModel } from "../model/user/user.model";

@Injectable()
export class ChatMessageManagement {

    constructor(
        private appConfig: AppConfig,
        private chatMessageService: ChatMessageService,
    ) { }

    async createMessage(chatMessage: ChatMessageModel) {
        try {
            const result = await this.chatMessageService.createMessage(chatMessage);
            return new ChatMessageModel().fromJson(
                result?.body?.chatInfo,
                this.appConfig.getPreImage() ?? ''
            );
        } catch (error) {
            throw error;
        }
    }

    async createConversation(shopOwnerId: number) {
        try {
            const result = await this.chatMessageService.createConversation(shopOwnerId);
            return new ChatMessageModel().fromJson(
                result?.body?.chatInfo,
                this.appConfig.getPreImage() ?? ''
            );
        } catch (error) {
            throw error;
        }
    }

    async fetchConversations() {
        try {
            const result = await this.chatMessageService.fetchConversations();
            const response: Conversation[] = result?.body?.conversations?.map(
                (conversation: any) => ({
                    otherUser: new UserModel().convertObj(conversation.otherUser),
                    lastMessage: new ChatMessageModel().fromJson(conversation.lastMessage, this.appConfig.getPreImage() ?? ''),
                    unreadCount: conversation.unreadCount ?? 0
                } as Conversation)
            ) ?? [];
            return response;
        } catch (error) {
            throw error;
        }
    }

    async fetchChatHistory(receiverId: number) {
        try {
            const result = await this.chatMessageService.fetchChatHistory(receiverId);
            const response: ChatMessageModel[] = result?.body?.messages?.map(
                (message: any) => new ChatMessageModel().fromJson(message, this.appConfig.getPreImage() ?? '', StatusMessage.SENT)
            ) ?? [];
            return response;
        } catch (error) {
            throw error;
        }
    }

    async markMessageAsRead(messageId: number) {
        try {
            await this.chatMessageService.markMessageAsRead(messageId);
            return true;
        } catch (error) {
            throw error;
        }
    }

    async markConversationAsRead(receiverId: number) {
        try {
            await this.chatMessageService.markConversationAsRead(receiverId);
            return true;
        } catch (error) {
            throw error;
        }
    }
}