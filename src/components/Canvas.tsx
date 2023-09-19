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
    const image = new Image();
    const art = new Image();
    image.onload = drawImageActualSize.bind(image, canvas, ctx, art);
    image.crossOrigin = "anonymous";
    image.src = "/CHANDLERTEMPLATE.png";
    art.crossOrigin = "anonymous";
    art.src = artwork || "/default.jpg";

  }, [artwork]);

  function drawImageActualSize(
    this: HTMLImageElement,
    canvas: HTMLCanvasElement,
    ctx: CanvasRenderingContext2D,
    art: HTMLImageElement
  ) {
    ctx.reset();
    art.onload=()=>{
        // Use the intrinsic size of image in CSS pixels for the canvas element
        canvas.width = this.naturalWidth;
        canvas.height = this.naturalHeight;
    
        ctx.setTransform(0.8, 0.1, -0.3, 1, 0, 0);
        ctx.drawImage(art, 250, 210, 320, 230);
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.drawImage(this, 0, 0, canvas.width, canvas.height);

    }
  }
  function handleDownload() {
    confetti();
    var link = document.createElement("a");
    link.download = `chandlerhugsalbum.png`;
    let canvas = document.getElementById("canvas") as HTMLCanvasElement;
    link.href = canvas.toDataURL("image/png");
    link.click();
  }
  return (
    <div className="flex mt-8 flex-col items-center justify-center">
      <Search
        authToken={authToken}
        handleSelectedArt={(art) => {
          console.log("art", art);

          setArtwork(art.art.url);
        }}
      />
      <canvas width="1000" height="1000" style={{width:"200px", height:"200px"}} id="canvas"></canvas>
      <div>
        <button className="p-2 m-2 bg-green-400 rounded-md hover:scale-[1.05] " onClick={handleDownload}>
          Download
        </button>
      </div>
    </div>
  );
};

export default Canvas;
