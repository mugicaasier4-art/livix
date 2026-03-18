export const hapticLight = () => {
  if (navigator.vibrate) navigator.vibrate(10);
};

export const hapticMedium = () => {
  if (navigator.vibrate) navigator.vibrate(25);
};
