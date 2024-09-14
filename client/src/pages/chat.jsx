import { useState } from 'react';
import GroupList from './groupchat';
import Message from './message';

function Chat() {
  const [selectedGroupId, setSelectedGroupId] = useState(null);
  const [selectedGroupName, setSelectedGroupName] = useState('');
  const [isCreatingGroup, setIsCreatingGroup] = useState(false);

  // Handler when a group is selected from GroupList
  const handleGroupSelect = (groupId, groupName) => {
    setSelectedGroupId(groupId);
    setSelectedGroupName(groupName);
  };

  // Handler when a new group is created
  const handleGroupCreate = () => {
    setIsCreatingGroup(false);
    // Optionally refresh the group list or take other actions
  };

  return (
    <div className="flex h-screen">
      {/* Group List on the left side */}
      <div className="w-1/4 flex flex-col p-4 bg-gray-100">
        <GroupList
          onGroupSelect={handleGroupSelect}
          isAdmin={true} // Pass this based on your app's logic
          setIsCreatingGroup={setIsCreatingGroup}
        />
      </div>

      {/* Message Component on the right side */}
      <div className="w-3/4 flex flex-col p-4">
        {selectedGroupId ? (
          <Message
            groupId={selectedGroupId}
            groupName={selectedGroupName}
            onGroupCreate={handleGroupCreate}
          />
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <p className="text-lg text-gray-500">Select a group to view messages</p>
          </div>
        )}
      </div>

      {/* Conditionally render group creation modal or any other component */}
      {isCreatingGroup && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-md shadow-md space-y-4">
            <h3 className="text-2xl font-bold">Create New Group</h3>
            {/* Your group creation form goes here */}
            <button
              onClick={() => setIsCreatingGroup(false)}
              className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md"
            >
              Cancel
            </button>
            <button
              onClick={handleGroupCreate}
              className="bg-blue-500 text-white px-4 py-2 rounded-md"
            >
              Create
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Chat;
