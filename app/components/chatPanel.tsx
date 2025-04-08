import Markdown from "react-markdown";
import { useLevelStore } from "src/level/level";
import { useEffect } from'react';

export default function ChatPanel() {
    const { loadLevel, currentLevel } = useLevelStore();

    useEffect(() => {
        loadLevel(0, 0);
    }, [loadLevel]);

    console.log("markdownText", currentLevel?.description);
    if (!currentLevel) {
        return <div className="h-full w-[calc(25%-5px)] pr-2 pl-2 bg-white overflow-auto">Loading...</div>;
    }

    return (
        <div className="h-full w-[calc(25%-5px)] pr-2 pl-2 bg-white overflow-auto">
            <ChatContainer markdownText={currentLevel.description} />
        </div>
    );
}

function ChatContainer({ markdownText }: { markdownText: string }) {
    return (
        <div className="flex flex-col gap-2 p-2 box-border">
            <Message markdownText={markdownText} />
        </div>
    );
}

interface MsgParams {
    markdownText: string;
}

function Message({ markdownText }: MsgParams) {
    return (
        <div className="markdown w-full bg-[#ddf6ff] text-black p-2 rounded-sm">
            <Markdown>{markdownText}</Markdown>
        </div>
    );
}