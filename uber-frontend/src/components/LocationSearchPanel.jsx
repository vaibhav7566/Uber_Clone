import React, { useRef } from "react";
const LocationSearchPanel = (props) => {              
  const { suggestions = [], loading = false, onSelectSuggestion } = props;
  const touchStartRef = useRef({ x: 0, y: 0 });
  const didScrollRef = useRef(false);

  const handleSuggestionClick = (suggestion) => {
    if (typeof onSelectSuggestion === "function") {
      onSelectSuggestion(suggestion);
      return;
    }

    // props.setVehiclePanelOpen(true);
    // props.setPanelOpen(false);
  };

  return (
    <div className="h-full overflow-y-auto pb-4 pr-1 ">
      {loading ? (
        <p className="text-sm text-gray-500 mt-3">Loading suggestions...</p>
      ) : null}

      {!loading && suggestions.length === 0 ? (
        <p className="text-sm text-gray-500 mt-3 text-center">
          Type at least 2 characters to search location
        </p>
      ) : null}

      {suggestions.map((suggestion, index) => {
        const description =
          suggestion.description || suggestion.mainText || "Unknown location";

        return (
          <div
            key={suggestion.placeId || `${description}-${index}`}
            onTouchStart={(e) => {
              const touch = e.touches?.[0];
              if (!touch) return;
              touchStartRef.current = { x: touch.clientX, y: touch.clientY };
              didScrollRef.current = false;
            }}
            onTouchMove={(e) => {
              const touch = e.touches?.[0];
              if (!touch) return;

              const deltaX = Math.abs(touch.clientX - touchStartRef.current.x);
              const deltaY = Math.abs(touch.clientY - touchStartRef.current.y);

              if (deltaX > 8 || deltaY > 8) {
                didScrollRef.current = true;
              }
            }}
            onClick={() => {
              if (didScrollRef.current) {
                didScrollRef.current = false;
                return;
              }

              handleSuggestionClick(suggestion);
            }}
            className="flex items-center justify-start gap-4 my-3 border-gray-200 active:border-gray-700 border-2 rounded-xl px-3 py-2 cursor-pointer"
          >
            <h2>
              <i className="bg-[#eee] h-8 w-8 rounded-full flex items-center justify-center ri-map-pin-fill"></i>
            </h2>
            <h4 className="font-medium text-sm">{description}</h4>
          </div>
        );
      })}
    </div>
  );
};

export default LocationSearchPanel;
