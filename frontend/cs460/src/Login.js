import React from 'react';
import './App.css';
import { Form, Input, Button, Checkbox } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';

class Loginpage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
          collapsed: false,
          login: props.loggedIn
        };
    }

    onFinish = values => {
        var payload = JSON.stringify({
            email: values.username, 
            password: values.password
        })

        var requestOptions = {
            method: 'POST',
            body: payload,
            redirect: 'follow'
        };

        fetch("http://127.0.0.1:5000/login", requestOptions)
        .then(result => { 
            var res = result.json(); 
            res.then( data => {
                if (data.err) { console.log(data.err); return; }
                var username = data.profile.email;
                var userID = data.profile.user_id; 
                this.props.login(username, userID);
            });
        })
        .catch(error => console.log('error', error));
    };
  
    render() {
        return (
            <Form
                name="normal_login"
                className="login-form"
                initialValues={{
                    remember: true,
                }}
                onFinish={this.onFinish}
            >
                <Form.Item
                    name="username"
                    rules={[
                    {
                        required: true,
                        message: 'Please input your Username!',
                    },
                    ]}
                >
                    <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="Username" />
                </Form.Item>
                <Form.Item
                    name="password"
                    rules={[
                    {
                        required: true,
                        message: 'Please input your Password!',
                    },
                    ]}
                >
                    <Input
                    prefix={<LockOutlined className="site-form-item-icon" />}
                    type="password"
                    placeholder="Password"
                    />
                </Form.Item>
                <Form.Item>
                    <Form.Item name="remember" valuePropName="checked" noStyle>
                    <Checkbox>Remember me</Checkbox>
                    </Form.Item>

                    <a className="login-form-forgot" href="">
                    Forgot password
                    </a>
                </Form.Item>

                <Form.Item>
                    <Button type="primary" htmlType="submit" className="login-form-button">
                    Log in
                    </Button>
                    Or <a href="">register now!</a>
                </Form.Item>
            </Form>
        );
    }
  }
  
  export default Loginpage;