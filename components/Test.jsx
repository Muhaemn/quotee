import React, { useEffect, useRef, useState } from "react";
import Cropper from "react-easy-crop";

const createImage = (url) =>
  new Promise((resolve, reject) => {
    const image = new Image();
    image.addEventListener("load", () => resolve(image));
    image.addEventListener("error", (error) => reject(error));
    image.setAttribute("crossOrigin", "anonymous");
    image.src = url;
  });

function getRadianAngle(degreeValue) {
  return (degreeValue * Math.PI) / 180;
}

export default function Test({ setShowModal, setImg, setRemove }) {
  const inputRef = useRef();
  const [show, setShow] = useState(false);
  const [image, setImage] = useState(null);
  const [croppedArea, setCroppedArea] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.click();
    }
  });
  const onCropComplete = (croppedAreaPercentage, croppedAreaPixels) => {
    setCroppedArea(croppedAreaPixels);
  };

  const onSelectFile = (event) => {
    setShow((prev) => !prev);
    if (event.target.files && event.target.files.length > 0) {
      const reader = new FileReader();
      reader.readAsDataURL(event.target.files[0]);
      reader.addEventListener("load", () => {
        setImage(reader.result);
      });
    }
  };

  const getCroppedFile = async () => {
    if (!croppedArea || !image) {
      return null;
    }

    const canvas = await getCroppedImg(image, croppedArea);

    return new Promise((resolve, reject) => {
      canvas.toBlob(
        (blob) => {
          if (!blob) {
            // Fallback for browsers that do not support toBlob
            const dataURL = canvas.toDataURL("image/jpeg", 0.66);
            const convertedBlob = dataURLToBlob(dataURL);
            resolve(
              new File([convertedBlob], "cropped-image.jpeg", {
                type: "image/jpeg",
              })
            );
          } else {
            resolve(
              new File([blob], "cropped-image.jpeg", { type: "image/jpeg" })
            );
          }
        },
        "image/jpeg",
        0.66
      );
    });
  };

  function dataURLToBlob(dataURL) {
    const arr = dataURL.split(",");
    const mime = arr[0].match(/:(.*?);/)[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new Blob([u8arr], { type: mime });
  }

  async function getCroppedImg(imageSrc, pixelCrop, rotation = 0) {
    const image = await createImage(imageSrc);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    const maxSize = Math.max(image.width, image.height);
    const safeArea = 2 * ((maxSize / 2) * Math.sqrt(2));

    canvas.width = safeArea;
    canvas.height = safeArea;

    ctx.translate(safeArea / 2, safeArea / 2);
    ctx.rotate(getRadianAngle(rotation));
    ctx.translate(-safeArea / 2, -safeArea / 2);

    ctx.drawImage(
      image,
      safeArea / 2 - image.width * 0.5,
      safeArea / 2 - image.height * 0.5
    );

    const data = ctx.getImageData(0, 0, safeArea, safeArea);

    canvas.width = pixelCrop.width;
    canvas.height = pixelCrop.height;

    ctx.putImageData(
      data,
      0 - safeArea / 2 + image.width * 0.5 - pixelCrop.x,
      0 - safeArea / 2 + image.height * 0.5 - pixelCrop.y
    );

    return canvas;
  }

  return (
    <div className="h-[90vh]  w-full relative mx-auto flex rounded-xl border-2 border-quotee-200 items-center justify-center">
      {show ? (
        <div className="h-full w-full bg-quotee-100 rounded-md">
          <div className="h-[90%] p-2 ">
            {image ? (
              <>
                <div className="h-full rounded-md overflow-hidden relative">
                  <Cropper
                    image={image}
                    crop={crop}
                    zoom={zoom}
                    aspect={1}
                    onCropChange={setCrop}
                    onZoomChange={setZoom}
                    onCropComplete={onCropComplete}
                  />
                </div>
              </>
            ) : null}
          </div>

          <div className="w-full p-2">
            <button
              className="text-white w-full px-4 py-2 disabled:bg-quotee-600 disabled:cursor-not-allowed rounded bg-quotee-500 hover:bg-quotee-600 transition-all ease-in-out duration-150"
              type="button"
              onClick={async (e) => {
                setRemove("");
                const data = await getCroppedFile();
                setImg({
                  show: URL.createObjectURL(data),
                  row: data,
                });
                setShowModal(false);
              }}
            >
              Set as profile picture
            </button>
          </div>
        </div>
      ) : (
        <label
          htmlFor="select"
          className=" cursor-pointer text-lg font-semibold text-quotee-600 animate-bounce"
        >
          Click to Select photo
          <input
            id="select"
            type="file"
            accept="image/*"
            className="hidden"
            ref={inputRef}
            onChange={onSelectFile}
          />
        </label>
      )}
    </div>
  );
}
