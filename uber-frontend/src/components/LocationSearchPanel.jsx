import React from "react";
const LocationSearchPanel = (props) => {              
  const { suggestions = [], loading = false, onSelectSuggestion } = props;

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
            onPointerDown={(e) => {
              e.preventDefault();
              e.stopPropagation();
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
