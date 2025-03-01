import React, { useState, useEffect, useContext } from "react";
import "./AddItems.css";
import { assets } from "../../assets/admin_assets/assets";
import {ToastContainer , toast} from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import { AdminContext } from "../../context/AdminContext";

const AddItems = () => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState(null); // State for the image file
  const [imagePreview, setImagePreview] = useState(null); // State for image preview
  const {backend_url} = useContext(AdminContext)

  // Cleanup image URL on unmount
  useEffect(() => {
    return () => {
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setImagePreview(URL.createObjectURL(file)); // Generate a preview URL for the image
    }
  };

  const submitForm = async (event) => {
    event.preventDefault();
    const url = backend_url + "/food/add";

    const formData = new FormData();
    formData.append("name", name);
    formData.append("description", description);
    formData.append("category", category);
    formData.append("price", price);
    if (image) {
      formData.append("image", image); // Add the image file
    }

    try {
      const response = await fetch(url, {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const result = await response.json();
        toast.success(result.message)
        console.log(result);

        // Reset form inputs
        setName("");
        setDescription("");
        setCategory("");
        setPrice("");
        setImage(null);
        setImagePreview(null); // Clear the preview
      } else {
        const errorData = await response.json();
        console.error("Failed to add item:", errorData.message || "Unknown error");
        alert(`Failed to add item: ${errorData.message || "Unknown error"}`);
      }
    } catch (error) {
      console.error("Error occurred while adding item:", error);
      alert("An error occurred. Please check the console for details.");
    }
  };

  return (
    <form onSubmit={submitForm} className="add-items-container">
      <ToastContainer />
      {/* Image upload */}
      <div className="image-upload">
        <label htmlFor="ImageUpload">
          Upload image
          <img
            src={imagePreview || assets.upload_area} // Show preview if available, else default image
            alt="Preview"
            className="image-preview"
          />
        </label>
        <input
          id="ImageUpload"
          type="file"
          accept="image/*"
          onChange={handleImageChange} // Handle image change
        />
      </div>

      {/* Product name */}
      <div className="product-name">
        <label htmlFor="ProductName">Product name</label>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          id="ProductName"
          type="text"
          placeholder="Type here..."
          required
        />
      </div>

      {/* Product description */}
      <div className="product-description">
        <label htmlFor="ProductDescription">Product description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={5}
          id="ProductDescription"
          required
        ></textarea>
      </div>

      {/* Product category and price */}
      <div className="product-cat-price">
        <div>
          <label htmlFor="category">Product category</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            id="category"
            required
          >
            <option value="">- Select -</option>
            <option value="Salad">Salad</option>
            <option value="Rolls">Rolls</option>
            <option value="Deserts">Deserts</option>
            <option value="Sandwitch">Sandwitch</option>
            <option value="Cake">Cake</option>
            <option value="Pure Veg">Pure Veg</option>
            <option value="Pasta">Pasta</option>
            <option value="Noodles">Noodles</option>
            <option value="Drinks">Drinks</option>
            <option value="Milkshakes">Milkshakes</option>
          </select>
        </div>
        <div>
          <label htmlFor="price">Product price</label>
          <input
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            id="price"
            type="number"
            placeholder="₹"
            required
          />
        </div>
      </div>

      <button type="submit" className="product-add">
        ADD
      </button>
    </form>
  );
};

export default AddItems;
