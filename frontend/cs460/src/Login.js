import React from 'react';
import './App.css';
import { Form, Input, Button, Checkbox, DatePicker } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';

class Loginpage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
          collapsed: false,
          login: props.loggedIn,
          isLogin: true
        };
    }

    onFinishLogin = values => {
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
                var userId = data.profile.user_id; 
                this.props.login(username, userId);
            });
        })
        .catch(error => console.log('error', error));
    };

    onFinishRegister = values => {
        console.log(values)
        var payload = JSON.stringify({
            first_name: values.firstName,
            last_name: values.lastName,
            gender: values.gender,
            date_of_birth: values.dob.toDate(),
            hometown: values.hometown,
            email: values.username, 
            password: values.password
        })

        var requestOptions = {
            method: 'POST',
            body: payload,
            redirect: 'follow'
        };

        fetch("http://127.0.0.1:5000/register", requestOptions)
        .then(result => { 
            var res = result.json(); 
            res.then( data => {
                if (data.err) { console.log(data.err); return; }
                console.log(data);
                this.setState({isLogin: true});
            });
        })
        .catch(error => console.log('error', error));
    };
  
    render() {
        const { isLogin } = this.state;
        return (
            <div>
            {isLogin ? <Form
                name="normal_login"
                className="login-form"
                initialValues={{
                    remember: true,
                }}
                onFinish={this.onFinishLogin}
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
                    Or <a onClick={() => this.setState({isLogin: false})}>register now!</a>
                </Form.Item>
            </Form> :
            <Form
                name="normal_login"
                className="login-form"
                initialValues={{
                    remember: true,
                }}
                onFinish={this.onFinishRegister}
            >
                <Form.Item
                    name="firstName"
                    rules={[
                    {
                        required: true,
                        message: 'Please input your first name!',
                    },
                    ]}
                >
                    <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="First Name" />
                </Form.Item>
                <Form.Item
                    name="lastName"
                    rules={[
                    {
                        required: true,
                        message: 'Please input your last name!',
                    },
                    ]}
                >
                    <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="Last name" />
                </Form.Item>
                <Form.Item
                    name="gender"
                    rules={[
                    {
                        required: true,
                        message: 'Please input your gender!',
                    },
                    ]}
                >
                    <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="Gender" />
                </Form.Item>
                <Form.Item
                    name="dob"
                    rules={[
                    {
                        required: true,
                        message: 'Please input your date of birth!',
                    },
                    ]}
                >
                    <DatePicker placeholder="Date of birth" onChange={ (date, dateString) => {console.log(date); console.log(dateString)}}/>
                </Form.Item>
                <Form.Item
                    name="hometown"
                    rules={[
                    {
                        required: true,
                        message: 'Please input your hometown!',
                    },
                    ]}
                >
                    <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="Hometown" />
                </Form.Item>
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
                    <Button type="primary" htmlType="submit" className="login-form-button">
                    Register
                    </Button>
                    Or <a onClick={() => this.setState({isLogin: true})}>login now!</a>
                </Form.Item>
            </Form>}
            </div>
        );
    }
  }
  
  export default Loginpage;