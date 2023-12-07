//? Generate a unique id for each entry that we're gonna make!
export const guid = () => {
  let uniqueId = parseInt(Math.random() * Number.MAX_SAFE_INTEGER);
  uniqueId = uniqueId
    .toString(18)
    .slice(0, 5)
    .padStart(5, "0")
    .toLocaleUpperCase();
  return uniqueId;
};
