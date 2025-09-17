import React from "react";

const Header = () => {
  return (
    <header className="bg-[FFFFFF] shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <div className="gradient-bg text-white px-3 py-2 rounded-lg font-bold text-xl">
              Test Prepify
            </div>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex space-x-8">
            <div className="relative group">
              <button className="text-blue-600 font-semibold px-3 py-2 rounded-md bg-blue-50 flex items-center">
                Đề thi <i className="fas fa-chevron-down ml-2"></i>
              </button>
              <div className="absolute top-full left-0 mt-2 w-96 bg-[#FFFFFF] rounded-lg shadow-xl border opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                <div className="grid grid-cols-2 gap-4 p-4">
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-2">IELTS</h3>
                    <ul className="space-y-2">
                      <li>
                        <a
                          href="#"
                          className="text-gray-600 hover:text-blue-600 flex justify-between"
                        >
                          Reading{" "}
                          <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                            12/20
                          </span>
                        </a>
                      </li>
                      <li>
                        <a
                          href="#"
                          className="text-gray-600 hover:text-blue-600 flex justify-between"
                        >
                          Listening{" "}
                          <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                            8/15
                          </span>
                        </a>
                      </li>
                      <li>
                        <a
                          href="#"
                          className="text-gray-600 hover:text-blue-600 flex justify-between"
                        >
                          Writing{" "}
                          <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                            5/10
                          </span>
                        </a>
                      </li>
                      <li>
                        <a
                          href="#"
                          className="text-gray-600 hover:text-blue-600 flex justify-between"
                        >
                          Speaking{" "}
                          <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                            3/8
                          </span>
                        </a>
                      </li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-2">TOEIC</h3>
                    <ul className="space-y-2">
                      <li>
                        <a
                          href="#"
                          className="text-gray-600 hover:text-blue-600 flex justify-between"
                        >
                          Reading{" "}
                          <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                            15/25
                          </span>
                        </a>
                      </li>
                      <li>
                        <a
                          href="#"
                          className="text-gray-600 hover:text-blue-600 flex justify-between"
                        >
                          Listening{" "}
                          <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                            10/20
                          </span>
                        </a>
                      </li>
                      <li>
                        <a
                          href="#"
                          className="text-gray-600 hover:text-blue-600 flex justify-between"
                        >
                          Full Test{" "}
                          <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                            7/12
                          </span>
                        </a>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
            <a
              href="#"
              className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md"
            >
              Luyện tập
            </a>
            <a
              href="#"
              className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md"
            >
              Thống kê
            </a>
          </nav>

          {/* Search & User */}
          <div className="flex items-center space-x-4">
            <div className="relative hidden md:block">
              <input
                type="text"
                placeholder="Tìm kiếm bài test..."
                className="w-64 pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <i className="fas fa-search absolute left-3 top-3 text-gray-400"></i>
            </div>

            <div className="relative">
              <button className="text-gray-600 hover:text-blue-600 relative">
                <i className="fas fa-bell text-xl"></i>
                <span className="notification-dot absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
              </button>
            </div>

            <div className="flex items-center space-x-2">
              <img
                src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='32' height='32' viewBox='0 0 32 32'%3E%3Ccircle cx='16' cy='16' r='16' fill='%234ade80'/%3E%3Ctext x='16' y='21' text-anchor='middle' fill='white' font-family='Arial' font-size='14' font-weight='bold'%3EH%3C/text%3E%3C/svg%3E"
                alt="Avatar"
                className="w-8 h-8 rounded-full"
              />
              <span className="hidden md:block text-gray-700 font-medium">
                Hoàng Minh
              </span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
