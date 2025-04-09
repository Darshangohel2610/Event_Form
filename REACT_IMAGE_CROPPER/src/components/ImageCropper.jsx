import React, { useRef } from 'react'
import { useState } from 'react'
import ReactCrop,{makeAspectCrop,centerCrop, convertToPercentCrop, convertToPixelCrop} from 'react-image-crop'
import setCanvasPreview from '../SetCanvasPreview'
const ASPACT_RATIO = 1
const MIN_DIM = 150

function ImageCropper() {
    const [imgSrc,setImgSrc] = useState("")
    const [error,setError ] = useState("")
    const imgRef = useRef(null)
    const imagePreviewCanvasRef = useRef(null)
    const [crop,setCrop] = useState({
        unit: '%', // Can be 'px' or '%'
        x: 25,
        y: 25,
        width: 50,
        height: 50
      })
    const onselectFile = (e)=>{

        const file = e.target.files?.[0]
        console.log(e.target.file)


        const reader = new FileReader()

        reader.addEventListener("load",()=>{
            const imageElement = new Image()
            const imgUrl = reader.result?.toString() ||"not uploaded";
            imageElement.src = imgUrl

            imageElement.addEventListener("load",(e)=>{
                if(error) setError("")
                const {naturalWidth,naturalHeight} = e.currentTarget
                if(naturalHeight < MIN_DIM || naturalWidth < MIN_DIM){
                    setError("uplod 150 * 150 img")
                    return setImgSrc("")   
                }

            })
            setImgSrc(imgUrl)
        })
        reader.readAsDataURL(file)
    }

    const onImageLoad = (e)=>{
        const {width,height} = e.currentTarget
        const widthWithInPercentage = (MIN_DIM/width) * 100
    
        const crop = makeAspectCrop({
            unit : "%",
            width : widthWithInPercentage
        },ASPACT_RATIO,width,height)
        setCrop(centerCrop(crop,width,height ))
    }
  return (
    <div>
        
        <label>
            choose profile pic
        <input
            type="file"
            accept='image/*'
            onChange={onselectFile}
        ></input>
        </label>
        {error&& <p>{error}</p>}
        {imgSrc &&
            <div>
                <ReactCrop
                    crop={crop}
                    circularCrop
                    keepSelection
                    onChange={
                        (pixalCrop,persentCrop)=>setCrop(persentCrop)
                    }
                    aspect = {ASPACT_RATIO}
                    minWidth={MIN_DIM}
                >

                    <img ref={imgRef} src={imgSrc} alt="uplod" style={{maxHeight:"70vh"}}
                        onLoad={onImageLoad}
                    ></img>
                </ReactCrop>
                <button
                    onClick={()=>{
                        setCanvasPreview(
                            imgRef.current,
                            imagePreviewCanvasRef.current,
                            convertToPixelCrop(
                                crop,
                                imgRef.current.width,
                                imgRef.current.height
                            )
                        )
                    }}
                >
                    crop image
                </button>


            </div>
        }
        {crop &&
            <canvas
            ref={imagePreviewCanvasRef}
             style={{
                border : "1px solid black",
                objectFit :"contain",
                width:150,
                height:150
             }}
            ></canvas>
        }

    </div>
  )
}

export default ImageCropper