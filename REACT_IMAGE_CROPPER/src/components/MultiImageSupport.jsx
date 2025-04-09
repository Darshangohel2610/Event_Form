import React, { useState } from 'react'

function MultiImageSupport() {
    const [images,setImages] = useState([])
    const handleImageChange = (e)=>{
        const files = Array.from(e.target.files)
        const newImages = files.map((file)=>({
            file,
            url: URL.createObjectURL(file),
            caption : ""
        }))
        setImages([...images,...newImages])
    }

    const handleCaptionChange = (index,value)=>{
        const updatedImages = images.map((img,i)=> i=== index? {...img,caption : value} : img)
        setImages(updatedImages)
    }

    const handleRemoveImage = (index)=>{
        setImages(images.filter((_,i)=> i!==index))
    }

    const handleSubmit = () => {
        console.log("Uploaded Images:", images);
      };
  return (
    <div>
        <input 
            type='file'
            multiple
            accept='image/*'
            onChange={handleImageChange}
        />
        <div>
            {images.map((image,index)=>(
                <div key={index}>
                    <img
                        src={image.url}
                        alt={`uploaded at ${index}`}
                    />
                    <input
                        type="text"
                        placeholder='enter caption'
                        value={image.caption}
                        onChange={(e)=> handleCaptionChange(index,e.target.value)}
                    />
                    <button
                        onClick={()=>handleRemoveImage(index)}
                    >
                        remove img ✕
                    </button>
                </div>
                
            ))}
        </div>
        {images.length > 0 && (
            <button onClick={handleSubmit}>submit</button>
        )}
    </div>
  )
}

export default MultiImageSupport