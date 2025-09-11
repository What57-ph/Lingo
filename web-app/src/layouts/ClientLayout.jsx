import React from 'react';
import { Outlet } from "react-router-dom";
import HeaderClient from '../components/client/HeaderClient';
import { Layout } from 'antd';
import { Content } from 'antd/es/layout/layout';

export default function ClientLayout() {
    return (
        <div>
            <HeaderClient />
            <Layout>
                <Content>
                    <Outlet />
                </Content>
            </Layout>

        </div>
    );
}
