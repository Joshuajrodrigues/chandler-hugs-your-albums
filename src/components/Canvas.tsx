import React, { useEffect, useState, type FC } from "react";
import Search from "./Search";
import confetti from "canvas-confetti";
const Canvas: FC<{
  authToken: string;
}> = ({ authToken }) => {
  const [artwork, setArtwork] = useState("");

  useEffect(() => {
    const canvas: HTMLCanvasElement = document.getElementById(
      "canvas"
    ) as HTMLCanvasElement;

    const ctx = canvas.getContext("2d")!;
    const image = new Image(60, 45);
    image.src = "/CHANDLERTEMPLATE.png";
    const art = new Image(32, 32);
    art.src = artwork || "/default.jpg";

    image.onload = drawImageActualSize.bind(image, canvas, ctx, art);
  }, [artwork]);

  function drawImageActualSize(
    this: HTMLImageElement,
    canvas: HTMLCanvasElement,
    ctx: CanvasRenderingContext2D,
    art: HTMLImageElement
  ) {
    // Use the intrinsic size of image in CSS pixels for the canvas element
    canvas.width = this.naturalWidth;
    canvas.height = this.naturalHeight;

    ctx.setTransform(0.8, 0.1, -0.3, 1, 0, 0);
    ctx.drawImage(art, 250, 210, 320, 230);
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.drawImage(this, 0, 0);
  }
  function handleDownload() {
    confetti();
    const canvas = document.getElementById("canvas") as HTMLCanvasElement;
    canvas.toBlob((blob) => {
        const newImg = document.createElement("img");
        newImg.crossOrigin = ""
        const url = URL.createObjectURL(blob!);
      
        newImg.onload = () => {

          // no longer need to read the blob so it's revoked
          URL.revokeObjectURL(url);
        };
      
        newImg.src = url;
        document.body.appendChild(newImg);
      });
  }
  return (
    <div>
      <Search
        authToken={authToken}
        handleSelectedArt={(art) => {
          setArtwork(art.art.url);
        }}
      />
      <canvas id="canvas"></canvas>
      <div>
        <button onClick={handleDownload} className="primary-button">
          Download
        </button>
      </div>
    </div>
  );
};

export default Canvas;
