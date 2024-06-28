export default function convertToYolo(
  x: number,
  y: number,
  width: number,
  height: number,
  imageWidth: number,
  imageHeight: number
) {
  const xCenter = x + width / 2;
  const yCenter = y + height / 2;

  const yoloX = xCenter / imageWidth;
  const yoloY = yCenter / imageHeight;
  const yoloWidth = width / imageWidth;
  const yoloHeight = height / imageHeight;

  return [yoloX, yoloY, yoloWidth, yoloHeight];
}
