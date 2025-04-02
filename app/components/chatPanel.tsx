import Markdown from "react-markdown";

export default function ChatPanel() {
    return (
        <div className="h-full w-[calc(25%-5px)] pr-2 pl-2 bg-white">
            <ChatContainer />
        </div>
    )
}


function ChatContainer() {
    let test_markdown = `
# 你好

\`\`\`js
const a = () => {};
\`\`\`
    `;

    return (
        <div className="flex flex-col gap-2 p-2 overflow-y-scroll box-border">
            <Message mdString={test_markdown}/>
        </div>
    )
}

interface MsgParams{
    mdString: string
}

function Message({mdString}: MsgParams) {
    return (
        <div className="markdown w-full bg-[#ddf6ff] text-black p-2 rounded-sm">
            <Markdown>{mdString}</Markdown>
        </div>
    )
}