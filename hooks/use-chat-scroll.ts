import { useEffect, useState } from "react";

type ChatScrollProps = {
  chatRef: React.RefObject<HTMLDivElement>;
  bottomRef: React.RefObject<HTMLDivElement>;
  shouldLoadMore: boolean;
  loadMore: () => void;
  count: number;
};

export const useChatScroll = ({
  chatRef,
  bottomRef,
  shouldLoadMore,
  count,
  loadMore,
}: ChatScrollProps) => {
  const [hasInitialized, setHasInitialized] = useState(false);

  useEffect(() => {
    const topDiv = chatRef?.current;

    if (!topDiv) {
    //   console.error("Chat container ref is not set.");
      return;
    }

    const handleScroll = () => {
      const scrollTop = topDiv.scrollTop;

      console.log("Scroll Top:", scrollTop);
      if (scrollTop === 0 && shouldLoadMore) {
        // console.log("Top reached, loading more messages...");
        loadMore();
      }
    };

    topDiv.addEventListener("scroll", handleScroll);

    return () => {
    //   console.log("Removing scroll listener.");
      topDiv.removeEventListener("scroll", handleScroll);
    };
  }, [shouldLoadMore, loadMore, chatRef]);

  useEffect(() => {
    const bottomDiv = bottomRef?.current;
    const topDiv = chatRef.current;

    if (!topDiv) {
    //   console.error("Chat container ref is not set.");
      return;
    }

    const shouldAutoScroll = () => {
      const distanceFromBottom =
        topDiv.scrollHeight - topDiv.scrollTop - topDiv.clientHeight;

    //   console.log("Distance from bottom:", distanceFromBottom);
      return distanceFromBottom <= 100;
    };

    if (shouldAutoScroll() || !hasInitialized) {
    //   console.log("Auto-scrolling to bottom...");
      setTimeout(() => {
        bottomDiv?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    }

    if (!hasInitialized) {
      setHasInitialized(true);
    }
  }, [bottomRef, chatRef, count, hasInitialized]);
};
