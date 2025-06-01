import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NbButtonModule, NbDialogModule, NbIconModule, NbInputModule, NbSelectModule, NbTooltipModule } from '@nebular/theme';
import { TranslateModule } from '@ngx-translate/core';
import { ChatMessageManagement } from '../../data/management/chat-message.management';
import { ChatMessageService } from '../../data/service/chat-message.service';
import { ImageResource } from '../../common/resource/image_resource';
import { ChatAttachment, ChatMessageModel, Conversation, StatusMessage } from '../../data/model/chat-message/chat-message.model';
import { ToastNotification } from '../common/toast/toast.component';
import { TimeAgoPipe } from '../../common/layout/pipes/time-ago.pipe';
import { AppConfig } from '../../common/config/app.config';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UserModel } from '../../data/model/user/user.model';
import { debounceTime, Observable, Subscription } from 'rxjs';
import { UserStoreModel } from '../../data/model/user/user.store.model';
import { AuthManagement } from '../../data/management/auth.management';
import { AuthService } from '../../data/service/auth.service';
import { WebSocketService } from '../../common/service/websocket.service';
import { WebSocketType } from '../../common/resource/websocket-type';
import moment from 'moment';

const NB_LIBS = [
    NbTooltipModule,
    NbInputModule,
    NbButtonModule,
    NbSelectModule,
    NbDialogModule,
    NbIconModule
]

const ANGULAR_MODULE = [
    CommonModule,
    TranslateModule,
    ReactiveFormsModule,
    FormsModule
]

const PROVIDERS = [
    ChatMessageManagement,
    ChatMessageService,
    AuthManagement,
    AuthService
]

const PIPES = [
    TimeAgoPipe
]

@Component({
    standalone: true,
    selector: 'app-chat-message',
    templateUrl: './chat-message.component.html',
    styleUrls: ['./chat-message.component.scss'],
    imports: [...NB_LIBS, ...ANGULAR_MODULE, ...PIPES],
    providers: [...PROVIDERS],
})
export class ChatMessageComponent implements OnInit, OnDestroy {
    icon_camera_upload: string = ImageResource.icon_camera_upload;
    image_upload_person: string = ImageResource.image_upload_person;
    image_not_found: string = ImageResource.image_chart_bar;
    icon_filter_chat: string = ImageResource.icon_filter_chat;

    preImage: string = '';
    $selectUser!: Observable<UserStoreModel>;
    userInfo!: UserStoreModel;
    private userSubscription!: Subscription;

    selectedReceiverId: number | null = null;
    otherUser: UserModel | null = null;
    conversations: Conversation[] = [];
    filteredConversations: Conversation[] = [];
    messages: ChatMessageModel[] = [];
    message: string = '';
    isOtherUserOnline: boolean = false;
    StatusMessage = StatusMessage;

    // Thay đổi thành mảng để hỗ trợ nhiều ảnh
    selectedImages: File[] = []; // Lưu mảng File
    previewUrls: string[] = []; // Lưu URL preview từ File

    @ViewChild('messagesList') messagesList!: ElementRef;
    @ViewChild('inputRef') inputRef!: ElementRef;
    @ViewChild('fileInput') fileInput!: ElementRef;
    private messageSubscription!: Subscription;

    constructor(
        private appConfig: AppConfig,
        private chatMessageMana: ChatMessageManagement,
        private authMana: AuthManagement,
        private wsService: WebSocketService
    ) { }

    async ngOnInit() {
        this.preImage = this.appConfig.getPreImage() ?? '';
        this.$selectUser = this.authMana.getSelectUser()
            .pipe(debounceTime(300));
        this.userSubscription = this.$selectUser.subscribe(
            async (user: UserStoreModel) => {
                this.userInfo = { ...user }
            }
        )
        this.subscribeToMessages();
        await this.fetchConversations();
    }

    ngOnDestroy() {
        if (this.userSubscription) {
            this.userSubscription.unsubscribe();
        }
        if (this.messageSubscription) {
            this.messageSubscription.unsubscribe();
        }
    }

