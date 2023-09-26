import '@tensorflow/tfjs';
import '@tensorflow/tfjs-converter';

const MODEL_URL = 'web_model/model.json';
const model = await tf.loadGraphModel(MODEL_URL);

// function getBoundingBox(canvas) {
//   const ctx = canvas.getContext('2d');
//   const pixels = ctx.getImageData(0, 0, canvas.width, canvas.height);

//   let minX = canvas.width;
//   let minY = canvas.height;
//   let maxX = -1;
//   let maxY = -1;

//   // Loop through all the pixels and find the min/max x/y values
//   for (let x = 0; x < pixels.width; x++) {
//     for (let y = 0; y < pixels.height; y++) {
//       const pixel = pixels.data[(y * pixels.width + x) * 4];

//       if (pixel !== 255) {
//         if (x < minX) minX = x;
//         if (y < minY) minY = y;
//         if (x > maxX) maxX = x;
//         if (y > maxY) maxY = y;
//       }
//     }
//   }

//   // Maintain aspect ratio
//   const width = maxX - minX;
//   const height = maxY - minY;

//   if (width > height) {
//     const halfDiff = (width - height) / 2;
//     minY -= halfDiff;
//     maxY += halfDiff;
//   } else {
//     const halfDiff = (height - width) / 2;
//     minX -= halfDiff;
//     maxX += halfDiff;
//   }

//   // Apply a bit of padding
//   minX -= 10;
//   minY -= 10;
//   maxX += 10;
//   maxY += 10;

//   return { minX, minY, maxX, maxY };
// }

// function cropCanvas(canvas, boundingBox) {
//   const { minX, minY, maxX, maxY } = boundingBox;
//   const ctx = canvas.getContext('2d');
//   const pixels = ctx.getImageData(minX, minY, maxX - minX, maxY - minY);

//   const newCanvas = document.createElement('canvas');
//   newCanvas.width = maxX - minX;
//   newCanvas.height = maxY - minY;
//   newCanvas.getContext('2d').putImageData(pixels, 0, 0);

//   return newCanvas;
// }

window.predict = function (canvas) {
  // // Find the bounds of the drawing, so we can crop it to just the drawing itself
  // const boundingBox = getBoundingBox(canvas);
  // // Crop the canvas to the bounding box
  // const croppedCanvas = cropCanvas(canvas, boundingBox);

  // resize the input image to target size of (1, 28, 28)
  let reshapedInput = tf.browser.fromPixels(canvas)
    .resizeNearestNeighbor([28, 28]) // Resize the image so it's 28x28. It's 3rd axis at index 2 contains "3" tensors for r,g and b on each pixel
    // Current shape: [28, 28, 3]
    .mean(2) // Reduce the axis at index 2 (so the rgb values for each pixel are removed) so we have a 2D shape (with only yes or no for color or no color)
    // Current shape: [28, 28]
    // Add a new axis at the beginning
    .expandDims(0) // So now we have a 3D shape with 1 as the first axis (which is the batch size)
    // Current shape: [1, 28, 28]
    .toFloat(); // Since all our model inputs are floats, we need this shape to be floats
  
  // Example shape data at this point: https://miro.medium.com/v2/resize:fit:629/1*THbDE9VGnlsm2lxnKZug2g.png

  reshapedInput = reshapedInput.div(255.0); // Go through each pixel and ensure the colors which were 0 - 255 become a single float from 0 - 1 (grayscale)

  // Since the model was trained on white text with a black background, we need to invert the colors of the input image (ours is black text on white background)
  reshapedInput = reshapedInput.mul(-1).add(1);

  // Draw the tensor back to the canvas to see what it looks like now
  const newCanvas = document.createElement('canvas');
  tf.browser.toPixels(tf.squeeze(reshapedInput), newCanvas);
  document.body.appendChild(newCanvas);

  const prediction = model.predict(reshapedInput);

  // Use softmax to get a probability distribution over the prediction
  const softmax = tf.softmax(prediction);
  const values = softmax.dataSync();

  // Get the index with the highest probability from the values array
  const index = values.indexOf(Math.max(...values));
  const probability = values[index];

  return { index, probability };
}