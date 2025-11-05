import { useState, useRef, useEffect } from "react";
import { Bell, Settings, User, AlertCircle, CheckCircle, Info, X } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { ru } from "date-fns/locale";

type Notification = {
  id: string;
  type: "info" | "success" | "warning" | "error";
  title: string;
  message: string;
  timestamp: Date;
  read?: boolean;
};

const Header = () => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([
   {
  id: "1",
  type: "success",
  title: "Добро пожаловать в Smart City Guide 🌆",
  message: "Рады видеть вас снова! Ваш персональный помощник готов подобрать лучшие места рядом.",
  timestamp: new Date(Date.now() - 1 * 60 * 1000),
},
   {
  id: "2",
  type: "success",
  title: "Рекомендация обновлена 🌿",
  message: "Мы подобрали свежие идеи для прогулки по вашему району — загляните в раздел «Что рядом?»",
  timestamp: new Date(Date.now() - 3 * 60 * 1000),
},
{
  id: "3",
  type: "info",
  title: "Напоминание 💡",
  message: "Не забудьте сохранить понравившиеся места, чтобы вернуться к ним позже!",
  timestamp: new Date(Date.now() - 15 * 60 * 1000),
},
  ]);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const unreadCount = notifications.filter(n => !n.read).length;

  const now = new Date();
  const timeString = now.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
  const dateString = now.toLocaleDateString('ru-RU', { month: 'short', day: 'numeric', year: 'numeric' });

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const getIcon = (type: Notification["type"]) => {
    switch (type) {
      case "success": return <CheckCircle className="w-4 h-4 text-success" />;
      case "warning": return <AlertCircle className="w-4 h-4 text-warning" />;
      case "error": return <AlertCircle className="w-4 h-4 text-destructive" />;
      default: return <Info className="w-4 h-4 text-info" />;
    }
  };

  const markAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    );
  };

  const clearAll = () => {
    setNotifications([]);
    setShowNotifications(false);
  };

  return (
    <header className="fixed top-0 left-0 right-0 h-16 z-50 glass-card border-b border-primary/20">
      <div className="h-full px-6 flex items-center justify-between">
        {/* Logo Section */}
        <div className="flex items-center gap-3">

          <div>
            <h1 className="text-xl font-bold gradient-text tracking-tight">
             SoloStack
            </h1>
            <p className="text-xs text-muted-foreground">Smart City Management</p>
          </div>
        </div>

        {/* Center Status */}
        <div className="flex items-center gap-6">
          <div className="text-center">
            <div className="font-mono text-2xl font-semibold text-foreground">{timeString}</div>
            <div className="text-xs text-muted-foreground">{dateString}</div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-4">
          {/* Notifications Bell */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 rounded-lg hover:bg-primary/10 transition-colors"
            >
              <Bell className="w-5 h-5 text-foreground" />
              {unreadCount > 0 && (
                <div className="absolute top-1 right-1 w-5 h-5 bg-destructive text-destructive-foreground rounded-full text-xs font-bold flex items-center justify-center animate-pulse">
                  {unreadCount > 9 ? "9+" : unreadCount}
                </div>
              )}
            </button>

            {/* Notifications Dropdown */}
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-background-elevated border border-primary/20 rounded-xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="p-4 border-b border-primary/10 flex items-center justify-between">
                  <h3 className="font-semibold text-foreground">Уведомления</h3>
                  {notifications.length > 0 && (
                    <button
                      onClick={clearAll}
                      className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                    >
                      Очистить
                    </button>
                  )}
                </div>

                <div className="max-h-96 overflow-y-auto">
                  {notifications.length === 0 ? (
                    <div className="p-8 text-center text-muted-foreground">
                      <Bell className="w-8 h-8 mx-auto mb-2 opacity-50" />
                      <p className="text-sm">Нет новых уведомлений</p>
                    </div>
                  ) : (
                    <div className="divide-y divide-primary/10">
                      {notifications.map((notif) => (
                        <div
                          key={notif.id}
                          className={`p-4 hover:bg-primary/5 transition-colors cursor-pointer ${
                            !notif.read ? "bg-primary/5" : ""
                          }`}
                          onClick={() => markAsRead(notif.id)}
                        >
                          <div className="flex items-start gap-3">
                            <div className="mt-0.5">{getIcon(notif.type)}</div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-foreground">{notif.title}</p>
                              <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{notif.message}</p>
                              <p className="text-xs text-muted-foreground mt-2">
                                {formatDistanceToNow(notif.timestamp, { addSuffix: true, locale: ru })}
                              </p>
                            </div>
                            {!notif.read && (
                              <div className="w-2 h-2 bg-primary rounded-full mt-1.5"></div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>


              </div>
            )}
          </div>


        </div>
      </div>
    </header>
  );
};

export default Header;