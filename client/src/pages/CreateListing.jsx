import React from 'react';

function CreateListing() {
  return (
    <main className="container mx-auto px-6 py-12 overflow-x-hidden ">
      <h1 className="text-3xl font-semibold text-center mb-8">Create Listing</h1>
      <form className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Left Column */}
        <div className="space-y-6">
          <div className="flex flex-col">
            <input
              type="text"
              id="name"
              placeholder="Name"
              className="input-field rounded-lg py-3 px-4"
              maxLength="62"
              minLength="10"
              required
            />
          </div>
          <div className="flex flex-col">
            <textarea
              id="description"
              placeholder="Description"
              className="input-field rounded-lg h-40 resize-none py-3 px-4"
              required
            ></textarea>
          </div>
          <div className="flex flex-col">
            <input
              type="text"
              id="address"
              placeholder="Address"
              className="input-field rounded-lg py-3 px-4"
              required
            />
          </div>
          <div className="flex space-x-6 items-center">
            <input type="checkbox" id="sell" className="form-checkbox" />
            <label htmlFor="sell" className="text-gray-700">Sell</label>
            <input type="checkbox" id="rent" className="form-checkbox" />
            <label htmlFor="rent" className="text-gray-700">Rent</label>
            <input type="checkbox" id="parkingspot" className="form-checkbox" />
            <label htmlFor="parkingspot" className="text-gray-700">Parking Spot</label>
            <input type="checkbox" id="furnished" className="form-checkbox" />
            <label htmlFor="furnished" className="text-gray-700">Furnished</label>
            <input type="checkbox" id="offer" className="form-checkbox" />
            <label htmlFor="offer" className="text-gray-700">Offer</label>
          </div>
        </div>
        {/* Right Column */}
        <div className="space-y-6">
          <div className="flex space-x-6 items-center">
            <div className="flex flex-col">
              <input
                type="number"
                id="bedrooms"
                placeholder="Bedrooms"
                min="1"
                max="10"
                className="input-field rounded-lg py-3 px-4"
                required
              />
            </div>
            <div className="flex flex-col">
              <input
                type="number"
                id="baths"
                placeholder="Baths"
                min="1"
                max="10"
                className="input-field rounded-lg py-3 px-4"
                required
              />
            </div>
          </div>
          <div className="flex space-x-2 items-center">
            <div className="flex flex-col">
              <div className="flex items-center">
                <input
                  type="number"
                  id="regularprice"
                  placeholder="Regular Price"
                  min="1"
                  max="10000"
                  className="input-field rounded-lg py-3 px-4 w-64"
                  required
                />
                <span className="text-sm text-gray-600 ml-2">($ / month)</span>
              </div>
            </div>
            <div className="flex flex-col">
              <div className="flex items-center">
                <input
                  type="number"
                  id="discountprice"
                  placeholder="Discounted Price"
                  min="1"
                  max="10000"
                  className="input-field rounded-lg py-3 px-4 w-64"
                  required
                />
                <span className="text-sm text-gray-600 ml-2">($ / month)</span>
              </div>
            </div>
          </div>
          <div>
            <label className="text-gray-700">Images:</label>
            <div className="flex space-x-4">
              <input
                type="file"
                id="images"
                accept="image/*"
                className="border border-gray-300 p-3 rounded-lg w-full"
                multiple
              />
              <button className="bg-blue-500 text-white px-4 py-3 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500">
                Upload
              </button>
            </div>
          </div>
          <button className="bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500">
            Create Listing
          </button>
        </div>
      </form>
    </main>
  );
}

export default CreateListing;















