import { Button, Card, Select, Space, Tag, Typography, Input, Avatar } from "antd"
import Brc from "../BreadCum"
import Header from "./ScratchHeader"
import { BulbFilled, CaretRightFilled, ClockCircleFilled, ClockCircleOutlined, CommentOutlined, CustomerServiceOutlined, DislikeFilled, ExclamationCircleOutlined, EyeFilled, HeartOutlined, LikeFilled, PlayCircleFilled, QuestionCircleFilled, QuestionCircleOutlined, ReadFilled, ReadOutlined, ShareAltOutlined, StarFilled, TeamOutlined, ThunderboltOutlined, UnorderedListOutlined, UserOutlined, WechatFilled } from '@ant-design/icons';
import BoxComment from "../../components/tests/BoxComment";
import RightSider from "../../components/tests/RightSider"

const AfterTestPage = () => {
  const { Text } = Typography;
  return (
    <div className="bg-gray-50">

      <Header />

      {/* main  */}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 mt-5">
        <div className="grid grid-cols-1 lg:grid-cols-10 gap-8">
          <div className="lg:col-span-7 ">

            {/* action */}

            <Card className="!shadow-lg !pb-3">



            </Card>

            {/* comment */}
            <BoxComment />
          </div>

          <div className="lg:col-span-3 space-y-6">
            <RightSider />
          </div>

        </div>
      </div>





    </div>
  )
}
export default AfterTestPage