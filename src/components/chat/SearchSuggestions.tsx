import React from "react";
import { ExternalLink } from "lucide-react";

interface SearchSuggestionsProps {
  renderedContent?: string; // HTML content provided by Google for rendering
  sources?: { uri: string; title: string }[];
  queries?: string[];
}

export const SearchSuggestions: React.FC<SearchSuggestionsProps> = ({
  renderedContent,
  sources,
  queries,
}) => {
  // If there's no content to display, return null
  if (
    !renderedContent &&
    (!sources || sources.length === 0) &&
    (!queries || queries.length === 0)
  ) {
    return null;
  }

  return (
    <div className="mt-4 space-y-2">
      {/* Render the Google Search content if available */}
      {renderedContent && (
        <div
          className="overflow-hidden rounded-md border border-border p-2"
          dangerouslySetInnerHTML={{ __html: renderedContent }}
        />
      )}

      {/* Render the sources if available */}
      {sources && sources.length > 0 && (
        <div className="text-xs space-y-1">
          <p className="font-medium">Sources:</p>
          <div className="space-y-1">
            {sources.map((source, index) => (
              <div key={index} className="flex items-center gap-1">
                <ExternalLink className="h-3 w-3" />
                <a
                  href={source.uri}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:underline truncate max-w-[300px]"
                >
                  {source.title || "Source link"}
                </a>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Render search queries if no rendered content is available */}
      {!renderedContent && queries && queries.length > 0 && (
        <div className="text-xs">
          <p className="font-medium">Related searches:</p>
          <div className="flex flex-wrap gap-1 mt-1">
            {queries.map((query, index) => (
              <a
                key={index}
                href={`https://www.google.com/search?q=${encodeURIComponent(
                  query
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-2 py-1 bg-secondary/50 hover:bg-secondary rounded-full text-xs"
              >
                {query}
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