    private subscribeToMessages() {
        if (this.messageSubscription) {
            this.messageSubscription.unsubscribe();
        }

        this.messageSubscription = this.wsService.getMessages().subscribe((data: any) => {
            console.log(data);
            switch (data.type) {
                case WebSocketType.NEW_MESSAGE: {
                    const newMessage = data.data as ChatMessageModel;
                    if (
                        this.selectedReceiverId &&
                        (newMessage.receiverId === this.userInfo.id || newMessage.senderId === this.userInfo.id) &&
                        (newMessage.senderId === this.selectedReceiverId || newMessage.receiverId === this.selectedReceiverId)
                    ) {
                        // Không thêm tin nhắn vào mảng nếu là tin nhắn của chính mình
                        if (newMessage.senderId !== this.userInfo.id) {
                            this.messages = [...this.messages, newMessage];
                            this.scrollToBottom();
                        }

                        if (newMessage.receiverId === this.userInfo.id) {
                            this.chatMessageMana.markMessageAsRead(newMessage.id)
                                .then(() => {
                                    console.log("Tin nhắn mới đã được đánh dấu đã đọc");
                                    this.updateConversationsAfterRead(newMessage);
                                })
                                .catch((err) => console.error("Lỗi khi đánh dấu tin nhắn: ", err));
                        }
                    }
                    this.updateConversations(newMessage);
                    break;
                }
                case WebSocketType.MESSAGE_READ: {
                    let tempMessages = this.messages.map(msg => {
                        if (msg.id === data.data.messageId) {
                            const readMessage = new ChatMessageModel().fromJson(msg, this.preImage, StatusMessage.SENT);
                            readMessage.isRead = true;
                            return readMessage;
                        }
                        return msg;
                    });
                    this.messages = [...tempMessages];
                    break;
                }
                case WebSocketType.USER_STATUS: {
                    const targetUserId = this.otherUser?.id;
                    if (targetUserId && data.userId === targetUserId) {
                        this.isOtherUserOnline = data.isOnline;
                    }
                    break;
                }
                case WebSocketType.CONVERSATION_READ: {
                    console.log("Cuộc trò chuyện đã được đánh dấu đã đọc:", data);
                    break;
                }
                case WebSocketType.UPDATE_CONVERSATIONS: {
                    const updatedConversation = data.data;
                    const existingConversation = this.conversations.find(conv =>
                        conv.otherUser.id === updatedConversation.otherUserId
                    );

                    if (existingConversation) {
                        existingConversation.lastMessage = updatedConversation.lastMessage;
                        existingConversation.unreadCount = updatedConversation.unreadCount;
                    } else {
                        const lastMessage = updatedConversation.lastMessage;
                        const otherUser = lastMessage.senderId === this.userInfo.id ? lastMessage.receiver : lastMessage.sender;
                        const newConversation: Conversation = {
                            otherUser: otherUser,
                            lastMessage: updatedConversation.lastMessage,
                            unreadCount: updatedConversation.unreadCount
                        };
                        this.conversations.push(newConversation);
                    }
                    this.filteredConversations = [...this.conversations];
                    break;
                }
            }
        });
    }

    private updateConversations(newMessage: ChatMessageModel) {
        const existingConversation = this.conversations.find(conv =>
            (conv.otherUser.id === newMessage.senderId && conv.otherUser.id !== this.userInfo.id) ||
            (conv.otherUser.id === newMessage.receiverId && conv.otherUser.id !== this.userInfo.id)
        );

        if (existingConversation) {
            existingConversation.lastMessage = newMessage;
        } else {
            const newConversation: Conversation = {
                otherUser: newMessage.senderId === this.userInfo.id ? newMessage.receiver : newMessage.sender,
                lastMessage: newMessage,
                unreadCount: 0 // Sẽ được cập nhật bởi backend qua UPDATE_CONVERSATIONS
            };
            this.conversations.push(newConversation);
        }
        this.filteredConversations = [...this.conversations];
    }

    private updateConversationsAfterRead(newMessage: ChatMessageModel) {
        const existingConversation = this.conversations.find(conv =>
            (conv.otherUser.id === newMessage.senderId && conv.otherUser.id !== this.userInfo.id) ||
            (conv.otherUser.id === newMessage.receiverId && conv.otherUser.id !== this.userInfo.id)
        );

        if (existingConversation) {
            existingConversation.unreadCount = 0;
            this.filteredConversations = [...this.conversations];
        }
    }

    async fetchConversations() {
        try {
            this.conversations = await this.chatMessageMana.fetchConversations();
            this.filteredConversations = [...this.conversations];
        } catch (error) {
            console.log(error);
            ToastNotification.error('Hệ thống gặp sự cố, quay lại sau.')
        }
    }

    async handleConversationPress(receiverId: number) {
        try {
            if (this.selectedReceiverId === receiverId) {
                this.scrollToBottom();
                return;
            }

            await this.chatMessageMana.markConversationAsRead(receiverId);
            let conversationIndex = this.conversations.findIndex(rc => rc.otherUser.id === receiverId);
            if (conversationIndex > -1) {
                this.conversations[conversationIndex].unreadCount = 0;
                this.filteredConversations = [...this.conversations];
            }
            this.selectedReceiverId = receiverId;
            await this.fetchMessages();
            this.scrollToBottom();
            setTimeout(() => {
                this.inputRef.nativeElement.focus();
            }, 100)
        } catch (error) {
            console.log(error);
            ToastNotification.error('Hệ thống gặp sự cố, quay lại sau.')
        }
    }

