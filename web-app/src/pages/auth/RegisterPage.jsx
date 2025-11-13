import { AppleFilled, FacebookFilled, FacebookOutlined, GoogleOutlined, LockFilled, LockOutlined, LockTwoTone, MailFilled, MailOutlined, MailTwoTone, PhoneOutlined, PhoneTwoTone, UserAddOutlined, UserOutlined } from "@ant-design/icons";
import { Button, Checkbox, Form, Input, message, Spin, Typography } from "antd"
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { register, requestOtp } from "../../slice/authentication";
import { useForm } from "antd/es/form/Form";
import { Step2 } from "../../components/auth/Step2";
import { toast } from "react-toastify";


const Step1 = ({ handleSendOTP }) => {
  return (
    <>
      <Form.Item
        label="Tên tài khoản"
        name="username" className="!font-semibold !text-lg  "
        rules={[
          { required: true, message: "Vui lòng nhập tên tài khoản" },
        ]}
      >
        <Input
          prefix={<UserOutlined twoToneColor="#2563eb" className="!mr-1" />}
          placeholder="Nhập tên tài khoản của bạn  " size="large"
          className="!pl-4 !py-3 lift-on-focus"
        />
      </Form.Item>

      <Form.Item
        label="Email"
        name="email" className="!font-semibold !text-lg"
        rules={[
          { required: true, message: "Vui lòng nhập email" },
          { type: "email", message: "Email không hợp lệ" },
        ]}
      >
        <Input
          prefix={<MailOutlined twoToneColor="#2563eb" className="!mr-1" />}
          placeholder="Nhập email của bạn" size="large"
          className="!pl-4 !py-3 lift-on-focus"
        />
      </Form.Item>

      <Form.Item
        label="Số điện thoại"
        name="phone" className="!font-semibold !text-lg"
        rules={[
          { required: true, message: "Vui lòng nhập số điện thoại" },
          { pattern: /^0\d{9}$/, message: "Số điện thoại không hợp lệ" }
        ]}

      >
        <Input
          prefix={<PhoneOutlined twoToneColor="#2563eb" className="!mr-1" />}
          placeholder="Nhập số điện thoại" size="large"
          className="!pl-4 !py-3 lift-on-focus"
        />
      </Form.Item>

      <Form.Item
        label="Mật khẩu"
        name="password" className="!font-semibold !text-lg !mb-2"
        rules={[{ message: "Vui lòng nhập mật khẩu" }]}

      >
        <Input.Password
          prefix={<LockOutlined twoToneColor="#2563eb" />}
          placeholder="Tạo mật khẩu" size="large"
          className="!pl-4 !py-3 lift-on-focus "
        />
      </Form.Item>
      <div class="">
        <div class="bg-gray-200 rounded-full h-1">
          <div class=" bg-gray-300" ></div>
        </div>
        <p class="text-xs text-gray-500 mt-2">Độ mạnh mật khẩu</p>
      </div>

      <Form.Item
        label="Xác nhận mật khẩu"
        name="cfPassword" className="!font-semibold !text-lg"
        rules={[
          { required: true, message: "Vui lòng xác nhận mật khẩu" },
          ({ getFieldValue }) => ({
            validator(_, value) {
              if (!value || getFieldValue("password") === value) {
                return Promise.resolve();
              }
              return Promise.reject(new Error("Mật khẩu xác nhận không khớp"));
            }
          })
        ]}


      >
        <Input.Password
          prefix={<LockOutlined twoToneColor="#2563eb" />}
          placeholder="Xác nhận mật khẩu" size="large"
          className="!pl-4 !py-3 lift-on-focus"
        />
      </Form.Item>
      <div className="space-y-4">
        <div className="flex items-start space-x-3">
          <Checkbox
            id="terms"
            className="!mr-2"
            required
          />
          <label
            htmlFor="terms"
            className="text-sm text-gray-600 leading-relaxed"
          >
            <span id="terms-text">Tôi đồng ý với </span>
            <a
              href="#"
              className="text-blue-600 hover:text-blue-800 font-medium"
              id="terms-link"
            >
              Điều khoản sử dụng
            </a>
            <span id="and-text"> và </span>
            <a
              href="#"
              className="text-blue-600 hover:text-blue-800 font-medium"
              id="privacy-link"
            >
              Chính sách bảo mật
            </a>
          </label>
        </div>

        <div className="flex items-start space-x-3">
          <Checkbox id="newsletter" className="!mr-2" />
          <label
            htmlFor="newsletter"
            className="text-sm text-gray-600"
            id="newsletter-text"
          >
            Nhận thông tin về khóa học và ưu đãi mới
          </label>
        </div>
      </div>

      <Form.Item label={null} className="!mt-6">
        <Button type="primary" onClick={handleSendOTP} block className="lift-on-hover !text-lg !h-12 !rounded-2xl !bg-blue-600 hover:!bg-blue-700">
          Tiếp tục
        </Button>
      </Form.Item>
    </>
  )
}


const RegisterPage = () => {

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.authentication);
  const [form] = useForm();
  const [step, setStep] = useState(1);
  const { Title } = Typography;

  const onFinish = async values => {
    // if (!values.username || !values.email || !values.phone || !values.password || !values.otp) {
    //   toast.error("Vui lòng điền đầy đủ thông tin");
    //   return;
    // }

    try {
      await dispatch(register(values)).unwrap();
      toast.success("Đăng ký thành công");
      navigate("/auth/login")
    } catch (err) {
      toast.error("Đăng ký thất bại");
      console.log(err);
    }
  };
  const onFinishFailed = errorInfo => {
    console.log('Failed:', errorInfo);
  };

  const [countdown, setCountdown] = useState(0);

  useEffect(() => {
    let timer;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [countdown]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSendOTP = async () => {
    try {
      await form.validateFields(["username", "email", "phone", "password", "cfPassword"]);
      const response = await dispatch(requestOtp({ email: form.getFieldValue("email"), reset: false })).unwrap();
      console.log(response);
      setStep(2);
      setCountdown(60);
      message.success("Mã OTP đã được gửi đến email của bạn");
    } catch (err) {
      console.log("Validation failed:", err);
    }
  };

  const handleResendOTP = async () => {
    const response = await dispatch(requestOtp({ email: form.getFieldValue("email"), reset: false })).unwrap();
    console.log(response);
    toast.success("Mã OTP mới đã được gửi lại");
    setCountdown(60);
    message.success("Mã OTP mới đã được gửi lại");
  };





  return (
    <>
      <Spin size="large" spinning={loading}>
        <Form
          name="basic"
          form={form}
          preserve={true}
          initialValues={{ remember: true }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
          layout="vertical"
          hideRequiredMark
        >
          <div style={{ display: step === 1 ? 'block' : 'none' }}>
            <Step1 handleSendOTP={handleSendOTP} />
          </div>

          {/* Step 2 - Ẩn khi step === 1 nhưng vẫn giữ trong DOM */}
          <div style={{ display: step === 2 ? 'block' : 'none' }}>
            <Step2
              loading={loading}
              countdown={countdown}
              formatTime={formatTime}
              handleResendOTP={handleResendOTP}
            />
          </div>
        </Form>
      </Spin>
    </>
  )
}
export default RegisterPage