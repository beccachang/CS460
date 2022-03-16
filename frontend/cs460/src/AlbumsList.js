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
    fullData: [],
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
      render: (name, record) => <a onClick={() => this.props.viewAlbum(record)}>{name}</a>,
      width: '20%',
    },
    {
      title: 'Creation Date',
      dataIndex: ['date'],
      render: (date) => new Date(date).toLocaleDateString(),
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
    // VIVIEN: Here's my shot at making a new album - it does work :) 
    // the endpoint is /albums/<int:user_id> 

    var payload = JSON.stringify({
      name: this.state.newAlbumName,
      userID: this.props.userId
    });

    var requestOptions = {
        method: 'POST',
        body: payload,
        redirect: 'follow'
    };

    this.setState({ loading: true });
    fetch("/album/new", requestOptions)
    .then(result => { 
        var res = result.json(); 
        res.then( data => {
            if (data.err) { console.log(data.err); return; }
            // This gives us the new album - let's add it to the data 
            var updatedData = this.state.fullData
            updatedData.push(data.albums);
            var params = {};
            this.setState({
              loading: false,
              fullData: updatedData, 
              data: updatedData,
              pagination: {
                ...params.pagination,
                total: data.albums.length,
              }
            });
        });
    })
    .catch(error => console.log('error', error));


  }

  fetch = (params = {}) => {
    this.setState({ loading: true });
    
    // VIVIEN: Listing actual albums - I assumed this is for the user
    fetch(`/albums/${this.props.userId}`)
      .then(res => res.json())
      .then(data => {
          if (data.err) { console.log(data.err); return; } 
          this.setState({
            loading: false,
            data: data.albums,
            fullData: data.albums,
            pagination: {
              ...params.pagination,
              total: data.albums.length,
            }
          });
        });
  };

  filterTable = (value) => {
    value = value.toLowerCase();
    var filterData = this.state.fullData.filter(v => {
      return v.date.indexOf(value) > -1 ||  v.name.indexOf(value) > -1;
    });
    this.setState({data: filterData});
  };

  clearFilter = (value) => {
    if (value == "") {
      this.setState({data: this.state.fullData});
    }
  }

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
                    <Search placeholder="Search Albums" allowClear onChange={event => this.clearFilter(event.target.value)} onSearch={str => this.filterTable(str)} style={{ width: 200 }} />,
                    <Popover placement="bottomLeft" content={content} trigger="click">
                        <Button key="1" type="primary" icon={<PlusOutlined/>}>
                        New Album
                        </Button>
                    </Popover>
                    
                ]}
            />
            <Table
            columns={this.columns}
            rowKey={record => record.id}
            dataSource={data}
            pagination={pagination}
            loading={loading}
            onChange={this.handleTableChange}/>
        </div>
      
    );
  }
}

export default AlbumsList;