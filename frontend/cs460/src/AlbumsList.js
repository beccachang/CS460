import React from 'react';
import './index.css';
import { Table, PageHeader, Button, Input, Popover } from 'antd';
import qs from 'qs';
import {
    PlusOutlined
  } from '@ant-design/icons';

const {Search} = Input;
const columns = [
  {
    title: 'Name',
    dataIndex: 'name',
    sorter: true,
    render: name => `${name.first} ${name.last}`,
    width: '20%',
  },
  {
    title: 'Creation Date',
    dataIndex: ['dob', 'date'],
    width: '20%',
  },
];

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
  };

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

  fetch = (params = {}) => {
    this.setState({ loading: true });
    fetch(`https://randomuser.me/api?${qs.stringify(getRandomuserParams(params))}`)
      .then(res => res.json())
      .then(data => {
        console.log(data);
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
            <Input style={{ width: 'calc(70%)' }} placeholder={'Album name'} />
            {/* To do: submit action. Check if any albums already have this name */}
            <Button >Submit</Button>
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
            columns={columns}
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