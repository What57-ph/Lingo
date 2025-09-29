import { LockOutlined } from "@ant-design/icons";
import { Button, Checkbox, Form, Input } from "antd"
const ResetPage = () => {
  const onFinish = values => {
    console.log('Success:', values);
  };
  const onFinishFailed = errorInfo => {
    console.log('Failed:', errorInfo);
  };

  return (
    <>
      <Form name="basic"
        initialValues={{ remember: true }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
        layout="vertical"
        hideRequiredMark
      >

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

        <Form.Item label={null} className="!mt-6">
          <Button type="primary" htmlType="submit" block className="lift-on-hover !text-lg !h-12 !rounded-2xl !bg-blue-600 hover:!bg-blue-700">
            Đặt lại mật khẩu
          </Button>
        </Form.Item>
      </Form>

    </>
  )
}
export default ResetPage