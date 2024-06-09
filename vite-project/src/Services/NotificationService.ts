import { BehaviorSubject, Observable } from 'rxjs';

type ISOString = string;

export type Notification = {
  title: string;
  message: string;
  date: ISOString;
  priority: 'low' | 'medium' | 'high';
  read: boolean;
};

class NotificationService {
  private notifications: Notification[] = [];
  private unreadCountSubject = new BehaviorSubject<number>(0);
  private notificationsSubject = new BehaviorSubject<Notification[]>([]);

  send(notification: Notification) {
    this.notifications.push(notification);
    this.updateUnreadCount();
    this.notificationsSubject.next(this.notifications);
  }

  list(): Observable<Notification[]> {
    return this.notificationsSubject.asObservable();
  }

  unreadCount(): Observable<number> {
    return this.unreadCountSubject.asObservable();
  }

  markAsRead(notification: Notification) {
    notification.read = true;
    this.updateUnreadCount();
    this.notificationsSubject.next(this.notifications);
  }

  private updateUnreadCount() {
    const unreadCount = this.notifications.filter((notification) => !notification.read).length;
    this.unreadCountSubject.next(unreadCount);
  }
}

const notificationService = new NotificationService();

export const useNotificationService = () => {
  return notificationService;
};

export default notificationService;
