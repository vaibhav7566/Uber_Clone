import API from "../../services/api";

export const getAddressSuggestions = (input) => {
  return API.get("/maps/suggestions", {
    params: { input },
  });
};
