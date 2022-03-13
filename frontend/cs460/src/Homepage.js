import React from 'react';
import './App.css';
import { Layout, Menu } from 'antd';
import {
  BookOutlined,
  TeamOutlined,
  UserOutlined,
  LogoutOutlined,
  HomeOutlined
} from '@ant-design/icons';

import Feed from './Feed';
import Profile from './Profile';
import AlbumsList from './AlbumsList';
import FriendsList from './FriendsList';
import UserAlbumPage from './UserAlbumPage';
import ExternalAlbumPage from './ExternalAlbumPage';

const { Header, Content, Footer, Sider } = Layout;
const { SubMenu } = Menu;

class Homepage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showingPage: 'home',
      collapsed: false,
      loadedProfile: null,
      viewingAlbum: null
    };
  }


  onCollapse = collapsed => {
    this.setState({ collapsed });
  };

  pageChange = newPage => {
    this.setState({showingPage: newPage});
  }

  visitProfilePage = (account) => {
    this.setState({
      showingPage: 'profile', 
      loadedProfile: account
    });
  }

  visitAlbumPage = (album) => {
    this.setState({
      showingPage: 'album', 
      viewingAlbum: album
    });
  }

  visitExternalAlbumPage = () => {
    this.setState({showingPage: 'externalAlbum'})
  }

  render() {
    const { collapsed, showingPage, loadedProfile, viewingAlbum } = this.state;
    return (
      <Layout style={{ minHeight: '100vh' }}>
        <Sider collapsible collapsed={collapsed} onCollapse={this.onCollapse}>
          <div className="logo" />
          <Menu theme="dark" defaultSelectedKeys={['0']} mode="inline">
            <Menu.Item key="0" icon={<HomeOutlined />} onClick={() => this.setState({showingPage: 'home'})}>
              Home
            </Menu.Item>
            <Menu.Item key="1" icon={<UserOutlined />} >
              Profile
            </Menu.Item>
            <Menu.Item key="2" icon={<BookOutlined />} onClick={() => this.setState({showingPage: 'albums'})}>
              Albums
            </Menu.Item>
            <Menu.Item key="3" icon={<TeamOutlined />} onClick={() => this.setState({showingPage: 'friends'})}>
              Friends
            </Menu.Item>
            <SubMenu key="sub1" icon={<UserOutlined />} title="User">
              <Menu.Item key="4">Tom</Menu.Item>
              <Menu.Item key="5">Bill</Menu.Item>
              <Menu.Item key="6">Alex</Menu.Item>
            </SubMenu>
            <SubMenu key="sub2" icon={<TeamOutlined />} title="Team">
              <Menu.Item key="7">Team 1</Menu.Item>
              <Menu.Item key="8">Team 2</Menu.Item>
            </SubMenu>
            <Menu.Item key="9" icon={<LogoutOutlined />}>
              Logout
            </Menu.Item>
          </Menu>
        </Sider>
        <Layout className="site-layout">
          <Header className="site-layout-background" style={{ padding: 0 }} />
          <Content style={{ margin: '0 16px' }}>
            <div className="site-layout-background" style={{ padding: 24, minHeight: 360 }}>
              {showingPage === 'home' ? <Feed/> : null}
              {showingPage === 'profile' ? <Profile username={this.props.username} userID={this.props.userID} profile={loadedProfile} visitExternalAlbumPage={() => this.visitExternalAlbumPage()}/> : null}
              {showingPage === 'album' ? <UserAlbumPage album={viewingAlbum} username={this.props.username} userID={this.props.userID}/> : null}
              {showingPage === 'albums' ? <AlbumsList username={this.props.username} userID={this.props.userID} viewAlbum={album => this.visitAlbumPage(album)}/> : null}
              {showingPage === 'friends' ? <FriendsList username={this.props.username} userID={this.props.userID} viewProfile={account => this.visitProfilePage(account)}/> : null}
              {showingPage === 'externalAlbum' ? <ExternalAlbumPage username={this.props.username} userID={this.props.userID} /> : null}
            </div>
          </Content>
          <Footer style={{ textAlign: 'center' }}>CS460 Project :)</Footer>
        </Layout>
      </Layout>
    );
  }
}

export default Homepage;