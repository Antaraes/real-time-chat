"use client";
import { pusherClient } from "@/lib/pusher";
import { chatHrefConstructor, toPusherKey } from "@/lib/utils";
import { Session } from "inspector";
import { usePathname, useRouter } from "next/navigation";
import { FC, useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import UnseenChatToast from "./UnseenChatToast";

interface SidebarChatProps {
  friends: User[];
  sessionId: string;
}
interface ExtendedMessage extends Message {
  senderImg: string;
  senderName: string;
}
const SidebarChat: FC<SidebarChatProps> = ({ friends, sessionId }) => {
  const router = useRouter();
  const pathname = usePathname();
  const [unseenMessages, setUnseenMessages] = useState<Message[]>([]);
  useEffect(() => {
    pusherClient.subscribe(toPusherKey(`user:${sessionId}:chats`));
    pusherClient.subscribe(toPusherKey(`user:${sessionId}:friends`));
    const newFriendHandler = () => {
      router.refresh();
    };
    const chatHandler = (message: ExtendedMessage) => {
      const shouldNotify =
        pathname !== `/dashboard/chat/${chatHrefConstructor(sessionId, message.senderId)}`;
      if (!shouldNotify) return;
      //should be notified
      toast.custom((t) => (
        //custome component
        <UnseenChatToast
          t={t}
          sessionId={sessionId}
          senderId={message.senderId}
          senderImg={message.senderImg}
          senderMessage={message.text}
          senderName={message.senderName}
        />
      ));
      setUnseenMessages((prev) => [...prev, message]);
    };
    pusherClient.bind("new_message", chatHandler);
    pusherClient.bind("new_friend", newFriendHandler);
    return () => {
      pusherClient.unsubscribe(toPusherKey(`user:${sessionId}:chats`));
      pusherClient.unsubscribe(toPusherKey(`user:${sessionId}:friends`));
    };
  }, [pathname, sessionId, router]);
  useEffect(() => {
    if (pathname?.includes("chat")) {
      setUnseenMessages((pre) => {
        return pre.filter((msg) => !pathname.includes(msg.senderId));
      });
    }
  }, [pathname]);
  return (
    <ul role="list" className="max-h-[25rem] overflow-y-auto -mx-2 px-6 space-y-1">
      {friends.sort().map((friend) => {
        const unseenMessagesCount = unseenMessages.filter((unseenMessage) => {
          return unseenMessage.senderId === friend.id;
        }).length;
        return (
          <li key={friend.id} className="border-b-1 border-gray-600 mb-4">
            <a
              href={`/dashboard/chat/${chatHrefConstructor(sessionId, friend.id)}`}
              className="text-gray-700 hover:text-indigo-600 hover:bg-gray-50 group flex items-center gap-x-3 rounded-md leading-6 text-sm "
            >
              {friend.name}
              {unseenMessagesCount > 0 ? (
                <div className="bg-indigo-600 font-medium text-xs text-white w-4 h-4 rounded-full flex justify-center items-center">
                  {unseenMessagesCount}
                </div>
              ) : null}
            </a>
          </li>
        );
      })}
    </ul>
  );
};

export default SidebarChat;
