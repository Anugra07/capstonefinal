function Dashboard({ setToken }) {
  const handleLogout = () => {
    setToken(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <nav className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl"></div>
            <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          </div>
          <button
            onClick={handleLogout}
            className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold px-6 py-2.5 rounded-xl hover:from-indigo-700 hover:to-purple-700 transition duration-200 shadow-lg hover:shadow-xl"
          >
            Logout
          </button>
        </div>
      </nav>
      
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="mb-8">
          <h2 className="text-4xl font-bold text-gray-900 mb-2">Welcome back! 👋</h2>
          <p className="text-gray-600 text-lg">Here's what's happening with your account today.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center text-white text-2xl mb-4">
              📊
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Analytics</h3>
            <p className="text-gray-600">Track your performance metrics</p>
            <div className="mt-4 text-3xl font-bold text-gray-900">2,543</div>
            <p className="text-sm text-green-600 mt-1">↑ 12% from last month</p>
          </div>
          
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center text-white text-2xl mb-4">
              👥
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Team</h3>
            <p className="text-gray-600">Manage your team members</p>
            <div className="mt-4 text-3xl font-bold text-gray-900">12</div>
            <p className="text-sm text-gray-500 mt-1">Active members</p>
          </div>
          
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition">
            <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl flex items-center justify-center text-white text-2xl mb-4">
              ⚙️
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Settings</h3>
            <p className="text-gray-600">Configure your preferences</p>
            <div className="mt-4">
              <button className="text-indigo-600 font-semibold hover:text-indigo-700">
                Manage →
              </button>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
          <h3 className="text-2xl font-bold text-gray-900 mb-6">Recent Activity</h3>
          <div className="space-y-4">
            <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-xl">
              <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center text-white">
                ✓
              </div>
              <div className="flex-1">
                <p className="font-semibold text-gray-900">Account created successfully</p>
                <p className="text-sm text-gray-600">Just now</p>
              </div>
            </div>
            <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-xl">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white">
                🔐
              </div>
              <div className="flex-1">
                <p className="font-semibold text-gray-900">Logged in from new device</p>
                <p className="text-sm text-gray-600">2 minutes ago</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
