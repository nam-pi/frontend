export const getIdLocal = (id: string): string => {
  const idLocalParts = id.split(/[#/]/);
  return idLocalParts[idLocalParts.length - 1];
};
