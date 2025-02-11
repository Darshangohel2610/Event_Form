import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
// import "../App.css";

const editorConfiguration = {
    licenseKey: 'eyJhbGciOiJFUzI1NiJ9.eyJleHAiOjE3NDA0NDE1OTksImp0aSI6IjJmOGE5YmZiLWU5MDYtNDQ0Yi1hNTQ2LTliMDA3NjY4OWQyYSIsInVzYWdlRW5kcG9pbnQiOiJodHRwczovL3Byb3h5LWV2ZW50LmNrZWRpdG9yLmNvbSIsImRpc3RyaWJ1dGlvbkNoYW5uZWwiOlsiY2xvdWQiLCJkcnVwYWwiLCJzaCJdLCJ3aGl0ZUxhYmVsIjp0cnVlLCJsaWNlbnNlVHlwZSI6InRyaWFsIiwiZmVhdHVyZXMiOlsiKiJdLCJ2YyI6Ijg0MTM4NDFkIn0.7_Fgb9EwlYjJdmiwzO6WI6a_3svSJqbrgHYmDVOowf2HDwk2POpkdhlgmM4tBOumuwG39FysZWe0nT2opOWj8g'
  };

const EventFormSchema = Yup.object({
  title: Yup.string()
    .matches(/^[a-zA-Z0-9 ]+$/, "Only alphanumeric and spaces allowed")
    .max(50, "Max 50 characters allowed")
    .required("Event Title is required"),
  discription: Yup.string()
    .max(5000, "Max 5000 characters allowed")
    .required("Event Description is required"),
  images: Yup.array()
    .max(5, "Maximum 5 images allowed")
    .of(
      Yup.object().shape({
        file: Yup.mixed()
          .test("fileType", "Only JPEG/PNG allowed", (file) => {
            return file && ["image/jpeg", "image/png"].includes(file?.type);
          })
          .required("Image is required"),
        caption: Yup.string().max(100, "Max 100 characters allowed"),
      })
    ),
});

function EventForm() {
  const [eventImages, setEventImages] = useState([]);

  const formik = useFormik({
    initialValues: {
      title: "",
      discription: "",
      images: [],
    },
    validationSchema: EventFormSchema,
    onSubmit: (values, { resetForm }) => {
      console.log("Submitted Data:", values);
      resetForm();
      setEventImages([]);
    },
  });

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);

    if (eventImages.length + files.length > 5) {
      alert("Can't upload more than 5 images");
      return;
    }
    const newImages = files.map((file) => ({
      file,
      url: URL.createObjectURL(file),
      caption: "",
    }));
    setEventImages((prev) => [...prev, ...newImages]);
    formik.setFieldValue("images", [...formik.values.images, ...newImages]);
  };

  const handleCaptionChange = (index, value) => {
    const updatedImages = [...formik.values.images];
    updatedImages[index].caption = value;
    formik.setFieldValue("images", updatedImages);
  };

  const removeImage = (index) => {
    const filteredImages = eventImages.filter((_, i) => i !== index);
    setEventImages(filteredImages);
    formik.setFieldValue(
      "images",
      formik.values.images.filter((_, i) => i !== index)
    );
  };

  return (
    <div className="max-w-2xl mx-auto bg-white shadow-lg rounded-lg p-6 mt-6">
      <h1 className="text-2xl font-semibold text-gray-800 mb-4">Event Form</h1>
      <form onSubmit={formik.handleSubmit} className="space-y-4">
        {/* Event Title */}
        <div>
          <label className="block text-gray-700 font-medium">Event Title:</label>
          <input
            name="title"
            value={formik.values.title}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
          />
          {formik.touched.title && formik.errors.title && (
            <div className="text-red-500 text-sm">{formik.errors.title}</div>
          )}
        </div>

        {/* Event Description */}
        <div>
          <label className="block text-gray-700 font-medium">Event Description:</label>
          <CKEditor
            editor={ClassicEditor}
            data={formik.values.discription}
            config={editorConfiguration}
            onChange={(event, editor) =>
              formik.setFieldValue("discription", editor.getData())
            }
          />
          {formik.touched.discription && formik.errors.discription && (
            <div className="text-red-500 text-sm">{formik.errors.discription}</div>
          )}
        </div>

        {/* Image Upload */}
        <div>
          <label className="block text-gray-700 font-medium">Event Images (Max: 5):</label>
          <input
            type="file"
            multiple
            accept="image/png, image/jpeg"
            onChange={handleImageChange}
            className="block w-full border border-gray-300 p-2 rounded-md"
          />
          {formik.errors.images && (
            <div className="text-red-500 text-sm">{formik.errors.images}</div>
          )}
        </div>

        {/* Image Preview */}
        <div className="grid grid-cols-3 gap-4">
          {eventImages.map((image, index) => (
            <div key={index} className="relative border p-2 rounded-lg shadow-md">
              <img src={image.url} className="w-full h-32 object-cover rounded-md" />
              <input
                type="text"
                placeholder="Enter caption"
                value={image.caption}
                onChange={(e) => handleCaptionChange(index, e.target.value)}
                className="w-full mt-2 p-1 border rounded-md"
              />
              <button
                onClick={() => removeImage(index)}
                type="button"
                className="mt-2 bg-red-500 text-white px-2 py-1 rounded-md w-full hover:bg-red-600"
              >
                Remove Image
              </button>
            </div>
          ))}
        </div>

        {/* Buttons */}
        <div className="flex justify-between mt-4">
          <button
            type="reset"
            onClick={() => {
              formik.resetForm();
              setEventImages([]);
            }}
            className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
          >
            Reset
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
}

export default EventForm;
