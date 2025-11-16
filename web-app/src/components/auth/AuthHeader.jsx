
import { KeyOutlined } from "@ant-design/icons";
import { FaKey } from "react-icons/fa";
import { useLocation } from "react-router-dom";

const AuthHeader = () => {
  const location = useLocation();

  const content = {
    "/auth/login": {
      label: 'Đăng nhập Preps Ielts',
      welcome: 'Chào mừng bạn trở lại!'
    },
    "/auth/register": {
      label: 'Đăng ký Preps Ielts',
    },
    "/auth/forget": {
      label: 'Đặt lại mật khẩu',
      welcome: 'Nhập email của bạn và chúng tôi sẽ gửi liên kết đặt lại mật khẩu'
    },
    "/auth/reset": {
      label: 'Đặt lại mật khẩu',
      welcome: 'Nhập mật khẩu mới của bạn'
    },
  };

  const { label, welcome } = content[location.pathname] || {
    label: ' Lingo',
    welcome: '!'
  }

  return (
    <div class="text-center mb-8">
      <div class="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-2xl mb-4">
        <span class="text-2xl font-bold text-[#FFFFFF]">{location.pathname === "/auth/forget" ? <FaKey /> : "P"}</span>
      </div>
      <h1 class="text-2xl !font-bold text-gray-800" >{label}</h1>
      <p class="text-gray-600 mt-2" >{welcome}</p>

      {/* form input */}
    </div>
  )
}
export default AuthHeader