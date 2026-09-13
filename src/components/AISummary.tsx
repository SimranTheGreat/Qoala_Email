import type { AIResponse } from "../types";

type AISummaryProps = {
  response: AIResponse;
};

export default function AISummary({ response }: AISummaryProps) {
  return (
    <div className="space-y-5">
      <div>
        <p className="mb-1 font-medium">Summary</p>

        <ul className="list-disc pl-5 text-gray-600">
          {response.summary_bullets.map((point, index) => (
            <li key={index}>{point}</li>
          ))}
        </ul>
      </div>

      <div>
        <p className="font-medium">Category</p>
        <p className="text-gray-600">{response.category}</p>
      </div>

      <div>
        <p className="font-medium">AI Priority</p>
        <p className="text-gray-600">{response.priority}</p>
      </div>

      <div>
        <p className="font-medium">Confidence</p>
        <p className="text-gray-600">
          {Math.round(response.confidence * 100)}%
        </p>
      </div>

      <div>
        <p className="font-medium">Suggested Action</p>
        <p className="text-gray-600">{response.suggested_action}</p>
      </div>
    </div>
  );
}
