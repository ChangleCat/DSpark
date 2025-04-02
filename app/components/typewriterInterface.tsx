import Markdown from "react-markdown";

export default function TypewriterInterface() {
  return (
    <div className="flex-1 bg-white text-black max-h-full p-2 pt-0">
      <ExerciseStatement markdownText="事情是这样的"/>
    </div>
  );
}

interface markdownText {
  markdownText: string;
}

function ExerciseStatement({ markdownText }: markdownText) {
  return (
    <div className="markdown">
      <Markdown>{markdownText}</Markdown>
    </div>
  );
}
