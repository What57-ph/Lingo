import { Button, Form, Input, Typography } from "antd";
import useFormInstance from "antd/es/form/hooks/useFormInstance";

const { Title, Text } = Typography;
export const Step2 = ({ loading, countdown, formatTime, handleResendOTP }) => {

  const form = Form.useFormInstance();

  const handleOTPChange = (value) => {
    form.setFieldValue("otp", value);
  }

  return (
    <>
      <Title level={5} className="!flex !text-center !justify-center !mb-6">
        Nhập mã xác thực
      </Title>

      <Form.Item
        name="otp"
        className="!font-semibold !text-lg"
        rules={[
          { required: true, message: "Vui lòng nhập mã xác thực" },
          { len: 6, message: "Mã OTP phải có 6 chữ số" }
        ]}
      >
        <div className="flex justify-center">
          <Input.OTP
            size="large"
            length={6}
            inputMode="numeric"
            onChange={handleOTPChange}
            style={{ gap: "12px", fontSize: "20px", height: "56px" }}
          />
        </div>
      </Form.Item>

      {countdown > 0 && (
        <div className="text-center mb-4">
          <Text className="text-green-600 font-semibold">
            Gửi lại OTP sau: {formatTime(countdown)}
          </Text>
        </div>
      )}

      {countdown === 0 && (
        <div className="text-center mb-6">
          <Text className="text-gray-600">Bạn không nhận được OTP? </Text>
          <Button
            type="link"
            onClick={handleResendOTP}
            loading={loading}
            className="!p-0 !h-auto !text-blue-600 !font-semibold"
          >
            Gửi lại
          </Button>
        </div>
      )}

      <Form.Item label={null} className="!mt-10">
        <Button
          type="primary"
          htmlType="submit"
          block
          className="!text-lg !h-12 !rounded-2xl !bg-blue-600 hover:!bg-blue-700 !font-semibold"
        >
          Xác nhận
        </Button>
      </Form.Item>
    </>
  );
}