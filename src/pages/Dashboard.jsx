import React from 'react';
import { useAuth } from '../hooks/useAuth.jsx';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card.jsx';
import { Button } from '../components/ui/button.jsx';
import { 
  Users, 
  Settings, 
  BarChart3, 
  Shield,
  User,
  Activity,
  TrendingUp,
  FileText
} from 'lucide-react';

const Dashboard = () => {
  const { user } = useAuth();

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-purple-500 to-blue-600 rounded-xl p-6 text-white">
        <h1 className="text-2xl font-bold mb-2">
          ยินดีต้อนรับ {user?.role === 'superadmin' ? 'System Admin' : user?.role}!
        </h1>
        <p className="text-purple-100">
          ระบบจัดการผู้ใช้งานและระบบรักษาความปลอดภัย
        </p>
      </div>

      {/* Action Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Admin Management Card */}
        {(user?.role === 'superadmin' || user?.role === 'admin') && (
          <Card className="bg-gradient-to-br from-orange-400 to-red-500 text-white border-0 shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader>
              <div className="flex items-center space-x-2">
                <Shield className="h-6 w-6" />
                <CardTitle className="text-white">Admin Management</CardTitle>
              </div>
              <CardDescription className="text-orange-100">
                จัดการผู้ใช้ Admin, เพิ่ม/ลบ Admin และกำหนด Role
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                className="bg-white bg-opacity-20 hover:bg-opacity-30 text-white border-white border"
                onClick={() => window.location.href = '/users'}
              >
                <Users className="mr-2 h-4 w-4" />
                จัดการ Admin
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Admin Dashboard Card */}
        <Card className="bg-gradient-to-br from-blue-500 to-purple-600 text-white border-0 shadow-lg hover:shadow-xl transition-shadow">
          <CardHeader>
            <div className="flex items-center space-x-2">
              <BarChart3 className="h-6 w-6" />
              <CardTitle className="text-white">Admin Dashboard</CardTitle>
            </div>
            <CardDescription className="text-blue-100">
              เข้าสู่ Admin Dashboard พร้อม สำหรับจัดการข้อมูลและระบบรักษาความปลอดภัย
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              className="bg-white bg-opacity-20 hover:bg-opacity-30 text-white border-white border"
              onClick={() => window.location.href = '/analytics'}
            >
              <TrendingUp className="mr-2 h-4 w-4" />
              เข้าสู่ Admin Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-white shadow-sm hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">ผู้ใช้งาน</p>
                <p className="text-2xl font-bold text-gray-900">1,247</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white shadow-sm hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-green-100 rounded-lg">
                <Activity className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">ร้านค้า</p>
                <p className="text-2xl font-bold text-gray-900">89</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white shadow-sm hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <FileText className="h-6 w-6 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">สินค้า</p>
                <p className="text-2xl font-bold text-gray-900">3,456</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white shadow-sm hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-red-100 rounded-lg">
                <TrendingUp className="h-6 w-6 text-red-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">ยอดขาย</p>
                <p className="text-2xl font-bold text-gray-900">567</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Management Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-white shadow-sm hover:shadow-md transition-shadow">
          <CardHeader>
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
              <CardTitle className="text-gray-900">จัดการผู้ใช้</CardTitle>
            </div>
            <CardDescription>
              จัดการบัญชีผู้ใช้และสิทธิ์การเข้าถึงระบบ
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              className="w-full bg-blue-600 hover:bg-blue-700 text-white"
              onClick={() => window.location.href = '/users'}
            >
              เข้าสู่การจัดการผู้ใช้
            </Button>
          </CardContent>
        </Card>

        <Card className="bg-white shadow-sm hover:shadow-md transition-shadow">
          <CardHeader>
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-green-100 rounded-lg">
                <Activity className="h-6 w-6 text-green-600" />
              </div>
              <CardTitle className="text-gray-900">อนุมัติร้านค้า</CardTitle>
            </div>
            <CardDescription>
              อนุมัติและจัดการร้านค้าที่ร้องขอการอนุมัติ
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              className="w-full bg-green-600 hover:bg-green-700 text-white"
              onClick={() => window.location.href = '/analytics'}
            >
              เข้าสู่การจัดการร้านค้า
            </Button>
          </CardContent>
        </Card>

        <Card className="bg-white shadow-sm hover:shadow-md transition-shadow">
          <CardHeader>
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Settings className="h-6 w-6 text-purple-600" />
              </div>
              <CardTitle className="text-gray-900">ตั้งค่าระบบ</CardTitle>
            </div>
            <CardDescription>
              กำหนดค่าและจัดการระบบทั่วไป
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              className="w-full bg-purple-600 hover:bg-purple-700 text-white"
              onClick={() => window.location.href = '/system'}
            >
              เข้าสู่ตั้งค่าระบบ
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;

