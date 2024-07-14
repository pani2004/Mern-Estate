import React, { useState, useEffect } from 'react';
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage';
import { app } from '../fireBase';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';

function CreateListing() {
  const [files, setFiles] = useState([]);
  const { currentUser } = useSelector(state => state.user);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    imageUrls: [],
    name: "",
    description: "",
    address: "",
    type: "",
    bedRooms: 1,
    bathRooms: 1,
    regularPrice: 50,
    discountPrice: 0,
    offer: false,
    parking: false,
    furnished: false,
  });
  const [imageUploadError, setImageUploadError] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const params = useParams();

  useEffect(() => {
    const fetchListing = async () => {
      const listingId = params.listingId;
      try {
        const res = await axios.get(`/api/listing/get/${listingId}`);
        const data = res.data;
        if (!data.success) {
          console.log(data.message);
          return;
        }
        setFormData({
          name: data.data.name,
          description: data.data.description,
          address: data.data.address,
          type: data.data.type,
          bedRooms: data.data.bedRooms,
          bathRooms: data.data.bathRooms,
          regularPrice: data.data.regularPrice,
          discountPrice: data.data.discountPrice,
          offer: data.data.offer,
          parking: data.data.parking,
          furnished: data.data.furnished,
          imageUrls: data.data.imageUrls,
        });
      } catch (error) {
        console.error("Error fetching listing:", error);
        // Handle error gracefully, e.g., redirect to an error page or display a message
      }
    };
    fetchListing();
  }, [params.listingId]);

  const handleSubmit = () => {
    if (files.length > 0 && files.length + formData.imageUrls.length < 7) {
      setUploading(true);
      const promises = files.map(storeImage); // Use map directly to simplify
      Promise.all(promises)
        .then((urls) => {
          setFormData({ ...formData, imageUrls: formData.imageUrls.concat(urls) });
          setImageUploadError(false);
          setUploading(false);
        })
        .catch((err) => {
          setImageUploadError("Image Upload Failed (2mb max per image)");
          setUploading(false);
        });
    } else {
      setImageUploadError("You can only upload 6 images per listing");
    }
  };

  const storeImage = async (file) => {
    return new Promise((resolve, reject) => {
      const storage = getStorage(app);
      const fileName = new Date().getTime() + file.name;
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, file);
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log(`Upload is ${progress}% done`);
        },
        (error) => {
          reject(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            resolve(downloadURL);
          });
        }
      );
    });
  };

  const handleDelete = (index) => {
    setFormData({
      ...formData,
      imageUrls: formData.imageUrls.filter((_, i) => i !== index)
    });
  };

  const handleChange = (e) => {
    const { id, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [id]: type === "checkbox" ? checked : value
    });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      if (formData.imageUrls.length < 1)
        return setError("You must upload at least one image");
      if (formData.regularPrice < formData.discountPrice)
        return setError("Discount price must be less than regular price");
      setLoading(true);
      setError(false);
      const res = await axios.post(`/api/listing/update/${params.listingId}`, { ...formData, userRef: currentUser.data._id }, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const data = res.data;
      console.log(data);
      setLoading(false);
      if (data.success === false) {
        setError(data.message);
      }
      navigate(`/listing/${data.data._id}`);
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  };

  return (
    <main className="container mx-auto px-6 py-12 overflow-x-hidden">
      <h1 className="text-3xl font-semibold text-center mb-8">Update Listing</h1>
      <form onSubmit={handleFormSubmit} className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Left Column */}
        <div className="space-y-6">
          <div className="flex flex-col">
            <input
              onChange={handleChange}
              value={formData.name}
              type="text"
              id="name"
              placeholder="Name"
              className="input-field rounded-lg py-3 px-4"
              maxLength="62"
              minLength="2"
              required
            />
          </div>
          <div className="flex flex-col">
            <textarea
              onChange={handleChange}
              value={formData.description}
              id="description"
              placeholder="Description"
              className="input-field rounded-lg h-40 resize-none py-3 px-4"
              required
            ></textarea>
          </div>
          <div className="flex flex-col">
            <input
              onChange={handleChange}
              value={formData.address}
              type="text"
              id="address"
              placeholder="Address"
              className="input-field rounded-lg py-3 px-4"
              required
            />
          </div>
          <div className="flex space-x-6 items-center">
            <input
              type="radio"
              id="type"
              name="type"
              value="sell"
              className="form-radio"
              onChange={handleChange}
              checked={formData.type === "sell"}
            />
            <label htmlFor="sell" className="text-gray-700">Sell</label>
            <input
              type="radio"
              id="type"
              name="type"
              value="rent"
              className="form-radio"
              onChange={handleChange}
              checked={formData.type === "rent"}
            />
            <label htmlFor="rent" className="text-gray-700">Rent</label>
            <input
              type="checkbox"
              id="parking"
              className="form-checkbox"
              onChange={handleChange}
              checked={formData.parking}
            />
            <label htmlFor="parking" className="text-gray-700">Parking Spot</label>
            <input
              type="checkbox"
              id="furnished"
              className="form-checkbox"
              onChange={handleChange}
              checked={formData.furnished}
            />
            <label htmlFor="furnished" className="text-gray-700">Furnished</label>
            <input
              type="checkbox"
              id="offer"
              className="form-checkbox"
              onChange={handleChange}
              checked={formData.offer}
            />
            <label htmlFor="offer" className="text-gray-700">Offer</label>
          </div>
        </div>
        {/* Right Column */}
        <div className="space-y-6">
          <div className="flex space-x-6 items-center">
            <div className="flex flex-col">
              <input
                onChange={handleChange}
                value={formData.bedRooms}
                type="number"
                id="bedRooms"
                placeholder="Bedrooms"
                min="1"
                max="10"
                className="input-field rounded-lg py-3 px-4"
                required
              />
              <p>Bedrooms</p>
            </div>
            <div className="flex flex-col">
              <input
                onChange={handleChange}
                value={formData.bathRooms}
                type="number"
                id="bathRooms"
                placeholder="Baths"
                min="1"
                max="10"
                className="input-field rounded-lg py-3 px-4"
                required
              />
              <p>Baths</p>
            </div>
          </div>
          <div className="flex space-x-2 items-center">
            <div className="flex flex-col">
              <div className="flex items-center">
                <input
                  onChange={handleChange}
                  value={formData.regularPrice}
                  type="number"
                  id="regularPrice"
                  placeholder="Regular Price"
                  min="50"
                  max="10000"
                  className="input-field rounded-lg py-3 px-4 w-50"
                  required
                />
                <p>Regular Price</p>
                <span className="text-sm text-gray-600 ml-2">($ / month)</span>
              </div>
            </div>
            {formData.offer && (
              <div className="flex flex-col">
                <div className="flex items-center">
                  <input
                    onChange={handleChange}
                    value={formData.discountPrice}
                    type="number"
                    id="discountPrice"
                    placeholder="Discounted Price"
                    min="0"
                    max="10000"
                    className="input-field rounded-lg py-3 px-4 w-50"
                    required
                  />
                  <p>Discounted Price</p>
                  <span className="text-sm text-gray-600 ml-2">($ / month)</span>
                </div>
              </div>
            )}

          </div>
          <div>
            <label className="text-gray-700">Images:</label>
            <div className="flex space-x-4">
              <input
                onChange={(e) => setFiles([...e.target.files])}
                type="file"
                id="images"
                accept="image/*"
                className="border border-gray-300 p-3 rounded-lg w-full"
                multiple
              />
              <button
                type="button"
                onClick={handleSubmit}
                className={`bg-blue-500 text-white px-4 py-3 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`}
                disabled={uploading}
              >
                {uploading ? 'Uploading...' : 'Upload'}
              </button>
            </div>
            <p className="text-red-700 text-sm">{imageUploadError && imageUploadError}</p>
            {formData.imageUrls.length > 0 && formData.imageUrls.map((url, index) => (
              <div key={index} className="flex justify-between p-3 border items-center mt-2">
                <img src={url} alt="listing image" className="w-20 h-20 object-contain rounded-lg" />
                <button type="button" onClick={() => handleDelete(index)} className="p-3 text-red-700 rounded-lg uppercase hover:opacity-75">Delete</button>
              </div>
            ))}
          </div>
          <button disabled={loading || uploading} className="bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500">
            {loading ? "Updating..." : "Update Listing"}
          </button>
          {error && <p className="text-red-700 text-sm">{error}</p>}
        </div>
      </form>
    </main>
  );
}

export default CreateListing;
