import React, { useState, useCallback, useEffect } from 'react'
import { Card, Modal, Button, Input, notification } from 'antd';
import {
    EditOutlined, DeleteOutlined, CheckCircleOutlined,
} from '@ant-design/icons';
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
import API_PATH from "./Constants/api-paths";
import DeleteModal from './component/DeleteModal';


ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Tooltip,
    Legend
);


const ScatterChart = ({ listData, ChartList }) => {
    const [selectedDataPoint, setSelectedDataPoint] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [editX, setEditX] = useState('');
    const [editY, setEditY] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const [chartId, setChartId] = useState("")
    const [isModalOpen, setIsModalOpen] = useState(false);

    const openModal = (_id) => {
        setChartId(_id)
        setIsModalOpen(true);
    };
    const handleOk = () => {
        console.log('OK Click');
        setIsModalOpen(false);
    };

    const handleCancel = () => {
        console.log('Cancel Click');
        setIsModalOpen(false);
    };

    const getChartOptions = (datapoints, chartId) => ({
        scales: {
            y: {
                beginAtZero: true,
            },
        },
        onClick: (event, chartElements, chart) => {
            if (chartElements.length > 0) {
                const { index } = chartElements[0];
                const clickedDataPoint = datapoints[index];
                console.log(clickedDataPoint, "clickedDataPoint");
                setSelectedDataPoint(clickedDataPoint);
                setModalVisible(true);
                setChartId(chartId)
                console.log(chartId, "chartId");
            }
        },
    });

    const handleDelete = async () => {
        console.log("Deleting data point:", selectedDataPoint);
        try {
            const chartObjFound = await listData.find((val) => val._id === chartId)
            console.log("chartObjFound", chartObjFound)

            const deletedDatapointRes = await chartObjFound.datapoints.filter((val) => val._id !== selectedDataPoint._id)
            console.log("deletedDatapointRes", deletedDatapointRes)

            const updatedPayload = {
                datapoints: deletedDatapointRes
            };

            const finalRes = await fetch(`${API_PATH.UPDATE}/${chartId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedPayload),
            });

            if (finalRes) {
                setModalVisible(false);
                await ChartList();
                notification.success({
                    message: "DataPoint deleted successfully.",
                    icon: <CheckCircleOutlined style={{ color: "#fff" }} />,
                    style: {
                        backgroundColor: "#2ecc71",
                        color: "#fff",
                        border: "1px solid #52c41a",
                    },
                    duration: 5,
                    placement: "topRight",
                });
            }
        } catch (error) {
            console.log("delete datapoint error", error)
        }
    };

    useEffect(() => {
        if (selectedDataPoint) {
            setEditX(selectedDataPoint.x);
            setEditY(selectedDataPoint.y);
        }
    }, [selectedDataPoint, modalVisible]);


    const handleEditDataPoints = async () => {

        if (!selectedDataPoint || !selectedDataPoint?._id) {
            console.error('No data point selected for editing.');
            return;
        }

        const updatePayload = {
            mainId: chartId,
            subId: selectedDataPoint?._id,
            x: parseInt(editX),
            y: parseFloat(editY),
        };

        try {
            const res = await fetch(API_PATH.UPDATEDATAPOINTS, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatePayload),
            });

            if (res) {
                ChartList()
                setModalVisible(false);
                setIsEditing(false);
                notification.success({
                    message: "DataPoint updated successfully.",
                    icon: <CheckCircleOutlined style={{ color: "#fff" }} />,
                    style: {
                        backgroundColor: "#2ecc71",
                        color: "#fff",
                        border: "1px solid #52c41a",
                    },
                    duration: 5,
                    placement: "topRight",
                });

            }

        } catch (error) {
            console.error('Failed to edit data point:', error);
        }
    };


    return (
        <>
            <div className='container-fluid'>
                <div className='row'>
                    <h5>List Data</h5>
                    {listData.map((item, index) => {
                        const chartData = {
                            datasets: [{
                                label: item.label,
                                data: item?.datapoints?.map(dp => ({
                                    x: dp?.x,
                                    y: dp?.y,
                                })),
                                backgroundColor: 'rgb(255, 99, 132)',
                            }]
                        };

                        return (
                            <div key={item?._id || index} className='col-md-4 col-12 mb-4'>
                                <Card
                                    cover={<Scatter options={getChartOptions(item?.datapoints, item?._id)} data={chartData} />}
                                    actions={[
                                        <div>
                                            <Button className='text-end' danger icon={<DeleteOutlined />} size="small" onClick={() => openModal(item?._id)}>Delete</Button>,
                                        </div>
                                    ]}
                                >
                                </Card>
                            </div>
                        );
                    })}
                </div>
            </div>

            <Modal
                title="Select Action"
                visible={modalVisible}
                onCancel={() => setModalVisible(false)}
                footer={[
                    <>
                        <Button key="cancel" onClick={() => setModalVisible(false)}>Cancel</Button>
                    </>

                ]}
            >
                <div className='mb-2'>
                    <Button type="primary" className='me-4' icon={<EditOutlined />} onClick={() => setIsEditing(true)}>Edit</Button>
                    <Button type="primary" danger icon={<DeleteOutlined />} onClick={handleDelete}>Delete</Button>
                </div>

                {isEditing && (
                    <div>
                        <div style={{ marginBottom: '16px' }}>
                            <label>X Value:</label>
                            <Input value={editX} onChange={e => setEditX(e.target.value)} />
                        </div>
                        <div>
                            <label>Y Value:</label>
                            <Input value={editY} onChange={e => setEditY(e.target.value)} />
                        </div>
                        <div className='mt-2'>
                            <Button type="primary" onClick={() => handleEditDataPoints()}>Save</Button>
                        </div>
                    </div>
                )}

            </Modal>

            <DeleteModal isModalOpen={isModalOpen} handleOk={handleOk} handleCancel={handleCancel} chartId={chartId} ChartList={ChartList} />
        </>
    )
}

export default ScatterChart