"use client";

import { Member, Message, User } from "@prisma/client";
import { ChatWelcome } from "./ChatWelcome";
import { useChatquery } from "@/hooks/use-chat-query";
import { Loader2, ServerCrash } from "lucide-react";
import { format } from "date-fns";
import { ElementRef, Fragment, useRef } from "react";
import { ChatItem } from "./ChatItem";
import { useChatSocket } from "@/hooks/use-chat-socket";
import { useChatScroll } from "@/hooks/use-chat-scroll";
import { ConversationChatItem } from "./conversationChatItem";

interface ChatmessagesProps {
  name: string;
  member: Member;
  chatid: string;
  apiUrl: string;
  socketUrl: string;
  socketquery: Record<string, any>;
  paramKey: "channelId" | "conversationId";
  paramValue: string;
  type: "channel" | "conversation";
}

type MessageWithMemberWithProfile = Message & {
  member: Member & {
    profile: User;
  };
};

const DATE_FORMAT = "d MMM yyyy, HH:mm";

export const ChatMessages = ({
  name,
  member,
  chatid,
  apiUrl,
  socketUrl,
  socketquery,
  paramKey,
  paramValue,
  type,
}: ChatmessagesProps) => {
  const queryKey = `chat:${chatid}`;
  const addKey = `chat:${chatid}:messages`;
  const updateKey = `chat:${chatid}:messages:update`;

  const chatRef = useRef<ElementRef<"div">>(null);
  const bottomRef = useRef<ElementRef<"div">>(null);

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status } =
    useChatquery({
      queryKey,
      apiUrl,
      paramKey,
      paramValue,
    });

  useChatSocket({ queryKey, addKey, updateKey });

  // console.log("Scroll Setup Props:", {
  //   chatRef,
  //   bottomRef,
  //   loadMore: fetchNextPage,
  //   shouldLoadMore: !isFetchingNextPage && !!hasNextPage,
  //   count: data?.pages?.[0]?.items?.length ?? 0,
  // });

  useChatScroll({
    chatRef,
    bottomRef,
    loadMore: fetchNextPage,
    shouldLoadMore: !isFetchingNextPage && !!hasNextPage,
    count: data?.pages?.[0]?.items?.length ?? 0,
  });

  if (status === "pending") {
    return (
      <div className="flex flex-col flex-1 justify-center items-center">
        <Loader2 className="h-7 w-7 text-zinc-500 animate-spin" />
        <p className="text-xs text-zinc-500 dark:text-zinc-400">
          Loading messages...
        </p>
      </div>
    );
  }
  if (status === "error") {
    return (
      <div className="flex flex-col flex-1 justify-center items-center">
        <ServerCrash className="h-7 w-7 text-zinc-500" />
        <p className="text-xs text-zinc-500 dark:text-zinc-400">
          Something went wrong
        </p>
      </div>
    );
  }

  return (
    <div
      ref={chatRef as React.RefObject<HTMLDivElement>}
      className="flex-1 flex flex-col py-4 overflow-y-auto"
    >
      {!hasNextPage && <div className="flex-1" />}
      {!hasNextPage && <ChatWelcome type={type} name={name} />}

      {hasNextPage && (
        <div className="flex justify-center">
          {isFetchingNextPage ? (
            <Loader2 className="h-6 w-6 text-zinc-500 animate-spin my-4" />
          ) : (
            <button
              onClick={() => fetchNextPage()}
              className="text-zinc-500 hover:text-zinc-600 dark:text-zinc-400 text-xs my-4 dark:hover:text-zinc-300 transition"
            >
              Load previous messages
            </button>
          )}
        </div>
      )}

      <div className="flex flex-col-reverse mt-auto">
        {data?.pages?.map((group, i) => (
          <Fragment key={i}>
            {group.items.map((message: MessageWithMemberWithProfile) => (
              <>
              {type == "conversation"? (
                <ConversationChatItem
                key={message.id}
                id={message.id}
                content={message.content}
                member={message.member}
                timestamp={format(
                  new Date(message.createdAt),
                  DATE_FORMAT
                )}
                fileUrl={message.fileUrl}
                deleted={message.deleted}
                currentMember={member}
                isUpdated={message.updatedAt !== message.createdAt}
                socketUrl={socketUrl}
                socketquery={socketquery}
                type={type}
              />
              ):(
              <ChatItem
                key={message.id}
                id={message.id}
                content={message.content}
                member={message.member}
                timestamp={format(
                  new Date(message.createdAt),
                  DATE_FORMAT
                )}
                fileUrl={message.fileUrl}
                deleted={message.deleted}
                currentMember={member}
                isUpdated={message.updatedAt !== message.createdAt}
                socketUrl={socketUrl}
                socketquery={socketquery}
                type={type}
              />
              )}
              </>
            ))}
          </Fragment>
        ))}
      </div>

      <div ref={bottomRef as React.RefObject<HTMLDivElement>} />
    </div>
  );
};
