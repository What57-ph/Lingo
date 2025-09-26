import { MailTwoTone } from "@ant-design/icons"
import { Button, Form, Input } from "antd"

const ForgetPage = () => {

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
        hideRequiredMark
        layout="vertical">

        <Form.Item
          label="Địa chỉ email"
          name="username" className="!font-semibold !text-lg"
          rules={[
            { required: true, message: "Vui lòng nhập email hoặc tên đăng nhập" },
          ]}
        >
          <Input
            prefix={<MailTwoTone twoToneColor="#2563eb" className="!mr-1" />}
            placeholder="Nhập email của bạn" size="large"
            className="!pl-4 !py-3 lift-on-focus"
          />
        </Form.Item>

        <Form.Item label={null} className="!mt-7">
          <Button type="primary" htmlType="submit" block className="lift-on-hover !text-lg !h-13 !rounded-2xl !bg-blue-600 hover:!bg-blue-700 !font-semibold">
            Gửi liên kết đặt lại
          </Button>
        </Form.Item>
      </Form>
    </>
  )
}
export default ForgetPage