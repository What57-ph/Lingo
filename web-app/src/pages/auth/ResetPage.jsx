import { LockOutlined } from "@ant-design/icons";
import { Button, Checkbox, Form, Input, Spin } from "antd"
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { changePassword } from "../../slice/authentication";
import { toast } from "react-toastify";
const ResetPage = () => {

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const { loading } = useSelector(state => state.authentication);
  const { email } = location.state || "";

  const onFinish = async values => {
    values = { email, ...values };
    console.log('Success:', values);
    try {
      await dispatch(changePassword(values)).unwrap();
      toast.success("Đổi mật khẩu thành công");
      navigate("/auth/login")
    } catch (err) {
      toast.success("Đổi mật khẩu thất bại");
      console.log(err);
    }
  };
  const onFinishFailed = errorInfo => {
    console.log('Failed:', errorInfo);
  };

  return (
    <>
      <Spin spinning={loading}>
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
      </Spin>
    </>
  )
}
export default ResetPage