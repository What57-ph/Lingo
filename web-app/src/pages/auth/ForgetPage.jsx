import { MailTwoTone } from "@ant-design/icons";
import { Button, Form, Input, Typography, Spin, message } from "antd";
import { useForm } from "antd/es/form/Form";
import { useState, useEffect } from "react";
import { Step2 } from "../../components/auth/Step2";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { changePassword, checkOtp, requestOtp, setLoading } from "../../slice/authentication";
import { toast } from "react-toastify";

const { Title, Text } = Typography; // Đưa ra ngoài

const Step1 = ({ loading, handleSendOTP }) => (
  <>
    <Form.Item
      label="Địa chỉ email"
      name="email"
      className="!font-semibold !text-lg"
      rules={[
        { required: true, message: "Vui lòng nhập email hoặc tên đăng nhập" },
        { type: "email", message: "Email không hợp lệ" }
      ]}
    >
      <Input
        prefix={<MailTwoTone twoToneColor="#2563eb" className="!mr-1" />}
        placeholder="Nhập email của bạn"
        size="large"
        className="!pl-4 !py-3"
      />
    </Form.Item>

    <Form.Item label={null} className="!mt-7">
      <Button
        type="primary"
        onClick={handleSendOTP}
        block
        loading={loading}
        className="!text-lg !h-13 !rounded-2xl !bg-blue-600 hover:!bg-blue-700 !font-semibold"
      >
        Gửi liên kết đặt lại
      </Button>
    </Form.Item>
  </>
);


const ForgetPage = () => {
  const [form] = useForm();
  const [step, setStep] = useState(1);
  // const [loading, setLoading] = useState(false);
  const { loading } = useSelector(state => state.authentication);
  const [countdown, setCountdown] = useState(0);
  const navigate = useNavigate();
  const dispatch = useDispatch();

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

  const onFinish = async values => {
    console.log("Success:", values);
    try {
      const response = await dispatch(checkOtp(values)).unwrap();
      console.log(response);
      toast.success("Xác thực thành công");
      navigate("/auth/reset", { state: { "email": values.email } });
    } catch (err) {
      toast.error("Xác thực thất bại");
      console.log("Xác thực: ", err);
    }
  };

  const onFinishFailed = errorInfo => {
    console.log("Failed:", errorInfo);
  };

  const handleSendOTP = async () => {
    try {
      await form.validateFields(["email"]);
      const response = await dispatch(requestOtp({ email: form.getFieldValue("email"), reset: true })).unwrap();
      console.log(response);
      setStep(2);
      setCountdown(60);
      message.success("Mã OTP đã được gửi đến email của bạn");
    } catch (err) {
      setLoading(false);
      console.log("Validation failed:", err);
    }
  };

  const handleResendOTP = async () => {
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setLoading(false);
    setCountdown(60);
    message.success("Mã OTP mới đã được gửi lại");
  };

  return (
    <Spin size="large" spinning={loading}>
      <Form
        name="forget"
        form={form}
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
  );
};

export default ForgetPage;