import React, { useEffect } from 'react';
import './App.css';
import getWeb3 from './ultils/getWeb3';
import { Form, Input, Button, Checkbox } from 'antd';
import 'antd/dist/antd.css';
import ENS from 'ethereum-ens';

const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};

const tailLayout = {
  wrapperCol: { offset: 8, span: 16 },
};

function App() {
  useEffect(() => {
    const connectWeb3 = () => {
      window.addEventListener('load', async () => {
        getWeb3();
      });
    };
    connectWeb3();
  });

  const onFinish = async (values) => {
    let web3 = window.web3;

    let myAccount = web3.currentProvider.selectedAddress;

    if (values.ens) {
      try {
        let ens = new ENS(web3);
        let address = await ens.resolver(values.address).addr();
        console.log(address);

        await web3.eth.sendTransaction({
          from: myAccount,
          to: address,
          value: values.value * 1000000000000000000,
        });

        console.log('Success');
      } catch (error) {
        console.log(error);
      }
    } else {
      try {
        await web3.eth.sendTransaction({
          from: myAccount,
          to: values.address,
          value: values.value * 1000000000000000000,
        });

        console.log('Success');
      } catch (error) {
        console.log(error);
      }
    }
  };

  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };

  return (
    <div className='App'>
      <div className='App-header'>
        <Form
          {...layout}
          name='basic'
          initialValues={{ remember: true }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
        >
          <Form.Item
            label='Address'
            name='address'
            rules={[{ required: true, message: 'Please input your address!' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label='ETH'
            name='value'
            rules={[{ required: true, message: 'Please input your value!' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item {...tailLayout} name='ens' valuePropName='checked'>
            <Checkbox>Use ENS Domain</Checkbox>
          </Form.Item>

          <Form.Item {...tailLayout}>
            <Button type='primary' htmlType='submit'>
              Send
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
}

export default App;