    async fetchMessages() {
        if (!this.selectedReceiverId) {
            return;
        }

        try {
            this.messages = [];
            this.messages = await this.chatMessageMana.fetchChatHistory(this.selectedReceiverId);

            if (this.messages.length > 0) {
                for (let message of this.messages) {
                    if (message.receiver.id === this.selectedReceiverId) {
                        this.otherUser = message.receiver;
                        break;
                    }
                }


                if (this.otherUser?.id && this.wsService.isConnected()) {
                    this.wsService.sendMessage({
                        type: WebSocketType.CHECK_USER_STATUS,
                        userId: this.otherUser.id
                    });
                    setTimeout(() => {
                        if (this.isOtherUserOnline === false) {
                            this.isOtherUserOnline = false;
                        }
                    }, 5000);
                } else {
                    this.isOtherUserOnline = false;
                }
            } else {
                this.isOtherUserOnline = false;
            }
            this.scrollToBottom();
        } catch (error: any) {
            console.log(error);
            ToastNotification.error('Hệ thống gặp sự cố, quay lại sau.');
            this.isOtherUserOnline = false;
        }
    };

    async handleSendMessage() {
        if (!this.message.trim() && this.previewUrls.length === 0 || this.selectedReceiverId === null) {
            return;
        }

        const tempMessage = ChatMessageModel.createMessage({
            senderId: this.userInfo.id,
            receiverId: this.selectedReceiverId,
            message: this.message.trim(),
            messageType: this.selectedImages.length > 0 ? 'image' : 'text',
            attachments: this.previewUrls.map((url: string) => ({
                url: url,
                name: '',
                size: 0,
                type: ''
            })),
            uploadImages: this.selectedImages
        });

        this.messages.push(tempMessage);
        this.message = '';
        this.scrollToBottom();

        try {
            const response = await this.chatMessageMana.createMessage(tempMessage);
            let pushedMessageIndex = this.messages.findIndex(msg => msg.id === tempMessage.id);
            if (pushedMessageIndex > -1) {
                this.messages[pushedMessageIndex] = { ...response, status: StatusMessage.SENT } as ChatMessageModel;
            }
            // Cập nhật conversations sau khi gửi tin nhắn thành công
            this.updateConversations(response);
        } catch (error) {
            console.log(error);
            ToastNotification.error('Hệ thống gặp sự cố, quay lại sau.');
            const failedMessage = this.messages.find(msg => msg.id === tempMessage.id);
            if (failedMessage) {
                failedMessage.status = StatusMessage.FAILED;
            }
        } finally {
            this.clearImagePreviews();
        }
    }

    handleImageSelect(event: Event) {
        const input = event.target as HTMLInputElement;
        if (input.files && input.files.length > 0) {
            const files = Array.from(input.files);
            const newImages = files.slice(0, 5 - this.selectedImages.length);
            this.selectedImages = [...this.selectedImages, ...newImages].slice(0, 5);
            this.previewUrls = this.selectedImages.map(file => URL.createObjectURL(file));
        }
    }

    clearImagePreviews() {
        this.previewUrls.forEach(url => URL.revokeObjectURL(url));
        this.selectedImages = [];
        this.previewUrls = [];
        if (this.fileInput) {
            this.fileInput.nativeElement.value = '';
        }
    }

    onSearch(event: Event) {
        const input = (event.target as HTMLInputElement).value.toLowerCase();
        this.filteredConversations = this.conversations.filter(conversation =>
            conversation.otherUser.name?.toLowerCase().includes(input) || false
        );
    }

    groupMessages(): { timestamp: string; messages: ChatMessageModel[] }[] {
        const grouped: { timestamp: string; messages: ChatMessageModel[] }[] = [];
        let currentGroup: ChatMessageModel[] = [];
        let lastTimestamp: moment.Moment | null = null;
        const timeThreshold = 15; // 15 minutes
        const today = moment().startOf('day');

        this.messages.forEach((msg, index) => {
            const currentTime = moment(msg.createdAt);

            if (lastTimestamp === null) {
                currentGroup.push(msg);
                lastTimestamp = currentTime;
            } else if (currentTime.diff(lastTimestamp, 'minutes') >= timeThreshold) {
                if (currentGroup.length > 0) {
                    grouped.push({
                        timestamp: currentTime.isSame(today, 'day')
                            ? lastTimestamp.format('HH:mm')
                            : lastTimestamp.format('DD/MM/YYYY HH:mm'),
                        messages: currentGroup,
                    });
                }
                currentGroup = [msg];
                lastTimestamp = currentTime;
            } else {
                currentGroup.push(msg);
            }

            if (index === this.messages.length - 1 && currentGroup.length > 0) {
                grouped.push({
                    timestamp: currentTime.isSame(today, 'day')
                        ? lastTimestamp.format('HH:mm')
                        : lastTimestamp.format('DD/MM/YYYY HH:mm'),
                    messages: currentGroup,
                });
            }
        });

        return grouped;
    }

    get groupedMessages(): { timestamp: string; messages: ChatMessageModel[] }[] {
        return this.groupMessages();
    }

    private scrollToBottom() {
        if (this.messagesList) {
            setTimeout(() => {
                this.messagesList.nativeElement.scrollTop = this.messagesList.nativeElement.scrollHeight;
            }, 100); // Đợi một chút để DOM cập nhật
        }
    }

}