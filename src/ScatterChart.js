import React, { useState } from 'react'
import { Card, Modal, Button } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Tooltip,
    Legend,
} from 'chart.js';
import { Scatter } from 'react-chartjs-2';
import faker from 'faker';

const { Meta } = Card;

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Tooltip,
    Legend
);

// Define the chart options
const options = {
    scales: {
        y: {
            beginAtZero: true,
        },
    },
};

const ScatterChart = () => {

    const [dataPoints, setDataPoints] = useState([]);
    const [visible, setVisible] = useState(false);
    const [selectedDataPoint, setSelectedDataPoint] = useState(null);

    const addDataPoint = (dataPoint) => {
        setDataPoints([...dataPoints, { ...dataPoint, _id: Date.now() }]);
    };

    const deleteDataPoint = (_id) => {
        setDataPoints(dataPoints.filter((point) => point._id !== _id));
        setVisible(false);
    };

    const editDataPoint = (updatedPoint) => {
        setDataPoints(
            dataPoints.map((point) =>
                point._id === selectedDataPoint._id ? { ...point, ...updatedPoint } : point
            )
        );
        setVisible(false);
    };




    const data = {
        datasets: [
            {
                label: 'A dataset',
                data: Array.from({ length: 100 }, () => ({
                    x: faker?.datatype?.number({ min: -100, max: 100 }),
                    y: faker?.datatype?.number({ min: -100, max: 100 }),
                })),
                backgroundColor: 'rgba(255, 99, 132, 1)',
            },
        ],
    };


    return (
        <>
            <div className='container-fluid'>
                <div className='row'>
                    <h4>List Data</h4>
                    <div className='col-md-4 col-12'>
                        <Card
                            cover={
                                <Scatter options={options} data={data} />
                            }
                            actions={[
                                <Button type="primary" icon={<EditOutlined key="edit" />} size={"small"} >Edit</Button>,
                                <Button type="primary" icon={<DeleteOutlined key="delete" />} size={"small"} >Delete</Button>,
                            ]}
                        >
                            <Meta
                                title="Card title"
                            />
                        </Card>
                    </div>
                    <div className='col-md-4 col-12'>
                        <Card
                            cover={
                                <Scatter options={options} data={data} />

                            }
                            actions={[
                                <Button type="primary" icon={<EditOutlined key="edit" />} size={"small"} onClick={() => setVisible(true)} >Edit</Button>,
                                <Button type="primary" icon={<DeleteOutlined key="delete" />} size={"small"} onClick={()=> setVisible(true)}>Delete</Button>,
                            ]}
                        >
                            <Meta
                                title="Card title"
                            />
                        </Card>
                    </div>
                    <div className='col-md-4 col-12'>
                        <Card

                            cover={
                                <Scatter options={options} data={data} />
                            }
                            actions={[
                                <Button type="primary" icon={<EditOutlined key="edit" />} size={"small"} >Edit</Button>,
                                <Button type="primary" icon={<DeleteOutlined key="delete" />} size={"small"} >Delete</Button>,
                            ]}
                        >
                            <Meta
                                title="Card title"
                            />
                        </Card>
                    </div>
                </div>
            </div>

            <Modal
                title="Edit or Delete"
                visible={visible}
                onCancel={() => setVisible(false)}
                footer={null}
            >
                <p>{selectedDataPoint?.label}</p>
                <Button type="primary" onClick={() => editDataPoint({ ...selectedDataPoint, x: selectedDataPoint.x + 1 })}>
                    Edit (Example: Increment X)
                </Button>
                <Button style={{ marginLeft: 8 }} danger onClick={() => deleteDataPoint(selectedDataPoint._id)}>
                    Delete
                </Button>
            </Modal>
        </>
    )
}

export default ScatterChart