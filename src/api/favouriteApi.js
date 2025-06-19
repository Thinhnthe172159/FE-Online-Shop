import { fetch } from "./Fetch";

export const getFavourite = async () => {
  let data = await fetch.get("/favourite/view-favourite");
  console.log(data.data.data.favourite_items);

  return data.data.data.favourite_items;
};
