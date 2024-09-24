/* eslint-disable react/prop-types */
import { useState, useEffect } from 'react';
import apiService from '../api/apiService';
import { jwtDecode } from 'jwt-decode';

function GroupList({ onGroupSelect, onUserSelect, setIsCreatingGroup }) {
  const [groups, setGroups] = useState([]);
  const [users, setUsers] = useState([]);
  const [isCreatingGroup, setIsCreatingGroupState] = useState(false);
  const [newGroupName, setNewGroupName] = useState('');
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false); // Add state for admin status

  useEffect(() => {
    const token = localStorage.getItem('User');
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        setIsAdmin(decodedToken.role === 'Admin');
      } catch (error) {
        console.error('Error decoding token:', error);
      }
    }
  }, []);

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const response = await apiService.get('/groups');
        setGroups(response.data);
      } catch (error) {
        console.error('Error fetching groups:', error);
      }
    };

    const fetchUsers = async () => {
      try {
        const response = await apiService.get('/users/users');
        setUsers(response.data);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchGroups();
    fetchUsers();
  }, []);

  const handleCreateGroup = async () => {
    if (!newGroupName || selectedUsers.length === 0) {
      alert('Please provide a group name and select at least one user.');
      return;
    }

    const groupData = {
      name: newGroupName,
      members: selectedUsers,
    };

    try {
      await apiService.post('/groups', groupData);
      setNewGroupName('');
      setSelectedUsers([]);
      setIsCreatingGroupState(false);
      setGroups((prevGroups) => [...prevGroups, groupData]); // Refresh group list
    } catch (error) {
     
      console.error('Error creating group:', error);
       
      
    }
  };

  return (
    <div className="flex flex-col h-full p-4 space-y-4 bg-slate-700 rounded-md shadow-md">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">Group Chat</h2>
        {isAdmin && (
          <button
            onClick={() => setIsCreatingGroupState(true)}
            className="bg-blue-400 text-white px-4 py-2 rounded-md"
          >
            Add
          </button>
        )}
      </div>

      <div className="text-xl font-semibold mb-2 text-white">Groups</div>
      <div className="flex-1 overflow-y-auto">
        <ul className="space-y-2">
          {groups.length > 0 ? (
            groups.map((group,index) => (
              <li
                key={group.length||index}
                className="text-lg cursor-pointer text-white hover:bg-slate-600"
                onClick={() => onGroupSelect(group._id, group.name)}
              >
                {group.name}
              </li>
            ))
          ) : (
            <li>No groups available</li>
          )}
        </ul>
      </div>

      <div className="text-xl font-semibold mb-2">Users</div>
      <div className="flex-1 overflow-y-auto">
        <ul className="space-y-2">
          {users.length > 0 ? (
            users.map((user) => (
              <li
                key={user._id}
                className="text-lg cursor-pointer hover:underline"
                onClick={() => onUserSelect(user._id, `${user.firstName} ${user.lastName}`)}
              >
                {user.firstName} {user.lastName}
              </li>
            ))
          ) : (
            <li>No users available</li>
          )}
        </ul>
      </div>

      {/* Modal for creating a new group */}
      {isCreatingGroup && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-md shadow-md space-y-4 w-96">
            <h3 className="text-2xl font-bold">Create New Group</h3>
            <input
              type="text"
              value={newGroupName}
              onChange={(e) => setNewGroupName(e.target.value)}
              className="w-full px-4 py-2 border rounded-md"
              placeholder="Group Name"
            />
            <div>
              <h4 className="text-lg font-semibold mb-2">Select Members:</h4>
              <ul className="space-y-2">
                {users.length > 0 ? (
                  users.map((user) => (
                    <li key={user._id}>
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          value={user._id}
                          checked={selectedUsers.includes(user._id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedUsers([...selectedUsers, user._id]);
                            } else {
                              setSelectedUsers(selectedUsers.filter((id) => id !== user._id));
                            }
                          }}
                          className="mr-2"
                        />
                        {user.firstName} {user.lastName}
                      </label>
                    </li>
                  ))
                ) : (
                  <li>No users available</li>
                )}
              </ul>
            </div>
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setIsCreatingGroupState(false)}
                className="bg-gray-400 text-white px-4 py-2 rounded-md hover:bg-gray-500"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateGroup}
                className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default GroupList;
