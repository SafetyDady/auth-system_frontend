import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth.jsx';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Label } from '../components/ui/label';
import { Badge } from '../components/ui/badge';
import { Alert, AlertDescription } from '../components/ui/alert';
import { 
  Users, 
  Plus, 
  Edit, 
  Trash2, 
  Search, 
  Shield, 
  UserCheck, 
  UserX,
  Crown,
  Settings
} from 'lucide-react';
import { toast } from 'react-toastify';

const UserManagement = () => {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // Mock users data (since we don't have user management API yet)
  const mockUsers = [
    {
      id: 1,
      username: 'superadmin',
      email: 'superadmin@example.com',
      role: 'superadmin',
      status: 'active',
      created_at: '2024-01-01T00:00:00Z',
      last_login: '2024-08-05T10:27:00Z'
    },
    {
      id: 2,
      username: 'admin1',
      email: 'admin1@example.com',
      role: 'admin',
      status: 'active',
      created_at: '2024-01-15T00:00:00Z',
      last_login: '2024-08-04T15:30:00Z'
    },
    {
      id: 3,
      username: 'admin2',
      email: 'admin2@example.com',
      role: 'admin',
      status: 'active',
      created_at: '2024-02-01T00:00:00Z',
      last_login: '2024-08-03T09:15:00Z'
    },
    {
      id: 4,
      username: 'user1',
      email: 'user1@example.com',
      role: 'user',
      status: 'active',
      created_at: '2024-03-01T00:00:00Z',
      last_login: '2024-08-02T14:22:00Z'
    },
    {
      id: 5,
      username: 'user2',
      email: 'user2@example.com',
      role: 'user',
      status: 'inactive',
      created_at: '2024-03-15T00:00:00Z',
      last_login: '2024-07-28T11:45:00Z'
    }
  ];

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setUsers(mockUsers);
      setLoading(false);
    }, 1000);
  }, []);

  const getRoleIcon = (role) => {
    switch (role) {
      case 'superadmin':
        return <Crown className="h-4 w-4" />;
      case 'admin':
        return <Shield className="h-4 w-4" />;
      default:
        return <Users className="h-4 w-4" />;
    }
  };

  const getRoleBadgeColor = (role) => {
    switch (role) {
      case 'superadmin':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'admin':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusBadgeColor = (status) => {
    return status === 'active' 
      ? 'bg-green-100 text-green-800 border-green-200'
      : 'bg-red-100 text-red-800 border-red-200';
  };

  const canManageUser = (targetUser) => {
    if (user?.role === 'superadmin') return true;
    if (user?.role === 'admin' && targetUser.role === 'user') return true;
    return false;
  };

  const filteredUsers = users.filter(u =>
    u.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEdit = (targetUser) => {
    if (!canManageUser(targetUser)) {
      toast.error('You do not have permission to edit this user');
      return;
    }
    setSelectedUser(targetUser);
    setShowModal(true);
  };

  const handleDelete = (targetUser) => {
    if (!canManageUser(targetUser)) {
      toast.error('You do not have permission to delete this user');
      return;
    }
    if (window.confirm(`Are you sure you want to delete user "${targetUser.username}"?`)) {
      setUsers(users.filter(u => u.id !== targetUser.id));
      toast.success(`User "${targetUser.username}" has been deleted`);
    }
  };

  const handleToggleStatus = (targetUser) => {
    if (!canManageUser(targetUser)) {
      toast.error('You do not have permission to modify this user');
      return;
    }
    const newStatus = targetUser.status === 'active' ? 'inactive' : 'active';
    setUsers(users.map(u => 
      u.id === targetUser.id 
        ? { ...u, status: newStatus }
        : u
    ));
    toast.success(`User "${targetUser.username}" status changed to ${newStatus}`);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
          <p className="text-gray-600 mt-1">Manage system users and their permissions</p>
        </div>
        <Button 
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2"
          disabled={user?.role === 'user'}
        >
          <Plus className="h-4 w-4" />
          Add User
        </Button>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search users by username, email, or role..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Users ({filteredUsers.length})
          </CardTitle>
          <CardDescription>
            {user?.role === 'superadmin' && "You can manage all users"}
            {user?.role === 'admin' && "You can manage regular users only"}
            {user?.role === 'user' && "View-only access"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-medium text-gray-900">User</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Role</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Status</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Last Login</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((targetUser) => (
                  <tr key={targetUser.id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <div>
                        <div className="font-medium text-gray-900">{targetUser.username}</div>
                        <div className="text-sm text-gray-500">{targetUser.email}</div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <Badge className={`flex items-center gap-1 w-fit ${getRoleBadgeColor(targetUser.role)}`}>
                        {getRoleIcon(targetUser.role)}
                        {targetUser.role}
                      </Badge>
                    </td>
                    <td className="py-3 px-4">
                      <Badge className={`w-fit ${getStatusBadgeColor(targetUser.status)}`}>
                        {targetUser.status === 'active' ? (
                          <UserCheck className="h-3 w-3 mr-1" />
                        ) : (
                          <UserX className="h-3 w-3 mr-1" />
                        )}
                        {targetUser.status}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-500">
                      {formatDate(targetUser.last_login)}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(targetUser)}
                          disabled={!canManageUser(targetUser)}
                          className="h-8 w-8 p-0"
                        >
                          <Edit className="h-3 w-3" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleToggleStatus(targetUser)}
                          disabled={!canManageUser(targetUser)}
                          className="h-8 w-8 p-0"
                        >
                          <Settings className="h-3 w-3" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(targetUser)}
                          disabled={!canManageUser(targetUser)}
                          className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredUsers.length === 0 && (
            <div className="text-center py-8">
              <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No users found matching your search.</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Permission Info */}
      <Alert>
        <Shield className="h-4 w-4" />
        <AlertDescription>
          <strong>Permission Matrix:</strong>
          {' '}Superadmin can manage everyone • Admin can manage regular users • Users have view-only access
        </AlertDescription>
      </Alert>
    </div>
  );
};

export default UserManagement;

