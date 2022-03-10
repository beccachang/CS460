import React from 'react';
import './index.css';
import { Table, PageHeader, Button, Input, Popover } from 'antd';
import qs from 'qs';
import {
    PlusOutlined
} from '@ant-design/icons';

const {Search} = Input;

const getRandomuserParams = params => ({
  results: params.pagination.pageSize,
  page: params.pagination.current,
  ...params,
});

class AlbumsList extends React.Component {
  state = {
    data: [],
    pagination: {
      current: 1,
      pageSize: 10,
    },
    loading: false,
    newAlbumName: null,
  };

  columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      sorter: true,
      render: (name, record) => <a onClick={() => this.props.viewAlbum(record)}>{name.first} {name.last}</a>,
      width: '20%',
    },
    {
      title: 'Creation Date',
      dataIndex: ['dob', 'date'],
      width: '20%',
    },
  ];

  componentDidMount() {
    const { pagination } = this.state;
    this.fetch({ pagination });
  }

  handleTableChange = (pagination, filters, sorter) => {
    this.fetch({
      sortField: sorter.field,
      sortOrder: sorter.order,
      pagination,
      ...filters,
    });
  };

  createNewAlbum = () => {

  }

  fetch = (params = {}) => {
    this.setState({ loading: true });
    fetch(`https://randomuser.me/api?${qs.stringify(getRandomuserParams(params))}`)
      .then(res => res.json())
      .then(data => {
        this.setState({
          loading: false,
          data: data.results,
          pagination: {
            ...params.pagination,
            total: data.totalCount,
            // 200 is mock data, you should read it from server
            // total: data.totalCount,
          },
        });
      });
  };

  render() {
    const { data, pagination, loading } = this.state;
    const content = (
        <Input.Group compact>
            <Input style={{ width: 'calc(70%)' }} placeholder={'Album name'} onChange={event => this.setState({newAlbumName: event.target.value})}/>
            {/* To do: submit action. Check if any albums already have this name */}
            <Button onClick={() => this.createNewAlbum(this.state.newAlbumName)}>Submit</Button>
        </Input.Group>
      );
    return (
        <div>
            <PageHeader
                className="site-page-header"
                title="Albums"
                extra={[    
                    // To do: filter table data based on search term
                    <Search placeholder="Search Albums" allowClear onSearch={() => console.log("hello")} style={{ width: 200 }} />,
                    <Popover placement="bottomLeft" content={content} trigger="click">
                        <Button key="1" type="primary" icon={<PlusOutlined/>}>
                        New Album
                        </Button>
                    </Popover>
                    
                ]}
            />
            <Table
            columns={this.columns}
            rowKey={record => record.login.uuid}
            dataSource={data}
            pagination={pagination}
            loading={loading}
            onChange={this.handleTableChange}/>
        </div>
      
    );
  }
}

export default AlbumsList;