import React from 'react';
import './App.css';
import { Layout, Menu } from 'antd';
import {
  BookOutlined,
  TeamOutlined,
  LogoutOutlined,
  HomeOutlined,
  CommentOutlined,
  SmileOutlined,
  TagOutlined,
  SearchOutlined
} from '@ant-design/icons';

import Feed from './Feed';
import Profile from './Profile';
import AlbumsList from './AlbumsList';
import FriendsList from './FriendsList';
import UserAlbumPage from './UserAlbumPage';
import ExternalAlbumPage from './ExternalAlbumPage';
import PeopleSearch from './PeopleSearch';
import CommentSearch from './CommentSearch';
import TagSearch from './TagSearch';

const { Header, Content, Footer, Sider } = Layout;
const { SubMenu } = Menu;

class Homepage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showingPage: 'home',
      collapsed: false,
      loadedProfile: null,
      viewingAlbum: null,
      externalUserId: null,
      albumId: null,
      albumName: null,
    };
  }


  onCollapse = collapsed => {
    this.setState({ collapsed });
  };

  pageChange = newPage => {
    this.setState({showingPage: newPage});
  }

  visitProfilePage = (userId) => {
    this.setState({
      showingPage: 'profile', 
      externalUserId: userId
    });
  }

  visitAlbumPage = (album) => {
    this.setState({
      showingPage: 'album', 
      viewingAlbum: album
    });
  }

  visitExternalAlbumPage = (albumId, albumName) => {
    console.log(albumId)
    this.setState({showingPage: 'externalAlbum', albumId: albumId, albumName: albumName})
  }

  render() {
    const { collapsed, showingPage, loadedProfile, viewingAlbum, externalUserId, albumId, albumName } = this.state;
    const { guest } = this.props;
    return (
      <Layout style={{ minHeight: '100vh' }}>
        <Sider collapsible collapsed={collapsed} onCollapse={this.onCollapse}>
          <div className="logo" />
          <Menu theme="dark" defaultSelectedKeys={['0']} mode="inline">
            <Menu.Item key="0" icon={<HomeOutlined />} onClick={() => this.setState({showingPage: 'home'})}>
              Home
            </Menu.Item>
            {guest ? null : <Menu.Item key="2" icon={<BookOutlined />} onClick={() => this.setState({showingPage: 'albums'})}>
              Albums
            </Menu.Item>}
            {guest ? null : <Menu.Item key="3" icon={<TeamOutlined />} onClick={() => this.setState({showingPage: 'friends'})}>
              Friends
            </Menu.Item> }
            <SubMenu key="sub1" icon={<SearchOutlined />} title="Searches">
              <Menu.Item icon={<SmileOutlined />} key="4" onClick={()=>this.setState({showingPage:'peopleSearch'})} >People</Menu.Item>
              <Menu.Item icon={<TagOutlined />} key="5" onClick={()=>this.setState({showingPage:'tagSearch'})}>Tags</Menu.Item>
              <Menu.Item icon={<CommentOutlined /> } key="6" onClick={()=>this.setState({showingPage:'commentSearch'})}>Comments</Menu.Item>
            </SubMenu>
            {guest ? null : <Menu.Item key="9" icon={<LogoutOutlined/>} onClick={this.props.logout}>
              Logout
            </Menu.Item>}
          </Menu>
        </Sider>
        <Layout className="site-layout">
          <Header className="site-layout-background" style={{ padding: 0 }} />
          <Content style={{ margin: '0 16px' }}>
            <div className="site-layout-background" style={{ padding: 24, minHeight: 360 }}>
              {showingPage === 'home' ? <Feed username={this.props.username} userId={this.props.userId} /> : null}
              {showingPage === 'profile' ? <Profile guest={guest} username={this.props.username} userId={this.props.userId} profileUserId={externalUserId} visitExternalAlbumPage={(i, n) => this.visitExternalAlbumPage(i,n)}/> : null}
              {showingPage === 'album' ? <UserAlbumPage album={viewingAlbum} username={this.props.username} userId={this.props.userId}/> : null}
              {showingPage === 'albums' ? <AlbumsList username={this.props.username} userId={this.props.userId} viewAlbum={album => this.visitAlbumPage(album)}/> : null}
              {showingPage === 'friends' ? <FriendsList username={this.props.username} userId={this.props.userId} viewProfile={account => this.visitProfilePage(account)}/> : null}
              {showingPage === 'externalAlbum' ? <ExternalAlbumPage username={this.props.username} userId={this.props.userId} albumId={albumId} albumName={albumName} externalUserId={externalUserId}/> : null}
              {showingPage === 'peopleSearch' ? <PeopleSearch viewProfile={e => this.visitProfilePage(e)}/> : null}
              {showingPage === 'commentSearch' ? <CommentSearch/> : null}
              {showingPage === 'tagSearch' ? <TagSearch/> : null}
            </div>
          </Content>
          <Footer style={{ textAlign: 'center' }}>CS460 Project :)</Footer>
        </Layout>
      </Layout>
    );
  }
}

export default Homepage;