import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NbButtonModule, NbDialogModule, NbIconModule, NbInputModule, NbSelectModule, NbTooltipModule } from '@nebular/theme';
import { TranslateModule } from '@ngx-translate/core';
import { ChatMessageManagement } from '../../data/management/chat-message.management';
import { ChatMessageService } from '../../data/service/chat-message.service';
import { ImageResource } from '../../common/resource/image_resource';
import { ChatMessageModel, Conversation, StatusMessage } from '../../data/model/chat-message/chat-message.model';
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
export class ChatMessageComponent implements OnInit {
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

    @ViewChild('messagesList') messagesList!: ElementRef;

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
        await this.fetchConversations();
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
            await this.chatMessageMana.markConversationAsRead(receiverId);
            let conversationIndex = this.conversations.findIndex(rc => rc.otherUser.id === receiverId);
            if (conversationIndex > -1) {
                this.conversations[conversationIndex].unreadCount = 0;
                this.filteredConversations = [...this.conversations];
            }
            this.selectedReceiverId = receiverId;
            await this.fetchMessages();
            this.scrollToBottom();
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

                if (WebSocketType.CHECK_USER_STATUS) { // Kiêm tra người dùng có online không

                } else {
                    this.isOtherUserOnline = false;
                }
            } else {
                if (WebSocketType.CHECK_USER_STATUS) {

                } else {
                    this.isOtherUserOnline = false;
                }
            }
            this.scrollToBottom();
        } catch (error: any) {
            console.log(error);
            ToastNotification.error('Hệ thống gặp sự cố, quay lại sau.');
            this.isOtherUserOnline = false;
        }
    };

    async handleSendMessage() {
        if (!this.message.trim() || this.selectedReceiverId === null) {
            return;
        }

        const tempMessage = ChatMessageModel.createMessage({
            senderId: this.userInfo.id,
            receiverId: this.selectedReceiverId,
            message: this.message.trim(),
            messageType: 'text'
        });

        this.messages.push(tempMessage);
        this.message = '';
        this.scrollToBottom();

        try {
            const response = await this.chatMessageMana.createMessage(tempMessage);
            let pushedMessage = this.messages.find(msg => msg.id === tempMessage.id);
            if (pushedMessage) {
                pushedMessage = { ...response, status: StatusMessage.SENT } as ChatMessageModel;
            }
        } catch (error) {
            console.log(error);
            ToastNotification.error('Hệ thống gặp sự cố, quay lại sau.');
            const failedMessage = this.messages.find(msg => msg.id === tempMessage.id);
            if (failedMessage) {
                failedMessage.status = StatusMessage.FAILED;
            }
        }
    }

    handleImageSelect() {
        // Placeholder cho chức năng chọn ảnh, sẽ triển khai sau
        console.log('Chọn ảnh được kích hoạt');
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