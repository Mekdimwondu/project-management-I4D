

function Message() {
  return (
    
      <section className="p-4 h-screen flex">
        {/* Group Chat Section */}
        <div className="w-1/4 flex flex-col p-4 space-y-4 bg-white rounded-md shadow-md">
          {/* Header Section */}
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">Group Chat</h2>
            <button className="bg-blue2 text-white px-4 py-2 rounded-md shadow-md hover:bg-blue-600 transition duration-200">
              Add
            </button>
          </div>
          
          {/* Search Input */}
          <div>
            <input 
              type="text" 
              className="w-full px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500" 
              placeholder="Search..." 
            />
          </div>
  
          {/* Members List */}
          <div>
            <div className="text-xl font-semibold mb-2">Members</div>
            <ul className="list-disc list-inside pl-4">
              <li>Name 1</li>
              <li>Name 2</li>
              <li>Name 3</li>
              {/* Add more members here */}
            </ul>
          </div>
        </div>
  
        {/* Chat Section */}
        <div className="w-3/4 flex flex-col p-4 space-y-4 bg-white rounded-md shadow-md ml-1">
          <div className="text-lg font-semibold mb-2">Chat</div>
          {/* Chat messages will go here */}
          <p>No messages yet.</p>
        </div>
      </section>
  )
}

export default Message